export interface UserInfo {
  userId: number
  name: string
  userType: 1 | 2 | 3 // 1 -> ADMIN, 2 -> STUDENT, 3 -> TEACHER
  avatar: string
  token: string
}

export interface User {
  username: string
  userType: 1 | 2 | 3 // 1 -> ADMIN | 2 -> STUDENT | 3 -> TEACHER
  gender: 1 | 2 // 1男 2女
  name: string
  photo: string | null // 头像
  phone: string
  email: string
}

export const UserInitialState = (): User => ({
  username: '',
  userType: 0,
  gender: 0,
  name: '',
  photo: '',
  phone: '',
  email: ''
})
