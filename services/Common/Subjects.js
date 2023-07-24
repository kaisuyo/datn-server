const { tryCatchExe } = require("../../core/middlewave")
const { Subject } = require("../../models")

const Subjects = {
  /**
   * 
   * @returns Subjects
   */
  getAll: async () => {
    return await tryCatchExe(async () => {
      const subjects = await Subject.findAll()
      return {value: subjects}
    }, "get all subject")
  },
}

module.exports = Subjects

