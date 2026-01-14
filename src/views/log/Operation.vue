<template>
  <div class="log-page">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="queryParams" class="search-box">
      <el-form-item label="用户">
        <el-input v-model="queryParams.nikeName" placeholder="请输入用户名称" clearable />
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="queryParams.keywords" placeholder="请输入关键词" clearable />
      </el-form-item>
      <!-- <el-form-item label="操作类型">
        <el-select v-model="queryParams.type" placeholder="选择类型" clearable>
          <el-option label="新增" value="ADD" />
          <el-option label="修改" value="UPDATE" />
          <el-option label="删除" value="DELETE" />
          <el-option label="登录" value="LOGIN" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="时间范围">
        <el-date-picker v-model="queryParams.dateRange" type="datetimerange" start-placeholder="开始时间"
          end-placeholder="结束时间" value-format="YYYY-MM-DDTHH:mm:ss" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="logList" border stripe style="width: 100%" :loading="loading">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="nickname" label="用户" width="120" />
      <el-table-column prop="ipAddress" label="IP 地址" width="140" />
      <el-table-column prop="ipSource" label="IP源" width="140" />
      <el-table-column prop="optType" label="类型" width="100" />
      <el-table-column prop="optMethod" label="调用方法" min-width="200" show-overflow-tooltip />
      <el-table-column prop="optDesc" label="操作描述" width="200" />
      <!-- <el-table-column prop="requestParam" label="请求参数" width="100" show-overflow-tooltip /> -->
      <el-table-column prop="executeTime" label="耗时(ms)" width="100" />
      <el-table-column prop="createTime" label="操作时间" width="180" />
    </el-table>

    <!-- 分页 -->
    <div class="page-box">
      <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
        hide-on-single-page="true" @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>

  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOperationLog } from '../../network/log'
export default {
  name: 'Operation',
  setup() {
    // 分页 + 搜索参数
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10,
      nikeName: '',
      type: '',
      keywords: '',
      dateRange: []
    })

    const logList = ref([])
    const total = ref(0)
    const loading = ref(false)
    const getLogList = () => {
      getOperationLog({ 'current': queryParams.pageNum, 
      'size': queryParams.pageSize, 'keywords': queryParams.keywords, 
      'nikeName': queryParams.nikeName, 'startTime': queryParams.dateRange[0],
       'endTime': queryParams.dateRange[1] }).then(res => {
        logList.value = res.data.recordList
        total.value = res.data.count
      }).catch(err => {
        ElMessage.error("获取操作日志失败")
      })
    }
    // 页数变化
    const handlePageChange = () => getLogList()
    // pageSize 变化
    const handleSizeChange = (data) => {
      queryParams.pageSize = data
      queryParams.pageNum = 1
      getLogList()
    }
    // 重置搜索条件
    const resetSearch = () => {
      queryParams.pageNum = 1
      queryParams.nikeName = ''
      queryParams.keywords = ''
      queryParams.dateRange = []
      getLogList()
    }
    // 查询
    const handleSearch = () => {
      queryParams.pageNum = 1
      getLogList()
    }
    onMounted(() => {
      getLogList()
    })
    return {
      queryParams,
      loading,
      logList,
      total,
      handleSizeChange,
      handlePageChange,
      handleSearch,
      resetSearch,
    }
  }
}
</script>
<style scoped>
.log-page {
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