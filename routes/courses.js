var express = require('express');
var router = express.Router();
const { Course, RegisCourse, RegisCourse} = require('../models/index')

router.get('/all', async (req, res) => {
  const courses = await Course.findAll()
  res.json({value: courses})
})

router.get('/self:userId', async (req, res) => {
  const { userId } = req.params
  const registCourses = await RegisCourse.findAll(
    {where: {userId}},
    {include: Course}
  )

  res.json({value: registCourses})
})

router.post('/register', async (req, res) => {
  const { userId, courseId } = req.body
  try {
    await RegisCourse.create({userId, courseId})
    res.json({value: true})
  } catch (e) {
    res.json({value: false})
  }
})

module.exports = router;
