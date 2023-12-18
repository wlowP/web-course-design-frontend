import request from '@/utils/request'

// 下载Excel
export const downloadExcel = async (type: 'student' | 'teacher' | 'course', idList: number[]): void => {
  // 根据type选择不同的url, 传入对应的idList
  const url = type === 'student' ? '/excel/getStudentVOListExcel' :
                                             type === 'teacher' ? '/excel/getTeacherVOListExcel' :
                                                                  '/excel/getCourseListExcel'

  const res = await request.post(url, {
    data: {
      [`${type}IdList`]: idList
    }
  }, { responseType: 'blob' })
  const blob = new Blob([res])
  const fileName: string = type === 'student' ? '学生信息表.xlsx' :
                           type === 'teacher' ? '教师信息表.xlsx' :
                                                '课程信息表.xlsx'
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const fileLink = document.createElement('a')
    fileLink.download = fileName
    fileLink.style.display = 'none'
    fileLink.href = URL.createObjectURL(blob)
    document.body.appendChild(fileLink)
    fileLink.click()
    URL.revokeObjectURL(fileLink.href) // 释放URL对象
    document.body.removeChild(fileLink)
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  }
}
