import request, { type DataResponse } from '@/utils/request'

// 根据token中的userId获取当学生的博客列表
export const getBlogList = async (): Promise<DataResponse> => {
  return await request.get('/blog/getBlogTagByUserId')
}

// 根据博客id获取博客详情
export const getBlogByBlogId = async (blogId: number): Promise<DataResponse> => {
  return await request.post('/blog/getBlogByBlogId', { data: { blogId } })
}

// 根据博客id给博客点赞
export const addBlogLike = async (blogId: number): Promise<DataResponse> => {
  return await request.post('/blog/praiseBlog', { data: { blogId } })
}

// 发布博客
export const publishBlog = async (title: string, text: string): Promise<DataResponse> => {
  return await request.post('/blog/createBlog', { data: { title, text } })
}

// 编辑保存博客
export const saveBlog = async (blogId: number, title: string, text: string): Promise<DataResponse> => {
  return await request.post('/blog/saveBlog', { data: { blogId, title, text } })
}

// 删除博客
export const deleteBlogByBlogId = async (blogId: number): Promise<DataResponse> => {
  return await request.post('/blog/deleteBlog', { data: { blogId } })
}

// 获取所有博客的概要列表
export const getAllBlogTags = async (): Promise<DataResponse> => {
  return await request.get('/blog/getAllBlogTag')
}
