import request, { DataResponse } from '@/utils/request'
import type { Course } from '@/types/Course'

// 获取所有课程
export const getCourseList = (): Promise<DataResponse<Course[]>> => {
  return request.post('/course/getCourseListAll')
}

// 添加课程
export const addNewCourse = (form): Promise<DataResponse> => {
  return request.post('/course/insertCourse', { data: { course: form } })
}

// 删除课程
export const disCourse = (id): Promise<DataResponse> => {
  return request.post('/course/deleteCourse', { data: { courseId: id } })
}

// 更新课程信息
export const updateCourse = (courseId, form): Promise<DataResponse> => {
  return request.post('/course/updateCourse', { data: { courseId, course: form } })
}
