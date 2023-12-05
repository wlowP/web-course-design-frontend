import type { Grade } from '@/types/Enums'
import { CourseStatus, CourseType } from '@/types/Enums'

export interface Course {
  courseId: number
  num: string // 课程序号
  name: string
  credit: number
  grade: Grade
  courseType: CourseType
  courseStatus: CourseStatus
}
