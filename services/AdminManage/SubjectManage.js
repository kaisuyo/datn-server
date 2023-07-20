const { Subject } = require("../../models")

const SubjectManage = {
  /**
   * 
   * @param {String} title String
   * @param {String} description String
   * @returns 
   */
  create: async (title, description) => {
    try {
      const newSubject = await Subject.create({title, description})
    } catch(e) {
      console.error(e)
      return {value: null, message: }
    }
  },

  /**
   * 
   * @param {Integer} subjectId Integer
   * @return Subject
   */
  get: async (subjectId) => {
    const subject = await Subject.findOne({where: {subjectId}})
    return subject
  },

  /**
   * 
   * @returns Subjects
   */
  getAll: async () => {
    const subjects = await Subject.findAll()
    return subjects
  },

  /**
   * 
   * @param {Integer} subjectId Integer
   * @param {String} title String
   * @param {String} description String
   * @returns Integer 1: updated, 0: update fail
   */
  update: async (subjectId, title, description) => {
    const isUpdated = await Subject.update({title, description}, {where: {subjectId}})
    return isUpdated
  },

  /**
   * 
   * @param {String} subjectId String
   * @returns Integer 1: deleted, 0: update fail
   */
  delete: async (subjectId) => {
    const deleted = await Subject.destroy({where: {subjectId}})
    return deleted
  }
}

module.exports = SubjectManage