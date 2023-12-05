<template>
  <div class="course-list">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgCourse, shape: 'square' }"
    >
      <template #title><span class="title">课程管理</span></template>
      <span class="tip">展示课程信息</span>
    </a-page-header>
    <a-card bordered>
      <a-table bordered sticky
               :data-source="courseList"
               :columns="columns"
               :loading="tableLoading"
               :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
               @change="updateFiltersAndSorter"
               :pagination="{ position: ['bottomRight'], defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['10', '15', '30', '50', '100'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` } as PaginationProps"
      >
        <template #headerCell="{ column }">
          <span>
            {{ column.title }}
          </span>
        </template>

        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
          <div style="padding: 8px">
            <a-input
              ref="searchInputRef"
              :placeholder="`根据 ${column.title} 搜索`"
              :value="selectedKeys?.join(' ')"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            >
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button size="small" style="width: 90px" @click="handleReset(clearFilters, column)">
              重置
            </a-button>
          </div>
        </template>
        <template #customFilterIcon="{ filtered }">
          <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '课程序号'">
            <a-typography-paragraph copyable class="clearMargin">
              {{ record.num }}
            </a-typography-paragraph>
          </template>
          <template v-if="column.title === '操作'">
            <a-space>
              <a-button type="default" @click="router.push({ path: ch('/主页/教务管理/课程信息'), state: { courseId: record.courseId } })">编辑</a-button>
              <a-button type="primary" danger @click="disableCourse(record.courseId)">禁用</a-button>
            </a-space>
          </template>
        </template>

        <template #summary>
          <a-table-summary fixed="bottom">
            <a-table-summary-row>
              <a-table-summary-cell :index="0" :col-span="6">
                <a-space>
                  <div style="width: 5em;">总数 {{ courseList.length }}</div>
                  <a-button type="primary" :icon="h(ReloadOutlined)" @click="refresh" :loading="btnLoading">刷新</a-button>
                  <a-button type="dashed" @click="enabledSorter = {}">重置排序</a-button>
                  <a-button type="dashed" @click="enabledFilters = {}">重置过滤器</a-button>
                  <a-button type="dashed" @click="searchedKeys = {}">重置搜索</a-button>
                  <a-button type="default" @click="enabledSorter = {}; enabledFilters = {}; searchedKeys = {}">重置所有筛选</a-button>
                </a-space>
              </a-table-summary-cell>
              <a-table-summary-cell :index="6" :col-span="2">
                <a-space>
                  <a-button type="primary" :icon="h(UserAddOutlined)" @click="showModal = true">添加课程</a-button>
                  <a-button type="primary" :icon="h(DownloadOutlined)">导出课程表格</a-button>
                </a-space>
              </a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="showModal"
             title="添加课程"
             :mask-closable="false"
             style="top: 20vh"
    >
      <a-card bordered style="max-height: 50vh; overflow-y: scroll">
        <a-form :label-col="{ style: { width: '100px' } }"
                :model="form"
                :rules="rules"
                ref="formRef"
        >
          <a-form-item label="课程序号" name="num">
            <a-input v-model:value="form.num" />
          </a-form-item>
          <a-form-item label="课程名称" name="name">
            <a-input v-model:value="form.name" />
          </a-form-item>
          <a-form-item label="课程学分" name="credit">
            <a-input-number v-model:value="form.credit" />
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
      </a-card>
      <template #footer>
        <a-button type="dashed" @click="formRef.resetFields()">重置</a-button>
        <a-button type="default" @click="showModal = false">取消</a-button>
        <a-button type="primary" @click="addCourse" :loading="btnLoading">确认添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import svgCourse from '@/assets/svg/课程.svg'
import { useRouter } from 'vue-router'
import { addNewCourse, disCourse, getCourseList } from '@/api/course'
import { computed, ref, h } from 'vue'
import type { Course } from '@/types/Course'
import { message, PaginationProps, TableColumnType, TableProps } from 'ant-design-vue'
import { DownloadOutlined, ReloadOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { CourseStatus, CourseType, Grade } from '@/types/Enums'
import { ch } from '@/utils/commons'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()

const init = async () => {
  const res = await getCourseList()
  if (res.code === 0) {
    courseList.value = res.data
    tableLoading.value = false
    return res.data
  } else {
    message.error(res.msg)
    tableLoading.value = false
    return null
  }
}
const refresh = async () => {
  btnLoading.value = true
  const res = await init()
  if (res) {
    message.success('刷新成功')
  }
  btnLoading.value = false
}
init()

const tableLoading = ref<boolean>(true)
const btnLoading = ref<boolean>(false)
const courseList = ref<Course[]>([])

const enabledFilters = ref()
const enabledSorter = ref()

const updateFiltersAndSorter: TableProps['onChange'] = (_pagination, filters, sorter) => {
  enabledFilters.value = filters
  enabledSorter.value = sorter
}

const searchedKeys = ref<Record<string, string[]>>({})
const searchInputRef = ref()

const handleSearch = (selectedKeys: string[], confirm: any, dataIndex: string) => {
  confirm()
  searchedKeys.value[dataIndex] = selectedKeys[0]?.split(' ')
}

const handleReset = (_clearFilters: any, column: any) => {
  searchedKeys.value[column.dataIndex] = []
}

const focusSearchInputByFlag = (flag: boolean) => {
  if (flag) {
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 100)
  }
}


const columns = computed<TableColumnType<Course>[]>(() => {
  const filters = enabledFilters.value || {}
  const sorter = enabledSorter.value || {}
  return [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      width: 60,
      sorter: (a: Course, b: Course) => a.courseId - b.courseId,
      sortOrder: sorter.field === 'courseId' && sorter.order,
    }, {
      title: '课程序号',
      dataIndex: 'num',
      width: 100
    }, {
      title: '课程名称',
      dataIndex: 'name',
      width: 120,
      customFilterDropdown: true,
      onFilter: (value: string, course: Course) => course.name.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: focusSearchInputByFlag,
      filteredValue: !!searchedKeys.value.name && [ ...searchedKeys.value.name ]
    }, {
      title: '课程学分',
      dataIndex: 'credit',
      width: 60,
      sorter: (a: Course, b: Course) => a.credit - b.credit,
      sortOrder: sorter.field === 'credit' && sorter.order,
    }, {
      title: '开设年级',
      dataIndex: 'grade',
      width: 60,
      filters: [{ text: '大一', value: Grade.F1 }, { text: '大二', value: Grade.F2 }, { text: '大三', value: Grade.F3 }, { text: '大四', value: Grade.F4 }, { text: '其他', value: Grade.OTHERS }],
      onFilter: (value: Grade, course: Course) => course.grade === value,
      filteredValue: filters.grade || null,
      customRender: ({ text }) => {
        switch (text) {
          case Grade.OTHERS: return '其他'
          case Grade.F1: return '大一'
          case Grade.F2: return '大二'
          case Grade.F3: return '大三'
          case Grade.F4: return '大四'
          default: return '未知'
        }
      }
    }, {
      title: '课程类型',
      dataIndex: 'courseType',
      width: 80,
      filters: [{ text: '必修', value: CourseType.REQUIRED }, { text: '限选', value: CourseType.SELECTED }, { text: '任选', value: CourseType.ELECTIVE }, { text: '必修(不计学分)', value: CourseType.REQUIRED_NO_CREDIT }],
      onFilter: (value: CourseType, course: Course) => course.courseType === value,
      filteredValue: filters.courseType || null,
      customRender: ({ text }) => {
        switch (text) {
          case CourseType.REQUIRED: return '必修'
          case CourseType.SELECTED: return '限选'
          case CourseType.ELECTIVE: return '任选'
          case CourseType.REQUIRED_NO_CREDIT: return '必修(不计学分)'
          default: return '未知'
        }
      }
    }, {
      title: '课程状态',
      dataIndex: 'courseStatus',
      width: 80,
      filters: [{ text: '无效课程', value: CourseStatus.INVALID }, { text: '有效不可选', value: CourseStatus.VALID_NOT_SELECTABLE }, { text: '可选课程', value: CourseStatus.SELECTABLE }],
      onFilter: (value: CourseStatus, course: Course) => course.courseStatus === value,
      filteredValue: filters.courseStatus || null,
      customRender: ({ text }) => {
        switch (text) {
          case CourseStatus.INVALID: return '无效课程'
          case CourseStatus.VALID_NOT_SELECTABLE: return '有效不可选'
          case CourseStatus.SELECTABLE: return '可选课程'
          default: return '未知'
        }
      }
    }, {
      title: '操作',
      width: 80
    }
  ] as TableColumnType<Course>[]
})

const rules: Record<string, Rule[]> = {
  num: [{ required: true, message: '请输入课程序号' },],
  name: [{ required: true, message: '请输入课程名称' },],
  credit: [{ required: true, type: "number", message: '请输入课程学分' },],
  grade: [{ required: true, type: 'number', message: '请选择开设年级' }],
  courseType: [{ required: true, type: 'number', message: '请选择课程类型' }],
  courseStatus: [{ required: true, type: 'number', message: '请选择课程状态' }]
}

const showModal = ref<boolean>(false)
const formRef = ref()
const form = ref({
  num: '',
  name: '',
  credit: '',
  grade: '',
  courseType: '',
  courseStatus: ''
})
const addCourse = () => {
  formRef.value.validate().then(async (form: any) => {
    btnLoading.value = true
    const res = await addNewCourse(form)
    if (res.code === 0) {
      message.success('添加成功')
      showModal.value = false
      await init()
    } else {
      message.error(res.msg)
    }
    btnLoading.value = false
  }, () => {})
}
const disableCourse = async (courseId: number) => {
  const res = await disCourse(courseId)
  if (res.code === 0) {
    message.success('已禁用')
    await init()
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped>

</style>
