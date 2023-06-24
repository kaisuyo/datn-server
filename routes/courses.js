var express = require('express');
const { Sequelize } = require('sequelize');
var router = express.Router();
const { Course, RegisCourse, WaitData, Notic, Video, Test, User} = require('../models/index');
const { WAIT_TYPE, REGIS_TYPE, COURSE_STATUS } = require('../services/enum');
const { checkAdmin, checkAuth, checkSuperUser } = require('./middlewave')
const Op = Sequelize.Op

router.get('/wait', checkAdmin, async (req, res) => {
  try {
    const regis = await RegisCourse.findAll({where: {regisType: REGIS_TYPE.APPROVE}})
    const courses = await Course.findAll({where: {status: COURSE_STATUS.WAIT, courseId: {
      [Op.notIn]:regis.map(r => r.courseId)
    }}})
    res.json({value: courses})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình lấy dữ liệu"})
  }
})

router.get('/public', async (req, res) => {
  try {
    const publicCourses = await Course.findAll({where: {status: COURSE_STATUS.ALOW}})
    res.json({value: publicCourses})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình lấy dữ liệu"})
  }
})

router.get('/another/:courseId', async (req, res) => {
  try {
    const another = await RegisCourse.findOne(
      {include: User},
      {where: {courseId: req.params.courseId, regisType: REGIS_TYPE.HAS}},
    )
    res.json({value: another})
  } catch(e) {
    console.error(e)
    res.json({})
  }
})

router.post('/self', checkAuth, async (req, res) => {
  const { regisType } = req.body
  try {
    const regisCourses = await RegisCourse.findAll({
      where: {userId: req.user.userId, regisType},
      include: Course
    })
  
    res.json({value: regisCourses.map(r => r.course)})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.get('/wait/add/:courseId', checkAdmin, async (req, res) => {
  try {
    const regis = await RegisCourse.findOne({where: {courseId: req.params.courseId, regisType: REGIS_TYPE.APPROVE}})
    if (regis) {
      res.json({value: false, message: "Khóa học đã được người khác nhận xử lý"})
    } else {
      await RegisCourse.create({userId: req.user.userId, courseId: req.params.courseId, regisType: REGIS_TYPE.APPROVE})
      res.json({value: true, message: "Đã thêm khóa học vào danh sách xử lý"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/wait/get/:courseId', checkAdmin, async (req, res) => {
  try {
    const course = await Course.findOne(
      {where: {courseId: req.params.courseId}}, 
      {include: [Video, Test]}
    )
    res.json({value: course})

  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.get("/get/:courseId", checkAuth, async (req, res) => {
  try {
    const regisCourse = await RegisCourse.findOne({where: {userId: req.user.userId, courseId: req.params.courseId}})

    const course = await Course.findOne({
      where: {courseId: regisCourse.courseId}, 
      include: [Video, Test]
    })
    
    if (regisCourse && course) {
      res.json({value: course})
    } else {
      res.json({message: "Bạn không thể lấy được thông tin khóa học này"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.post('/approve', checkAdmin, async (req, res) => {
  const { description, status, courseId } = req.body
  try {
    if (status == COURSE_STATUS.ALOW) {
      await Course.update({status}, {where: {courseId}})
      res.json({value: true})
    } else {
      const regis = RegisCourse.findOne({where: {courseId, regisType: REGIS_TYPE.HAS}})
      await RegisCourse.destroy({where: {userId: req.user.userId, regisType: REGIS_TYPE.APPROVE, courseId}})
      await Course.update({status}, {where: {courseId}})
      await Notic.create({userId: regis.userId, message: description})
      res.json({value: true})
    }
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

router.post("/acceptRegis", checkSuperUser, async (req, res) => {
  const { userId, courseId } = req.body
  const acceptRegis = await WaitData.findOne({where: {userId, waitType: 1, waitDataDest: courseId}})
  if (acceptRegis) {
    await RegisCourse.create({userId, courseId: acceptRegis.waitDataDest})
    await WaitData.destroy({where: {userId, waitType: 1, waitDataDest: courseId}})
    await Notic.create({userId, message: "Bạn đã đăng ký khóa học thành công", status: 0})
    res.json({value: true})
  } else {
    res.json({message: "CÓ lỗi trong quá trình xử lý"})
  }
})

router.post('/create', checkSuperUser, async (req, res) => {
  const { title, description, subjectId } = req.body
  try {
    const newCourse = await Course.create({title, description, subjectId})
    await RegisCourse.create({userId: req.user.userId, courseId: newCourse.courseId, regisType: REGIS_TYPE.HAS})
    res.json({value: newCourse})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/update', checkSuperUser, async (req, res) => {
  try {
    const { title, description, courseId } = req.body
    const regis = RegisCourse.findOne({where: {courseId, userId: req.user.userId}})
    
    if (regis) {
      const newCourse = await Course.update({title, description}, {where: {courseId}})
      res.json({value: courseId, message: "Chỉnh sửa thông tin khóa học thành công"})
    } else {
      res.json({message: "Bạn không thể chỉnh sửa thông tin khóa học này"})
    }
  } catch(e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  } 
})

router.post('/send', checkSuperUser, async (req, res) => {
  const { courseId } = req.body
  try {
    await Course.update({status: COURSE_STATUS.WAIT}, {where: {courseId}})
    await WaitData.create({userId: req.user.userId, waitType: WAIT_TYPE.UPLOAD, waitDataDest: courseId})
    res.json({value: true})
  }catch(e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/delete/:courseId', checkSuperUser, async (req, res) => {
  try {
    await Course.destroy({where: {courseId: req.params.courseId}})
    res.json({value: true})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
