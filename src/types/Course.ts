import { CourseStatus, CourseType, Grade } from '@/types/Enums'

export interface Course {
  courseId: number
  num: string // 课程序号
  name: string
  credit: number
  grade: Grade
  courseType: CourseType
  courseStatus: CourseStatus
}

// 课程的初始状态
export const courseInitialState = (): Course => ({
  courseId: 0,
  num: '',
  name: '',
  credit: 0,
  grade: Grade.OTHERS,
  courseType: CourseType.REQUIRED,
  courseStatus: CourseStatus.INVALID
})
