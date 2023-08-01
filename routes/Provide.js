var express = require('express');
const { ROLE } = require('../core/enum');
const { checkProvider } = require('../core/middlewave');
const CourseProvide = require('../services/CourseProvide/CourseProvide');
const QuestionManage = require('../services/CourseProvide/QuestionManage');
const RequireManage = require('../services/CourseProvide/RequireManage');
const TestManage = require('../services/CourseProvide/TestManage');
const VideoManage = require('../services/CourseProvide/VideoManage');
var router = express.Router();

router.post("/courses/self", checkProvider, async (req, res) => {
  const result = await CourseProvide.getAllProvideCourses(req.user.userId)
  res.json(result)
})

router.post("/courses/get", checkProvider, async (req, res) => {
  const {courseId} = req.body
  const result = await CourseProvide.getCourse(courseId)
  res.json(result)
})

router.post("/courses/create", checkProvider, async (req, res) => {
  const { title, description, subjectId } = req.body
  const result = await CourseProvide.create(title, description, subjectId, req.user.userId)
  res.json(result)
})

router.post("/courses/update", checkProvider, async (req, res) => {
  const { courseId, title, description } = req.body
  const result = await CourseProvide.updateCourse(req.user.userId, courseId, title, description)
  res.json(result)
})

router.post("/videos/get", checkProvider, async (req, res) => {
  const { videoId } = req.body
  const result = await VideoManage.getVideo(videoId)
  res.json(result)
})

router.post("/tests/get", checkProvider, async (req, res) => {
  const { testId } = req.body
  const result = await TestManage.get(testId)
  res.json(result)
})

router.post("/courses/delete", checkProvider, async (req, res) => {
  const { courseId } = req.body
  const result = await CourseProvide.deleteCourse(req.user.userId, courseId)
  res.json(result)
})

router.post("/videos/create", checkProvider, async (req, res) => {
  const { courseId, url, title, description, time } = req.body
  const result = await VideoManage.create(title, description, url, time, courseId)
  res.json(result)
})

router.post("/tests/create", checkProvider, async (req, res) => {
  const { courseId, title, description, estimate } = req.body
  const result = await TestManage.createTest(courseId, title, description, estimate)
  res.json(result)
})

router.post("/courses/send", checkProvider, async (req, res) => {
  const { courseId } = req.body
  const result = await CourseProvide.requestApprove(req.user.userId, courseId)
  res.json(result)
})

router.post("/videos/update", checkProvider, async (req, res) => {
  const { url, videoId } = req.body
  const result = await VideoManage.update(videoId, url)
  res.json(result)
})

router.post("/videos/delete", checkProvider, async (req, res) => {
  const { videoId } = req.body
  const result = await VideoManage.delete(videoId)
  res.json(result)
})

router.post("/questions/list", checkProvider, async (req, res) => {
  const { testId } = req.body
  const result = await QuestionManage.getAllQuestionOfTest(testId)
  res.json(result)
})

router.post("/tests/update", checkProvider, async (req, res) => {
  const { testId, title, description, estimate } = req.body
  const result = await TestManage.updateTestInfo(testId, title, description, estimate)
  res.json(result)
})

router.post("/questions/add", checkProvider, async (req, res) => {
  const { testId, title, description, optionA, optionB, optionC, optionD, answer } = req.body
  const result = await QuestionManage.create(testId, title, description, optionA, optionB, optionC, optionD, answer)
  res.json(result)
})

router.post("/tests/delete", checkProvider, async (req, res) => {
  const { testId } = req.body
  const result = await TestManage.deleteTest(testId)
  res.json(result)
})

router.post("/questions/update", checkProvider, async (req, res) => {
  const { questionId, title, description, optionA, optionB, optionC, optionD, answer } = req.body
  const result = await QuestionManage.update(questionId, title, description, optionA, optionB, optionC, optionD, answer)
  res.json(result)
})

router.post("/questions/delete", checkProvider, async (req, res) => {
  const { questionId } = req.body
  const result = await QuestionManage.delete(questionId)
  res.json(result)
})

router.post("/videos/updateTime", checkProvider, async (req, res) => {
  const { videoId, time } = req.body
  const result = await VideoManage.updateTime(videoId, time)
  res.json(result)
})

router.post("/requires", checkProvider, async (req, res) => {
  const result = await RequireManage.getAll(req.user.userId)
  res.json(result)
})

router.post("/requires/blockRegis", checkProvider, async (req, res) => {
  const { waitId } = req.body
  const result = await RequireManage.blockRegis(waitId)
  res.json(result)
})

router.post("/requires/alowRegis", checkProvider, async (req, res) => {
  const { waitId } = req.body
  const result = await RequireManage.alowRegis(waitId)
  res.json(result)
})

module.exports = router;
