const { Op } = require("sequelize")
const { bcrypt, saltRounds } = require("../../core/bcrypt")
const { ROLE } = require("../../core/enum")
const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { User } = require("../../models")
const BaseUser = require("../BaseUser/BaseUser")

const UserManage = {
  createProvider: async (username, password) => {
    return await BaseUser.create(username, password, ROLE.PROVIDER)
  },

  createApprover: async (username, password) => {
    return await BaseUser.create(username, password, ROLE.APPROVER)
  },

  changeStatusUser: async (userId, userStatus) => {
    return await tryCatchExe(async () => {
      const user = await User.findOne({where: {userId}})
      if (!user) {
        return {message: Message.USER_NOT_EXIST}
      }
      if (user.username == 'system') {
        return {message: Message.CHANGE_SYSTEM_ACCOUNT_ERR}
      }

      await User.update({status: userStatus}, {where: {userId}})
      return {value: true}
    }, "change status of user")
  },

  resetPassword: async (userId) => {
    return await tryCatchExe(async () => {
      const hashPass = bcrypt.hashSync('0', saltRounds)
      const isUpdated = await User.update({password: hashPass}, {where: {userId, username: {[Op.ne]: 'system'}}})
      return {value: isUpdated}
    }, 'reset password')
  },

  deleteUser: async (userId) => {
    return await tryCatchExe(async () => {
      const isDeleted = await User.destroy({where: {userId}})
      return {value: isDeleted}
    }, 'delete approver or provider')
  },

  getAllProvider: async () => {
    return await tryCatchExe(async () => {
      const providers = await User.findAll({where: {role: ROLE.PROVIDER}})
      return {value: providers}
    }, 'get all provider')
  },

  getAllApprover: async () => {
    return await tryCatchExe(async () => {
      const approvers = await User.findAll({where: {role: ROLE.APPROVER}})
      return {value: approvers}
    }, 'get all approver')
  }
}

module.exports = UserManage