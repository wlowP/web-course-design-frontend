import type { User } from '@/types/User'
import { UserInitialState } from '@/types/User'

export interface Teacher extends User{
  teacherId: number
  position: string // 职务
  degree: string // 学位
  college: string // 所在学院
}

export interface TeacherInfo {
  research: string // 研究方向
  paper: string // 发表的论文
  resume: string // 个人简历
}

export const TeacherInitialState = (): Teacher => ({
  teacherId: 0,
  position: '',
  degree: '',
  college: '',
  ...UserInitialState(),
  userType: 3
})

export const TeacherInfoInitialState = (): TeacherInfo => ({
  research: '',
  paper: '',
  resume: ''
})
