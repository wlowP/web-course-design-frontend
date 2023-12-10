<template>
    <div>
        <a-page-header title="课程表" sub-title="这是教师课程表" @back="() => $router.go(-1)">
            <template #extra>
                <a-space>
                    <a-cascader v-model:value="value" :options="options" size="large" placeholder="选择教授班级"
                        change-on-select />
                </a-space>
                <a-space>
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
        <a-table :columns="columns" :data-source="data" :scroll="{ x: 'calc(700px + 50%)', y: 'calc(700px + 50%)' }"
            :pagination="false" :rowClassName="() => { return 'rowClass' }" bordered>
            <template #title>获取(某教师教授的某班课程表)</template>

        </a-table>
    </div>
</template>
<script lang="ts" setup>
//共有的
import { computed, ref, watch } from 'vue';

//下载按钮
import { DownloadOutlined } from '@ant-design/icons-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
const size = ref<SizeType>('large');

//搜索框
import type { CascaderProps } from 'ant-design-vue';
const options: CascaderProps['options'] = [
    {
        value: 'dayi',
        label: '大一',
        children: [
            {
                value: 'dayione',
                label: '1',
            },
            {
                value: 'dayitwo',
                label: '2',
            },
            {
                value: 'dayithree',
                label: '3',
            },
            {
                value: 'dayifour',
                label: '4',
            },
            {
                value: 'dayifive',
                label: '5',
            },
        ],
    },
    {
        value: 'daer',
        label: '大二',
        children: [
            {
                value: 'daerone',
                label: '1',
            },
            {
                value: 'daertwo',
                label: '2',
            },
            {
                value: 'daerthree',
                label: '3',
            },
            {
                value: 'daerfour',
                label: '4',
            },
            {
                value: 'daerfive',
                label: '5',
            },
            {
                value: 'daersix',
                label: '6',
            },
        ],
    },
    {
        value: 'dasan',
        label: '大三',
        children: [
            {
                value: 'dasanone',
                label: '1',
            },
            {
                value: 'dasantwo',
                label: '2',
            },
            {
                value: 'dasanthree',
                label: '3',
            },
            {
                value: 'dasanfour',
                label: '4',
            },
        ],
    },
    {
        value: 'dasi',
        label: '大四',
        children: [
            {
                value: 'dasione',
                label: '1',
            },
            {
                value: 'dasitwo',
                label: '2',
            },
            {
                value: 'dasithree',
                label: '3',
            },
        ],
    },
];
const value = ref<string[]>([]);

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
        className: 'shiduanstyle',
        customCell: (columns, index) => {
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
            if (index === 0 || index === 1) {
                return {
                    class: "morning-row",
                };
            }

            if (index === 2) {
                return {
                    class: "afternoonbreak-row",
                };
            }
            if (index === 3 || index === 4) {
                return {
                    class: "afternoon-row",
                };
            }

            if (index === 5 || index === 6) {
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

th.shiduanstyle {
    background-color: rgb(34, 139, 34) !important;
    font-weight: bolder;
}

.morning-row {
    background-color: rgb(124, 252, 0) !important;
}

.afternoonbreak-row {
    background-color: rgb(238, 130, 238) !important;
}

.afternoon-row {
    background-color: rgb(240, 230, 140) !important;
}

.night-row {
    background-color: rgb(144, 238, 144) !important;
}


th.kejiestyle {
    background-color: #e98c8c !important;
    font-weight: bolder;
}

th.weekstyle {
    background-color: cornflowerblue !important;
}


th.mondaystyle,
th.tuesdaystyle,
th.wednesdaystyle,
th.thursdaystyle,
th.fridaystyle,
th.saturdaystyle,
th.sundaystyle {
    background-color: rgb(176, 224, 230) !important;
    text-align: center;
}
</style>