const { WAIT_TYPE, COURSE_STATUS, REGIS_TYPE, ROLE } = require("../../core/enum")
const { tryCatchExe } = require("../../core/middlewave")
const { Course, RegisCourse, WaitData, User, Subject } = require("../../models")

const Courses = {
  getAll: async (userId) => {
    return await tryCatchExe(async () => {
      const publishCourses = await Course.findAll({where: {status: COURSE_STATUS.ALOW}, include: Subject})
      let regis = [], waits = []

      if (userId != -1) {
        regis = await RegisCourse.findAll({where: {userId, regisType: REGIS_TYPE.REGIS}})
        waits = await WaitData.findAll({where: {userId, waitType: WAIT_TYPE.REGIS}})
      }
      const regisListId = regis.map(r => r.courseId)
      const waitsList = waits.map(w => w.waitDataDest)
      return ({value: publishCourses.filter(c => ![...regisListId, ...waitsList].includes(c.courseId))})
    }, "get all course for learner without regis course")
  },

  getSubInfo: async (courseId) => {
    return await tryCatchExe(async () => {
      const regis = await RegisCourse.findOne({where: {courseId, regisType: REGIS_TYPE.HAS}, include: User})
      const course = await Course.findOne({where: {courseId}, include: Subject})
      return {value: {another: regis.user.username, subject: course.subject.title}}
    }, "get sub info of course provider")
  }
}

module.exports = Courses