import request, { DataResponse } from '@/utils/request'

// 获取教师列表
export const getTeacherList = async (): Promise<DataResponse> => {
  return await request.post('/teacher/selectTeacherVOList')
}

// 添加教师
export const addNewTeacher = async (form): Promise<DataResponse> => {
  return await request.post('/teacher/insertTeacher', { data: form })
}

// 删除教师
export const deleteTeacherById = async (teacherId: number): Promise<DataResponse> => {
  return await request.post('/teacher/deleteTeacher', { data: { teacherId } })
}

// 获取一个教师的信息
export const getTeacherById = async (teacherId: number): Promise<DataResponse> => {
  return await request.post('/teacher/selectTeacher', { data: { teacherId } })
}

// 获取教师具体信息
export const getTeacherInfoById = async (teacherId: number): Promise<DataResponse> => {
  return await request.post('/teacher/selectTeacherInfo', { data: { teacherId } })
}
