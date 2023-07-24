const Message = require("../../core/message")
const { tryCatchExe } = require("../../core/middlewave")
const { Subject } = require("../../models")

const SubjectManage = {
  /**
   * 
   * @param {String} title String
   * @param {String} description String
   * @returns 
   */
  create: async (title, description) => {
    return await tryCatchExe(async () => {
      const newSubject = await Subject.create({title, description})
      return {value: newSubject, message: Message.CREATE_SUBJECT_SUCCESS}
    }, "create subject")
  },

  /**
   * 
   * @param {Integer} subjectId Integer
   * @return Subject
   */
  get: async (subjectId) => {
    return await tryCatchExe(async () => {
      const subject = await Subject.findOne({where: {subjectId}})
      return {value: subject}
    }, "get subject")
  },

  /**
   * 
   * @param {Integer} subjectId Integer
   * @param {String} title String
   * @param {String} description String
   * @returns Integer 1: updated, 0: update fail
   */
  update: async (subjectId, title, description) => {
    return await tryCatchExe(async () => {
      const isUpdated = await Subject.update({title, description}, {where: {subjectId}})
      return {value: isUpdated}
    }, "update subject")
  },

  /**
   * 
   * @param {String} subjectId String
   * @returns Integer 1: deleted, 0: update fail
   */
  delete: async (subjectId) => {
    return await tryCatchExe(async () => {
      const deleted = await Subject.destroy({where: {subjectId}})
      return deleted
    }, "delete subject")
  }
}

module.exports = SubjectManage