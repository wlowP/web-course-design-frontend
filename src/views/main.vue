<template>
  <!-- 主页面 -->
  <div class="main">
    <a-layout style="height: 100vh;">
      <a-layout-header class="app-header">
        <a-row style="max-height: 60px">
          <a-col :span="5" style="background-color: pink;">
            教务管理系统
          </a-col>
          <a-col :span="7" :offset="12" style="background-color: deepskyblue;">
            选项
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider collapsed-width="50"
                        v-model:collapsed="menuState.collapsed"
                        class="sider"
                        breakpoint="xl"
        >
          <div class="menu">
            <a-button type="primary" style="margin-bottom: 16px;" @click="menuState.collapsed = !menuState.collapsed">
              <MenuUnfoldOutlined v-if="menuState.collapsed"/>
              <MenuFoldOutlined v-else/>
            </a-button>
            <a-menu
              style="border-radius: 10px; user-select: none;"
              v-model:openKeys="menuState.openKeys"
              v-model:selectedKeys="menuState.selectedKeys"
              mode="inline"
              :items="menuItems"
              @select="({ key }: any) => router.push(key)"
            ></a-menu>
          </div>
        </a-layout-sider>
        <a-layout-content class="content">
          <!-- todo: 用Transition组件加点页面切换的动画效果 -->
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        版权所有 ©2023 wlow 保留所有权利
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, ref, watch } from 'vue'
import {
  AppstoreOutlined,
  DesktopOutlined,
  FileTextOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { ch } from '@/utils/commons'
import { useRoute, useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()
const route = useRoute()

// 及时根据路由变化更新菜单选中项
watch(() => route.path, () => {
  menuState.value.selectedKeys = [route.path]
})

// 菜单状态
const menuState = ref<any>({
  collapsed: false,
  selectedKeys: [route.path],
  // 分割路由路径, 得到二级路由名称, 作为菜单的展开项
  openKeys: [decodeURI(route.path.substring(1).split('/')[1])]
})

// 菜单选项
// 每当TypeScript报类型错误时, 难搞的话就any得了
const menuItems = reactive<any>([
  {
    key: '个人信息',
    icon: () => h(MailOutlined),
    label: '个人信息',
    children: [
      {
        key: ch('/主页/个人信息/系统简介'),
        label: '系统简介',
        title: '本项目的简介',
        icon: () => h(FileTextOutlined)
      }, {
        key: ch('/主页/个人信息/修改密码'),
        label: '修改密码'
      }
    ]
  }
])

// 根据用户类型动态添加菜单项
;(() => {
  const userinfo = menuItems[0].children
  // 不检测menuItems[0].children是否存在的话TypeScript会报错
  if (userinfo) {
    switch (store.userInfo.userType) {
      case 'ADMIN': {
        // 个人信息: + 项目文档, + 项目视频
        userinfo.push({
          key: ch('/主页/个人信息/项目文档'),
          label: '项目文档'
        }, {
          key: ch('/主页/个人信息/项目视频'),
          label: '项目视频'
        })
        menuItems.push({
          key: '系统管理',
          icon: () => h(AppstoreOutlined),
          label: '系统管理',
          children: [
            {
              key: ch('/主页/系统管理/菜单管理'),
              label: '菜单管理'
            }, {
              key: ch('/主页/系统管理/字典管理'),
              label: '字典管理'
            }
          ]
        }, {
          key: '人员管理',
          icon: () => h(PieChartOutlined),
          label: '人员管理',
          children: [
            {
              key: ch('/主页/人员管理/学生管理'),
              label: '学生管理'
            }, {
              key: ch('/主页/人员管理/教师管理'),
              label: '教师管理'
            }
          ]
        }, {
          key: '教务管理',
          icon: () => h(DesktopOutlined),
          label: '教务管理',
          children: [
            {
              key: ch('/主页/教务管理/课程管理'),
              label: '课程管理'
            }, {
              key: ch('/主页/教务管理/成绩管理'),
              label: '成绩管理'
            }
          ]
        })
        break
      }
      case 'TEACHER': {
        userinfo.push({
          key: ch('/主页/个人信息/个人简介'),
          label: '个人简介'
        })
        break
      }
      case 'STUDENT': {
        userinfo.push({
          key: ch('/主页/个人信息/项目文档'),
          label: '项目文档'
        }, {
          key: ch('/主页/个人信息/项目视频'),
          label: '项目视频'
        }, {
          key: ch('/主页/个人信息/个人简介'),
          label: '个人简介'
        })
        break
      }
    }
  }
  // todo: 测试页面, 发布后删除
  menuItems.push({
    key: ch('/主页/测试页面'),
    label: '📌📌测试页面'
  })
})()

</script>

<style scoped lang="scss">
.main {
  .app-header {
    padding-left: 0;
    padding-right: 0;
    color: white;
    height: 60px;
    background-color: #7dbcea;
    .ant-col {
      height: 60px;
    }
  }

  .content {
    padding: 5px;
    //color: white;
    //background-color: #108ee9;
    max-height: calc(100vh - 60px - 25px);
    overflow: auto;
  }

  .sider {
    padding: 5px 5px 5px 0;
    max-height: calc(100vh - 60px - 25px);
    text-align: left;
    color: white;
    overflow: auto;
    background-color: #3ba0e9;

    .menu {
      .ant-btn {
        margin-top: 10px;
      }
    }
  }

  .footer {
    padding: 5px 50px;
    height: 25px;
    text-align: center;
    color: white;
    background-color: #7dbcea;
  }
}
</style>
