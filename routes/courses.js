var express = require('express');
const { Sequelize } = require('sequelize');
var router = express.Router();
const { Course, RegisCourse, WaitData, Video, Test, User} = require('../models/index');
const { WAIT_TYPE, REGIS_TYPE, COURSE_STATUS, ROLE } = require('../services/enum');
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

router.get('/publish', async (req, res) => {
  try {
    const publishCourses = await Course.findAll({where: {status: COURSE_STATUS.ALOW}})
    let regis = [], waits = []

    if (req.isAuthenticated()) {
      regis = await RegisCourse.findAll({where: {userId: req.user.userId, regisType: REGIS_TYPE.REGIS}})
      waits = await WaitData.findAll({where: {userId: req.user.userId, waitType: WAIT_TYPE.REGIS}})
    }
    const regisListId = regis.map(r => r.courseId)
    const waitsList = waits.map(w => w.waitDataDest)
    res.json({value: publishCourses.filter(c => ![...regisListId, ...waitsList].includes(c.courseId))})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình lấy dữ liệu"})
  }
})

router.get('/another/:courseId', async (req, res) => {
  try {
    const another = await RegisCourse.findOne({
      include: User,
      where: {courseId: req.params.courseId, regisType: REGIS_TYPE.HAS}
    })
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

    const waitCoursesData  = await WaitData.findAll({
      where: {
        userId: req.user.userId,
        waitType: WAIT_TYPE.REGIS
      }
    })

    const waitCourses = await Course.findAll({where: {
      courseId: waitCoursesData.map(w => w.waitDataDest)
    }})

    res.json({
      value: [
        ...(waitCourses.map(w => {
          return {...w.dataValues, status: COURSE_STATUS.WAIT}})
        ),
        ...(regisCourses.map(r => {
          let status = (r.course.status != COURSE_STATUS.ALOW && req.user.role == ROLE.USER)? 
          COURSE_STATUS.BLOCK : r.course.status
          return {...r.course.dataValues, status}
        }))
      ]
    })
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

    if (!regisCourse) {
      res.json({message: "Bạn chưa được chấp nhận cho khóa học này"})
    } else {
      const course = await Course.findOne({
        where: {courseId: regisCourse.courseId}, 
        include: [Video, Test]
      })
      
      if (course) {
        if (course.status != COURSE_STATUS.ALOW && req.user.role == ROLE.USER) {
          res.json({message: "Khóa học đang trong quá trình sửa đổi"})
        } else {
          res.json({value: course})
        }
      } else {
        res.json({message: "Bạn không thể lấy được thông tin khóa học này"})
      }
    }

  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.post('/approve', checkAdmin, async (req, res) => {
  const { description, status, courseId } = req.body
  try {
    if (status == COURSE_STATUS.ALOW || status == COURSE_STATUS.WAIT) {
      await Course.update({status}, {where: {courseId}})
      res.json({value: true})
    } else {
      const regis = await RegisCourse.findOne({where: {courseId, regisType: REGIS_TYPE.HAS}})
      await RegisCourse.destroy({where: {userId: req.user.userId, regisType: REGIS_TYPE.APPROVE, courseId}})
      await Course.update({status}, {where: {courseId}})
      await WaitData.create({
        userId: req.user.userId,
        receiverId: regis.userId, 
        waitType: WAIT_TYPE.RETURN,
        message: description
      })
      res.json({value: true})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi khi truy xuất dữ liệu"})
  }
})

router.post('/regis', checkAuth, async (req, res) => {
  const { courseId } = req.body
  if (req.user.role != ROLE.USER) {
    res.json({message: "Bạn không phải người học"})
    return;
  }
  try {
    const course = await Course.findOne({where: {courseId}})
    if (course) {
      const regisHas = await RegisCourse.findOne({
        where: {courseId, regisType: REGIS_TYPE.HAS}
      })
      await WaitData.create({
        userId: req.user.userId, 
        receiverId: regisHas.userId, 
        waitType: WAIT_TYPE.REGIS, 
        waitDataDest: courseId,
        message: `Đăng ký khóa học: ${course.title}`
      })
      res.json({value: true, message: "Đã gửi yêu cầu đăng ký khóa học"})
    } else {
      res.json({message: "Yêu cầu này không tồn tại nữa"})
    }
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post("/alowRegis", checkSuperUser, async (req, res) => {
  const { waitId } = req.body
  try {
    const wait = await WaitData.findOne({where: {waitId}})
    if (wait) {
      if (wait.waitType == WAIT_TYPE.REGIS) {
        await RegisCourse.create({userId: wait.userId, courseId: wait.waitDataDest, regisType: REGIS_TYPE.REGIS})
        await WaitData.destroy({where: {waitId}})
        res.json({value: true})
      } else {
        await WaitData.destroy({where: {waitId}})
        res.json({message: "Việc làm này chỉ mang tính hình thức"})
      }
    } else {
      res.json({message: "Yêu cầu này không tồn tại nữa"})
    }
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/blockRegis', checkSuperUser, async (req, res) => {
  const { waitId } = req.body
  const wait = await WaitData.findOne({where: {waitId}})
  if (wait) {
    if (wait.waitType == WAIT_TYPE.REGIS) {
      await WaitData.destroy({where: {waitId}})
      res.json({value: true})
    } else {
      res.json({message: "Việc làm này chỉ mang tính hình thức"})
    }
  } else {
    res.json({message: "Có lỗi trong quá trình xử lý"})
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

router.get('/requires', checkSuperUser, async (req, res) => {
  try {
    const requires = await WaitData.findAll({
      where: {receiverId: req.user.userId},
      include: User
    })

    const result = []
    requires.forEach(e => {
      let role = ''
      if (e.user.role == ROLE.ADMIN) {
        role = 'Người duyệt'
      } else if (e.user.role == ROLE.USER) {
        role = 'Người học'
      }
      result.push({
        waitId: e.waitId,
        fromUser: e.user.username,
        role,
        message: e.message
      })
    })
    res.json({value: result})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
