<template>
    <div class="log-page">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="queryParams" class="search-box">
            <el-form-item label="用户">
                <el-input  placeholder="请输入用户名称" clearable />
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'Home',

}
</script>