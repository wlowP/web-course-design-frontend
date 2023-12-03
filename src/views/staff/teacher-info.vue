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
        <transition name="card-tab" mode="out-in">
          <div v-if="activeKey === 'basic'" class="basic">
            <a-descriptions bordered title="基本信息">
              <template #extra>
                <a-space>
                  <a-button v-show="editBasicInfo" type="default" @click="teacherEdit = deepClone(teacher)">重置
                  </a-button>
                  <a-button type="primary" @click="editBasicInfo = !editBasicInfo">
                    {{ editBasicInfo ? '取消' : '编辑' }}
                  </a-button>
                  <a-button v-show="editBasicInfo" type="primary" @click="editSaveBasicInfo" :icon="h(SaveOutlined)">
                    保存
                  </a-button>
                </a-space>
              </template>
              <a-descriptions-item label="教师ID">
                {{ teacher.teacherId }}
              </a-descriptions-item>
              <a-descriptions-item label="姓名">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.name"/>
                <span v-else>{{ teacher.name }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="工号">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.username"/>
                <span v-else>{{ teacher.username }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="性别">
                <a-radio-group v-if="editBasicInfo" v-model:value="teacherEdit.gender">
                  <a-radio :value="1">男</a-radio>
                  <a-radio :value="2">女</a-radio>
                </a-radio-group>
                <span v-else>
                  {{
                    teacher.gender === 1 ? '男' :
                    teacher.gender === 2 ? '女' : '未知'
                  }}
               </span>
              </a-descriptions-item>
              <a-descriptions-item label="邮箱">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.email"/>
                <span v-else>{{ teacher.email }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="电话">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.phone"/>
                <span v-else>{{ teacher.phone }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="所在学院">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.college"/>
                <span v-else>{{ teacher.college }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="学位">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.degree"/>
                <span v-else>{{ teacher.degree }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="职位">
                <a-input v-if="editBasicInfo" v-model:value="teacherEdit.position"/>
                <span v-else>{{ teacher.position }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div v-else-if="activeKey === 'further-info'" class="further-info">
            <a-descriptions bordered title="其他信息" :column="1" :label-style="{ width: '120px' }">
              <template #extra>
                <a-space>
                  <a-button v-show="editFurtherInfo" type="default" @click="teacherInfoEdit = deepClone(teacherInfo)">重置
                  </a-button>
                  <a-button type="primary" @click="editFurtherInfo = !editFurtherInfo">
                    {{ editFurtherInfo ? '取消' : '编辑' }}
                  </a-button>
                  <a-button v-show="editFurtherInfo" type="primary" @click="editSaveFurtherInfo" :icon="h(SaveOutlined)">
                    保存
                  </a-button>
                </a-space>
              </template>
              <a-descriptions-item label="研究方向">
                <a-textarea v-if="editFurtherInfo" v-model:value="teacherInfoEdit.research"/>
                <span v-else>{{ teacherInfo.research }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="论文">
                <a-textarea v-if="editFurtherInfo" v-model:value="teacherInfoEdit.paper" :rows="6"/>
                <span v-else>{{ teacherInfo.paper }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="个人简历">
                <a-textarea v-if="editFurtherInfo" v-model:value="teacherInfoEdit.resume" :rows="8"/>
                <span v-else>{{ teacherInfo.resume }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </transition>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import svgTeacherInfo from '@/assets/svg/教师信息.svg'
import { useRouter } from 'vue-router'
import { getTeacherById, getTeacherInfoById, updateTeacherInfo } from '@/api/teacher'
import { deepClone } from '@/utils/commons'
import { message } from 'ant-design-vue'
import { onActivated, ref, h } from 'vue'
import type { Teacher, TeacherInfo } from '@/types/Teacher'
import { TeacherInfoInitialState, TeacherInitialState } from '@/types/Teacher'
import { SaveOutlined } from '@ant-design/icons-vue'
import Schema, { Rules } from 'async-validator'

const router = useRouter()

const teacher = ref<Teacher>(TeacherInitialState()),
      teacherEdit = ref<Teacher>(TeacherInitialState()),
      teacherInfo = ref<TeacherInfo>(TeacherInfoInitialState()),
      teacherInfoEdit = ref<TeacherInfo>(TeacherInfoInitialState())

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
  { key: 'further-info', tab: '其他信息' }
]

const rules: Rules = {
  name: [{ required: true, message: '请输入姓名', whitespace: true }],
  username: [{ required: true, message: '请输入工号', whitespace: true }],
  gender: [{ required: true, type: 'number', message: '请选择性别', whitespace: true }],
  email: [
    { required: true, message: '请输入邮箱', whitespace: true },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  phone: [
    { required: true, message: '请输入电话', whitespace: true },
    { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '电话格式不正确' }
  ],
  college: [{ required: true, message: '请输入所在学院', whitespace: true }],
  degree: [{ required: true, message: '请输入学位', whitespace: true }],
  position: [{ required: true, message: '请输入职位', whitespace: true }]
}
const validator = new Schema(rules)

const editBasicInfo = ref<boolean>(false)
const editFurtherInfo = ref<boolean>(false)

const editSaveBasicInfo = () => {
  validator.validate(teacherEdit.value, async (errors, fields) => {
    if (errors) {
      message.error(errors[0].message)
      return
    }
    const res = await updateTeacherInfo(fields)
    if (res.code === 0) {
      message.success('保存成功')
      teacher.value = deepClone(fields)
      editBasicInfo.value = false
    } else {
      message.error(res.msg)
    }
  })
}

const editSaveFurtherInfo = async () => {
  const res = await updateTeacherInfo({ ...teacherInfoEdit.value, teacherId: teacher.value.teacherId })
  if (res.code === 0) {
    message.success('保存成功')
    teacherInfo.value = deepClone(teacherInfoEdit.value)
    editFurtherInfo.value = false
  } else {
    message.error(res.msg)
  }
}
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
