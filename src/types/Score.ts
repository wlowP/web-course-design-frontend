import type { Course } from '@/types/Course'
import type { UserType, ScoreStatus } from '@/types/Enums'

export interface Score extends Course {
  // 虽然name属性是从Course接口继承下来的, 但是在这里表示的是成绩所属的学生的
  studentId: number
  major: 1 | 2 | 3 // 1 -> 软件工程, 2 -> 数字媒体技术, 3 -> 数据科学与大数据技术
  gpa: number
  studentClass: number
  rankClassGPA: number // 绩点班级排名
  rankCollegeGPA: number // 绩点学院排名
  username: string // 学号
  photo: string
  userType: UserType
  courseName: string
  score: number
  rankClassCourse: number // 单科班级排名
  rankCollegeCourse: number // 单科学院排名
  scoreStatus: ScoreStatus
}

export const ScoreInitialState = (): Score => ({
  courseId: 0,
  courseName: '',
  courseStatus: undefined,
  courseType: undefined,
  credit: 0,
  gpa: 0,
  grade: undefined,
  major: undefined,
  name: '',
  num: '',
  photo: '',
  rankClassCourse: 0,
  rankClassGPA: 0,
  rankCollegeCourse: 0,
  rankCollegeGPA: 0,
  score: 0,
  scoreStatus: undefined,
  studentClass: 0,
  studentId: 0,
  userType: undefined,
  username: ''
})
