// 既然都用了TypeScript 不用一下类型就太可惜了

// 学生的基本类型
import type { User } from '@/types/User'
import { UserInitialState } from '@/types/User'
import { Grade, UserType } from '@/types/Enums'

export interface Student extends User {
  studentId: number
  major: 1 | 2 | 3 // 1 -> 软件工程, 2 -> 数字媒体技术, 3 -> 数据科学与大数据技术
  grade: Grade
  gpa: number
  studentClass: number
  rankClass: number
  rankCollege: number
  birthday: string
  ethnicity: string
  birthplace: string
  address: string
}

// 学生的活动类型, 比如参加过的竞赛, 社团, 志愿者, 实习等等
export interface StudentActivity {
  studentId: number
  name: string
  major: string
  grade: Grade
  username: string
  userType: UserType.STUDENT
  honors: StudentActivityItem[]
  competitions: StudentActivityItem[]
  disciplinary: StudentActivityItem[]
  clubs: StudentActivityItem[]
  volunteer: StudentActivityItem[]
  internship: StudentActivityItem[]
}

export interface StudentActivityItem {
  studentAdvancedId: number,
  studentId: number
  advancedType: 1 | 2 | 3 | 4 | 5 | 6
  title: string
  content: string
  duration: number
  updateTime: string
}

// 学生的活动类型的初始状态
export const studentActivityInitialState = (): StudentActivity => ({
  studentId: 0,
  name: '',
  grade: Grade.OTHERS,
  major: '',
  username: '',
  userType: UserType.STUDENT,
  clubs: [],
  competitions: [],
  disciplinary: [],
  honors: [],
  internship: [],
  volunteer: []
})

// 学生的初始状态
export const studentInitialState = (): Student => ({
  address: '',
  birthday: '',
  birthplace: '',
  ethnicity: '',
  gpa: 0,
  grade: Grade.OTHERS,
  rankClass: 0,
  rankCollege: 0,
  studentClass: 0,
  studentId: 0,
  major: '',
  ...UserInitialState(),
  userType: UserType.STUDENT
})

// 学生活动类型的映射关系
export const StudentActivityType: Record<number, { label: string, dataIndex: 'honors' | 'competitions' | 'disciplinary' | 'clubs' | 'volunteer' | 'internship' }> = {
  1: { label: '个人荣誉', dataIndex: 'honors' },
  2: { label: '竞赛经历', dataIndex: 'competitions' },
  3: { label: '处分', dataIndex: 'disciplinary' },
  4: { label: '社团', dataIndex: 'clubs' },
  5: { label: '志愿活动', dataIndex: 'volunteer' },
  6: { label: '实习经历', dataIndex: 'internship' }
}
