<template>
  <div class="student-info">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgStudentInfo, shape: 'square' }"
    >
      <template #title><span class="title">学生信息</span></template>
      <span class="tip">管理学生的各项信息</span>
    </a-page-header>
    <a-space direction="vertical" style="width: 100%;">
      <a-card bordered hoverable>
        <a-avatar :size="50" :src="student.photo"/>
        <span class="name">
          {{ student.name }}
        </span>
        <span class="num">
          {{ student.username }}
        </span>
      </a-card>
      <a-card bordered
              title="查看/编辑信息"
              :tab-list="infoTabs"
              :active-tab-key="activeKey"
              @tabChange="(key: string) => activeKey = key"
      >
        <div v-show="activeKey === 'basic'">
          <a-descriptions bordered title="基本信息">
            <template #extra>
              <a-space>
                <a-button v-show="editBasicInfo" type="default" @click="studentEdit = deepClone(student)">重置</a-button>
                <a-button type="primary" @click="editBasicInfo = !editBasicInfo">{{
                    editBasicInfo ? '取消' : '编辑'
                  }}
                </a-button>
                <a-button v-show="editBasicInfo" type="primary" @click="editSaveBasicInfo" :icon="h(SaveOutlined)">
                  保存
                </a-button>
              </a-space>
            </template>
            <!-- types/student中的属性都展示了, photo在上面, userType不用展示 -->
            <a-descriptions-item label="学生ID">
              <a-input-number v-if="editBasicInfo" v-model:value="studentEdit.studentId"/>
              <span v-else>{{ student.studentId }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="姓名">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.name"/>
              <span v-else>{{ student.name }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="学号">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.username"/>
              <span v-else>{{ student.username }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="年级">
              <a-select v-if="editBasicInfo" v-model:value="studentEdit.grade">
                <a-select-option :value="1">大一</a-select-option>
                <a-select-option :value="2">大二</a-select-option>
                <a-select-option :value="3">大三</a-select-option>
                <a-select-option :value="4">大四</a-select-option>
                <a-select-option :value="5">其他</a-select-option>
              </a-select>
              <span v-else>
                {{
                  student.grade === 1 ? '大一' :
                  student.grade === 2 ? '大二' :
                  student.grade === 3 ? '大三' :
                  student.grade === 4 ? '大四' : '其他'
                }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="班级">
              <a-input-number v-if="editBasicInfo" v-model:value="studentEdit.studentClass" :min="1" :max="20"/>
              <span v-else>{{ student.studentClass }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="专业">
              <a-select v-if="editBasicInfo" v-model:value="studentEdit.major">
                <a-select-option :value="1">软件工程</a-select-option>
                <a-select-option :value="2">数字媒体技术</a-select-option>
                <a-select-option :value="3">数据科学与大数据技术</a-select-option>
              </a-select>
              <span v-else>
                {{
                  student.major === 1 ? '软件工程' :
                  student.major === 2 ? '数字媒体技术' :
                  student.major === 3 ? '数据科学与大数据技术' : '暂无'
                }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="绩点">
              {{ student.gpa }}
            </a-descriptions-item>
            <a-descriptions-item label="绩点班级排名">
              {{ student.rankClass }}
            </a-descriptions-item>
            <a-descriptions-item label="绩点学院排名">
              {{ student.rankCollege }}
            </a-descriptions-item>
            <a-descriptions-item label="生日">
              <a-date-picker v-if="editBasicInfo" value-format="YYYY-MM-DD" v-model:value="studentEdit.birthday"/>
              <span v-else>{{ student.birthday }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="性别">
              <a-radio-group v-if="editBasicInfo" v-model:value="studentEdit.gender">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
              <span v-else>
                {{
                  student.gender === 1 ? '男' :
                  student.gender === 2 ? '女' : '未知'
                }}
             </span>
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.email"/>
              <span v-else>{{ student.email }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="籍贯">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.birthplace"/>
              <span v-else>{{ student.birthplace }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="民族">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.ethnicity"/>
              <span v-else>{{ student.ethnicity }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="电话">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.phone"/>
              <span v-else>{{ student.phone }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="地址">
              <a-input v-if="editBasicInfo" v-model:value="studentEdit.address"/>
              <span v-else>{{ student.address }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div v-show="activeKey === 'activity'">
          <a-collapse v-model:activeKey="activeKeyCollapse">
            <a-collapse-panel v-for="(type, id) in StudentActivityType"
                              :key="id"
                              :header="type.label"
            >
              <template #extra>
                <a-button type="primary" size="small" @click.stop="() => {
                  addActivity = true;
                  editActivity = false;
                  resetActivityForm();
                  form.advancedType = id
                }">
                  添加记录
                </a-button>
              </template>
              <a-collapse>
                <a-collapse-panel v-for="item in studentActivity[type.dataIndex]"
                                  :key="item.studentAdvancedId"
                                  :header="'活动标题'"
                >
                  <h3>{{ '标题' }}</h3>
                  <p>时长: {{ item.duration }}</p>
                  <a-divider class="reduce-margin"/>
                  <p>&emsp;{{ item.content }}</p>
                  <a-space class="operation">
                    <a-button type="primary" size="small"
                              @click="() => {
                                addActivity = false;
                                editActivity = true;
                                form.studentAdvancedId = item.studentAdvancedId;
                                form.content = item.content;
                                form.duration = item.duration;
                                form.advancedType = item.advancedType
                              }"
                    >
                      编辑
                    </a-button>
                    <a-popconfirm title="是否确定要删除?"
                                  ok-text="删除"
                                  ok-type="danger"
                                  :ok-button-props="{ danger: true, type: 'primary' }"
                                  cancel-text="取消"
                                  @confirm="deleteActivity(item.studentAdvancedId)"
                    >
                      <template #icon>
                        <question-circle-outlined style="color: red"/>
                      </template>
                      <a-button size="small" danger>删除</a-button>
                    </a-popconfirm>
                  </a-space>
                </a-collapse-panel>
              </a-collapse>
            </a-collapse-panel>
          </a-collapse>
          <!-- 编辑/添加活动信息的弹窗 -->
          <a-modal v-model:open="openActivityModal"
                   :title="editActivity ? '编辑' : `添加${StudentActivityType[form.advancedType]?.label}`"
                   ok-text="确认"
                   :mask-closable="false"
                   @ok="() => editActivity ? editSaveActivity() : addNewActivity()"
                   style="top: 20vh;"
          >
            <a-card bordered>
              <a-form :label-col="{ style: { width: '70px' } }"
                      :model="form"
                      ref="formRef"
                      :rules="{
                        content: [{ required: true, message: '请输入活动内容', whitespace: true }],
                        duration: [{ required: true, type: 'number', message: '请输入时长', whitespace: true }]
                      }"
              >
                <a-form-item label="活动内容" name="content">
                  <a-input v-model:value="form.content"/>
                </a-form-item>
                <a-form-item label="时长" name="duration">
                  <a-input-number v-model:value="form.duration"/>
                </a-form-item>
              </a-form>
            </a-card>
          </a-modal>
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import {
  addNewStudentActivity,
  deleteStudentActivity,
  getStudentActivityById,
  getStudentById,
  updateStudent,
  updateStudentActivity
} from '@/api/student'
import { computed, h, onActivated, ref } from 'vue'
import svgStudentInfo from '@/assets/svg/学生信息.svg'
import { useRouter } from 'vue-router'
import type { Student, StudentActivity } from '@/types/Student'
import { studentActivityInitialState, StudentActivityType, studentInitialState } from '@/types/Student'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { deepClone } from '@/utils/commons'
import Schema, { Rules } from 'async-validator'
import { message } from 'ant-design-vue'

const router = useRouter()

// 学生基本信息
// 📌📌为了在插值表达式{{ }}中访问student属性时TypeScript不至于认为student可能是undefined, 这里给student一个初始值
const student = ref<Student>(studentInitialState())
// 编辑中的学生基本信息
const studentEdit = ref<Student>(studentInitialState())
// 学生的活动信息
const studentActivity = ref<StudentActivity>(studentActivityInitialState())

const init = async () => {
  let res = await getStudentById(history.state.studentId)
  if (res.code !== 0) {
    message.error('获取学生信息失败')
    return
  }
  student.value = res.data
  studentEdit.value = deepClone(student.value)
  await initStudentActivity()
}

const initStudentActivity = async () => {
  const res = await getStudentActivityById(history.state.studentId)
  if (res.code !== 0) {
    message.error('获取学生活动信息失败')
    return
  }
  studentActivity.value = res.data
}

onActivated(() => {
  init()
  editBasicInfo.value = false
  editActivity.value = false
})

// 卡片当前显示的标签页
const activeKey = ref('basic')
// 卡片的标签页
const infoTabs = [
  { key: 'basic', tab: '基本信息' },
  { key: 'activity', tab: '活动信息' }
]

// 基础信息是否处于编辑状态
const editBasicInfo = ref<boolean>(false)

// 表单校验规则, 单独使用了async-validator库
const rules: Rules = {
  name: [{ required: true, message: '请输入姓名', whitespace: true }],
  username: [{ required: true, message: '请输入学号', whitespace: true }],
  grade: [{ required: true, type: 'number', message: '请选择年级', whitespace: true }],
  studentClass: [{ required: true, type: 'number', message: '请输入班级', whitespace: true }],
  major: [{ required: true, type: 'number', message: '请选择专业', whitespace: true }],
  gender: [{ required: true, type: 'number', message: '请选择性别', whitespace: true }],
  email: [
    { required: true, message: '请输入邮箱', whitespace: true },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  birthplace: [{ required: true, message: '请输入籍贯', whitespace: true }],
  ethnicity: [{ required: true, message: '请输入民族', whitespace: true }],
  phone: [
    { required: true, message: '请输入电话', whitespace: true },
    // 手机号的校验比较宽松
    { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '电话格式不正确' }
  ],
  birthday: [{ required: true, message: '请选择出生日期', whitespace: true }],
  address: [{ required: true, message: '请输入住址', whitespace: true }]
}
// 构造async-validator的校验实例
const validator = new Schema(rules)

// 基本信息保存编辑
const editSaveBasicInfo = () => {
  validator.validate(studentEdit.value, async (errors, fields) => {
    if (errors) {
      message.error(errors[0].message)
      return
    }
    editBasicInfo.value = false
    const res = await updateStudent(fields)
    if (res.code === 0) {
      message.success('保存成功')
      student.value = fields as Student
    } else {
      message.error('保存失败, 请稍后重试')
    }
  })
}

// 活动信息面板中折叠面板当前展开的面板
const activeKeyCollapse = ref<string[]>([])

// 是否正在编辑活动信息
const editActivity = ref<boolean>(false)
// 是否正在添加活动信息
const addActivity = ref<boolean>(false)
// 是否打开活动信息的弹窗
const openActivityModal = computed<boolean>({
  get: () => editActivity.value || addActivity.value,
  set: value => { editActivity.value = value; addActivity.value = value }
})

const form = ref({ content: '', duration: 0, studentAdvancedId: -1, advancedType: -1 })
const resetActivityForm = () => {
  form.value = { content: '', duration: 0, studentAdvancedId: -1, advancedType: -1 }
}

const formRef = ref()
const editSaveActivity = async () => {
  formRef.value.validate().then(async () => {
    const res = await updateStudentActivity(form.value)
    if (res.code === 0) {
      message.success('保存成功')
      await initStudentActivity()
      editActivity.value = false
    } else {
      message.error('保存失败, 请稍后重试')
    }
  }, () => {})
}


const addNewActivity = () => {
  formRef.value.validate().then(async () => {
    const res = await addNewStudentActivity({ ...form.value, studentId: student.value.studentId })
    if (res.code === 0) {
      message.success('添加成功')
      await initStudentActivity()
      addActivity.value = false
    } else {
      message.error('添加失败, 请稍后重试')
    }
  }, () => {})
}

const deleteActivity = async (studentAdvancedId: number) => {
  const res = await deleteStudentActivity(studentAdvancedId)
  if (res.code === 0) {
    message.success('删除成功')
    await initStudentActivity()
  } else {
    message.error('删除失败, 请稍后重试')
  }
}
</script>

<style scoped>
.student-info {
  .name {
    font-size: 20px;
    margin-left: 10px;
  }

  .num {
    font-size: 14px;
    margin-left: 10px;
    color: #9a9a9a;
  }

  .operation {
    margin-top: 5px;
  }

  .reduce-margin {
    margin: 5px 0;
  }
}
</style>
