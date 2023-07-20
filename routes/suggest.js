var express = require('express');
const { Op } = require('sequelize');
var router = express.Router();
const {Subject, LearnResult, User, RegisCourse, Course, Tested, Test, SeenVideo, Video} = require('../models/index');
const funcs = require('../services/Analysis/CalculateLearnResult');
const { REGIS_TYPE, COURSE_STATUS, ROLE } = require('../core/enum');
const S_SMC_FCM = require('../services/Analysis/ssmc_fcm');
const { checkSuperAdmin } = require('./middlewave');

router.get("/all", checkSuperAdmin , async (req, res) => {
  try {
    const learnResult = await LearnResult.findAll({
      include: [
        {model: User},
        {model: Subject}
      ],
      order: [
        ['userId', 'ASC'],
      ],
    })
  
    res.json({value: learnResult})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình truy suất dữ liệu"})
  }
})

router.get('/calculate', checkSuperAdmin, async (req, res) => {
  try {
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
            model: SeenVideo,
            include: Video
          }
        ]
      })

      if (users.length <= 0) break;

      turn++;

      const listLearnResult = []
      users.forEach(user => {
        subjects.forEach(s => {
          const learnResult = funcs.calculate(user, s)
          if (learnResult) {
            listLearnResult.push(learnResult)
          } 
        })
      })

      await LearnResult.bulkCreate(listLearnResult);
      // const temp = await LearnResult.findAll()
      // if (temp.length >= 300) break;
    }

    res.json({value: true})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình truy suất dữ liệu"})
  }
})

router.post('/update', checkSuperAdmin, async (req, res) => {
  try {
    const { userId, subjectId, label } = req.body
    await LearnResult.update({label}, {where: {userId, subjectId}})
    const result = await LearnResult.findOne({where: {userId, subjectId}})
    res.json({value: result})
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình truy suất dữ liệu"})
  }
})

router.post('/clustering', checkSuperAdmin, async (req, res) => {
  const learnResult = await LearnResult.findAll()
  const s_smc_fcm = new S_SMC_FCM(learnResult.map(l => ({...l.dataValues, rate: l.dataValues.rate * 2})), ['NONE', 'LOW', 'MEDIUM', 'HIGH'], 'label', ['userId', 'subjectId'])
  const result = await s_smc_fcm.run()
  await Promise.all(result.X.map(x => {
    return LearnResult.update({label: x.label}, {where: {userId: x.userId, subjectId: x.subjectId}})
  }))
  res.json({value: true})
})

router.post('/clusteringPhase2', checkSuperAdmin, async (req, res) => {
  const { dataList, clusters } = req.body
  const s_smc_fcm = new S_SMC_FCM(dataList, clusters, 'cluster', ['username', 'userId'])
  const result = await s_smc_fcm.run()
  res.json({value: result.X})
})

router.post('/assign', checkSuperAdmin, async (req, res) => {
  const { userId, courseId } = req.body
  try {
    const regis = await RegisCourse.findOne({where: {userId, courseId}})
    if (regis) {
      res.json({message: "Môn học đã được đăng ký bởi người dùng này"})
    } else {
      const suggestCourse = await RegisCourse.create({userId, courseId, regisType: REGIS_TYPE.SUGGEST})
      res.json({value: suggestCourse})
    }
  } catch (e) {
    console.error(e);
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/unAssign', checkSuperAdmin, async (req, res) => {
  const { userId, courseId } = req.body
  try {
    await RegisCourse.destroy({where: {userId, courseId, regisType: [REGIS_TYPE.SUGGEST, REGIS_TYPE.SUGGEST_BY_UESR, REGIS_TYPE.SUGGEST_BY_SUBJECT]}})
    res.json({value: true})
  } catch (e) {
    console.error(e);
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/get', checkSuperAdmin, async (req, res) => {
  const {userId} = req.body
  try {
    const users = await User.findAll({where: {userId: {[Op.ne]: userId}, role: ROLE.USER}})
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

    console.log(curUser);
    res.json({value: {
      customSuggest: customSuggest.map(c => ({label: c.course.title, key: c.courseId})), 
      userSuggest: userSuggest.map(c => ({label: c.title, key: c.courseId, tooltip: `${nearest.username} (độ sai khác: ${nearest.d})`})), 
      subjectSuggest: subjectSuggest.map(c => ({label: c.title, key: c.courseId, tooltip: c.dataValues.subject.title})), 
      all: all.filter(c => !allRegis.map(r => r.dataValues.courseId).includes(c.courseId)).map(c => ({label: c.title, key: c.courseId}))
    }})
  } catch (e) {
    console.error(e)
    res.json({value: []})
  }
})

module.exports = router;
