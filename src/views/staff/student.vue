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
      >
        <template #headerCell="{ column }">
          <span>
            {{ column.name }}
          </span>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>

            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical" />
              <a>Delete</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link">
                More actions
              </a>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import svgStudentList from '@/assets/svg/学生管理.svg'
import { useRouter } from 'vue-router'
import { studentList } from '@/assets/config'

const router = useRouter()

const columns = [
  // dataIndex支持数组来访对象的嵌套属性
  // key属性是对应vue使用v-for时需要的key, 如果已经指定了唯一的dataIndex属性, 就可不必指定key了
  { name: '学号', dataIndex: 'username' },
  { name: '姓名', dataIndex: ['student', 'name'] },
  { name: '性别', dataIndex: ['studentBasic', 'gender'] },
  { name: '年级', dataIndex: ['student', 'grade'] },
  { name: '专业', dataIndex: ['student', 'major'] },
  { name: '邮箱', dataIndex: ['studentBasic', 'email'] },
  { name: '手机', dataIndex: ['studentBasic', 'phone'] }
];
</script>

<style scoped>

</style>
