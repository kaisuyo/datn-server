var express = require('express');
const { checkApprover } = require('../core/middlewave');
const CourseApprove = require('../services/CourseApprove/CourseApprove');
const TestInfo = require('../services/CourseApprove/TestInfo');
const VideoInfo = require('../services/CourseApprove/VideoInfo');
var router = express.Router();

router.post("/wait", checkApprover, async (req, res) => {
  const result = await CourseApprove.getWaitingApprove()
  res.json(result)
})

router.post("/add", checkApprover, async (req, res) => {
  const { courseId } = req.body
  const result = await CourseApprove.takeForApprove(req.user.userId, courseId)
  res.json(result)
})

router.post("/self", checkApprover, async (req, res) => {
  const result = await CourseApprove.getApproved(req.user.userId)
  res.json(result)
})

router.post("/get", checkApprover, async (req, res) => {
  const { courseId } = req.body
  const result = await CourseApprove.getCourse(courseId)
  res.json(result)
})

router.post("/videos", checkApprover, async (req, res) => {
  const { videoId } = req.body
  const result = await VideoInfo.get(videoId)
  res.json(result)
})

router.post("/tests", checkApprover, async (req, res) => {
  const { testId } = req.body
  const result = await TestInfo.get(testId)
  res.json(result)
})

router.post("/", checkApprover, async (req, res) => {
  const { courseId, description, status } = req.body
  const result = await CourseApprove.updateApprovalStatus(req.user.userId, courseId, status, description)
  res.json(result)
})

router.post("/questions", checkApprover, async (req, res) => {
  const { testId } = req.body
  const result = await TestInfo.getQuestions(testId)
  res.json(result)
})

module.exports = router;
