<template>
  <div class="menu-page">
    <el-row :gutter="16">

      <!-- 左侧菜单树 -->
      <el-col :span="6">
        <el-card shadow="never" class="card menu-tree-card">
          <div class="card-title">菜单结构</div>
          <el-tree :data="menuTree" :props="treeProps" node-key="id" highlight-current render-after-expand
            @node-click="handleTreeClick" />
        </el-card>
      </el-col>

      <!-- 右侧表格 -->
      <el-col :span="18">
        <el-card shadow="never" class="card">
          <div class="toolbar">
            <el-button type="primary" @click="openDialog('add')" size="small">
              <el-icon>
                <Plus />
              </el-icon>
              新增菜单
            </el-button>
          </div>

          <el-table :data="menuList" border style="width: 100%" size="small" header-cell-class-name="table-header">
            <el-table-column prop="name" label="菜单名称" min-width="150" />
            <el-table-column prop="path" label="路由地址" min-width="200" />
            <el-table-column prop="icon" label="图标" width="60" align="center">
              <template #default="scope">
                <el-icon>
                  <i class='iconfont' :class="scope.row.icon"></i>
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="isHidden" label="是否隐藏" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.isHidden === 0 ? 'success' : 'danger'" effect="plain" size="small">
                  {{ scope.row.isHidden === 0 ? '否' : '是' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" width="50" align="center" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button link size="small" type="primary" @click="openDialog('edit', scope.row)">
                  编辑
                </el-button>
                <el-button link size="small" type="danger" @click="handleDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="520px" class="dialog-form">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px" label-position="left">

        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" clearable />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-icon>
            <i class="iconfont" :class="form.icon"></i>
          </el-icon>
        </el-form-item>

        <el-form-item label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="如 /system/user" clearable />
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component" placeholder="如 system/user/index.vue" clearable />
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select v-model="form.parentId" :data="menuTree" :props="treeProps" check-strictly clearable
            placeholder="默认顶级" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllMenuTree } from "../../network/menu";

const menuTree = ref([]);
const menuList = ref([]);

const treeProps = {
  label: "name",
  value: "id",
  children: "children",
};

const selectedNode = ref(null);

// ===== 加载菜单 =====
const loadMenu = async () => {
  getAllMenuTree().then((res) => {
    menuTree.value = res.data;
    menuList.value = flatten(res.data);
  })

};

// 树点击
const handleTreeClick = (node) => {
  selectedNode.value = node;
  menuList.value = flatten([node]);
};

// 树转列表
const flatten = (data) => {
  let result = [];
  data.forEach(item => {
    result.push(item);
    if (item.children?.length) {
      result = result.concat(flatten(item.children));
    }
  });
  return result;
};

// ===== 新增/编辑 =====
const dialogVisible = ref(false);
const dialogTitle = ref("新增菜单");
const formRef = ref(null);

const form = reactive({
  id: null,
  name: "",
  type: 0,
  path: "",
  component: "",
  parentId: 0,
  sort: 0,
});

const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
};

const openDialog = (mode, row) => {
  dialogTitle.value = mode === "add" ? "新增菜单" : "编辑菜单";
  dialogVisible.value = true;
  if (mode === "edit") Object.assign(form, row);
  else Object.assign(form, { id: null, name: "", type: 0, path: "", component: "", parentId: 0, sort: 0 });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    if (form.id) {
      await axios.put("/api/menu", form);
      ElMessage.success("修改成功");
    } else {
      await axios.post("/api/menu", form);
      ElMessage.success("新增成功");
    }
    dialogVisible.value = false;
    loadMenu();
  });
};

// ===== 删除 =====
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除 "${row.name}" 吗？`, "提示", { type: "warning" })
    .then(async () => {
      await axios.delete(`/api/menu/${row.id}`);
      ElMessage.success("删除成功");
      loadMenu();
    })
    .catch(() => { });
};

// 页面加载时
onMounted(() => {
  loadMenu();
});
</script>
<style scoped>
.menu-page {
  padding: 16px;
}

.card {
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.menu-tree-card {
  min-height: 600px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  padding: 6px 0 12px;
  color: #333;
}

.toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
}

.table-header {
  background: #fafafa !important;
  font-weight: 600;
  color: #444;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.dialog-form :deep(.el-dialog__header) {
  font-size: 16px;
  font-weight: 600;
}

.iconfont {
  font-size: 16px;
}
</style>
