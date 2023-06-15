
var express = require('express');
var router = express.Router();
const { Question } = require('../models/index')
const { checkAdmin } = require('./middlewave')

router.post('/update', checkAdmin, async (req, res) => {
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

router.post("/add", checkAdmin, async (req, res) => {
  const { testId, title, description, optionA, optionB, optionC, optionD, answer } = req.body
  try {
    const newQ = await Question.create({testId, title, description, optionA, optionB, optionC, optionD, answer})
    res.json({value: newQ})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get("/delete/:questionId", checkAdmin, async (req, res) => {
  const questionId = req.params.questionId
  try {
    await Question.destroy({where: {questionId}})
    res.json({value: questionId})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
