const { tryCatchExe } = require("../../core/middlewave")
const { Test, Question } = require("../../models")

const TestInfo = {
  getAll: async (courseId) => {
    return await tryCatchExe(async () => {
      const tests = await Test.findAll({where: {courseId}})
      return {value: tests}
    }, "get all test for read only")
  },

  get: async (testId) => {
    return await tryCatchExe(async () => {
      const test = await Test.findOne({where: {testId}})
      return {value: test}
    }, "get test info and all question of it")
  },

  getQuestions: async (testId) => {
    return await tryCatchExe(async () => {
      const questions = await Question.findAll({where: {testId}})
      return {value: questions}
    }, "get questions of test")
  }
}

module.exports = TestInfo