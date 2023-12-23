<template>
  <!-- 主页面 -->
  <div class="main">
    <a-layout style="height: 100vh;">
      <a-layout-header class="app-header">
        <a-row style="max-height: 60px">
          <a-col class="logo" :span="5">
            <img src="@/assets/img/logo.png" alt="图片加载失败" style="height: 60px;">
          </a-col>
          <a-col :span="5" :offset="14" style="overflow: hidden;">
            <a-row class="status">
              <a-popover
                trigger="hover"
                :open="openTooltip"
                :mouse-enter-delay="0.2"
                @openChange="(visible: boolean) => openTooltip = visible"
              >
                <template #title>
                  <div style="text-align: center">
                    {{ store.currentUser.username }} {{ store.currentUser.name }}
                  </div>
                </template>
                <template #content>
                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center">
                    <a-space direction="vertical">
                      <template #split>
                        <a-divider class="clearMargin"/>
                      </template>
                      <a-typography-link @click="router.push(ch('/主页/个人信息/系统简介'))">系统简介</a-typography-link>
                      <a-typography-link @click="router.push(ch('/主页/个人信息/修改密码'))">修改密码</a-typography-link>
                      <a-typography-link @click="router.push(ch('/主页/个人信息/项目文档'))">项目文档</a-typography-link>
                      <a-typography-link v-if="store.userInfo.userType !== UserType.ADMIN" @click="router.push(ch('/主页/个人信息/个人简介'))">个人简介</a-typography-link>
                      <a-button danger @click="logout" :icon="h(LogoutOutlined)">退出登录</a-button>
                    </a-space>
                  </div>
                </template>
                <a-avatar class="avatar" :src="store.userInfo.avatar" :size="{ xs: 16, sm: 24, md: 32, lg: 48, xl: 48, xxl: 48 }"/>
              </a-popover>
              <div style="height: 60px; line-height: 30px">
                <div>您好, {{ store.userInfo.name }}~</div>
                <div>欢迎使用教务管理系统 <span>{{ time }}</span></div>
              </div>
            </a-row>
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
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <keep-alive>
                <component :is="Component"/>
              </keep-alive>
            </transition>
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
import { h, onActivated, onMounted, reactive, ref, watch } from 'vue'
import {
  DesktopOutlined,
  FileTextOutlined, HighlightTwoTone,
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined
} from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { ch, deepClone, formatTime } from '@/utils/commons'
import { useRoute, useRouter } from 'vue-router'
import { UserType } from '@/types/Enums'
import { getCurrentUser } from '@/api/general'
import { message } from 'ant-design-vue'
import { studentInitialState } from '@/types/Student'
import { TeacherInitialState } from '@/types/Teacher'

const store = useUserStore()
const router = useRouter()
const route = useRoute()

// 及时根据路由变化更新菜单选中项
watch(() => route.path, () => {
  menuState.value.selectedKeys = [route.path]
})

// 当前系统时间
const time = ref<string>(formatTime(new Date()))

onMounted(async () => {
  setInterval(() => {
    time.value = formatTime(new Date())
  }, 1000)
})

// 菜单状态
const menuState = ref<any>({
  collapsed: false,
  selectedKeys: [route.path],
  // 分割路由路径, 得到二级路由名称, 作为菜单的展开项
  openKeys: [decodeURI(route.path.substring(1).split('/')[1])]
})

const initialItem = {
  key: '个人信息',
  icon: () => h(MailOutlined),
  label: '个人信息',
  children: [
    {
      key: ch('/主页/个人信息/系统简介'),
      label: '系统简介',
      icon: () => h(FileTextOutlined)
    }, {
      key: ch('/主页/个人信息/修改密码'),
      label: '修改密码'
    }
  ]
}

// 菜单选项
// 每当TypeScript报类型错误时, 难搞的话就any得了
const menuItems = reactive<any>([
  deepClone(initialItem)
])

// 根据用户类型动态添加菜单项
onActivated(async () => {
  // 获取当前用户信息(学生/教师)
  if (store.userInfo.userType !== UserType.ADMIN) {
    const res = await getCurrentUser(store.userInfo.userType, store.userInfo.userId)
    if (res.code === 0) {
      store.currentUser = res.data
    } else {
      message.error(res.msg)
      // 出错的话就拿初始状态来顶着
      if (store.userInfo.userType === UserType.STUDENT) store.currentUser = studentInitialState()
      else if (store.userInfo.userType === UserType.TEACHER) store.currentUser = TeacherInitialState()
    }
  }

  menuItems.splice(0)
  menuItems.push(deepClone(initialItem))
  const userinfo = menuItems[0].children
  // 不检测menuItems[0].children是否存在的话TypeScript会报错
  if (userinfo) {
    switch (store.userInfo.userType) {
      case UserType.ADMIN: {
        // 个人信息: + 项目文档
        userinfo.push({
          key: ch('/主页/个人信息/项目文档'),
          label: '项目文档'
        })
        menuItems.push({
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
      case UserType.STUDENT: {
        userinfo.push({
          key: ch('/主页/个人信息/项目文档'),
          label: '项目文档'
        }, {
          key: ch('/主页/个人信息/个人简介'),
          label: '个人简介'
        })
        menuItems.push({
          key: ch('/主页/博客/学生博客'),
          label: '学生博客',
          icon: () => h(HighlightTwoTone)
        })
        break
      }
      case UserType.TEACHER: {
        userinfo.push({
          key: ch('/主页/个人信息/教师简介'),
          label: '个人简介'
        }, {
          key: ch('/主页/个人信息/项目文档'),
          label: '项目文档'
        })
        menuItems.push({
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
    }
  }
})

// 用于控制悬浮头像时Tooltip的显示
const openTooltip = ref<boolean>(false)

// 退出登录
const logout = () => {
  store.userInfo = {
    avatar: '',
    name: '',
    token: '',
    userId: 0,
    userType: UserType.NULL
  }
  store.currentUser = {} as any
  router.push('/')
}
</script>

<style scoped lang="scss">
.main {
  .app-header {
    padding-left: 0;
    padding-right: 0;
    height: 60px;
    background-color: #B2EBF2;

    .logo {
      padding-left: 70px;
      background-color: #a50001;
      border-radius: 0 30px 30px 0;
      img {
        height: 60px;
      }
    }

    .status {
      height: 60px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      .avatar {
        margin-right: 20px;
      }
    }

    .ant-col {
      height: 60px;
    }
  }

  .content {
    padding: 5px;
    max-height: calc(100vh - 60px - 25px);
    overflow: hidden auto;
    // 过渡组件的类名, 默认是v-enter-from...
    .page-enter-active {
      transition: all 0.2s;
    }

    .page-leave-active {
      transition: all 0.1s;
    }

    .page-enter-from {
      transform: translateY(-20px);
      opacity: 0;
    }

    .page-leave-to {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .sider {
    padding: 5px 5px 5px 0;
    max-height: calc(100vh - 60px - 25px);
    text-align: left;
    color: white;
    overflow: auto;
    background-image: linear-gradient(#C2E7DA, #0097A7);

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
    background-color: rgba(182, 182, 182, 0.98);
  }
}
</style>
