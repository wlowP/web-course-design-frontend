<template>
  <!-- 主页面 -->
  <div class="layout">
    <a-space direction="vertical" style="width: 100%;" :size="[0, 48]">
      <a-layout>
        <a-layout-header class="header">
          沙袋大学学生信息管理系统
        </a-layout-header>
        <a-layout>
          <a-layout-sider v-model:collapsed="state.collapsed" class="sider">
            <div class="menu">
              <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
                <MenuUnfoldOutlined v-if="state.collapsed"/>
                <MenuFoldOutlined v-else/>
              </a-button>
              <a-menu
                v-model:openKeys="state.openKeys"
                v-model:selectedKeys="state.selectedKeys"
                :items="items"
              ></a-menu>
            </div>
          </a-layout-sider>
          <a-layout-content class="body">
            Body
          </a-layout-content>
        </a-layout>
        <a-layout-footer class="footer">
          Footer
        </a-layout-footer>
      </a-layout>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue'
import {
  AppstoreOutlined,
  DesktopOutlined,
  InboxOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue'

const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
})
const items = reactive([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'Option 1',
    title: 'Option 1',
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'Option 2',
    title: 'Option 2',
  },
  {
    key: '3',
    icon: () => h(InboxOutlined),
    label: 'Option 3',
    title: 'Option 3',
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    title: 'Navigation One',
    children: [
      {
        key: '5',
        label: 'Option 5',
        title: 'Option 5',
      },
      {
        key: '6',
        label: 'Option 6',
        title: 'Option 6',
      },
      {
        key: '7',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
        title: 'Option 8',
      },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Two',
    title: 'Navigation Two',
    children: [
      {
        key: '9',
        label: 'Option 9',
        title: 'Option 9',
      },
      {
        key: '10',
        label: 'Option 10',
        title: 'Option 10',
      },
      {
        key: 'sub3',
        label: 'Submenu',
        title: 'Submenu',
        children: [
          {
            key: '11',
            label: 'Option 11',
            title: 'Option 11',
          },
          {
            key: '12',
            label: 'Option 12',
            title: 'Option 12',
          }
        ]
      }
    ]
  }
])
watch(
  () => state.openKeys,
  (value, oldValue) => {
    state.preOpenKeys = oldValue
  },
)
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  state.openKeys = state.collapsed ? [] : state.preOpenKeys
}
</script>

<style scoped lang="scss">
.layout {
  .header {
    text-align: center;
    color: white;
    height: 64px;
    //padding-inline: 50px;
    line-height: 64px;
    background-color: #7dbcea;
  }

  .body {
    text-align: center;
    color: white;
    background-color: #108ee9;
  }

  .sider {
    text-align: center;
    color: white;
    background-color: #3ba0e9;

    .menu {
      .ant-btn {
        margin-top: 10px;
      }
    }
  }

  .footer {
    height: 32px;
    text-align: center;
    color: white;
    background-color: #7dbcea;
  }
}
</style>
