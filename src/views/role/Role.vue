<template>
    <div class="role-page">

        <!-- 搜索条件 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="角色名称">
                <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
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
                    <el-switch v-model="scope.row.isDisable" size="small" />
                    <el-tag :type="scope.row.isDisable == 0 ? 'success' : 'danger'">
                        {{ scope.row.isDisable == 0 ? "启用" : "禁用" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-box" style="margin-top: 10px; text-align: right;">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                v-model:current-page="pageNum" v-model:page-size="pageSize" @current-change="getRoleList"
                @size-change="getRoleList" />
        </div>


        <!-- 弹框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formData.roleName" />
                </el-form-item>
                <el-form-item label="权限字符" prop="roleLabel">
                    <el-input v-model="formData.roleLabel" />
                </el-form-item>
                <el-form-item label="状态" prop="isDisable">
                    <el-select v-model="formData.isDisable">
                        <el-option label="启用" value='0' />
                        <el-option label="禁用" value='1' />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoles } from '../../network/role'

const searchForm = reactive({ roleName: '', isDisable: '' })
const roleList = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const formData = reactive({
    id: null,
    roleName: '',
    roleLabel: '',
    isDisable: '1'
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

function handleSearch() {
    pageNum.value = 1
    getRoleList()
}

function resetSearch() {
    searchForm.roleName = ''
    searchForm.isDisable = ''
    getRoleList()
}

function handleAdd() {
    dialogTitle.value = '新增角色'
    Object.assign(formData, { id: null, roleName: '', roleLabel: '', isDisable: '0' })
    dialogVisible.value = true
}

function handleEdit(row) {
    dialogTitle.value = '编辑角色'
    console.log(row);
    Object.assign(formData, row)
    console.log(row);

    dialogVisible.value = true
}

function submitForm() {
    formRef.value.validate(async valid => {
        if (!valid) return
        formData.id ? await updateRole(formData) : await addRole(formData)
        dialogVisible.value = false
        getRoleList()
    })
}

// function handleDelete(id) {
//   deleteRole(id).then(() => fetchData())
// }

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
