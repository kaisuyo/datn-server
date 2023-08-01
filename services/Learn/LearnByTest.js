const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { Question, Tested, Test } = require("../../models")

const LearnByTest = {
  getQuestions: async (testId) => {
    return await tryCatchExe(async () => {
      const questions = await Question.findAll({where: {testId}})
      return {value: questions.map(q => ({...q, answer: undefined}))}
    }, "get questions of test")
  },

  get: async (userId, testId) => {
    return await tryCatchExe(async () => {
      const test = await Test.findOne({where: {testId}})
      const tested = await Tested.findOne({where: {testId, userId}})
      return {value: {...test.dataValues, rate: tested?.rate}}
    }, "get data of test")
  },

  submit: async (userId, testId, answers, time) => {
    return await tryCatchExe(async () => {
      const test = await Test.findOne({where: {testId}, include: Question})
      if (test) {
        let trueCount = 0, count = 0
        test.questions.forEach(q => {
          let ans = answers.find(a => a.questionId == q.questionId)
          if (ans && ans.answer == q.answer) {
            trueCount++
          }
          count++
        })

        let score = trueCount/count*100

        const tested = await Tested.findOne({where: {testId}})
        let testedInfo = null;
        if (tested) {
          testedInfo = await Tested.update({
            score: (tested.score*tested.fraq + score)/(tested.fraq+1),
            time: (tested.time*tested.fraq + time)/(tested.fraq+1),
            fraq: tested.fraq+1,
          }, {where: {testId, userId}})
        } else {
          testedInfo = await Tested.create({testId, userId, score, time, fraq: 1})
        }

        return ({value: score})
      } else {
        return ({message: Message.TEST_ERR})
      }
    }, "submit test")
  },

  getMaxScore: async (userId, testId) => {
    return await tryCatchExe(async () => {
      const tested = await Tested.findOne({where: {testId, userId}})
      return ({value: tested?.score})
    }, "get score of test of user")
  },

  rate: async (userId, testId, rate) => {
    return await tryCatchExe(async () => {
      await Tested.update({rate}, {where: {userId, testId}})
      return {value: true}
    }, "ratting for test")
  }
}

module.exports = LearnByTest