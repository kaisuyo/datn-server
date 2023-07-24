var express = require('express');
var router = express.Router();
const CalcFinalLearnResult = require('../services/Analysis/CalcFinalLearnResult');
const { checkAdmin } = require('../core/middlewave');

router.get("/all", checkAdmin , async (req, res) => {
  const result = await CalcFinalLearnResult.getLearnResult()
  res.json(result)
})

router.get('/calculate', checkAdmin, async (req, res) => {
  const result = await CalcFinalLearnResult.calculate()
  res.json(result)
})

router.post('/update', checkAdmin, async (req, res) => {
  const { userId, subjectId, label } = req.body
  const result = await CalcFinalLearnResult.handworkLabeling(userId, subjectId, label)
  res.json(result)
})

router.post('/clustering', checkAdmin, async (req, res) => {
  const result = await CalcFinalLearnResult.clustering()
  res.json({value: result})
})

router.post('/assign', checkAdmin, async (req, res) => {
  const { userId, courseId } = req.body
  const result = await CalcFinalLearnResult.assign(userId, courseId)
  res.json(result)
})

router.post('/unAssign', checkAdmin, async (req, res) => {
  const { userId, courseId } = req.body
  const result = await CalcFinalLearnResult.unAssign(userId, courseId)
  res.json(result)
})

router.post('/get', checkAdmin, async (req, res) => {
  const {userId} = req.body
  const result = await CalcFinalLearnResult.getSuggest(userId)
  res.json(result)
})

module.exports = router;
