export interface UserInfo {
  userId: number
  name: string
  userType: 1 | 2 | 3 // 1 -> ADMIN, 2 -> STUDENT, 3 -> TEACHER
  avatar: string
  token: string
}
