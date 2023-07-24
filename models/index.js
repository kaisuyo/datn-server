const sequelize = require('../core/connect')
const { bcrypt, saltRounds } = require('../core/bcrypt')
const User = require('../models/User');
const Video = require('../models/Video');
const WatchVideo = require('./WatchVideo');
const Test = require('../models/Test');
const Tested = require('../models/Tested');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Question = require('./Question');
const RegisCourse = require('../models/RegisCourse');
const WaitData = require("../models/WaitData");

const LearnResult = require('./LearnResult');

User.hasMany(WatchVideo, {foreignKey: 'userId'})
WatchVideo.belongsTo(User, {foreignKey: 'userId'})

User.hasMany(Tested, {foreignKey: 'userId'})
Tested.belongsTo(User, {foreignKey: 'userId'})

Video.hasMany(WatchVideo, {foreignKey: 'videoId'})
WatchVideo.belongsTo(Video, {foreignKey: 'videoId'})

Test.hasMany(Tested, {foreignKey: 'testId'})
Tested.belongsTo(Test, {foreignKey: 'testId'})

Course.hasMany(Video, {foreignKey: 'courseId'})
Video.belongsTo(Course, {foreignKey: 'courseId'})

Course.hasMany(Test, {foreignKey: 'courseId'})
Test.belongsTo(Course, {foreignKey: 'courseId'})

Subject.hasMany(Course, {foreignKey: 'subjectId'})
Course.belongsTo(Subject, {foreignKey: 'subjectId'})

Test.hasMany(Question, {foreignKey: 'testId'})
Question.belongsTo(Test, {foreignKey: 'testId'})

User.hasMany(RegisCourse, {foreignKey: 'userId'})
RegisCourse.belongsTo(User, {foreignKey: 'userId'})

Course.hasMany(RegisCourse, {foreignKey: 'courseId'})
RegisCourse.belongsTo(Course, {foreignKey: 'courseId'})

User.hasMany(WaitData, {foreignKey: 'userId'})
WaitData.belongsTo(User, {foreignKey: 'userId'})

User.hasMany(LearnResult, {foreignKey: 'userId'})
LearnResult.belongsTo(User, {foreignKey: 'userId'})

Subject.hasMany(LearnResult, {foreignKey: 'subjectId'})
LearnResult.belongsTo(Subject, {foreignKey: 'subjectId'})

sequelize.authenticate().then(async function(errors) { 
  if (errors) {
    console.log("error");
  } else {
    // add subjectId to tests and videos
    // const courses = await Course.findAll()
    // await Promise.all(courses.map(c => {
    //   return Promise.all([Test.update({subjectId: c.subjectId}, {where: {courseId: c.courseId}}),
    //     Video.update({subjectId: c.subjectId}, {where: {courseId: c.courseId}})
    //   ])
    // }))
    // await LearnResult.truncate()
    // const breakSize = 50;
    // let turn = 0;
    // const subjects = await Subject.findAll()

    // while (true) {
    //   const users = await User.findAll({
    //     limit: breakSize,
    //     offset: turn*breakSize,
    //     where: {role: 0},
    //     include: [
    //       {
    //         model: RegisCourse,
    //         include: Course
    //       },
    //       {
    //         model: Tested,
    //         include: Test,
    //       },
    //       {
    //         model: SeenVideo,
    //         include: Video
    //       }
    //     ]
    //   })

    //   if (users.length <= 0) break;

    //   turn++;

    //   const listLearnResult = []
    //   users.forEach(user => {
    //     subjects.forEach(s => {
    //       const learnResult = funcs.calculate(user, s)
    //       learnResult && listLearnResult.push(learnResult)
    //     })
    //   })

    //   await LearnResult.bulkCreate(listLearnResult);
    // }

    // console.log("done");
    // const a = new S_SMC_FMC(dataH.map(e => ({
    //   ...e, 
    //   measure1: Number(e.measure1),
    //   measure2: Number(e.measure2),
    //   measure3: Number(e.measure3),
    //   measure4: Number(e.measure4)
    // })), [0, 1], 'label', ['id'])
    // a.run().then(data => {
    //   fs.writeFile('output.txt', JSON.stringify(data.X), (err) => {
    //     if (err) throw err;
    //     console.log("done");
    //    });
    // })
  }
});

module.exports = {
  User, 
  Video,
  WatchVideo,
  Test,
  Tested,
  Course,
  Subject,
  Question,
  RegisCourse,
  WaitData,
  LearnResult
}