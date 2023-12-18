/**
 * 性别
 */
export enum Gender {
  MALE = 1,
  FEMALE = 2
}

/**
 * 用户类型
 * 0 -> 📌未登录; 1 -> 管理员; 2 -> 学生; 3 -> 教师
 */
export enum UserType {
  NULL,
  ADMIN ,
  STUDENT ,
  TEACHER
}

/**
 * 年级
 * 0 -> 其他; 1 -> 大一; 2 -> 大二; 3 -> 大三; 4 -> 大四
 */
export enum Grade {
  OTHERS,
  F1,
  F2,
  F3,
  F4
}

/**
 * 课程类型
 * 1 -> 必修课; 2 -> 限选课; 3 -> 任选课; 4 -> 必修但不计入绩点
 */
export enum CourseType {
  REQUIRED = 1,
  SELECTED = 2,
  ELECTIVE = 3,
  REQUIRED_NO_CREDIT = 4
}

/**
 * 课程状态
 * 1 -> 无效课程; 2 -> 有效但不可选课程; 3 -> 可选课程
 */
export enum CourseStatus {
  INVALID = 1,
  VALID_NOT_SELECTABLE = 2,
  SELECTABLE = 3
}

/**
 * 成绩状态
 * 1 -> 未进行批改; 2 -> 已批改但是学生不可见; 3 -> 已批改且学生可见
 */
export enum ScoreStatus {
  NOT_TESTED = 1,
  TESTED_NOT_VISIBLE = 2,
  TESTED_VISIBLE = 3
}
