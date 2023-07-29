var express = require('express');
const { checkAuth } = require('../core/middlewave');
const CalcFinalLearnResult = require('../services/Analysis/CalcFinalLearnResult');
const CourseRegis = require('../services/Learn/CourseRegis');
const LearnByTest = require('../services/Learn/LearnByTest');
const LearnByWatchVideo = require('../services/Learn/LearnByWatchVideo');
const SelfCourse = require('../services/Learn/SelfCourse');
var router = express.Router();

router.post("/courses/regis", checkAuth, async (req, res) => {
  const { userId, courseId } = req.body
  const result = await CourseRegis.regis(userId, courseId)
  res.json(result)
})

router.post("/self", checkAuth, async (req, res) => {
  const result = await SelfCourse.getSelfCourses(req.user)
  res.json(result)
})

router.post("/get", checkAuth, async (req, res) => {
  const {courseId} = req.body
  const result = await SelfCourse.getCourse(courseId)
  res.json(result)
})

router.post("/videos", checkAuth, async (req, res) => {
  const { videoId } = req.body
  const result = await LearnByWatchVideo.get(videoId)
  res.json(result)
})

router.post("/tests", checkAuth, async (req, res) => {
  const { testId } = req.body
  const result = await LearnByTest.get(testId)
  res.json(result)
})

router.post("/questions", checkAuth, async (req, res) => {
  const { testId } = req.body
  const result = await LearnByTest.getQuestions(testId)
  res.json(result)
})

router.post("/maxScore", checkAuth, async (req, res) => {
  const { testId } = req.body
  const result = await LearnByTest.getMaxScore(req.user.userId, testId)
  res.json(result)
})

router.post("/videos/watch", checkAuth, async (req, res) => {
  const { videoId, watchTime } = req.body
  const result = await LearnByWatchVideo.watch(req.user.userId, videoId, watchTime)
  res.json(result)
})

router.post("/tests/submit", checkAuth, async (req, res) => {
  const { answers, testId, time, rate } = req.body
  const result = await LearnByTest.submit(req.user.userId, testId, answers, time, rate)
  res.json(result)
})

router.post("/suggest", checkAuth, async (req, res) => {
  const result = await CalcFinalLearnResult.getSuggest(req.user.userId)
  if (result.value) {
    const { customSuggest, userSuggest, subjectSuggest } = result.value
    const courseIds = [...customSuggest, ...userSuggest, ...subjectSuggest].map(x => x.key)
    const courses = await SelfCourse.getByIds(courseIds)
    res.json(courses)
  } else {
    res.json({value: []})
  }
})

module.exports = router;
