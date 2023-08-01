const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { Question, Tested, Test } = require("../../models")

const LearnByTest = {
  getQuestions: async (testId) => {
    return await tryCatchExe(async () => {
      const questions = await Question.findAll({where: {testId}})
      return {value: questions}
    }, "get questions of test")
  },

  get: async (testId) => {
    return await tryCatchExe(async () => {
      const test = await Test.findOne({where: {testId}})
      return {value: test}
    }, "get data of test")
  },

  submit: async (userId, testId, answers, time, rate) => {
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
            time: tested.time + time,
            fraq: tested.fraq+1,
          }, {where: {testId, userId}})
        } else {
          testedInfo = await Tested.create({testId, userId: req.user.userId, score, time, rate, fraq: 1})
        }

        return ({value: testedInfo})
      } else {
        return ({message: Message.TEST_ERR})
      }
    }, "submit test")
  },

  getMaxScore: async (userId, testId) => {
    return await tryCatchExe(async () => {
      const tested = await Tested.findOne({where: {testId, userId}})
      return ({value: tested})
    }, "get max score of test of user")
  }
}

module.exports = LearnByTest