const { tryCatchExe } = require("../../core/middlewave")
const { Course, RegisCourse, Test, Video } = require("../../models")
const { COURSE_STATUS, REGIS_TYPE, WAIT_TYPE } = require("../../core/enum")
const Message = require("../../core/message")

const CourseApprove = {
  getWaitingApprove: async () => {
    return await tryCatchExe(async () => {
      const courses = await Course.findAll({where: {status: COURSE_STATUS.WAIT}})
      return {value: courses}
    }, "get all course waiting for approve")
  },

  getApproved: async (userId) => {
    return await tryCatchExe(async () => {
      const regis = await RegisCourse.findAll({where: {userId, regisType: REGIS_TYPE.APPROVE}, include: Course})
      return ({value: regis.map(x => x.course)})
    })
  },

  getCourse: async (courseId) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: {courseId}, include: [{model: Test}, {model: Video}]})
      return {value: course}
    })
  },

  takeForApprove: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const isTake = await RegisCourse.findOne({courseId, regisType: REGIS_TYPE.APPROVE})
      if (isTake) {
        return {message: Message.CANNOT_TAKE_FOR_APPROVE}
      }

      const regis = await RegisCourse.create({courseId, userId, regisType: REGIS_TYPE.APPROVE})
      return {value: regis}
    }, "take a course for approve")
  },

  updateApprovalStatus: async (userId, courseId, status, description) => {
    return await tryCatchExe(async () => {
      if (status == COURSE_STATUS.ALOW || status == COURSE_STATUS.WAIT) {
        const isUpdated = await Course.update({status}, {where: {courseId}})
        return ({value: isUpdated})
      } else {
        const regis = await RegisCourse.findOne({where: {courseId, regisType: REGIS_TYPE.HAS}})
        await RegisCourse.destroy({where: {userId, regisType: REGIS_TYPE.APPROVE, courseId}})
        await Course.update({status}, {where: {courseId}})
        await WaitData.create({
          userId,
          receiverId: regis.userId, 
          waitType: WAIT_TYPE.RETURN,
          message: description
        })
        return ({value: true})
      }
    }, "update approval status")
  }
}

module.exports = CourseApprove