const { REGIS_TYPE, WAIT_TYPE, COURSE_STATUS } = require("../../core/enum")
const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { Course, RegisCourse, WaitData } = require("../../models")

const CourseRegis = {
  regis: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: {courseId}})
      if (course) {
        const regisHas = await RegisCourse.findOne({
          where: {courseId, regisType: REGIS_TYPE.HAS}
        })
        await WaitData.create({
          userId: userId, 
          receiverId: regisHas.userId, 
          waitType: WAIT_TYPE.REGIS, 
          waitDataDest: courseId,
          message: `Đăng ký khóa học: ${course.title}`
        })
        return ({value: true, message: Message.SEND_REQUEST_REGIS_COURSE})
      } else {
        return ({message: Message.COURSE_NOT_EXIST})
      }
    }, "user regis a course")
  },

  get: async (courseId) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: {courseId}})
      return {value: course}
    }, "get course info")
  }
}

module.exports = CourseRegis