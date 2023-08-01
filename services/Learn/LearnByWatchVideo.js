const { tryCatchExe } = require("../../core/middlewave")
const { Video, WatchVideo } = require("../../models")

const LearnByWatchVideo = {
  get: async (userId, videoId) => {
    return await tryCatchExe(async () => {
      const video = await Video.findOne({where: {videoId}})
      const watch = await WatchVideo.findOne({where: {userId, videoId}})
      return {value: {...video.dataValues, rate: watch?.rate}}
    }, "get video by id")
  },

  watch: async (userId, videoId, watchTime) => {
    return await tryCatchExe(async () => {
      const seen = await WatchVideo.findOne({
        where: {videoId, userId},
        include: Video
      })
      if (seen) {
        const newTime = (seen.time*seen.fraq + watchTime)/(seen.fraq + 1)
        const fraq = seen.fraq + 1;
        await WatchVideo.update({time: newTime, fraq}, {where: {videoId, userId}})
      } else {
        await WatchVideo.create({videoId, userId, time: watchTime})
      }
      return ({})
    }, "update time watch video")
  },

  rate: async (userId, videoId, rate) => {
    return await tryCatchExe(async () => {
      await WatchVideo.update({rate}, {where: {userId, videoId}})
      return {value: true}
    }, "ratting for video")
  }
}

module.exports = LearnByWatchVideo