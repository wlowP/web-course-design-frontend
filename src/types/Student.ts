// 既然都用了TypeScript 不用一下类型就太可惜了
export interface Student {
  studentId: number
  name: string
  major: string
  grade: string // 所属年级
  gpa: number
  studentClass: number
  rankClass: number
  rankCollege: number
  username: string
  photo: string | null
  userType: 'ADMIN' | 'STUDENT' | 'TEACHER'
  gender: '男' | '女'
  birthday: string
  ethnicity: string
  birthplace: string
  address: string
  phone: string
  email: string
  honors: string
  competitions: string
  disciplinary: string
  clubs: string
  volunteer: string
  internship: string
}
