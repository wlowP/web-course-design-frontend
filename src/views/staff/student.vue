<template>
  <div class="student">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgStudentList, shape: 'square' }"
    >
      <template #title><span class="title">学生管理</span></template>
      <span class="tip">展示学生的各项信息</span>
    </a-page-header>
    <a-card bordered>
      <a-table :columns="columns"
               :data-source="studentList"
               bordered sticky
               :loading="tableLoading"
               :scroll="{ x: 2600 }"
               :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
               @change="updateFiltersAndSorter"
               :pagination="{ position: ['bottomRight'], defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['10', '15', '30', '50', '100'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` } as PaginationProps"
      >
        <!-- todo: 启用了sticky属性让表头附着视口顶部后, 划到表格底部时偶尔会出现底部有两个横向滚动条的情况, 看看能不能修复 -->
        <template #headerCell="{ column }">
          <span>
            {{ column.title }}
          </span>
        </template>

        <!-- 列头右侧的下拉搜索框 -->
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
          <div style="padding: 8px">
            <a-input
              ref="searchInputRef"
              :placeholder="`根据 ${column.title} 搜索`"
              :value="selectedKeys?.join(' ')"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
            /> <!-- 📌在@change的时候将输入的搜索内容传递给组件内部值selectedKeys, 所以不用自己加一个v-model了 -->
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

        <!-- record就对应每个学生对象 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '学号'">
            <a-typography-paragraph copyable class="clearMargin">
              {{ record.username }}
            </a-typography-paragraph>
          </template>
          <template v-else-if="column.title === '性别'">
            {{
              record.gender === 1 ? '男' :
              record.gender === 2 ? '女' : '未知'
            }}
          </template>
          <template v-else-if="column.title === '年级'">
            {{
              record.grade === 1 ? '大一' :
              record.grade === 2 ? '大二' :
              record.grade === 3 ? '大三' :
              record.grade === 4 ? '大四' : '其他'
            }}
          </template>
          <template v-else-if="column.title === '专业'">
            {{
              record.major === 1 ? '软件工程' :
              record.major === 2 ? '数字媒体技术' :
              record.major === 3 ? '数据科学与大数据技术' : '暂无'
            }}
          </template>
          <template v-else-if="column.title === '操作'">
            <a-space>
              <!-- 这里跳转时通过history.state传递对象参数. 这样就可以不用将参数暴露在地址栏url中了 -->
              <a-button type="default" @click="router.push({ path: ch('/主页/人员管理/学生信息'), state: { studentId: record.studentId } })">编辑</a-button>
              <a-popconfirm title="是否确定要删除?"
                            ok-text="删除"
                            ok-type="danger"
                            :ok-button-props="{ danger: true, type: 'primary' }"
                            cancel-text="取消"
                            @confirm="deleteStudent(record.studentId)"
              >
                <template #icon><question-circle-outlined style="color: red" /></template>
                <a-button type="primary" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>

        <!-- 底部操作栏 -->
        <template #summary>
          <a-table-summary fixed="bottom">
            <a-table-summary-row>
              <a-table-summary-cell :index="0" :col-span="6">
                <a-space>
                  <div style="width: 5em;">总数 {{ studentList.length }}</div>
                  <a-button type="primary" :icon="h(ReloadOutlined)" @click="refresh" :loading="btnLoading">刷新</a-button>
                  <a-button type="dashed" @click="enabledSorter = {}">重置排序</a-button>
                  <a-button type="dashed" @click="enabledFilters = {}">重置过滤器</a-button>
                  <a-button type="dashed" @click="searchedKeys = {}">重置搜索</a-button>
                  <a-button type="default" @click="enabledSorter = {}; enabledFilters = {}; searchedKeys = {}">重置所有筛选</a-button>
                </a-space>
              </a-table-summary-cell>
              <a-table-summary-cell :index="6" :col-span="9"/>
              <a-table-summary-cell :index="15" :col-span="2">
                <a-space>
                  <a-button type="primary" :icon="h(UserAddOutlined)" @click="showModal = true">添加学生</a-button>
                  <a-button type="primary" :icon="h(DownloadOutlined)">导出学生表格</a-button>
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
             :mask-closable="false"
             style="top: 20vh"
    >
      <a-card bordered style="max-height: 50vh; overflow-y: scroll">
        <a-form :label-col="{ style: { width: '100px' } }"
                :model="form"
                :rules="rules"
                ref="formRef"
        >
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="form.name"/>
          </a-form-item>
          <a-form-item label="学号" name="username">
            <a-input v-model:value="form.username"/>
          </a-form-item>
          <a-form-item label="年级" name="grade">
            <a-select v-model:value="form.grade">
              <a-select-option :value="1">大一</a-select-option>
              <a-select-option :value="2">大二</a-select-option>
              <a-select-option :value="3">大三</a-select-option>
              <a-select-option :value="4">大四</a-select-option>
              <a-select-option :value="5">其他</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="班级" name="studentClass">
            <a-input-number v-model:value="form.studentClass" addon-after="班" :min="1" :max="20"/>
          </a-form-item>
          <a-form-item label="专业" name="major">
            <a-select v-model:value="form.major">
              <a-select-option :value="1">软件工程</a-select-option>
              <a-select-option :value="2">数字媒体技术</a-select-option>
              <a-select-option :value="3">数据科学与大数据技术</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value="form.gender">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="form.email"/>
          </a-form-item>
          <a-form-item label="籍贯" name="birthplace">
            <a-input v-model:value="form.birthplace"/>
          </a-form-item>
          <a-form-item label="民族" name="ethnicity">
            <a-input v-model:value="form.ethnicity"/>
          </a-form-item>
          <a-form-item label="电话" name="phone">
            <a-input v-model:value="form.phone"/>
          </a-form-item>
          <a-form-item label="出生日期" name="birthday">
            <a-date-picker value-format="YYYY-MM-DD" v-model:value="form.birthday"/>
          </a-form-item>
          <a-form-item label="住址" name="address">
            <a-input v-model:value="form.address"/>
          </a-form-item>
        </a-form>
      </a-card>
      <template #footer>
        <a-button type="dashed" @click="reset">重置</a-button>
        <a-button type="default" @click="showModal = false">取消</a-button>
        <a-button type="primary" @click="addStudent" :loading="btnLoading">确认添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import svgStudentList from '@/assets/svg/学生管理.svg'
import { Router, useRouter } from 'vue-router'
import { computed, h, ref } from 'vue'
import { message, PaginationProps, TableColumnType, TableProps } from 'ant-design-vue'
import type { Student } from '@/types/Student'
import { addNewStudent, deleteStudentById, getStudentList } from '@/api/student'
import {
  ReloadOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
  UserAddOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { ch } from '@/utils/commons'

const router: Router = useRouter()
const studentList = ref<Student[]>([])

// 表格的加载状态
const tableLoading = ref(false)
const init = async () => {
  tableLoading.value = true
  const res = await getStudentList()
  if (res.code === 0) {
    studentList.value = res.data
    tableLoading.value = false
    return res.data
  } else {
    message.error(res.msg)
    tableLoading.value = false
    return null
  }
}
// 一进页面就获取学生列表
init()
// 刷新学生列表
const refresh = async () => {
  btnLoading.value = true
  const res = await init()
  if (res !== null) {
    message.success('刷新成功')
  }
  btnLoading.value = false
}

// 过滤器和排序器的状态, 用于实现受控的过滤器和排序器
const enabledFilters = ref()
const enabledSorter = ref()

// 搜索的表单自动聚焦
const focusSearchInputByFlag = (flag: boolean) => {
  if (flag) {
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 100)
  }
}

// 使用计算属性返回columns对象数组, 以便实现受控的过滤器, 搜索等功能
const columns = computed<TableColumnType<Student>[]>(() => {
  const filters = enabledFilters.value || {}
  const sorter = enabledSorter.value || {}
  return [
    // dataIndex支持数组来访对象的嵌套属性
    // key属性是对应vue使用v-for时需要的key, 如果已经指定了唯一的dataIndex属性, 就可不必指定key了
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left',
      customFilterDropdown: true,
      onFilter: (value: string, record: Student) => record.name.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: visible => focusSearchInputByFlag(visible),
      filteredValue: !!searchedKeys.value.name && [ ...searchedKeys.value.name ]
    },
    {
      title: '学号',
      dataIndex: 'username',
      width: 150,
      customFilterDropdown: true,
      onFilter: (value: string, record: Student) => record.username.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: visible => focusSearchInputByFlag(visible),
      filteredValue: !!searchedKeys.value.username && [ ...searchedKeys.value.username ]
    },
    {
      title: '学生ID',
      dataIndex: 'studentId',
      width: 100,
      sorter: (a: Student, b: Student) => a.studentId - b.studentId,
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
      filters: [{ text: '大一', value: 1 }, { text: '大二', value: 2 }, { text: '大三', value: 3 }, { text: '大四', value: 4 }],
      onFilter: (value: number, student: Student) => student.grade === value,
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
      width: 250,
      filters: [{text: '软件工程', value: 1}, {text: '数字媒体技术', value: 2}, {text: '数据科学与大数据技术', value: 3}],
      onFilter: (value: number, student: Student) => student.major === value,
      filteredValue: filters.major || null // 定义了filteredValue后就会启用过滤器的受控模式
    },
    {
      title: '绩点',
      dataIndex: 'gpa',
      width: 100,
      sorter: (a: Student, b: Student) => a.gpa - b.gpa,
      sortOrder: sorter.field === 'gpa' && sorter.order
    },
    {
      title: '绩点班级排名',
      width: 140,
      dataIndex: 'rankClass',
      sorter: (a: Student, b: Student) => a.rankClass - b.rankClass,
      sortOrder: sorter.field === 'rankClass' && sorter.order
    },
    {
      title: '绩点学院排名',
      width: 140,
      dataIndex: 'rankCollege',
      sorter: (a: Student, b: Student) => a.rankCollege - b.rankCollege,
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
  ] as TableColumnType<Student>[] // 类型断言一下以免IDE报错
})

// 更新过滤器和排序器的状态
const updateFiltersAndSorter: TableProps['onChange'] = (_pagination, filters, sorter) => {
  enabledFilters.value = filters
  enabledSorter.value = sorter
}

// 根据某一列或多列的信息查询
// 保存每一列的搜索关键字, 用于多列搜索
const searchedKeys = ref<Record<string, string[]>>({})
// 搜索框的ref引用
const searchInputRef = ref()

// 某一列的搜索
const handleSearch = (selectedKeys: string[], confirm: any, dataIndex: string) => {
  confirm()
  searchedKeys.value[dataIndex] = selectedKeys[0].split(' ')
}

// 重置某一列搜索的关键字
const handleReset = (_clearFilters: any, column: any) => {
  searchedKeys.value[column.dataIndex] = []
}

// 添加学生
// 是否展示添加学生的对话框
const showModal = ref(false)
// 添加学生的表单
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
  address: ''
})
// 添加学生的表单验证规则
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入姓名', whitespace: true, trigger: 'blur' }],
  username: [{ required: true, message: '请输入学号', whitespace: true, trigger: 'blur' }],
  grade: [{ required: true, type: 'number', message: '请选择年级', whitespace: true, trigger: 'blur' }],
  studentClass: [{ required: true, type: 'number', message: '请输入班级', whitespace: true, trigger: 'blur' }],
  major: [{ required: true, type: 'number', message: '请选择专业', whitespace: true, trigger: 'blur' }],
  gender: [{ required: true, type: 'number', message: '请选择性别', whitespace: true, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', whitespace: true, trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ],
  birthplace: [{ required: true, message: '请输入籍贯', whitespace: true, trigger: 'blur' }],
  ethnicity: [{ required: true, message: '请输入民族', whitespace: true, trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入电话', whitespace: true, trigger: 'blur' },
    // 手机号的校验比较宽松
    { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '电话格式不正确', trigger: ['blur', 'change'] }
  ],
  birthday: [{ required: true, message: '请选择出生日期', whitespace: true, trigger: 'blur' }],
  address: [{ required: true, message: '请输入住址', whitespace: true, trigger: 'blur' }]
}
// 重置表单
const reset = () => form.value = { name: '', username: '', grade: '', studentClass: '', major: '', gender: '', email: '', birthplace: '', ethnicity: '', phone: '', birthday: '', address: '' }

// 表单的ref引用
const formRef = ref()
// 按钮的加载状态, 一个页面上同时应该只能有一个按钮处于加载状态
const btnLoading = ref(false)
// 发起请求增加学生
const addStudent = () => {
  formRef.value.validate().then(async (form: any) => {
    btnLoading.value = true
    const res = await addNewStudent(form)
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

// 删除学生
const deleteStudent = async (studentId: number) => {
  const res = await deleteStudentById(studentId)
  if (res.code === 0) {
    message.success('删除成功')
    await init()
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped>

</style>
