import type { DataResponse } from '@/utils/request'
import request from '@/utils/request'

/*
* 获取成绩列表. option: 1 -> 根据课程ID查询; 2 -> 根据学生ID查询
*  */
export const getScoreList = async (option: number, data): Promise<DataResponse> => {
  const url: string = option === 1 ? '/score/selectAllCourseVOListByCourseId' :
                      option === 2 ? '/score/getCourseVOListByStudentId' : ''
  return await request.post(url, data)
}

/*
* 修改成绩
*  */
export const updateScore = async (data): Promise<DataResponse> => {
  return await request.post('/score/updateScore', data)
}
