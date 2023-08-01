const { ROLE, REGIS_TYPE, WAIT_TYPE } = require("../../core/enum")
const { tryCatchExe } = require("../../core/middlewave")
const { User, WaitData, RegisCourse } = require("../../models")

const RequireManage = {
  getAll: async (userId) => {
    return await tryCatchExe(async () => {
      const requires = await WaitData.findAll({
        where: {receiverId: userId},
        include: User
      })
  
      const result = []
      requires.forEach(e => {
        let role = ''
        if (e.user.role == ROLE.APPROVER) {
          role = 'Người duyệt'
        } else if (e.user.role == ROLE.LEARNER) {
          role = 'Người học'
        }
        result.push({
          waitId: e.waitId,
          fromUser: e.user.username,
          role,
          message: e.message
        })
      })
      return ({value: result})
    }, "get all require")
  },

  blockRegis: async (waitId) => {
    return await tryCatchExe(async () => {
      const wait = await WaitData.findOne({where: {waitId}})
      if (wait) {
        if (wait.waitType == WAIT_TYPE.REGIS) {
          await WaitData.destroy({where: {waitId}})
          return ({value: true})
        } else {
          return ({message: "Bạn bắt buộc phải sửa"})
        }
      }
    }, "block a regis require")
  },

  alowRegis: async (waitId) => {
    return await tryCatchExe(async () => {
      const wait = await WaitData.findOne({where: {waitId}})
      if (wait) {
        if (wait.waitType == WAIT_TYPE.REGIS) {
          await RegisCourse.create({userId: wait.userId, courseId: wait.waitDataDest, regisType: REGIS_TYPE.REGIS})
          await WaitData.destroy({where: {waitId}})
          return ({value: true})
        } else {
          await WaitData.destroy({where: {waitId}})
          return ({message: "Bạn bắt buộc phải sửa"})
        }
      } else {
        return ({message: "Yêu cầu này không tồn tại nữa"})
      }
    }, "alow a regis require")
  }
}

module.exports = RequireManage