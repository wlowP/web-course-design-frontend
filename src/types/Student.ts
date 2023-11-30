// 既然都用了TypeScript 不用一下类型就太可惜了

// 学生的基本类型
export interface Student {
  studentId: number
  name: string // * (可请求接口修改)
  major: 1 | 2 | 3 // *
  grade: 1 | 2 | 3 | 4 | 5 // * // 所属年级
  gpa: number
  studentClass: number // *
  rankClass: number
  rankCollege: number
  username: string // *
  photo: string | null
  userType: 'ADMIN' | 'STUDENT' | 'TEACHER'
  gender: 1 | 2 // *
  birthday: string // *
  ethnicity: string // *
  birthplace: string // *
  address: string // *
  phone: string // *
  email: string // *
}

// 学生的活动类型, 比如参加过的竞赛, 社团, 志愿者, 实习等等
export interface StudentActivity {
  studentId: number
  name: string
  major: string
  grade: string
  username: string
  userType: 'STUDENT' | string
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
  grade: '',
  major: '',
  username: '',
  userType: 'STUDENT',
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
  email: '',
  ethnicity: '',
  gender: '未知',
  gpa: 0,
  grade: '',
  major: '',
  name: '',
  phone: '',
  photo: '',
  rankClass: 0,
  rankCollege: 0,
  studentClass: 0,
  studentId: 0,
  userType: 'STUDENT',
  username: ''
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
