<template>
  <div class="student">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgStudentList, shape: 'square' }"
    >
      <template #title><span class="title">学生管理</span></template>
      <span class="tip">展示并管理学生的各项信息</span>
    </a-page-header>
    <a-card bordered>
      <a-table :columns="columns"
               :data-source="studentList"
               bordered sticky
               :scroll="{ x: 2600 }"
               :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
               @change="updateFiltersAndSorter"
               :pagination="{ position: ['bottomRight'], defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['10', '15', '30', '50', '100'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` }"
      >
        <!-- todo: 启用了sticky属性让表头附着视口顶部后偶尔会出现底部有两个横向滚动条的情况, 看看能不能修复 -->
        <template #headerCell="{ column }">
          <span>
            {{ column.title }}
          </span>
        </template>

        <!-- record就对应每个学生对象 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '学号'">
            <a-typography-paragraph copyable>
              {{ record.username }}
            </a-typography-paragraph>
          </template>
          <template v-else-if="column.title === '操作'">
            <a-space>
              <a-button type="primary" danger>删除</a-button>
              <a-button type="link">查看</a-button>
            </a-space>
          </template>
        </template>

        <!-- 底部操作栏 -->
        <template #summary>
          <a-table-summary fixed="bottom">
            <a-table-summary-row>
              <a-table-summary-cell :index="0" :col-span="5">
                <a-space>
                  <div style="width: 4em;">共 {{ studentList.length }} 条</div>
                  <a-button type="primary" :icon="h(ReloadOutlined)" @click="refresh">刷新</a-button>
                  <a-button type="dashed" @click="enabledSorter = {}">重置排序</a-button>
                  <a-button type="dashed" @click="enabledFilters = {}">重置过滤器</a-button>
                  <a-button type="default" @click="enabledSorter = {}; enabledFilters = {}">重置所有筛选</a-button>
                </a-space>
              </a-table-summary-cell>
              <a-table-summary-cell :index="5" :col-span="10"/>
              <a-table-summary-cell :index="15" :col-span="2">
                <a-space>
                  <a-button type="primary" @click="showModal = true">添加学生</a-button>
                  <a-button type="primary">导出学生表格</a-button>
                </a-space>
              </a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>
      </a-table>
    </a-card>

    <!-- 添加学生的对话框 -->
    <a-modal v-model:open="showModal"
             title="添加学生"
             @ok="addStudent"
             style="top: 20vh"
    >
      <a-form :label-col="{ style: { width: '100px' } }"
              :model="form"
      >
        <a-form-item label="姓名">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="学号">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="年级">
          <a-input v-model:value="form.grade" />
        </a-form-item>
        <a-form-item label="班级">
          <a-input v-model:value="form.studentClass" />
        </a-form-item>
        <a-form-item label="专业">
          <a-input v-model:value="form.major" />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="form.gender">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="form.email" />
        </a-form-item>
        <a-form-item label="籍贯">
          <a-input v-model:value="form.birthplace" />
        </a-form-item>
        <a-form-item label="民族">
          <a-input v-model:value="form.ethnicity" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="form.phone" />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker value-format="YYYY-MM-DD" v-model:value="form.birthday" />
        </a-form-item>
        <a-form-item label="住址">
          <a-input v-model:value="form.address" />
        </a-form-item>
        <a-form-item label="上传头像">
          <a-upload v-model:file-list="form.photo" :show-upload-list="false" list-type="picture-card">
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传头像</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import svgStudentList from '@/assets/svg/学生管理.svg'
import { useRouter } from 'vue-router'
import { computed, h, ref } from 'vue'
import { message, TableColumnType, TableProps } from 'ant-design-vue'
import type { Student } from '@/types/Student'
import { getStudentList } from '@/api/student'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const studentList = ref<Student[]>([])

const init = async () => {
  const res = await getStudentList()
  if (res.code === 0) {
    studentList.value = res.data
    return res.data
  } else {
    message.error('获取学生列表失败')
    return null
  }
}
// 一进页面就获取学生列表
init()
// 刷新学生列表
const refresh = async () => {
  const res = await init()
  if (res !== null) {
    message.success('刷新成功')
  }
}

// 过滤器和排序器的状态, 用于实现受控的过滤器和排序器
const enabledFilters = ref()
const enabledSorter = ref()

// 使用计算属性返回columns对象数组, 以便实现受控的过滤器, 搜索等功能
const columns = computed<TableColumnType<Student>[]>(() => {
  const filters = enabledFilters.value || {}
  const sorter = enabledSorter.value || {}
  return [
    // dataIndex支持数组来访对象的嵌套属性
    // key属性是对应vue使用v-for时需要的key, 如果已经指定了唯一的dataIndex属性, 就可不必指定key了
    {
      title: '学号',
      dataIndex: 'username',
      width: 150,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '学生ID',
      dataIndex: 'studentId',
      width: 100,
      sorter: (a, b) => a.studentId - b.studentId,
      sortOrder: sorter.field === 'studentId' && sorter.order // 定义了sortOrder后就会启用排序的受控模式
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 100
    },
    {
      title: '年级',
      dataIndex: 'grade',
      width: 100,
      filters: [{ text: '大一', value: '大一' }, { text: '大二', value: '大二' }, { text: '大三', value: '大三' }, { text: '大四', value: '大四' }],
      onFilter: (value, student) => student.grade === value,
      filteredValue: filters.grade || null // 定义了filteredValue后就会启用过滤器的受控模式
    },
    {
      title: '班级',
      dataIndex: 'studentClass',
      width: 100
    },
    {
      title: '专业',
      dataIndex: 'major',
      width: 250
    },
    {
      title: '绩点',
      dataIndex: 'gpa',
      width: 100,
      sorter: (a, b) => a.gpa - b.gpa,
      sortOrder: sorter.field === 'gpa' && sorter.order
    },
    {
      title: '绩点班级排名',
      width: 140,
      dataIndex: 'rankClass',
      sorter: (a, b) => a.rankClass - b.rankClass,
      sortOrder: sorter.field === 'rankClass' && sorter.order
    },
    {
      title: '绩点学院排名',
      width: 140,
      dataIndex: 'rankCollege',
      sorter: (a, b) => a.rankCollege - b.rankCollege,
      sortOrder: sorter.field === 'rankCollege' && sorter.order
    },
    {
      title: '籍贯',
      dataIndex: 'birthplace',
      width: 150
    },
    {
      title: '住址',
      dataIndex: 'address',
      width: 150
    },
    {
      title: '民族',
      dataIndex: 'ethnicity',
      width: 100
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '出生日期',
      dataIndex: 'birthday'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150
    }
  ]
})

// 更新过滤器和排序器的状态
const updateFiltersAndSorter: TableProps['onChange'] = (_pagination, filters, sorter) => {
  enabledFilters.value = filters
  enabledSorter.value = sorter
}

// 添加学生
const showModal = ref(false)
const form = ref({
  name: '',
  username: '',
  grade: '',
  studentClass: '',
  major: '',
  gender: '',
  email: '',
  birthplace: '',
  ethnicity: '',
  phone: '',
  birthday: '',
  address: '',
  photo: []
})

const addStudent = () => {
  console.log('添加学生')
  showModal.value = false
}
</script>

<style scoped>

</style>
