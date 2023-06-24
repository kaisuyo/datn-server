
var express = require('express');
var router = express.Router();
const { Course, Test, RegisCourse, Question, Tested } = require('../models/index')
const { checkAdmin, checkAuth, checkSuperUser } = require('./middlewave')

router.get("/all", checkAuth, async (req, res) => {
  const { courseId } = req.body
  try {
    const regis = RegisCourse.findOne({where: {userId: req.user.userId, courseId}})
    if (regis) {
      const tests = Test.findAll({where: {courseId}})
      res.json({value: tests})
    } else {
      res.json({message: "Bạn chưa đăng ký khóa học này"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Đã có lỗi trong quá trình xử lý"})
  }
})

router.get('/:testId', checkAuth, async (req, res) => {
  try {
    const test = await Test.findOne({where: {testId: req.params.testId}})
    if (test) {
      const regis = await RegisCourse.findOne({where: {userId: req.user.userId, courseId: test.courseId}})
      if (regis) {
        res.json({value: test})
      } else {
        res.json({message: "Bài kiểm tra không hợp lệ"})
      }
    } else {
      res.json({message: "Bài kiểm tra không tồn tại"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Đã có lỗi trong quá trình xử lý"})
  }
})

router.post('/submit', checkAuth, async (req, res) => {
  const {testId, answers, time, rate} = req.body
  try {
    const test = await Test.findOne({include: Question}, {where: {testId}})
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

      const tested = Tested.findOne({where: testId})
      if (tested) {
        await Tested.update({
          score: (tested.score*tested.fraq + score)/(tested.fraq+1),
          time: tested.time + time,
          fraq: tested.fraq+1
        }, {where: {testId}})
      } else {
        await Tested.create({userId: req.user.userId, score, time, rate, fraq: 1})
      }
    } else {
      res.json({message: "Bài kiểm tra bị lỗi"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/create', checkSuperUser, async (req, res) => {
  const { courseId, title, description, estimate } = req.body
  try {
    const newTest = await Test.create({courseId, description, title, estimate})
    res.json({value: newTest})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/update', checkSuperUser, async (req, res) => {
  const { testId, title, description } = req.body
  try {
    const test = Test.findOne({where: {testId}})
    if (test) {
      Test.update({title, description}, {where: {testId}})
      res.json({value: test})
    } else {
      res.json({message: "Bài kiểm tra bị lỗi"})
    }
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get("/delete/:testId", checkSuperUser, async (req, res) => {
  const testId = req.params.testId
  try {
    await Test.destroy({where: {testId}})
    res.json({value: testId})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
