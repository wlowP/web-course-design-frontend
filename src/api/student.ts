import request, { DataResponse } from '@/utils/request'

// 接口方法都指定一下返回值, 免得TypeScript老是报错

// 📌async 方法返回值都应当套一层 Promise, 否则调用处分不清类型
// 获取学生列表
export const getStudentList = async (): Promise<DataResponse> => {
  return await request.post('/student/selectStudentVOList')
}

// 添加学生
export const addNewStudent = async (form): Promise<DataResponse> => {
  return await request.post('/student/insertStudent', { data: form })
}

// 删除学生
export const deleteStudentById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/student/deleteStudent', { data: { studentId } })
}

// 获取学生信息
export const getStudentById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/student/selectStudent', { data: { studentId } })
}

// 获取学生活动列表
export const getStudentActivityById = async (studentId: number): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/selectStudentAdvancedVOListByStudentId', { data: { studentId } })
}

// 修改学生信息
export const updateStudent = async (form): Promise<DataResponse> => {
  return await request.post('/student/updateStudent', { data: form })
}

// 修改学生活动信息
export const updateStudentActivity = async (form): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/updateStudentAdvanced', { data: form })
}

// 添加学生活动信息
export const addNewStudentActivity = async (form): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/insertStudentAdvanced', { data: form })
}

// 删除学生活动信息
export const deleteStudentActivity = async (studentAdvancedId: number): Promise<DataResponse> => {
  return await request.post('/studentAdvanced/deleteStudentAdvanced', { data: { studentAdvancedId } })
}
