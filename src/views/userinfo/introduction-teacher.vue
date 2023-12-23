<template>
  <div class="introduction-teacher">
    <a-row>
      <a-col :md="0" :lg="5" style="padding-top: 100px">
        <a-divider/>
        <a-card style="width: 300px">
          <template #cover>
            <img
              alt="图片加载失败"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          </template>
          <a-card-meta>
            <template #avatar>
              <a-avatar :size="64" :src="store.userInfo.avatar" />
            </template>
            <template #title>
              <h1>欢迎回来 <br> {{ store.userInfo.name }}</h1>
            </template>
          </a-card-meta>
        </a-card>
        <a-divider/>
      </a-col>
      <a-col :md="24" :lg="19">
        <a-row style="display: flex; justify-content: space-between">
          <a-descriptions title="基本信息" bordered :column="2">
            <a-descriptions-item label="姓名">{{ store.userInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="手机">{{ store.currentUser.phone }}</a-descriptions-item>
            <a-descriptions-item label="职位">{{ (store.currentUser as Teacher).position }}</a-descriptions-item>
            <a-descriptions-item label="学位">{{ (store.currentUser as Teacher).degree }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ store.currentUser.email }}</a-descriptions-item>
            <a-descriptions-item label="学院">{{ (store.currentUser as Teacher).college }}</a-descriptions-item>
          </a-descriptions>
          <a-card bordered title="发表的论文" style="flex: 1; margin-left: 35px">
            {{ teacherInfo.paper }}
          </a-card>
        </a-row>
        <a-divider orientation="left" class="reduceMargin">详细资料</a-divider>
        <a-row>
          <a-col :span="18">
            <a-card bordered title="个人简历" style="height: 400px;">
              <template #extra>
                <a-space>
                  <a-button v-show="edit" @click="onCancel">取消</a-button>
                  <a-button type="primary" @click="onEditOrSave">{{ edit ? '保存' : '编辑' }}</a-button>
                </a-space>
              </template>
              <v-md-editor v-model="editResume" :mode="edit ? 'editable' : 'preview'"/>
            </a-card>
          </a-col>
          <a-col :span="5" :offset="1">
            <a-card bordered title="研究方向">
              {{ teacherInfo.research }}
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user'
import { Teacher, type TeacherInfo } from '@/types/Teacher'
import { h, ref } from 'vue'
import { getTeacherInfoById, updateTeacherInfo } from '@/api/teacher'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const store = useUserStore()
const teacherInfo = ref<TeacherInfo>({} as TeacherInfo)
const edit = ref<boolean>(false)
const editResume = ref<string>('')

;(async () => {
  const res = await getTeacherInfoById((store.currentUser as Teacher).teacherId)
  if (res.code === 0) {
    teacherInfo.value = res.data
    editResume.value = res.data.resume
  } else {
    message.error(res.msg)
  }
})()

const onEditOrSave = async () => {
  if (edit.value) {
    // 保存
    console.log('保存')
    const res = await updateTeacherInfo({
      teacherId: (store.currentUser as Teacher).teacherId,
      resume: editResume.value
    })
    if (res.code === 0) {
      message.success('保存成功')
      teacherInfo.value.resume = editResume.value
      edit.value = !edit.value
    } else {
      message.error(res.msg)
    }
  } else {
    // 编辑
    console.log('编辑')
    edit.value = !edit.value
  }
}
const onCancel = () => {
  Modal.confirm({
    title: '取消编辑简历',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要取消编辑吗? 你的修改将不会被保存!',
    okText: '确定',
    okType: 'danger',
    okButtonProps: {
      type: 'primary'
    },
    cancelText: '取消',
    onOk: () => {
      editResume.value = teacherInfo.value.resume
      edit.value = false
    }
  })
}
</script>

<style scoped>

</style>
