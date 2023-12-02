<template>
  <div class="teacher-info">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgTeacherInfo, shape: 'square' }"
    >
      <template #title><span class="title">教师信息</span></template>
      <span class="tip">管理教师的各项信息</span>
    </a-page-header>
    <a-space direction="vertical" style="width: 100%;">
      <a-card bordered class="avatar">
        <a-avatar :size="50" :src="teacher.photo"/>
        <span class="name">{{ teacher.name }}</span>
        <span class="num">{{ teacher.username }}</span>
      </a-card>
      <a-card bordered
              class="info"
              title="查看/编辑信息"
              :tab-list="infoTabs"
              :active-tab-key="activeKey"
              @tabChange="(key: string) => activeKey = key"
      >
        <transition-group name="card-tab">
          <div v-show="activeKey === 'basic'" :key="1" class="basic">

          </div>
          <div v-show="activeKey === 'further-info'" :key="2" class="further-info">teacher further-info</div>
        </transition-group>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import svgTeacherInfo from '@/assets/svg/教师信息.svg'
import { useRouter } from 'vue-router'
import { getTeacherById, getTeacherInfoById } from '@/api/teacher'
import { deepClone } from '@/utils/commons'
import { message } from 'ant-design-vue'
import { onActivated, ref } from 'vue'
import type { Teacher } from '@/types/Teacher'
import { TeacherInfoInitialState, TeacherInitialState } from '@/types/Teacher'

const router = useRouter()

const teacher = ref<Teacher>(TeacherInitialState()),
      teacherEdit = ref<Teacher>(TeacherInitialState()),
      teacherInfo = ref<Teacher>(TeacherInfoInitialState()),
      teacherInfoEdit = ref<Teacher>(TeacherInfoInitialState())

const init = async () => {
  let res = await getTeacherById(history.state.teacherId)
  if (res.code === 0) {
    teacher.value = res.data
    teacherEdit.value = deepClone(teacher.value)
    await initTeacherInfo()
  } else {
    message.error(res.msg)
  }
}

const initTeacherInfo = async () => {
  const res = await getTeacherInfoById(history.state.teacherId)
  if (res.code === 0) {
    teacherInfo.value = res.data
    teacherInfoEdit.value = deepClone(teacherInfo.value)
  } else {
    message.error(res.msg)
  }
}

onActivated(() => {
  init()
})

// 卡片当前显示的标签页
const activeKey = ref('basic')
// 卡片的标签页
const infoTabs = [
  { key: 'basic', tab: '基本信息' },
  { key: 'further-info', tab: '具体信息' }
]
</script>

<style scoped>
.teacher-info {
  .avatar {
    .name {
      font-size: 20px;
      margin-left: 10px;
    }

    .num {
      font-size: 14px;
      margin-left: 10px;
      color: #9a9a9a;
    }
  }

  .info {
    .card-tab-enter-active,
    .card-tab-leave-active {
      transition: all 0.2s ease;
    }

    .card-tab-enter-from,
    .card-tab-leave-to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
}
</style>
