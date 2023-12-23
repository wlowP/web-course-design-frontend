<template>
  <div class="blogs">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgBlogs, shape: 'square' }"
    >
      <template #title><span class="title">学生博客</span></template>
      <span class="tip">最近发表的博客</span>
    </a-page-header>
    <a-card bordered style="padding: 0 100px">
      <a-list :data-source="blogsAbstract"
              :loading="loading"
              :pagination="{ defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['10', '15', '30', '50', '100'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` } as PaginationProps"
      >
        <template #renderItem="{ item: blog }">
          <a-list-item>
            <a-card :title="blog.title" style="width: 100%;" hoverable @click="router.push({ path: ch('/主页/博客/博客编辑'), state: { blogId: blog.blogId } })">
              <template #extra>
                <a-space style="color: #9a9a9a">
                  <template #split>|</template>
                  <span>作者: {{ (blog as Blog).author }}</span>
                  <span>发布日期: {{ (blog as Blog).createTime }}</span>
                  <span>最后修改: {{ (blog as Blog).updateTime }}</span>
                </a-space>
              </template>
              {{ blog.digest }} ......
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
    <a-float-button type="primary" style="right: 60px; bottom: 90px; width: 60px; height: 60px;"
                    @click="router.push({ path: ch('/主页/博客/博客编辑'), state: { publish: true } })"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      <template #tooltip>发布博客</template>
    </a-float-button>
  </div>
</template>

<script setup lang="ts">
import svgBlogs from '@/assets/svg/学生博客.svg'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { Blog } from '@/types/Student'
import { getAllBlogTags } from '@/api/blog'
import { message, type PaginationProps } from 'ant-design-vue'
import { ch } from '@/utils/commons'
import { PlusOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 博客信息的概要. 具有digest属性, 也就是text的前100个字
const blogsAbstract = ref<Blog[]>([])
const loading = ref<boolean>(false)

// 获取博客信息
const init = async () => {
  loading.value = true
  const res = await getAllBlogTags()
  if (res.code === 0) {
    blogsAbstract.value = res.data
  } else {
    message.error(res.msg)
  }
  loading.value = false
}
init()
</script>

<style scoped>

</style>
