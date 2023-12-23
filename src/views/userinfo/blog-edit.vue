<template>
  <div class="blog-edit">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgBlogEdit, shape: 'square' }"
    >
      <template #title><span class="title">博客信息</span></template>
      <span class="tip">展示博客信息</span>
    </a-page-header>
    <a-card bordered>
      <template #title>
        <span v-if="!edit">{{ blog.title }}</span>
        <a-input v-else v-model:value="editTitle" style="width: 500px;"/>
      </template>
      <template #extra>
        <a-space :size="15" v-if="blog.userId === store.userInfo.userId && !publish">
          <a-button type="primary" danger @click="onRemove">删除此博客</a-button>
          <a-button v-show="edit" @click="onCancel">取消</a-button>
          <a-button type="primary" @click="onEditOrSave">{{ edit ? '保存' : '编辑' }}</a-button>
        </a-space>
        <a-space :size="15" v-if="publish">
          <a-button type="primary" @click="onPublish">发布</a-button>
        </a-space>
        <a-space :size="15" v-if="blog.userId !== store.userInfo.userId && !publish">
          <span style="user-select: none">
            <component :is="LikeOutlined" style="cursor: pointer" @click="iLikeThisBlog(blog.blogId)"/>&nbsp;{{ (blog as Blog).praise }}
          </span>
        </a-space>
      </template>
      <v-md-editor v-model="editText"
                   :mode="edit ? 'editable' : 'preview'"
                   height="calc(80vh)"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import svgBlogEdit from '@/assets/svg/博客.svg'
import { useRouter } from 'vue-router'
import { onActivated, ref, h } from 'vue'
import { addBlogLike, deleteBlogByBlogId, getBlogByBlogId, publishBlog, saveBlog } from '@/api/blog'
import type { Blog } from '@/types/Student'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined, LikeOutlined } from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { throttle } from '@/utils/commons'

const router = useRouter()
const store = useUserStore()

const blog = ref<Blog>({} as Blog)
const editText = ref<string>('')
const editTitle = ref<string>('')
const edit = ref<boolean>(false)

const publish = ref<boolean>(history.state.publish)

onActivated(async () => {
  publish.value = history.state.publish
  if (!publish.value) {
    edit.value = false
    const res = await getBlogByBlogId(history.state.blogId)
    if (res.code === 0) {
      blog.value = res.data
    } else {
      message.error(res.msg)
    }
  } else {
    edit.value = true
    blog.value = {
      author: '',
      praise: 0,
      blogId: 0,
      userId: store.userInfo.userId,
      title: '',
      text: '',
      digest: '',
      createTime: '',
      updateTime: ''
    }
  }
  editText.value = blog.value.text
  editTitle.value = blog.value.title
})

const onEditOrSave = async () => {
  if (edit.value) {
    // 保存
    const res = await saveBlog(blog.value.blogId, editTitle.value, editText.value)
    if (res.code === 0) {
      message.success('保存成功')
      blog.value.title = editTitle.value
      blog.value.text = editText.value
      edit.value = !edit.value
    } else {
      message.error(res.msg)
    }
  } else {
    // 编辑
    edit.value = !edit.value
  }
}

const onCancel = () => {
  Modal.confirm({
    title: '取消编辑博客',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要取消编辑吗? 你的修改将不会被保存!',
    okText: '确定',
    okType: 'danger',
    okButtonProps: {
      type: 'primary'
    },
    cancelText: '取消',
    onOk: () => {
      editText.value = blog.value.text
      editTitle.value = blog.value.title
      edit.value = false
    }
  })
}

const onRemove = () => {
  Modal.confirm({
    title: '删除博客',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要删除此博客吗?',
    okText: '确定',
    okType: 'danger',
    okButtonProps: {
      type: 'primary'
    },
    cancelText: '取消',
    onOk: async () => {
      const res = await deleteBlogByBlogId(blog.value.blogId)
      if (res.code === 0) {
        message.success('删除成功')
        router.back()
      } else {
        message.error(res.msg)
      }
    }
  })
}

const onPublish = async () => {
  const res = await publishBlog(editTitle.value, editText.value)
  if (res.code === 0) {
    message.success('发布成功')
    router.back()
  } else {
    message.error(res.msg)
  }
}

// 点赞博客, 为防止用户频繁点击, 使用节流函数
const iLikeThisBlog = throttle(async (blogId: number) => {
  console.log('点赞: ', blogId)
  const res = await addBlogLike(blogId)
  if (res.code === 0) {
    message.success('点赞成功')
    blog.value.praise++
  } else {
    message.error(res.msg)
  }
}, 1000)
</script>

<style scoped>

</style>
