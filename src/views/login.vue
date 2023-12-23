<template>
  <a-layout :style="layoutStyle">
    <a-layout-header :style="headerStyle">教 学 管 理 系 统</a-layout-header>
    <a-layout-content :style="contentStyle">
      <a-layout-content :style="contentStyleLeft"></a-layout-content>
      <a-layout-content :style="loginContentStyle">
        <div class="my-form">
          <a-form
            :model="formState"
            name="normal_login"
            class="login-form"
          >
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
              <template #label>
                <label style="font-size:20px;">用户名</label>
              </template>
              <a-input v-model:value="formState.username" style="width: 330px" autocomplete="on" :prefix="h(UserOutlined)"/>
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
              <template #label>
                <label style="font-size:20px;">密&emsp;码</label>
              </template>
              <a-input-password v-model:value="formState.password" autocomplete="on" :prefix="h(LockOutlined)" />
            </a-form-item>

            <a-form-item>
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember" style="float: left">记住我</a-checkbox>
              </a-form-item>
              <!--<a class="login-form-forgot" href="" style="float: right">忘记密码</a>-->
            </a-form-item>

            <a-form-item>
              <a-button @click="login" type="primary" html-type="submit"
                        class="login-form-button" style="margin: 10px; width: 400px ;display: block">
                登 录
              </a-button>
              <!-- <a href="" style="float: right">现在注册!</a> -->
            </a-form-item>
          </a-form>
        </div>

      </a-layout-content>
      <a-layout-content :style="contentStyleLeft"></a-layout-content>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import { type CSSProperties, h, ref } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { ch } from '@/utils/commons'
import request, { type DataResponse } from '@/utils/request'
import { message } from 'ant-design-vue'
import useUserStore from '@/stores/user'

const layoutStyle: CSSProperties = {
  height: '100vh',
  minHeight: '500px',
  minWidth: '500px',
  background: 'linear-gradient(to bottom, #4bc1b1, rgb(0, 198, 233))'
}
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: 'white',
  lineHeight: '36px',
  fontSize: '20px',
  height: '5vh'
}
const contentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '80vh',
  minHeight: '500px',
  minWidth: '500px',
  flexDirection: 'row'
}
const contentStyleLeft: CSSProperties = {
  display: 'flex',
  width: '25vh'
}
const loginContentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '50vh',
  height: '50vh',
  minHeight: '500px',
  minWidth: '500px',
  boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
  borderRadius: '5vh',
  backgroundColor: 'white'
}

const router = useRouter()
const store = useUserStore()

const formState = ref({
  username: '',
  password: '',
  remember: false
})

if (store.loginForm.remember) {
  formState.value = store.loginForm
}

const login = async () => {
  const res: DataResponse = await request.post('/auth/login', {
    username: formState.value.username,
    password: formState.value.password
  })
  if (res.code === 0) {
    // 记住密码
    if (formState.value.remember) {
      store.loginForm = formState.value
    }
    message.success(`欢迎回来, ${res.data.name}!`)
    store.userInfo = res.data
    await router.push(ch('/主页'))
  } else {
    message.error(res.msg)
  }
}
</script>
