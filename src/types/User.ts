import { Gender, UserType } from '@/types/Enums'

export interface UserInfo {
  userId: number
  name: string
  userType: UserType
  avatar: string
  token: string
}

export interface User {
  username: string
  userType: UserType
  gender: Gender // 1男 2女
  name: string
  photo: string | null // 头像
  phone: string
  email: string
}

export const UserInitialState = (): User => ({
  username: '',
  userType: UserType.NULL,
  gender: Gender.MALE,
  name: '',
  photo: '',
  phone: '',
  email: ''
})
