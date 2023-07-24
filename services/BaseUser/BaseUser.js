const { saltRounds, bcrypt } = require("../../core/bcrypt")
const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { User } = require("../../models")

const BaseUser = {
  create: async (username, password, roleType) => {
    return await tryCatchExe(async () => {
      const oldAdmin = await User.findOne({where: {username}})
      if (oldAdmin) {
        return {message: Message.USER_EXIST_ERR}
      } else {
        const hashPass = bcrypt.hashSync(password, saltRounds)
        const user = await User.create({username, password: hashPass, role: roleType})
        return {value: user}
      }
    }, "create user")
  },

  changePassword: async (userId, password, oldPassword) => {
    if (!oldPassword || !password) {
      return {value: null, message: Message.CHANGE_USER_INFO_NOT_VALID_ERR}
    }

    return await tryCatchExe(async () => {
      const user = await User.findOne({where: {userId}})
      if (user && user.username == 'system') {
        return {message: Message.CHANGE_SYSTEM_ACCOUNT_ERR}
      }

      const verifyPass = bcrypt.compareSync(oldPassword, user.password)
      if (verifyPass) {
        const hashPass = bcrypt.hashSync(password, saltRounds)
        await User.update({password: hashPass}, {where: {userId}})
        return ({value: true, message: Message.CHANGE_SYSTEM_ACCOUNT_ERR})
      }
    }, "change password")

  },

}

module.exports = BaseUser