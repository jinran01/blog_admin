<template>
  <el-popover width="400px" trigger="click" @hide="hideHandler">
    <el-scrollbar max-height="200px" v-infinite-scroll="loadMore">
      <div class="icon-grid">
        <!-- <el-scrollbar max-height="400px"> -->
        <el-icon v-for="icon in visibleIcons" :key="icon" @click="handleSelect(icon.class)">
          <i class="fa" :class="icon.class"></i>
        </el-icon>
        <div v-if="loading" class="loading">加载中...</div>
        <!-- </el-scrollbar> -->
      </div>
    </el-scrollbar>
    <template #reference>
      <el-input v-model="props.modelValue" placeholder="选择图标" readonly>
        <template #prefix>
          <el-icon v-if="props.modelValue">
            <i class="fa" :class="props.modelValue"></i>
            <!-- <component :is="props.modelValue" /> -->
          </el-icon>
        </template>
      </el-input>
    </template>
  </el-popover>

</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import { glyphs } from "../assets/icons";

const pageSize = 42
const page = ref(1)

const visibleIcons = ref([])
const loading = ref(false)
const noMore = ref(false)
const timer = ref(null)
const props = defineProps({
  modelValue: String
});

const emit = defineEmits(["update:modelValue"]);
const icons = ref(glyphs);

function handleSelect(icon) {
  // console.log(icon);
  
  emit("update:modelValue", icon);
}
function hideHandler() {
  // 重置分页
  page.value = 1
  visibleIcons.value = []
  noMore.value = false
  // clearTimeout(timer.value)
}
function loadMore() {
  if (loading.value || noMore.value) return
  loading.value = true
  timer.value = setTimeout(() => {
    const start = (page.value - 1) * pageSize
    const end = start + pageSize
    const batch = icons.value.slice(start, end)
    if (batch.length === 0) {
      noMore.value = true
    } else {
      visibleIcons.value.push(...batch)
      page.value++
    }
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  /* max-height: 200px; */
  overflow: hidden;
  padding: 8px;
}

.icon-grid .el-icon {
  cursor: pointer;
  font-size: 20px;
}

.icon-grid .el-icon:hover {
  color: var(--el-color-primary);
}

.loading,
.tips {
  grid-column: 1 / -1;
  text-align: center;
  padding: 6px 0;
}
</style>
