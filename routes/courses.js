var express = require('express');
var router = express.Router();
const { Course, RegisCourse, WaitData, Notic} = require('../models/index')
const { checkAdmin, checkAuth } = require('./middlewave')

router.get('/all', async (req, res) => {
  try {
    const courses = await Course.findAll()
    res.json({value: courses})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình lấy dữ liệu"})
  }
})

router.post('/self', checkAuth, async (req, res) => {
  try {
    const regisCourses = await RegisCourse.findAll(
      {where: {userId: req.user.userId}},
      {include: Course}
    )
  
    res.json({value: regisCourses})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.post('/register', checkAuth, async (req, res) => {
  const { courseId } = req.body
  try {
    await WaitData.create({userId: req.user.userId, waitType: 1, waitDataDest: courseId})
    res.json({value: true, message: "Đã gửi yêu cầu đăng ký khóa học"})
  } catch (e) {
    console.error(e)
    res.json({})
  }
})

router.post("/acceptRegis", checkAdmin, async (req, res) => {
  const { userId, courseId } = req.body
  const acceptRegis = await WaitData.findOne({where: {userId, waitType: 1, waitDataDest: courseId}})
  if (acceptRegis) {
    await RegisCourse.create({userId, courseId: acceptRegis.waitDataDest})
    await WaitData.destroy({where: {userId, waitType: 1, waitDataDest: courseId}})
    await Notic.create({userId, message: "Bạn đã đăng ký khóa học thành công", status: 0})
    res.json({value: true})
  } else {
    res.json({value: false})
  }
})

module.exports = router;
