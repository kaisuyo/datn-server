const { tryCatchExe } = require("../../core/middlewave")
const { Test, Course } = require("../../models")

const TestManage = {
  createTest: async (courseId, subjectId, title, description, estimate) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: courseId})
      const test = await Test.create({title, description, subjectId, estimate, courseId, subjectId: course.subjectId})
      return {value: test}
    }, "create test")
  },

  get: async (testId) => {
    return await tryCatchExe(async () => {
      const test = await Test.findOne({where: {testId}})
      return {value: test}
    }, "get test info")
  },

  getAllTestOfCourse: async (courseId) => {
    return await tryCatchExe(async () => {
      const tests = Test.findAll({where: {courseId}})
      return ({value: tests})
    }, "get all test of a course")
  },

  updateTestInfo: async (testId, title, description, estimate) => {
    return await tryCatchExe(async () => {
      const isUpdated = await Test.update({title, description, estimate}, {where: {testId}})
      return {value: isUpdated}
    }, "update info of test")
  },

  deleteTest: async (testId) => {
    return await tryCatchExe(async () => {
      const isDeleted = await Test.destroy({where: {testId}})
      return {value: isDeleted}
    }, "delete a test")
  }
}

module.exports = TestManage