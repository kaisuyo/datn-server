
var express = require('express');
var router = express.Router();
const { Video, RegisCourse, SeenVideo } = require('../models/index')
const { checkAdmin, checkAuth } = require('./middlewave')

router.get('/all/:courseId', checkAuth, async (req, res) => {
  try {
    const videos = await Video.findAll({where: {courseId: req.params.courseId}})
    res.json({value: videos})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/:videoId', checkAuth , async (req, res) => {
  try {
    const video = await Video.findOne({videoId: req.params.videoId})
    const regisCourse = await RegisCourse.findOne({where: {userId: req.user.userId, courseId: video.courseId}})
    if (regisCourse) {
      const seen = await SeenVideo.findOne({where: {videoId: video.videoId}})
      if (seen) {
        await SeenVideo.update({fraq: seen.fraq + 1})
      } else {
        await SeenVideo.create({fraq: 0, userId: req.user.userId, videoId: video.videoId})
      }
      res.json({value: video})
    } else {
      res.json({message: "Video bạn yêu cầu không thuộc khóa học của bạn"})
    }
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/stop', checkAuth, async (req, res) => {
  try {
    const { time, videoId } = req.body
    const seen = SeenVideo.findOne({where: {videoId}})
    await SeenVideo.update({time: seen.time + time})
    res.json({value: true})
  }catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/create', checkAdmin, async (req, res) => {
  const { title, description, url, courseId, time } = req.body
  try {
    await Video.create({title, description, URL: url, time, courseId})
    res.json({value: true})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/update', checkAdmin, async (req, res) => {
  const { title, description, url, courseId, time, videoId } = req.body
  try {
    await Video.update({title, description, URL: url, time, courseId}, {where: {videoId}})
    res.json({value: true})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/delete:videoId', checkAdmin, async (req, res) => {
  try {
    await Video.destroy({where: {videoId: req.params.videoId}})
    res.json({value: true})
  } catch(e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
