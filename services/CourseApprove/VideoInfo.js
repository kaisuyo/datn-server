const { tryCatchExe } = require("../../core/middlewave")
const { Video } = require("../../models")

const VideoInfo = {
  getAll: async (courseId) => {
    return await tryCatchExe(async () => {
      const videos = await Video.findAll({where: {courseId}})
      return {value: videos}
    }, "get all videos for read only")
  },

  get: async (videoId) => {
    return await tryCatchExe(async () => {
      const video = await Video.findOne({where: {videoId}})
      return {value: video}
    }, "get video info")
  }
}

module.exports = VideoInfo