const { REGIS_TYPE, WAIT_TYPE, ROLE, COURSE_STATUS } = require('../../core/enum')
const Message = require('../../core/message')
const { tryCatchExe } = require('../../core/middlewave')
const { Test, RegisCourse, WaitData, Course, Subject, Video } = require('../../models')

const SelfCourse = {
  getSelfCourses: async (user) => {
    return await tryCatchExe(async () => {
      const userId = user ? user.userId : -1
      const regisCourses = await RegisCourse.findAll({
        where: {userId, regisType: REGIS_TYPE.REGIS},
        include: Course
      })

      const waitCoursesData  = await WaitData.findAll({
        where: {
          userId,
          waitType: WAIT_TYPE.REGIS
        }
      })

      const waitCourses = await Course.findAll({where: {
        courseId: waitCoursesData.map(w => w.waitDataDest)
      }})

      return ({
        value: [
          ...(waitCourses.map(w => {
            return {...w.dataValues, status: COURSE_STATUS.WAIT}})
          ),
          ...(regisCourses.map(r => {
            let status = (r.course.status != COURSE_STATUS.ALOW && user?.role == ROLE.USER)? 
            COURSE_STATUS.BLOCK : r.course.status
            return {...r.course.dataValues, status}
          }))
        ]
      })
    }, "get all self course")
  },

  getCourse: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const regis = await RegisCourse.findOne({where: {userId, courseId, regisType: REGIS_TYPE.REGIS}})
      if (!regis) {
        return {message: Message.COURSE_NOT_FOR_YOU}
      }

      const course = await Course.findOne({
        where: {courseId}, 
        include: [{model: Test}, {model: Video}]
      })
      return {value: course}
    }, "get course for leaning")
  },

  getByIds: async (courseIds) => {
    return await tryCatchExe(async () => {
      const courses = await Course.findAll({where: {courseId: courseIds}, include: Subject})
      return {value: courses}
    }, "get course for leaning")
  }
}

module.exports = SelfCourse