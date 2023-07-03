var express = require('express');
var router = express.Router();
const {Subject, LearnResult, User, RegisCourse, Course, Tested, Test, SeenVideo, Video} = require('../models/index');
const funcs = require('../services/calculateLearnResult');
const { checkSuperAdmin } = require('./middlewave');

router.get("/all", checkSuperAdmin , async (req, res) => {
  try {
    const learnResult = await LearnResult.findAll({
      include: [
        {model: User},
        {model: Subject}
      ],
      order: [
        ['userId', 'DESC'],
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
          learnResult && listLearnResult.push(learnResult)
        })
      })

      await LearnResult.bulkCreate(listLearnResult);
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

module.exports = router;
