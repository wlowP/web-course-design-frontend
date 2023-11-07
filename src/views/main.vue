<template>
  <!-- 主页面 -->
  <div class="main">
    <a-layout style="min-height: 100vh;">
      <a-layout-header class="header">
        沙袋大学学生信息管理系统
      </a-layout-header>
      <a-layout>
        <a-layout-sider collapsed-width="50"
                        v-model:collapsed="menuState.collapsed"
                        class="sider"
                        breakpoint="xl"
        >
          <div class="menu">
            <a-button type="primary" style="margin-bottom: 16px;" @click="toggleCollapsed">
              <MenuUnfoldOutlined v-if="menuState.collapsed"/>
              <MenuFoldOutlined v-else/>
            </a-button>
            <a-menu
              v-model:openKeys="menuState.openKeys"
              v-model:selectedKeys="menuState.selectedKeys"
              mode="inline"
              :inline-collapsed="menuState.collapsed"
              :items="menuItems"
              @select="onSelected"
            ></a-menu>
          </div>
        </a-layout-sider>
        <a-layout-content class="body">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        Footer
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue'
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
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

// 菜单状态
const menuState = reactive({
  collapsed: false,
  selectedKeys: ['description'],
  openKeys: ['userinfo'],
  preOpenKeys: ['userinfo'],
})

// todo: bug: 在某个子页面刷新后, 菜单默认选中的项会变成description, 但是路由页面展示的还是原来的子页面
// 菜单选项
// 每当TypeScript报类型错误时, 难搞的话就any得了
const menuItems = reactive<any>([
  {
    key: 'userinfo',
    icon: () => h(MailOutlined),
    label: '个人信息',
    children: [
      {
        key: 'description',
        label: '系统简介',
        title: '本项目的简介',
        to: ch('/主页/个人信息/系统简介'),
        icon: () => h(FileTextOutlined)
      }, {
        key: 'renew-password',
        label: '修改密码',
        to: ch('/主页/个人信息/修改密码')
      }
    ]
  }
])

// 选中菜单选项是的跳转方法
// TypeScript类型检查太严格了, 但又没法引用到MenuItem的类型定义, 所以这里全部any了, AnyScript (((
// 注意一下ts函数形参中出现解构时定义类型的格式
const onSelected = ({ item }: { item: any }) => {
    router.push(item.to)
  }

// 根据用户类型动态添加菜单项
;(() => {
  const userinfo = menuItems[0].children
  // 不检测menuItems[0].children是否存在的话TypeScript会报错
  if (userinfo) {
    switch (store.userInfo.userType) {
      case 'ROLE_ADMIN': {
        // 个人信息: + 项目文档, + 项目视频
        userinfo.push({
          key: 'project-doc',
          label: '项目文档',
          to: ch('/主页/个人信息/项目文档')
        }, {
          key: 'project-video',
          label: '项目视频',
          to: ch('/主页/个人信息/项目视频')
        })
        menuItems.push({
          key: 'system',
          icon: () => h(AppstoreOutlined),
          label: '系统管理',
          children: [
            {
              key: 'menu',
              label: '菜单管理',
              to: ch('/主页/系统管理/菜单管理')
            }, {
              key: 'dictionary',
              label: '字典管理',
              to: ch('/主页/系统管理/字典管理')
            }
          ]
        }, {
          key: 'staff',
          icon: () => h(PieChartOutlined),
          label: '人员管理',
          children: [
            {
              key: 'student-management',
              label: '学生管理',
              to: ch('/主页/人员管理/学生管理')
            }, {
              key: 'teacher-management',
              label: '教师管理',
              to: ch('/主页/人员管理/教师管理')
            }
          ]
        }, {
          key: 'education',
          icon: () => h(DesktopOutlined),
          label: '教务管理',
          children: [
            {
              key: 'course-management',
              label: '课程管理',
              to: ch('/主页/教务管理/课程管理')
            }, {
              key: 'score-management',
              label: '成绩管理',
              to: ch('/主页/教务管理/成绩管理')
            }
          ]
        })
        break
      }
      case 'ROLE_TEACHER': {
        userinfo.push({
          key: 'introduction',
          label: '个人简介',
          to: ch('/主页/个人信息/个人简介')
        })
        break
      }
      case 'ROLE_STUDENT': {
        userinfo.push({
          key: 'project-doc',
          label: '项目文档',
          to: ch('/主页/个人信息/项目文档')
        }, {
          key: 'project-video',
          label: '项目视频',
          to: ch('/主页/个人信息/项目视频')
        }, {
          key: 'introduction',
          label: '个人简介',
          to: ch('/主页/个人信息/个人简介')
        })
        break
      }
    }
  }
})()

// 切换菜单折叠状态
const toggleCollapsed = () => {
  menuState.collapsed = !menuState.collapsed
  // 在这里更新openKeys, 用于折叠时恢复
  menuState.openKeys = menuState.collapsed ? [] : menuState.preOpenKeys
}
// watch更新preOpenKeys, 用于折叠时恢复
watch(
  () => menuState.openKeys,
  (_, oldValue) => {
    menuState.preOpenKeys = oldValue
  },
)
</script>

<style scoped lang="scss">
.main {
  .header {
    text-align: center;
    color: white;
    height: 64px;
    background-color: #7dbcea;
  }

  .body {
    color: white;
    //height: calc(100vh - 64px - 25px);
    background-color: #108ee9;
  }

  .sider {
    text-align: left;
    color: white;
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
