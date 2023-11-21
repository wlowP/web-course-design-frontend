import request, { DataResponse } from '@/utils/request'
import type { Student } from '@/types/Student'

// 接口方法都指定一下返回值, 免得TypeScript老是报错

// 获取学生列表
export const getStudentList = async (): Promise<DataResponse<Student[]>> => {
  return await request.post('/student/selectStudentVOList')
}
