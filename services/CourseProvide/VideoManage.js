const { tryCatchExe } = require("../../core/middlewave")
const { Video, Course } = require("../../models")

const VideoManage = {
  create: async (title, description, url, time, courseId) => {
    return await tryCatchExe(async () => {
      const course = await Course.findOne({where: {courseId}})
      const newVideo = await Video.create({title, description, URL: url, time, courseId, subjectId: course.subjectId})
      return {value: newVideo}
    }, "create video")
  },

  getAllVideoOfCourse: async (courseId) => {
    return await tryCatchExe(async () => {
      const videos = await Video.findAll({where: {courseId}})
      return {value: videos}
    }, "get all video of course")
  },

  getVideo: async (videoId) => {
    return await tryCatchExe(async () => {
      const video = await Video.findOne({where: {videoId}})
      return {value: video}
    }, "get a video info")
  },

  update: async (videoId, url) => {
    return await tryCatchExe(async () => {
      const isUpdated = await Video.update({URL: url}, {where: {videoId}})
      return {value: isUpdated}
    }, "update video")
  },
  
  delete: async (videoId) => {
    return await tryCatchExe(async () => {
      const isDeleted = await Video.destroy({where: {videoId}})
      return {value: isDeleted}
    }, "delete a video")
  },

  updateTime: async (videoId, time) => {
    return await tryCatchExe(async () => {
      const isUpdated = await Video.update({time}, {where: {videoId}})
      return {value: isUpdated}
    }, "update time of video")
  }
}

module.exports = VideoManage