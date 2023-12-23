<template>
  <div class="introduction">
    <a-row>
      <a-col :xs="15" :lg="12" class="left">
        <a-space direction="vertical" :size="20" style="width: 100%;">
          <div class="welcome">
            <img src="@/assets/svg/welcome.svg" alt="图片加载失败" width="140">
            <div class="text">
              <span>Hi, {{ store.currentUser.name }},</span>
              <h1>欢迎回来</h1>
            </div>
          </div>
          <div class="search">
            <a-input-search
              v-model:value="searchText"
              placeholder="输入内容进行搜索..."
              enter-button
              size="large"
              @search="onSearch"
            />
          </div>
          <div class="statistic">
            <a-row>
              <a-col :span="5">
                <a-card bordered class="wrapper">
                  <a-space direction="vertical" class="number" :size="14">
                    <div>
                      <div>学期绩点</div>
                      <span>{{ (store.currentUser as Student).gpa }}</span>
                    </div>
                    <div>
                      <div>班级排名</div>
                      <span>{{ (store.currentUser as Student).rankClass }}</span>
                    </div>
                    <div>
                      <div>学院排名</div>
                      <span>{{ (store.currentUser as Student).rankCollege }}</span>
                    </div>
                  </a-space>
                </a-card>
              </a-col>
              <a-col :span="19">
                <v-chart class="chart" :option="option" autoresize/>
              </a-col>
            </a-row>
          </div>
          <div class="blogs">
            <a-divider class="clearMargin" orientation="left"><h2>我的博客</h2></a-divider>
            <a-card bordered>
              <a-list :data-source="blogs" :pagination="{ pageSize: 7 } as PaginationProps">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a-typography-link @click="router.push({ path: ch('/主页/博客/博客编辑'), state: { blogId: item.blogId } })">{{ item.title }}</a-typography-link>
                      </template>
                    </a-list-item-meta>
                    <div>
                      <span style="user-select: none">
                        <component :is="LikeOutlined" style="cursor: pointer" @click="iLikeThisBlog(item.blogId)"/>&nbsp;{{ (item as Blog).praise }}
                      </span>
                    </div>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </div>
        </a-space>
      </a-col>
      <a-col :xs="0" :lg="3" style="padding: 35px 10px 0" class="activity-list">
        <a-space direction="vertical" size="middle">
          <a-card bordered hoverable size="small"
                  class="activity-item"
                  v-for="(type, id) in StudentActivityType"
                  @click="changeActivityList(type)"
                  :class="{ activated: currentActivityType === type.dataIndex }"
          >
            <template #cover>
              <img :src="pngList[id]" alt="图片加载失败">
            </template>
            <h4 style="text-align: center;">{{ type.label }}</h4>
          </a-card>
        </a-space>
      </a-col>
      <a-col :span="9" class="dashboard">
        <a-card bordered>
          <a-space :size="20">
            <a-avatar :src="store.userInfo.avatar || svgEmptyAvatar"
                      :size="{ xs: 64, sm: 64, md: 96, lg: 128, xl: 128, xxl: 128 }"
            />
            <a-descriptions :column="1" :content-style="{ width: '15vw' }" bordered>
              <a-descriptions-item label="姓名">{{ store.currentUser.name }}</a-descriptions-item>
              <a-descriptions-item label="学号">{{ store.currentUser.username }}</a-descriptions-item>
              <a-descriptions-item label="班级">{{ (store.currentUser as Student).studentClass }}</a-descriptions-item>
              <a-descriptions-item label="专业">
                {{
                  (store.currentUser as Student).major === 1 ? '软件工程' :
                    (store.currentUser as Student).major === 2 ? '数字媒体技术' :
                      (store.currentUser as Student).major === 3 ? '数据科学与大数据技术' : '暂无'
                }}
              </a-descriptions-item>
              <a-descriptions-item label="年级">
                {{
                  (store.currentUser as Student).grade === Grade.F1 ? '大一' :
                    (store.currentUser as Student).grade === Grade.F2 ? '大二' :
                      (store.currentUser as Student).grade === Grade.F3 ? '大三' :
                        (store.currentUser as Student).grade === Grade.F4 ? '大四' : '其他'
                }}
              </a-descriptions-item>
            </a-descriptions>
          </a-space>
          <a-divider class="reduceMargin">{{ currentActivityType.toUpperCase() }}</a-divider>
          <a-list size="small" :data-source="studentActivity[currentActivityType]"
                  :pagination="{ pageSize: 5 } as PaginationProps"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :description="item.content"
                  :title="item.title"
                />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user'
import svgEmptyAvatar from '@/assets/svg/空头像.svg'
import pngHonors from '@/assets/img/个人荣誉.png'
import pngCompetitions from '@/assets/img/竞赛经历.png'
import pngDisciplinary from '@/assets/img/处分.png'
import pngClubs from '@/assets/img/社团.png'
import pngVolunteer from '@/assets/img/志愿活动.png'
import pngInternships from '@/assets/img/实习经历.png'
import { getStudentActivityById } from '@/api/student'
import {
  type Blog,
  type Student,
  type StudentActivity,
  StudentActivityType,
  type StudentActivityTypeString
} from '@/types/Student'
import { ref } from 'vue'
import { message, type PaginationProps } from 'ant-design-vue'
import { Grade } from '@/types/Enums'

const store = useUserStore()
const router = useRouter()

const studentActivity = ref<StudentActivity>({} as StudentActivity)
// 学生活动类型的封面图片列表
const pngList: Record<number, string> = {
    1: pngHonors,
    2: pngCompetitions,
    3: pngDisciplinary,
    4: pngClubs,
    5: pngVolunteer,
    6: pngInternships
}

const activityTypeCount = ref<{value: number, name: string}[]>([
  { value: 0, name: '个人荣誉' },
  { value: 0, name: '竞赛经历' },
  { value: 0, name: '处分' },
  { value: 0, name: '社团' },
  { value: 0, name: '志愿活动' },
  { value: 0, name: '实习经历' }
])

// 学生博客
const blogs = ref<Blog[]>([])

// setup时获取学生活动信息
;(async () => {
  let res = await getStudentActivityById((store.currentUser as Student).studentId)
  if (res.code === 0) {
    studentActivity.value = res.data
  } else {
    message.error(res.msg)
  }

  // 计算每种活动类型的数量
  for (let i = 1; i <= 6; i++) {
    activityTypeCount.value[i - 1].value = studentActivity.value[StudentActivityType[i].dataIndex].length
  }

  // 获取博客列表
  res = await getBlogList()
  if (res.code === 0) {
    blogs.value = res.data
  } else {
    message.error(res.msg)
  }
})()

// ================vue-echarts相关的导入
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { addBlogLike, getBlogList } from '@/api/blog'
import { LikeOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { ch, throttle } from '@/utils/commons'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const option = ref<EChartsOption>({
  title: {
    text: '活动占比统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['个人荣誉', '竞赛经历', '处分', '社团', '志愿活动', '实习经历']
  },
  series: [
    {
      name: '活动占比统计',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: activityTypeCount.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
// ===============

// 切换活动类型
const currentActivityType = ref<StudentActivityTypeString>('honors')
const changeActivityList = (type: { label: string, dataIndex: StudentActivityTypeString }) => {
  currentActivityType.value = type.dataIndex
}

const searchText = ref('')
const onSearch = async (value: string) => {
  console.log(value)
  window.open(`https://www.bing.com/search?q=${ encodeURIComponent(value) }`)
}

// 点赞博客, 为防止用户频繁点击, 使用节流函数
const iLikeThisBlog = throttle(async (blogId: number) => {
  console.log('点赞: ', blogId)
  const res = await addBlogLike(blogId)
  if (res.code === 0) {
    message.success('点赞成功')
    const target = blogs.value.find(blog => blog.blogId === blogId)
    if (target) {
      target.praise++
    }
  } else {
    message.error(res.msg)
  }
}, 1000)
</script>

<style scoped>
.introduction {
  .left {
    .welcome {
      display: flex;
      align-items: center;
      justify-content: center;

      .text {
        margin-left: 50px;

        span {
          font-size: 30px;
        }

        h1 {
          font-size: 40px;
        }
      }
    }

    .statistic {
      .wrapper {
        background-color: #a50001;
        color: white;
        text-align: center;
        border-radius: 50% 0 0 50%;

        .number {
          padding-top: 15px;
          font-size: 24px;

          span {
            font-size: 20px;
          }
        }
      }
    }
  }

  .activity-list {
    .activity-item.activated {
      box-shadow: 0 3px 6px 3px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
