
var express = require('express');
var router = express.Router();
const { Question } = require('../models/index')
const { checkAdmin, checkSuperUser, checkAuth } = require('./middlewave')

router.post('/update', checkSuperUser, async (req, res) => {
  const { questionId, title, description, optionA, optionB, optionC, optionD, answer } = req.body
  try {
    const updatedQ = await Question.update({title, description, optionA, optionB, optionC, optionD, answer},
      {where: {questionId}})
    res.json({value: updatedQ})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post("/add", checkSuperUser, async (req, res) => {
  const { testId, title, description, optionA, optionB, optionC, optionD, answer } = req.body
  try {
    await Question.create({testId, title, description, optionA, optionB, optionC, optionD, answer})
    res.redirect('/questions/list/'+testId)
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get("/delete/:questionId", checkSuperUser, async (req, res) => {
  const questionId = req.params.questionId
  try {
    const q = await Question.findOne({where: {questionId}})
    await Question.destroy({where: {questionId}})
    res.redirect('/questions/list/'+q.testId)
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/list/:testId', checkAuth, async (req, res) => {
  try {
    const questions = await Question.findAll({where: {testId: req.params.testId}})
    res.json({value: questions.reverse()})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
