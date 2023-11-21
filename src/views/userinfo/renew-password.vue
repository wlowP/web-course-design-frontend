<template>
  <div class="renew-password">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgRenewPwd, shape: 'square' }"
    >
      <template #title><span class="title">修改密码</span></template>
      <span class="tip">密码强度要求三种字符类型（大小写、数字、特殊字符）及以上且密码长度为8位及以上！</span>
    </a-page-header>
    <a-card bordered>
      <a-form
        :model="formState"
        name="renew-password"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 8 }"
        :rules="rules"
        @finish="onFinish"
      >
        <a-form-item
          label="旧密码"
          name="oldPassword"
          has-feedback
        >
          <a-input autocomplete="off" v-model:value="formState.oldPassword"/>
        </a-form-item>

        <a-form-item
          label="新密码"
          name="newPassword"
          has-feedback
        >
          <a-input-password autocomplete="off" v-model:value="formState.newPassword"/>
        </a-form-item>

        <a-form-item
          label="确认新密码"
          name="confirmPassword"
          has-feedback
        >
          <a-input-password autocomplete="off" v-model:value="formState.confirmPassword"/>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-space size="middle">
            <a-button type="primary" html-type="submit">确认修改</a-button>
            <a-button type="default" html-type="reset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import svgRenewPwd from '@/assets/svg/修改密码.svg'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()

const formState = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 各项表单的校验规则
// 只有在TypeScript类型的限制下才能获得较好的代码提示
const rules: Record<string, Rule[]> = {
  oldPassword: [
    { required: true, message: '请先输入旧密码!' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码!' }
  ],
  confirmPassword: [
    { required: true, message: '请确认你的新密码!' },
    {
      validator: (_rule: any, value: any) => value === formState.value.newPassword ? Promise.resolve() : Promise.reject('两次输入的密码不一致!'),
      trigger: 'blur'
    }
  ]
}

const onFinish = () => {
  console.log('通过参数校验:', formState.value)
  // 发起请求修改密码...
}

</script>

<style scoped>
.renew-password {

}
</style>
