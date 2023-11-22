import request, { DataResponse } from '@/utils/request'

// 接口方法都指定一下返回值, 免得TypeScript老是报错

// 获取学生列表
// async 方法返回值都应当套一层 Promise
export const getStudentList = async (): Promise<DataResponse> => {
  return await request.post('/student/selectStudentVOList')
}

export const addNewStudent = async (form): Promise<DataResponse> => {
  return await request.post('/student/insertStudent', { data: form })
}

export const deleteStudentById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/student/deleteStudent', { data: { studentId } })
}
