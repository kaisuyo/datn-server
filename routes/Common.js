var express = require('express');
const Courses = require('../services/Common/Courses');
const Subjects = require('../services/Common/Subjects');
var router = express.Router();

router.post("/courses", async (req, res) => {
  const userId = req.user? req.user.userId : -1
  const result = await Courses.getAll(userId)
  res.json(result)
})

router.post("/subjects", async (req, res) => {
  const result = await Subjects.getAll()
  res.json(result)
})

router.post("/courses/subInfo", async (req, res) => {
  const { courseId } = req.body
  const result = await Courses.getSubInfo(courseId)
  res.json(result)
})

module.exports = router;
