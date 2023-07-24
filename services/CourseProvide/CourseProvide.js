const { COURSE_STATUS, REGIS_TYPE } = require("../../core/enum")
const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { Course, RegisCourse, Test, Video } = require("../../models")

const CourseProvide = {
  create: async (title, description, subjectId) => {
    return await tryCatchExe(async () => {
      const course = await Course.create({title, description, subjectId})
      await RegisCourse.create({userId, courseId: course.courseId, regisType: REGIS_TYPE.HAS})
      return {value: course}
    }, "create course")
  },

  deleteCourse: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const regisCourse = await RegisCourse.findOne({where: {courseId, userId, type: REGIS_TYPE.HAS}})
      if (regisCourse) {
        const isDeleted = await Course.destroy({where: {courseId}})
        return {value: isDeleted}
      } else {
        return {message: Message.CANNOT_DELETE_COURSE}
      }
    }, "delete a course")
  },

  updateCourse: async (userId, courseId, title, description) => {
    return await tryCatchExe(async () => {
      const regis = RegisCourse.findOne({where: {courseId, userId, type: REGIS_TYPE.HAS}})
      
      if (regis) {
        const course = await Course.findOne({where: {courseId, status: COURSE_STATUS.N0}})
        if (course) {
          const newCourse = await Course.update({title, description}, {where: {courseId}})
          return ({value: courseId, message: Message.UPDATE_COURSE_SUCCESS})
        }
      }
      
      return ({message: Message.CANNOT_UPDATE_COURSE_ERR})
    }, "update course info")
  },

  requestApprove: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const regis = RegisCourse.findOne({where: {courseId, userId, type: REGIS_TYPE.HAS}})
      
      if (regis) {
        const course = await Course.findOne({where: {courseId, status: COURSE_STATUS.N0}})
        if (course) {
          const newCourse = await Course.update({status: COURSE_STATUS.WAIT}, {where: {courseId}})
          return ({value: courseId, message: Message.UPDATE_COURSE_SUCCESS})
        }
      }
      
      return ({message: Message.CANNOT_UPDATE_COURSE_ERR})
    }, 'send request approve')
  },

  getAllProvideCourses: async (userId) => {
    return await tryCatchExe(async () => {
      const provideCourses = await RegisCourse.findAll({where: {userId, regisType: REGIS_TYPE.HAS}, include: Course})
      return {value: provideCourses.map(x => x.course)}
    }, "get all provided courses")
  },

  getCourse: async (courseId) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: {courseId}, include: [{model: Test}, {model: Video}]})
      return {value: course}
    }, "get course info")
  }
}

module.exports = CourseProvide