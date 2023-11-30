import request, { DataResponse } from '@/utils/request'

// 获取教师列表
export const getTeacherList = async (): Promise<DataResponse> => {
  return await request.post('/teacher/selectTeacherVOList')
}
