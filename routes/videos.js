
var express = require('express');
var router = express.Router();
const { Video, RegisCourse, SeenVideo } = require('../models/index');
const { REGIS_TYPE } = require('../services/enum');
const { checkAdmin, checkAuth, checkSuperUser } = require('./middlewave')

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
    const video = await Video.findOne({where: {videoId: req.params.videoId}})
    const regisCourse = await RegisCourse.findOne({where: {userId: req.user.userId, courseId: video.courseId}})
    if (regisCourse) {
      if (regisCourse.regisType == REGIS_TYPE.HAS) {
        res.json({value: video})
      } else {
        const seen = await SeenVideo.findOne({where: {videoId: video.videoId}})
        if (seen) {
          await SeenVideo.update({fraq: seen.fraq + 1}, {where: {videoId: video.videoId}})
        } else {
          await SeenVideo.create({fraq: 0, userId: req.user.userId, videoId: video.videoId})
        }
        res.json({value: video})
      }
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

router.post('/create', checkSuperUser, async (req, res) => {
  const { title, description, url, courseId, time } = req.body
  try {
    const newVideo = await Video.create({title, description, URL: url, time, courseId})
    res.json({value: newVideo})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/updateTime', checkSuperUser, async (req, res) => {
  const { videoId, time } = req.body
  try {
    await Video.update({time}, {where: {videoId}})
    res.json({})
  } catch (e) {
    console.error(e)
    res.json({})
  }
})

router.post('/update', checkSuperUser, async (req, res) => {
  const { url, videoId } = req.body
  try {
    await Video.update({URL: url}, {where: {videoId}})
    res.json({value: true})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/delete/:videoId', checkSuperUser, async (req, res) => {
  try {
    await Video.destroy({where: {videoId: req.params.videoId}})
    res.json({value: true})
  } catch(e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/seen', checkAuth, async (req, res) => {
  const { videoId, seenTime } = req.body
  try {
    const seen = await SeenVideo.findOne({
      where: {videoId, userId: req.user.userId},
      include: Video
    })
    if (seen) {
      console.log(seen)
      if (seen.time + seenTime >= seen.video.dataValues.time) {
        const fraq = seen.fraq + 1;
        const newTime = seen.time + seenTime - seen.video.dataValues.time
        await SeenVideo.update({time: newTime, fraq}, {where: {videoId, userId: req.user.userId}})
      } else {
        await SeenVideo.update({time: seen.time + seenTime}, {where: {videoId, userId: req.user.userId}})
      }
    } else {
      await SeenVideo.create({videoId, userId: req.user.userId, time: seenTime})
    }
    res.json({})
  } catch(e) {
    console.error(e)
    res.json({})
  }
})

router.post('/')

module.exports = router;
