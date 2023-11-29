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

export const getStudentById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/student/selectStudent', { data: { studentId } })
}

export const getStudentActivityById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/selectStudentAdvancedVOListByStudentId', { data: { studentId } })
}

export const updateStudent = async (form): Promise<DataResponse> => {
  return await request.post('/student/updateStudent', { data: form })
}

export const updateStudentActivity = async (form): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/updateStudentAdvanced', { data: form })
}

export const addNewStudentActivity = async (form): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/insertStudentAdvanced', { data: form })
}

export const deleteStudentActivity = async (studentAdvancedId: number): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/deleteStudentAdvanced', { data: { studentAdvancedId } })
}
