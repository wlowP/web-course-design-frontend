<template>
  <div class="teacher">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgTeacherList, shape: 'square' }"
    >
      <template #title><span class="title">教师管理</span></template>
      <span class="tip">展示教师的各项信息</span>
    </a-page-header>
    <a-card bordered>
      <a-table :columns="columns"
               :data-source="teacherList"
               bordered sticky
               :loading="tableLoading"
               :scroll="{ x: 1800 }"
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
          <template v-if="column.title === '工号'">
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
          <template v-else-if="column.title === '操作'">
            <a-space>
              <a-button type="default" @click="router.push({ path: ch('/主页/人员管理/教师信息'), state: { teacherId: record.teacherId } })">查看</a-button>
              <a-popconfirm title="是否确定要删除?"
                            ok-text="删除"
                            ok-type="danger"
                            :ok-button-props="{ danger: true, type: 'primary' }"
                            cancel-text="取消"
                            @confirm="deleteTeacher(record.teacherId)"
              >
                <template #icon><question-circle-outlined style="color: red"/></template>
                <a-button type="primary" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>

        <template #summary>
          <a-table-summary fixed="bottom">
            <a-table-summary-row>
              <a-table-summary-cell :index="0" :col-span="6">
                <a-space>
                  <div style="width: 5em;">总数 {{ teacherList.length }}</div>
                  <a-button type="primary" :icon="h(ReloadOutlined)" @click="refresh" :loading="btnLoading">刷新</a-button>
                  <a-button type="dashed" @click="enabledSorter = {}">重置排序</a-button>
                  <a-button type="dashed" @click="enabledFilters = {}">重置过滤器</a-button>
                  <a-button type="dashed" @click="searchedKeys = {}">重置搜索</a-button>
                  <a-button type="default" @click="enabledSorter = {}; enabledFilters = {}; searchedKeys = {}">重置所有筛选</a-button>
                </a-space>
              </a-table-summary-cell>
              <a-table-summary-cell :index="6" :col-span="2"/>
              <a-table-summary-cell :index="8" :col-span="2">
                <a-space>
                  <a-button type="primary" :icon="h(UserAddOutlined)" @click="showModal = true">添加教师</a-button>
                  <a-button type="primary" :icon="h(DownloadOutlined)">导出教师表格</a-button>
                </a-space>
              </a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>
      </a-table>
    </a-card>

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
          <a-form-item label="工号" name="username">
            <a-input v-model:value="form.username"/>
          </a-form-item>
          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value="form.gender">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="职务" name="position">
            <a-input v-model:value="form.position"/>
          </a-form-item>
          <a-form-item label="学位" name="degree">
            <a-input v-model:value="form.degree"/>
          </a-form-item>
          <a-form-item label="所在学院" name="college">
            <a-input v-model:value="form.college"/>
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="form.email"/>
          </a-form-item>
          <a-form-item label="电话" name="phone">
            <a-input v-model:value="form.phone"/>
          </a-form-item>
        </a-form>
      </a-card>
      <template #footer>
        <a-button type="dashed" @click="formRef.resetFields()">重置</a-button>
        <a-button type="default" @click="showModal = false">取消</a-button>
        <a-button type="primary" @click="addTeacher" :loading="btnLoading">确认添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import svgTeacherList from '@/assets/svg/教师管理.svg'
import { useRouter } from 'vue-router'
import { computed, h, ref } from 'vue'
import { message, PaginationProps, TableColumnType, TableProps } from 'ant-design-vue'
import { addNewTeacher, deleteTeacherById, getTeacherList } from '@/api/teacher'
import type { Teacher } from '@/types/Teacher'
import {
  DownloadOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined
} from '@ant-design/icons-vue'
import { ch } from '@/utils/commons'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()

const tableLoading = ref<boolean>(false)
const init = async () => {
  tableLoading.value = true
  const res = await getTeacherList()
  if (res.code === 0) {
    teacherList.value = res.data
    tableLoading.value = false
    return res.data
  } else {
    message.error(res.msg)
    tableLoading.value = false
    return null
  }
}
init()

const teacherList = ref<Teacher[]>([])

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

const columns = computed<TableColumnType<Teacher>[]>(() => {
  const filters = enabledFilters.value || {}
  const sorter = enabledSorter.value || {}
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left',
      customFilterDropdown: true,
      onFilter: (value: string, record: Teacher) => record.name.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: focusSearchInputByFlag,
      filteredValue: !!searchedKeys.value.name && [ ...searchedKeys.value.name ]
    }, {
      title: '工号',
      dataIndex: 'username',
      width: 150,
      customFilterDropdown: true,
      onFilter: (value: string, record: Teacher) => record.username.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: focusSearchInputByFlag,
      filteredValue: !!searchedKeys.value.username && [ ...searchedKeys.value.username ]
    }, {
      title: '教师ID',
      dataIndex: 'teacherId',
      width: 100,
      sorter: (a: Teacher, b: Teacher) => a.teacherId - b.teacherId,
      sortOrder: sorter.field === 'teacherId' && sorter.order // 定义了sortOrder后就会启用排序的受控模式
    }, {
      title: '性别',
      dataIndex: 'gender',
      filters: [{ text: '男', value: 1 }, { text: '女', value: 2 }],
      onFilter: (value: number, teacher: Teacher) => teacher.gender === value,
      filteredValue: filters.gender || null,
      width: 100
    }, {
      title: '邮箱',
      dataIndex: 'email',
      width: 250
    }, {
      title: '电话',
      dataIndex: 'phone',
      width: 150
    }, {
      title: '职务',
      dataIndex: 'position',
      width: 170
    }, {
      title: '学位',
      dataIndex: 'degree',
      width: 150
    }, {
      title: '所在学院',
      dataIndex: 'college',
      customFilterDropdown: true,
      width: 200,
      onFilter: (value: string, record: Teacher) => record.college.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: focusSearchInputByFlag,
      filteredValue: !!searchedKeys.value.college && [ ...searchedKeys.value.college ]
    }, {
      title: '操作',
      fixed: 'right',
      width: 160
    }
  ] as TableColumnType<Teacher>[]
})

const showModal = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const refresh = async () => {
  btnLoading.value = true
  const res = await init()
  if (res) {
    message.success('刷新成功')
  }
  btnLoading.value = false
}

const formRef = ref()
const form = ref({
  name: '',
  username: '',
  email: '',
  gender: '',
  degree: '',
  phone: '',
  position: '',
  college: ''
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入姓名', whitespace: true, trigger: 'blur' }],
  username: [{ required: true, message: '请输入工号', whitespace: true, trigger: 'blur' }],
  gender: [{ required: true, type: 'number', message: '请选择性别', whitespace: true, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', whitespace: true, trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入电话', whitespace: true, trigger: 'blur' },
    // 手机号的校验比较宽松
    { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '电话格式不正确', trigger: ['blur', 'change'] }
  ],
  position: [{ required: true, message: '请输入职务', whitespace: true, trigger: 'blur' }],
  degree: [{ required: true, message: '请输入学位', whitespace: true, trigger: 'blur' }],
  college: [{ required: true, message: '请输入所在学院', whitespace: true, trigger: 'blur' }]
}

const addTeacher = () => {
  formRef.value.validate().then(async (form: any) => {
    btnLoading.value = true
    const res = await addNewTeacher(form)
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

const deleteTeacher = async (teacherId: number) => {
  const res = await deleteTeacherById(teacherId)
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
