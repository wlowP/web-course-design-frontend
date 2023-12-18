<template>
  <a-drawer
    title="编辑课程信息"
    :width="500"
    :open="show"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" ref="formRef" :model="form" :rules="rules">
      <a-form-item label="课程序号" name="num">
        <a-input v-model:value="form.num" />
      </a-form-item>
      <a-form-item label="课程名称" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="学分" name="credit">
        <a-input v-model:value="form.credit" />
      </a-form-item>
      <a-form-item label="开设年级" name="grade">
        <a-select v-model:value="form.grade">
          <a-select-option :value="1">大一</a-select-option>
          <a-select-option :value="2">大二</a-select-option>
          <a-select-option :value="3">大三</a-select-option>
          <a-select-option :value="4">大四</a-select-option>
          <a-select-option :value="5">其他</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程类型" name="courseType">
        <a-select v-model:value="form.courseType">
          <a-select-option :value="1">必修</a-select-option>
          <a-select-option :value="2">限选</a-select-option>
          <a-select-option :value="3">任选</a-select-option>
          <a-select-option :value="4">必修(不计学分)</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程状态" name="courseStatus">
        <a-select v-model:value="form.courseStatus">
          <a-select-option :value="1">无效课程</a-select-option>
          <a-select-option :value="2">有效不可选</a-select-option>
          <a-select-option :value="3">可选课程</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button @click="formRef.resetFields()">重置</a-button>
        <a-button type="primary" @click="onSave">保存修改</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Course } from '@/types/Course'
import { deepClone } from '@/utils/commons'
import type { Rule } from 'ant-design-vue/es/form'
import { updateCourse } from '@/api/course'
import { message } from 'ant-design-vue'

// 使用子组件v-model时，需要在子组件中自定义props和emit
// 在TypeScript中为prop设置自定义接口/类型, 得在泛型中限定类型
// 这里📌📌📌📌📌📌不要对props解构, 否则下面的watch📌📌📌📌📌📌监听不到props的变化
const props = defineProps<{
  show: boolean // 默认是required: true. 如果不是必须的，可以使用?标记: show?: boolean
  course: Course
}>()
const emit = defineEmits(['update:show', 'refresh'])

const formRef = ref()
const form = ref<Course>(deepClone(props.course))

const rules: Record<string, Rule[]> = {
  num: [{ required: true, message: '请输入课程序号' }],
  name: [{ required: true, message: '请输入课程名称' }],
  credit: [
    { required: true, type: 'number', message: '请输入学分' },
    { pattern: /^\d{1,2}(\.\d)?$/, message: '学分必须是1-2位数字' }
  ],
  grade: [{ required: true, type: 'number', message: '请选择开设年级' }],
  courseType: [{ required: true, type: 'number', message: '请选择课程类型' }],
  courseStatus: [{ required: true, type: 'number', message: '请选择课程状态' }]
}

watch(() => props.course, newVal => form.value = deepClone(newVal))

const onClose = () => {
  emit('update:show', false)
}

const onSave = () => {
  formRef.value.validate().then(async (form: any) => {
    const res = await updateCourse(props.course.courseId, form)
    if (res.code === 0) {
      message.success('添加成功')
      emit('refresh')
    } else {
      message.error(res.msg)
    }
  }, () => {})
}
</script>

