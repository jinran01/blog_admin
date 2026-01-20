<template>
    <div class="role-page">

        <!-- 搜索条件 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="角色名称">
                <el-input v-model="searchForm.keywords" placeholder="请输入角色名称" clearable />
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchForm.isDisable" placeholder="选择状态" clearable>
                    <el-option label="启用" value="0" />
                    <el-option label="禁用" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>

        <!-- 数据表格 -->
        <el-table :data="roleList" border style="width: 100%">
            <el-table-column prop="roleName" label="角色名称" width="180" />
            <el-table-column prop="roleLabel" label="权限字符" width="180" />
            <el-table-column prop="isDisable" label="状态" width="100">
                <template #default="scope">
                    <el-switch v-model="scope.row.isDisable"
                        :disabled="scope.row.roleLabel == 'admin' || scope.row.roleLabel == 'anonymous' ? true : false"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value=0
                        :inactive-value=1 inline-prompt active-text="启用" inactive-text="禁用"
                        @change="changeDisable(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" link @click="handleEditMenu(scope.row)"
                        :disabled="scope.row.roleLabel == 'admin' ? true : false">菜单权限</el-button>
                    <el-button type="primary" link @click="handleEditResource(scope.row)"
                        :disabled="scope.row.roleLabel == 'admin' ? true : false">资源权限</el-button>
                    <el-button type="primary" link @click="handleEdit(scope.row)"
                        :disabled="scope.row.roleLabel == 'admin' || scope.row.roleLabel == 'anonymous' ? true : false">编辑</el-button>
                    <el-popconfirm icon-color="#626AEF" title="确定要删除吗?" @cancel="onCancel">
                        <template #reference>
                            <el-button type="danger" link
                                :disabled="scope.row.roleLabel == 'admin' || scope.row.roleLabel == 'anonymous' ? true : false">删除</el-button>
                        </template>
                        <template #actions="{ confirm, cancel }">
                            <el-button size="small">取消</el-button>
                            <el-button type="danger" size="small"  @click="confirmDeleteRole(scope.row.id)">
                                确认
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-box" style="margin-top: 10px; text-align: right;">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                v-model:current-page="pageNum" v-model:page-size="pageSize" @current-change="getRoleList"
                @size-change="getRoleList" />
        </div>


        <!-- 新增/编辑弹框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formData.roleName" />
                </el-form-item>
                <el-form-item label="权限字符" prop="roleLabel">
                    <el-input v-model="formData.roleLabel" />
                </el-form-item>
                <el-form-item label="状态" prop="isDisable" v-if="dialogTitle == '编辑角色' ? false : true">
                    <el-select v-model="formData.isDisable">
                        <el-option label="启用" :value=0 />
                        <el-option label="禁用" :value=1 />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>

        <!-- 分配菜单权限弹框 -->
        <el-dialog header="分配菜单权限" v-model="dialogVisibleForRoleMemu" width="600px" @close="closeMenuRole">
            <el-card>
                <div style="margin-bottom: 10px;">
                    <el-button type="primary" @click="handleCheckAll">全选</el-button>
                    <el-button type="danger" @click="handleUncheckAll">清空</el-button>
                </div>

                <el-tree ref="treeRef" :data="menuTree" node-key="id" show-checkbox :props="defaultProps"
                    :default-checked-keys="checkedMenuKeys" />

                <div style="margin-top: 20px;">
                    <el-button type="success" @click="submitMenuRole">提交权限</el-button>
                </div>
            </el-card>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoles, saveOrUpdateRole, updateRoleMenu, updateRoleStatus } from '../../network/role'
import { ElMessage } from 'element-plus'
import { getAllMenuTree, getMenuIdsByRoleId } from '../../network/menu'
import { da } from 'element-plus/es/locales.mjs'

const searchForm = reactive({ keywords: '', isDisable: '' })
const roleList = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const menuTree = ref([])
const checkedMenuKeys = ref([]) // 已勾选ID
const treeRef = ref(null)

const dialogVisible = ref(false)
const dialogVisibleForRoleMemu = ref(false)
const dialogVisibleForRoleResource = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const formData = reactive({
    id: null,
    roleName: '',
    roleLabel: '',
    isDisable: 1
})
const defaultProps = ref({
    label: 'name',
    children: 'children'
})
const rules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleLabel: [{ required: true, message: '请输入权限字符', trigger: 'blur' }]
}

function getRoleList() {
    getRoles({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        ...searchForm
    }).then(res => {
        roleList.value = res.data.recordList
        total.value = res.data.count
    })

}
function changeDisable(row) {
    updateRoleStatus({
        id: row.id,
        isDisable: row.isDisable ? 1 : 0
    }).then(res => {
        if (res.flag === false) {
            ElMessage.error(res.message)
        } else {
            ElMessage.success(res.message)
        }
        getRoleList()
    })

}
function handleSearch() {
    pageNum.value = 1
    getRoleList()
}

function resetSearch() {
    searchForm.keywords = ''
    searchForm.isDisable = ''
    getRoleList()
}

function handleAdd() {
    dialogTitle.value = '新增角色'
    Object.assign(formData, { id: null, roleName: '', roleLabel: '', isDisable: 1 })
    dialogVisible.value = true
}

function handleEdit(row) {
    dialogTitle.value = '编辑角色'
    Object.assign(formData, row)
    dialogVisible.value = true
}

function handleEditMenu(row) {
    getAllMenuTree().then(res => {
        menuTree.value = res.data
    })
    getMenuIdsByRoleId(row.id).then(res => {
        checkedMenuKeys.value = res.data
    })
    Object.assign(formData, row)
    dialogVisibleForRoleMemu.value = true

}
function submitForm() {
    formRef.value.validate(async valid => {
        if (!valid) return
        saveOrUpdateRole(formData).then(res => {
            if (res.flag === false) {
                ElMessage.error(res.message)
            } else {
                getRoleList()
                ElMessage.success(res.message)
            }
        })
        // formData.id ? await updateRole(formData) : await addRole(formData)
        dialogVisible.value = false
    })
}
function closeMenuRole() {
    checkedMenuKeys.value = []
}
function submitMenuRole() {
    let menuIds = []
    treeRef.value.getCheckedNodes(false, true).forEach(item => {
        menuIds.push(item.id)
    })
    updateRoleMenu({ 'roleId': formData.id, 'menuIds': menuIds }).then(res => {
        Object.assign(formData, { id: null, roleName: '', roleLabel: '', isDisable: 1 })
    })
}
function handleCheckAll() {
    treeRef.value.data.forEach(item => {
        treeRef.value.setChecked(item.id, true, true)
    })
}
function handleUncheckAll() {
    treeRef.value.setCheckedKeys([])
}
function confirmDeleteRole(roleId) {
    // 调用删除接口
    // deleteRole(roleId).then(res => {
    //     if (res.flag === false) {
    //         ElMessage.error(res.message)
    //     } else {
    //         getRoleList()
    //         ElMessage.success(res.message)
    //     }
    // })
    console.log("删除角色ID:", roleId);
}
onMounted(() => getRoleList())
</script>

<style scoped>
.role-page {
    background: #fff;
    padding: 16px;
    border-radius: 6px;
}

.search-box {
    margin-bottom: 12px;
}

.page-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}
</style>
