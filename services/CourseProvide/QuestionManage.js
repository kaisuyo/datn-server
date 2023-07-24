const { tryCatchExe } = require("../../core/middlewave")
const { Question } = require("../../models")

const QuestionManage = {
  create: async (testId, title, description, optionA, optionB, optionC, optionD, answer) => {
    return await tryCatchExe(async () => {
      const question = await Question.create({
        testId, title, description, optionA, optionB, optionC, optionD, answer
      })
      return {value: question}
    }, "create a question for test")
  },

  getAllQuestionOfTest: async (testId) => {
    return await tryCatchExe(async () => {
      const list = await Question.findAll({where: {testId}})
      return {value: list}
    }, "get all question of test")
  },

  update: async (questionId, title, description, optionA, optionB, optionC, optionD, answer) => {
    return await tryCatchExe(async () => {
      const updatedQ = await Question.update({title, description, optionA, optionB, optionC, optionD, answer},
        {where: {questionId}})
      return ({value: updatedQ})
    }, "update question")
  },

  delete: async (questionId) => {
    return await tryCatchExe(async () => {
      const isDeleted = await Question.destroy({where: {questionId}})
      return {value: isDeleted}
    }, "delete a question")
  }
}

module.exports = QuestionManage