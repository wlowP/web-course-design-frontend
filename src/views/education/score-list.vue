<template>
  <div class="score">
    <a-page-header class="header"
                   @back="$router.back()"
                   :avatar="{ src: svgScoreList, shape: 'square' }"
    >
      <template #title><span class="title">成绩管理</span></template>
      <span class="tip">管理学生的成绩</span>
    </a-page-header>
    <a-card bordered title="查询选项">
      <a-row>
        <a-col :span="4">
          <a-radio-group v-model:value="queryOption" button-style="solid" style="width: 300px;">
            <a-radio-button :value="1">根据课程ID查询</a-radio-button>
            <a-radio-button :value="2">根据学生ID查询成绩</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :span="7" :offset="13">
          <a-row style="display: flex">
            <a-input-search v-model:value="searchText"
                            style="width: 25vw;"
                            :placeholder="`输入${queryOption === 1 ? '课程' : '学生'}ID进行查询`"
                            @keydown.enter="search"
            >
              <template #enterButton>
                <a-button :icon="h(SearchOutlined)" type="primary" @click="search">查询</a-button>
              </template>
            </a-input-search>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card bordered>
      <a-table bordered sticky
               :columns="columns"
               :data-source="scoreList"
               :scroll="{ x: 2000 }"
               :loading="tableLoading"
               :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
               :pagination="{ position: ['bottomRight'], defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['10', '15', '30', '50', '100'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` } as PaginationProps"
               @change="updateFiltersAndSorter"
      >
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
            <a-button size="small" style="width: 90px" @click="handleReset(clearFilters, column)">重置</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import svgScoreList from '@/assets/svg/成绩管理.svg'
import { computed, h, ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message, PaginationProps, type TableColumnType, TableProps } from 'ant-design-vue'
import type { Score } from '@/types/Score'
import { getScoreList } from '@/api/score'
import { CourseType, Grade, ScoreStatus } from '@/types/Enums'
import type { Course } from '@/types/Course'
import type { Student } from '@/types/Student'

const scoreList = ref<Score[]>([])

// 1 -> 根据课程ID查询; 2 -> 根据学生ID查询
const queryOption = ref<number>(1)

const searchText = ref<string>('')

const tableLoading = ref<boolean>(false)
const search = async () => {
  tableLoading.value = true
  const res = await getScoreList(queryOption.value, { data: { [queryOption.value === 1 ? 'courseId' : 'studentId']: searchText.value } })
  if (res.code === 0) {
    scoreList.value = res.data
    tableLoading.value = false
    return res.data
  } else {
    message.error(res.msg)
    tableLoading.value = false
    return []
  }
}

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

const columns = computed<TableColumnType<Score>>(() => {
  const filters = enabledFilters.value || {}
  const sorter = enabledSorter.value || {}
  return [
    {
      title: '学生姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left',
      customFilterDropdown: true,
      onFilter: (value: string, record: Student) => record.name.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: focusSearchInputByFlag,
      filteredValue: !!searchedKeys.value.name && [ ...searchedKeys.value.name ]
    }, {
      title: '学生ID',
      dataIndex: 'studentId',
      width: 90
    }, {
      title: '专业',
      dataIndex: 'major',
      width: 250,
      customRender: ({ text }) => {
        switch (text) {
          case 1: return '软件工程'
          case 2: return '数字媒体技术'
          case 3: return '数据科学与大数据技术'
        }
      }
    }, {
      title: '年级',
      dataIndex: 'grade',
      width: 100,
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
      title: '班级',
      dataIndex: 'studentClass',
      width: 100
    }, {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 120
    }, {
      title: '课程序号',
      dataIndex: 'num',
      width: 100
    }, {
      title: '课程类型',
      dataIndex: 'courseType',
      width: 110,
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
      title: '课程学分',
      dataIndex: 'credit',
      width: 100
    }, {
      title: '成绩',
      dataIndex: 'score'
    }, {
      title: '单科班级排名',
      dataIndex: 'rankClassCourse',
      sorter: (a: Score, b: Score) => a.rankClassCourse - b.rankClassCourse,
      sortOrder: sorter.field === 'rankClassCourse' && sorter.order
    }, {
      title: '单科学院排名',
      dataIndex: 'rankCollegeCourse',
      sorter: (a: Score, b: Score) => a.rankCollegeCourse - b.rankCollegeCourse,
      sortOrder: sorter.field === 'rankCollegeCourse' && sorter.order
    }, {
      title: '成绩状态',
      dataIndex: 'scoreStatus',
      customRender: ({ text }) => {
        switch (text) {
          case ScoreStatus.NOT_TESTED: return '未批改'
          case ScoreStatus.TESTED_NOT_VISIBLE: return '已批改不可见'
          case ScoreStatus.TESTED_VISIBLE: return '已批改可见'
        }
      },
      filters: [{ text: '未批改', value: ScoreStatus.NOT_TESTED }, { text: '已批改不可见', value: ScoreStatus.TESTED_NOT_VISIBLE }, { text: '已批改可见', value: ScoreStatus.TESTED_VISIBLE }],
      onFilter: (value: ScoreStatus, score: Score) => score.scoreStatus === value,
      filteredValue: filters.scoreStatus || null
    }, {
      title: '操作',
      fixed: 'right',
      width: 160
    }
  ] as TableColumnType<Score>[]
})
</script>

<style scoped>

</style>
