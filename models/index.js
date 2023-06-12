
const User = require('../models/User');
const Video = require('../models/Video');
const SeenVideo = require('../models/SeenVideo');
const Test = require('../models/Test');
const Tested = require('../models/Tested');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Question = require('./Question');
const Answer = require('./Answer');

User.hasMany(SeenVideo, {
	foreignKey: 'userId',
})
SeenVideo.belongsTo(User, {
	foreignKey: 'userId',
})

User.hasMany(Tested, {
  foreignKey: 'userId',
})
Tested.belongsTo(User, {
  foreignKey: 'userId'
})

Video.hasMany(SeenVideo, {
  foreignKey: 'videoId',
})
SeenVideo.belongsTo(Video, {
  foreignKey: 'videoId',
})

Test.hasMany(Tested, {
  foreignKey: 'testId',
})
Tested.belongsTo(Test, {
  foreignKey: 'testId',
})

Course.hasMany(Video, {
  foreignKey: 'courseId',
})
Video.belongsTo(Course, {
  foreignKey: 'courseId',
})

Course.hasMany(Test, {
	foreignKey: 'courseId',
})
Test.belongsTo(Course, {
	foreignKey: 'courseId',
})

Subject.hasMany(Course, {
	foreignKey: 'subjectId',
})
Course.belongsTo(Subject, {
	foreignKey: 'subjectId',
})

Test.hasMany(Question, {
  foreignKey: 'testId'
})
Question.belongsTo(Test, {
  foreignKey: 'testId'
})

Question.hasMany(Answer, {
  foreignKey: 'questionId'
})
Answer.belongsTo(Question, {
  foreignKey: 'questionId'
})

module.exports = {
  User, 
  Video,
  SeenVideo,
  Test,
  Tested,
  Topic,
  Course,
  Subject,
  Question,
  Answer
}