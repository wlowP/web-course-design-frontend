<template>
  <div class="sys-description">
    <a-page-header class="header"
                   :avatar="{ src: svgDesc, shape: 'square' }"
    >
      <template #title><span class="title">系统简介</span></template>
      <span class="tip">管理系统的基本情况, 以及通知</span>
    </a-page-header>
    <a-row :gutter="12">
      <a-col span="16">
        <a-card class="introduction" bordered>
          <template #title>
            <span class="title">系统介绍</span>
          </template>
          <p>啊?</p>
        </a-card>
      </a-col>
      <a-col span="8">
        <a-card class="sys-notify" bordered>
          <template #title>
            <span class="title">系统通知</span>
          </template>
          <a-typography>
            <a-typography-paragraph>
              1. 请各位同学登录项目提交系统：
              <a-typography-text code copyable>http://*****/:9090</a-typography-text>
              ，用户名为学号，初始密码为
              <a-typography-text code>123456</a-typography-text>
              ，同学可以通过修改密码功能修改自己的密码。
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph>
              2. 请各位同学在“团队信息”界面维护个人的权重，查看团队成绩和个人最后成绩，请注意团队总权重之和不要超过团队人员数。
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph>
              3. 每组推选一个同学在“团队信息”界面上传项目资料，上传成功后，请下载查看，确保上传正确无误。系统记录上传者和上传时间，可以多次上传，新上传的文件覆盖原来上传的文件，请同学在规定时间内上传，截止时间后上传的文件无效。
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph>
              4. 上传文件需将所有文件压缩为一个.zip文件，包括（1）前端工程（2）后端工程（3）数据库文件(java.db),（4）包括photo等其他文件目录
              （5）项目文档(project.doc)，请务必将所有内容放在
              <a-typography-text code>/teach/java2</a-typography-text>
              目录里进行文件压缩，见下图，以方便前后端工程在IDEA环境直接成功运行。
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph>
              <ul>
                <li>
                  <a-typography-link href="https://apifox.com/apidoc/shared-1b992f4b-edb0-4961-93c9-0acd6a0aa236/api-123357560">
                    点击查看接口文档
                  </a-typography-link>
                </li>
              </ul>
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph>
              5.（这部分工作可以选做）为了方便老师检查作业，请自行测试完善“项目文档”，“项目视频”功能，检查老师测试时可以直接点击相应功能查看技术文档和特色视频，为了减少视频大小，视频只演示特色功能，时间不要超过2分钟。
            </a-typography-paragraph>
            <a-divider/>
            <a-typography-paragraph mark strong style="font-size: 22px;">
              系统截止时间为*******以前，请大家尽量不要在最后截止时间提交，以免出现网络拥堵，鼓励大家提前提交，提前提交者有一定的分数奖励。
            </a-typography-paragraph>
          </a-typography>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import svgDesc from '@/assets/svg/介绍.svg'

</script>

<style scoped>
.sys-description {

  .sys-notify {
    background-color: #fff;

    .ant-typography {
      font-size: 18px;
    }

    .ant-divider {
      background-color: rgba(0, 0, 0, 0.20);
    }
  }
  .introduction, .sys-notify {
    .title {
      font-size: 24px;
    }
  }
}
</style>
