const { tryCatchExe } = require("../../core/middlewave")
const S_SMC_FCM = require("./SSmcFcm")
const { LearnResult, User, Subject, RegisCourse, Course, Tested, Test, WatchVideo, Video } = require("../../models")
const CalculateLearnFields = require("./CalculateLearnFields")
const Message = require("../../core/message")
const { REGIS_TYPE, COURSE_STATUS } = require("../../core/enum")

const CalcFinalLearnResult = {
  getLearnResult: async () => {
    return await tryCatchExe(async () => {
      const learnResult = await LearnResult.findAll({
        include: [
          {model: User},
          {model: Subject}
        ],
        order: [
          ['userId', 'ASC'],
        ],
      })
    
      return ({value: learnResult})
    }, "get all data calculated")
  },

  calculate: async () => {
    return await tryCatchExe(async () => {
      await LearnResult.truncate()
      const breakSize = 50;
      let turn = 0;
      const subjects = await Subject.findAll()

      while (true) {
        const users = await User.findAll({
          limit: breakSize,
          offset: turn*breakSize,
          where: {role: 0},
          include: [
            {
              model: RegisCourse,
              include: Course
            },
            {
              model: Tested,
              include: Test,
            },
            {
              model: WatchVideo,
              include: Video
            }
          ]
        })

        if (users.length <= 0) break;

        turn++;

        const listLearnResult = []
        users.forEach(user => {
          subjects.forEach(s => {
            const learnResult = CalculateLearnFields.calculate(user, s)
            if (learnResult) {
              listLearnResult.push(learnResult)
            } 
          })
        })

        await LearnResult.bulkCreate(listLearnResult);
      }

      return ({value: true})
    }, "calculate field for analysis")
  },

  handworkLabeling: async (userId, subjectId, label) => {
    return tryCatchExe(async () => {
      await LearnResult.update({label}, {where: {userId, subjectId}})
      const result = await LearnResult.findOne({where: {userId, subjectId}})
      return ({value: result})
    }, "handwork labeling")
  },

  clustering: async () => {
    return await tryCatchExe(async () => {
    const learnResult = await LearnResult.findAll()
    if (learnResult.every(e => e.label)) {
      return {value: true}
    }
    const s_smc_fcm = new S_SMC_FCM(learnResult.map(l => ({...l.dataValues, rate: l.dataValues.rate * 2})), ['NONE', 'LOW', 'MEDIUM', 'HIGH'], 'label', ['userId', 'subjectId'])
    const result = await s_smc_fcm.run()
    await Promise.all(result.X.map(x => {
      return LearnResult.update({label: x.label}, {where: {userId: x.userId, subjectId: x.subjectId}})
    }))
    return ({value: true})
    }, "auto clustering")
  },

  assign: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const regis = await RegisCourse.findOne({where: {userId, courseId}})
      if (regis) {
        return ({message: Message.COURSE_BE_REGIS})
      } else {
        const suggestCourse = await RegisCourse.create({userId, courseId, regisType: REGIS_TYPE.SUGGEST})
        return ({value: suggestCourse})
      }
    }, "assign suggest course")
  },

  unAssign: async (userId, courseId) => {
    return await tryCatchExe(async () => {
      const isUnAssign = await RegisCourse.destroy({where: {userId, courseId, regisType: [REGIS_TYPE.SUGGEST, REGIS_TYPE.SUGGEST_BY_UESR, REGIS_TYPE.SUGGEST_BY_SUBJECT]}})
      return {value: isUnAssign}
    }, "un assign suggest course")
  },

  getSuggest: async (userId) => {
    return await tryCatchExe(async () => {
      const subjects = await Subject.findAll()
      const all = await Course.findAll({where: {status: COURSE_STATUS.ALOW}})
      const allRegis = await RegisCourse.findAll({where: {userId, regisType: REGIS_TYPE.REGIS}, include: Course})
      const allRegisCourse = allRegis.map(r => r.dataValues)
      const learnResults = await LearnResult.findAll({where: {userId}})
      const learnAllResult = await LearnResult.findAll({include: User})
  
      const handleDuplicate = (listCourses, regisCourses) => {
        const listRegisCoursesId = regisCourses.map(c => c.courseId)
        return listCourses.filter(c => !listRegisCoursesId.includes(c.courseId))
      }
  
      const customSuggest = await RegisCourse.findAll({where: {userId, regisType: REGIS_TYPE.SUGGEST}, include: Course})
      
      let highSubject = learnResults.filter(s => s.label === 'HIGH')
      if (highSubject.length <= 0) {
        highSubject = learnResults.filter(s => s.label === 'MEDIUM')
        const maxFreq = Math.max(...highSubject.map(e => e.courseTotal))
        highSubject = highSubject.filter(e => e.courseTotal == maxFreq).slice(0, 1)
      }
  
      const allSubjectSuggest = await Course.findAll({where: {subjectId: highSubject.map(x => x.subjectId)}, include: Subject})
      const subjectSuggest = handleDuplicate(allSubjectSuggest, allRegisCourse)
      
      const tempData = []
      const TMP = {
        NONE: 0,
        LOW: 3.33,
        MEDIUM: 6.67,
        HIGH: 10
      }
      const arrToObj = (arr) => {
        const result = {}
        arr.forEach(e => {
          result[e.subjectId] = 0
        })
    
        return result
      }
      console.log(learnAllResult);
      learnAllResult.forEach(e => {
        let dataIndex = tempData.findIndex(x => x.userId === e.userId)
        if (dataIndex === -1) {
          dataIndex = tempData.push({key: e.userId, userId: e.userId, username: e.dataValues.user.username, ...arrToObj(subjects)}) - 1
        }
  
        tempData[dataIndex][e.subjectId] = TMP[e.label]
      })
      const distance = (a, b, ignores) => {
        let d = 0;
        const tempV = Object.keys(a).map(field => {
          if (!ignores.includes(field)) {
            if (typeof a[field] == 'number' && typeof b[field] == 'number') {
              const v = a[field] - b[field]
              return v*v
            }
          } 
          return 0
        })
  
        d = tempV.reduce((x, y) => x+y, 0)
  
        return Math.sqrt(d)
      }
      const distances = []
      let curUser = tempData.find(u => u.userId == userId)
      tempData.forEach(u => {
        if (u && u.userId != userId) {
          distances.push({
            userId: u.userId,
            username: u.username,
            d: distance(curUser, u, ['key', 'userId', 'username'])
          })
        }
      })
      for(let i = 0; i < distances.length - 1; i++) {
        for(let j = i+1; j < distances.length; j++) {
          if (distances[i].d > distances[j].d) {
            let t = distances[i]
            distances[i] = distances[j]
            distances[j] = t
          }
        }
      }
  
      let nearest = distances[0]
      let allRegisOfNearest = []
      let turn = 0
      let suggestCourseList = []
      while (nearest && turn <= 1) {
        turn++
        allRegisOfNearest = await RegisCourse.findAll({where: {userId: nearest.userId}, include: Course})
        const courseList = allRegisOfNearest.map(a => a.dataValues)
        suggestCourseList = handleDuplicate(courseList, allRegisCourse)
        if (suggestCourseList.length) {
          break;
        }
  
        nearest = distances[1]
      }
      const userSuggest = await Course.findAll({where: {courseId: suggestCourseList.map(s => s.courseId)}})
  
      return {value: {
        customSuggest: customSuggest.map(c => ({label: c.course.title, key: c.courseId})), 
        userSuggest: userSuggest.map(c => ({label: c.title, key: c.courseId, tooltip: `${nearest.username} - ${nearest.userId} (độ sai khác: ${nearest.d})`})), 
        subjectSuggest: subjectSuggest.map(c => ({label: c.title, key: c.courseId, tooltip: c.dataValues.subject.title})), 
        all: all.filter(c => !allRegis.map(r => r.dataValues.courseId).includes(c.courseId)).map(c => ({label: c.title, key: c.courseId}))
      }}
    }, "get suggestion courses")
  } 
}

module.exports = CalcFinalLearnResult