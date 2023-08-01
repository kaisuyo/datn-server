var express = require('express');
const { checkAuth } = require('../core/middlewave');
const CalcFinalLearnResult = require('../services/Analysis/CalcFinalLearnResult');
const CourseRegis = require('../services/Learn/CourseRegis');
const LearnByTest = require('../services/Learn/LearnByTest');
const LearnByWatchVideo = require('../services/Learn/LearnByWatchVideo');
const SelfCourse = require('../services/Learn/SelfCourse');
var router = express.Router();

router.post("/courses/regis", checkAuth, async (req, res) => {
  const { courseId } = req.body
  const result = await CourseRegis.regis(req.user.userId, courseId)
  res.json(result)
})

router.post("/self", checkAuth, async (req, res) => {
  const result = await SelfCourse.getSelfCourses(req.user)
  res.json(result)
})

router.post("/get", checkAuth, async (req, res) => {
  const {courseId} = req.body
  const result = await SelfCourse.getCourse(req.user.userId, courseId)
  res.json(result)
})

router.post("/videos", checkAuth, async (req, res) => {
  const { videoId } = req.body
  const {userId} = req.user
  const result = await LearnByWatchVideo.get(userId, videoId)
  res.json(result)
})

router.post("/tests", checkAuth, async (req, res) => {
  const { testId } = req.body
  const { userId } = req.user
  const result = await LearnByTest.get(userId, testId)
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
  const { answers, testId, time } = req.body
  const result = await LearnByTest.submit(req.user.userId, testId, answers, time)
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

router.post("/rateVideo", checkAuth, async (req, res) => {
  const { videoId, rate } = req.body
  const { userId } = req.user
  const result = await LearnByWatchVideo.rate(userId, videoId, rate);
  res.json(result)
}) 

router.post("/rateTest", checkAuth, async (req, res) => {
  const { testId, rate } = req.body
  const { userId } = req.user
  const result = await LearnByTest.rate(userId, testId, rate);
  res.json(result)
}) 

module.exports = router;
