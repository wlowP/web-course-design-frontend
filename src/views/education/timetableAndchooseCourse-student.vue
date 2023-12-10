<template>
    <div>
        <a-page-header title="选课/课程表" sub-title="这是学生选课和课程表展示界面" @back="() => $router.go(-1)">
            <template #extra>
                <a-select v-model:value="value" show-search placeholder="选择学年" style="width: 100px" :options="options"
                    :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="handleChange"></a-select>
                <a-space warp>
                    <a-tooltip title="search">
                        <a-button type="primary" shape="circle" :icon="h(SearchOutlined)" />
                    </a-tooltip>
                </a-space>
                <a-button type="primary" :size="size">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    下载课表
                </a-button>
            </template>
        </a-page-header>
        <a-table 
        :columns="columns" 
        :data-source="data" 
        :scroll="{ x: 'calc(700px + 50%)', y: 'calc(200px+50%)' }"
        :pagination="false"  
        :rowClassName="() => { return 'rowClass' }"
        bordered 
        >
            <template #title>获取学生姓名和学年</template>

        </a-table>
    </div>

    <div class="course-arrange">
        <a-page-header class="header" @back="router.back()" :avatar="{ src: svgCourse, shape: 'square' }">
            <template #title><span class="title">课程管理</span></template>
            <span class="tip">展示课程信息</span>
        </a-page-header>
        <a-card bordered>
            <a-table bordered sticky :data-source="courseList" :columns="columns" :loading="tableLoading"
                :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
                @change="updateFiltersAndSorter"
                :pagination="{ position: ['bottomRight'], defaultPageSize: 15, showQuickJumper: true, pageSizeOptions: ['5', '10', '15', '20'], showTotal: (total: any, range: any) => `共 ${total} 条 当前: ${range[0]} - ${range[1]}` } as PaginationProps">
                <template #headerCell="{ column }">
                    <span>
                        {{ column.title }}
                    </span>
                </template>

                <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                    <div style="padding: 8px">
                        <a-input ref="searchInputRef" :placeholder="`根据 ${column.title} 搜索`"
                            :value="selectedKeys?.join(' ')" style="width: 188px; margin-bottom: 8px; display: block"
                            @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
                        <a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
                            @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
                            <template #icon>
                                <SearchOutlined />
                            </template>
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
                        <a-button type="primary" danger @click="chooseCourse(record.courseArrangeId)">选择该课程</a-button>
                        <a-button type="primary" danger @click="deleteCourse(record.courseArrangeId)">删除该选择</a-button>
                        </a-space>
                    </template>


                </template>

                <template #summary>
                    <a-table-summary fixed="bottom">
                        <a-table-summary-row>
                            <a-table-summary-cell :index="0" :col-span="6">
                                <a-space>
                                    <div style="width: 5em;">总数 {{ courseList.length }}</div>
                                    <a-button type="primary" :icon="h(ReloadOutlined)" @click="refresh"
                                        :loading="btnLoading">刷新</a-button>
                                    <a-button type="dashed" @click="enabledSorter = {}">重置排序</a-button>
                                    <a-button type="dashed" @click="enabledFilters = {}">重置过滤器</a-button>
                                    <a-button type="dashed" @click="searchedKeys = {}">重置搜索</a-button>
                                    <a-button type="default"
                                        @click="enabledSorter = {}; enabledFilters = {}; searchedKeys = {}">重置所有筛选</a-button>
                                </a-space>
                            </a-table-summary-cell>
                            <a-table-summary-cell :index="6" :col-span="2">
                                <a-space>
                                    <a-button type="primary"  @click="saveAllCourseArrange">保存所有课程安排</a-button>
                                    <a-button type="primary" :icon="h(DownloadOutlined)">导出课程安排表格</a-button>
                                </a-space>
                            </a-table-summary-cell>
                        </a-table-summary-row>
                    </a-table-summary>
                </template>
            </a-table>
        </a-card>

        <a-modal v-model:open="showModal" title="添加课程" :mask-closable="false" style="top: 20vh">
            <a-card bordered style="max-height: 50vh; overflow-y: scroll">
                <a-form :label-col="{ style: { width: '100px' } }" :model="form" :rules="rules" ref="formRef">
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
<script lang="ts" setup>
//共有的
import { ref } from 'vue';

//下载按钮
import { DownloadOutlined } from '@ant-design/icons-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
const size = ref<SizeType>('large');
//搜索框
import type { SelectProps } from 'ant-design-vue';
const options = ref<SelectProps['options']>([
    { value: 'one', label: '大一' },
    { value: 'two', label: '大二' },
    { value: 'three', label: '大三' },
    { value: 'four', label: '大四' },
]);
const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};
const handleBlur = () => {
    console.log('blur');
};
const handleFocus = () => {
    console.log('focus');
};
const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const value = ref<string | undefined>(undefined);
//搜索按钮
import { h } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
//表格
//表格数据流
import type { TableColumnsType } from 'ant-design-vue';
type TableDataType = {
    key: number,
    shiduan: string;
    time: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
};


const columns: TableColumnsType = [
    {
        title: '时段',
        width: 60,
        fixed: 'left',
        className:'shiduanstyle',
        customCell: (columns,index) => {
            // console.log(column, index);
            if (index === 0) {
                return {
                    class: "morning-row",
                };
            }

            if (index === 2) {
                return {
                    class: "afternoonbreak-row",
                };
            }
            if (index === 3) {
                return {
                    class: "afternoon-row",
                };
            }

            if (index === 5) {
                return {
                    class: "night-row",
                };
            }
            return {};
        },
        customRender: ({ index }) => {
            const obj = {
                children: '',
                props: {} as any,
            };
            if (index === 0) {
                obj.props.rowSpan = 2;
                obj.children = '上午';
            }

            if (index === 2) {
                obj.props.rowSpan = 1;
                obj.props.colSpan = 9;
                obj.children = '午休时间';
            }
            if (index === 3) {
                obj.props.rowSpan = 2;
                obj.children = '下午';
            }

            if (index === 5) {
                obj.props.rowSpan = 2;
                obj.children = '晚间';
            }
            if (index === 1 || index === 4 || index === 6) {
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    },
    {
        title: '课节',
        width: 120,
        fixed: 'left',
        className: 'kejiestyle',
        customCell: (columns, index) => {
            // console.log(column, index);
            if (index === 0|| index === 1) {
                return {
                    class: "morning-row",
                };
            }

            if (index === 2) {
                return {
                    class: "afternoonbreak-row",
                };
            }
            if (index === 3|| index === 4) {
                return {
                    class: "afternoon-row",
                };
            }

            if (index === 5|| index === 6) {
                return {
                    class: "night-row",
                };
            }
            return {};
        },
        customRender: ({ index }) => {
            const obj = {
                children: '',
                props: {} as any,
            };
            if (index === 0) {
                obj.children = '8:00--9:50';
            }
            if (index === 1) {
                obj.children = '10:10--12:00';
            }
            if (index === 2) {
                obj.props.colSpan = 0;
            }
            if (index === 3) {
                obj.children = '14:00--15:50';
            }
            if (index === 4) {
                obj.children = '16:10--18:00';
            }
            if (index === 5) {
                obj.children = '19:00--20:50';
            }
            return obj;
        },
    },
    {
        title: '星期',
        className: 'weekstyle',
        children: [
            {
                title: '一',
                dataIndex: 'monday',
                key: 'monday',
                width: 100,
                className: 'mondaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },

            },
            {
                title: '二',
                dataIndex: 'tuesday',
                key: 'tuesday',
                width: 100,
                className: 'tuesdaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },

            },
            {
                title: '三',
                dataIndex: 'wednesday',
                key: 'wednesday',
                width: 100,
                className: 'wednesdaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },

            },
            {
                title: '四',
                dataIndex: 'thursday',
                key: 'thursday',
                width: 100,
                className: 'thursdaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },

            },
            {
                title: '五',
                dataIndex: 'friday',
                key: 'friday',
                width: 100,
                className: 'fridaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: '六',
                dataIndex: 'saturday',
                key: 'saturday',
                width: 100,
                className: 'saturdaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: '七',
                dataIndex: 'sunday',
                key: 'sunday',
                width: 100,
                className: 'sundaystyle',
                customRender: ({ index }) => {
                    const obj = {
                        props: {} as any,
                    };
                    if (index === 2) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },
            },
        ],
    },
];
const data = [...Array(7)].map((_, i) => ({
    key: i,
    monday: ' monday',
    tuesday: 'tuesday',
    wednesday: ' wednesday',
    thursday: 'thursday',
    friday: 'friday',
    saturday: 'saturday',
    sunday: 'sunday'
}));


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
import type { SelectProps } from 'ant-design-vue';


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
            filteredValue: !!searchedKeys.value.name && [...searchedKeys.value.name]
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
            filters: [{ text: '必修', className:required-course,value: CourseType.REQUIRED }, 
            { text: '限选', className:limited-course,value: CourseType.SELECTED }, 
            { text: '任选', className:optional-course,value: CourseType.ELECTIVE }, 
            { text: '必修(不计学分)',className:unknown-course, value: CourseType.REQUIRED_NO_CREDIT }],
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
            title: '上课时间',
            key: 'time',
            width: 150,
        },
        {
            title: '状态',
            key: 'state',
            fixed: 'right',
            width: 250,
        },
        {
            title: '操作',
            key: 'seleted',
            fixed: 'right',
            width: 250,
        },
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
    }, () => { })
}



const optionDaily = ref<SelectProps['options']>([
    { value: 'one', label: '8:00--9:50' },
    { value: 'two', label: '10:10--12:00' },
    { value: 'three', label: '14:00--15:50' },
    { value: 'four', label: '16:10--18:00' },
    { value: 'five', label: '19:00--20:50' },
]);

const optionWeekly = ref<SelectProps['options']>([
    { value: 'one', label: '星期一' },
    { value: 'two', label: '星期二' },
    { value: 'three', label: '星期三' },
    { value: 'four', label: '星期四' },
    { value: 'five', label: '星期五' },
    { value: 'six', label: '星期六' },
    { value: 'seven', label: '星期日' },
]);
const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};
const handleBlur = () => {
    console.log('blur');
};
const handleFocus = () => {
    console.log('focus');
};
const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const value = ref<string | undefined>(undefined);

const popupScroll = () => {
    console.log('popupScroll');
};

const sumWeeks = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
const allWeeks = [...Array(20)].map((_, i) => ({ value: (i + 1) }));


const saveOneCourseArrange = async (courseArrangeId:number) => {
  try {
    const res = await saveCourseArrange(courseArrangeId); // 调用保存函数保存数据

    if (res.code === 0) {
      message.success('保存成功');
    } else {
      message.error(res.msg);
    }
  } catch (error) {
    console.error(error);
    message.error('保存失败');
  }
};

const saveAllCourseArrange = async () => {
    try {
    const modifiedData = dataSource.filter(record => record.isModified);

    for (const record of modifiedData) {
      const res = await saveCourseArrange(courseArrangeId);

      if (res.code === 0) {
        record.isModified = false;
      } else {
        message.error(res.msg);
      }
    }

    message.success('保存成功');
  } catch (error) {
    console.error(error);
    message.error('保存失败');
  }
};

// 模拟保存数据的异步函数
const saveCourseArrange = async (courseArrangeId) => {
  // 保存单个课程安排的异步函数
  return {
    code: 0,
    msg: '保存成功',
  };
};

</script>


<style >
/* 页头 */
.demo-page-header :deep(tr:last-child td) {
    padding-bottom: 0;
}

/* 表壳边框 */
.rowClass>td {
    border: 1.5px solid #ABD1F5 !important;
}

.rowClass {
    background-color: bisque;
    text-align: center;
    font-size: 14px;

}

th.shiduanstyle{
	background-color: rgb(34,139,34)!important;
	font-weight: bolder;
}

.morning-row {
    background-color:rgb(124, 252, 0)!important;
}

.afternoonbreak-row{
    background-color:rgb(238,130,238)!important;
}

.afternoon-row{
    background-color:rgb(240,230,140)!important;
}

.night-row{
   background-color:rgb(144,238,144)!important;
}


th.kejiestyle{
	background-color: #e98c8c!important;
	font-weight: bolder;
}

th.weekstyle{
    background-color: cornflowerblue !important;
}


th.mondaystyle,th.tuesdaystyle,th.wednesdaystyle,th.thursdaystyle,th.fridaystyle,th.saturdaystyle,th.sundaystyle{
      background-color: rgb(176,224,230) !important;
       text-align: center;
}

.required-course{
    background-color: rgb(240,128,128) !important;
}
.limited-course{
    background-color: rgb(238,232,170) !important;
}
.optional-course{
    background-color: rgb(176,224,230) !important;
}
.unknown-course{
    background-color: rgb(211,211,211) !important;
} 


</style>