const { tryCatchExe } = require("../../core/middlewave")
const { Video, WatchVideo } = require("../../models")

const LearnByWatchVideo = {
  get: async (videoId) => {
    return await tryCatchExe(async () => {
      const video = await Video.findOne({where: {videoId}})
      return {value: video}
    }, "get video by id")
  },

  watch: async (userId, videoId, watchTime) => {
    return await tryCatchExe(async () => {
      const seen = await WatchVideo.findOne({
        where: {videoId, userId},
        include: Video
      })
      if (seen) {
        if (seen.time + watchTime >= seen.video.dataValues.time) {
          const fraq = seen.fraq + 1;
          const newTime = seen.time + watchTime - seen.video.dataValues.time
          await WatchVideo.update({time: newTime, fraq}, {where: {videoId, userId}})
        } else {
          await WatchVideo.update({time: seen.time + watchTime}, {where: {videoId, userId}})
        }
      } else {
        await WatchVideo.create({videoId, userId, time: watchTime})
      }
      res.json({})
    }, "update time watch video")
  }
}

module.exports = LearnByWatchVideo