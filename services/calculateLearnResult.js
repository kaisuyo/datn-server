
const calculateRate = (user, subject) => {
  let result = 0 ;
  let videos = user.seen_videos.filter(v => 
    v.video.subjectId == subject.subjectId &&
    v.fraq != 0
  )
  videos.forEach(v => {
    result += v.rate
  });

  let tests = user.testeds.filter(t => 
    t.test.subjectId == subject.subjectId &&
    t.fraq != 0
  )
  tests.forEach(t => {
    result += t.rate
  });
  return result/(videos.length + tests.length);
}

const calculateTimeTest = (user, subject) => {
  let result = 0
  let tests = user.testeds.filter(t => 
    t.test.subjectId == subject.subjectId &&
    t.fraq != 0
  )
  tests.forEach(t => {
    result += t.time
  });
  return result/tests.length
}

const calculateTimeVideo = (user, subject) => {
  let result = 0
  let videos = user.seen_videos.filter(v => 
    v.video.subjectId == subject.subjectId && 
    v.fraq != 0
  )
  videos.forEach(v => {
    result += v.time
  });
  return result/videos.length
}

const calculateScore = (user, subject) => {
  let result = 0
  let tests = user.testeds.filter(t => 
    t.test.subjectId == subject.subjectId &&
    t.fraq != 0
  )
  tests.forEach(t => {
    result += t.score
  });
  return result/tests.length
}

const calculateTestTimes = (user, subject) => {
  let result = 0
  let tests = user.testeds.filter(t => 
    t.test.subjectId == subject.subjectId &&
    t.fraq != 0
  )

  result = tests.map(t => t.fraq).reduce((a, b) => a+b, 0)
  return result;
}

const calculateVideoTimes = (user, subject) => {
  let result = 0
  let videos = user.seen_videos.filter(v => 
    v.video.subjectId == subject.subjectId &&
    v.fraq != 0
  )

  result = videos.map(v => v.fraq).reduce((a, b) => a+b, 0)
  return result;
}

const calculateCourseTotal = (user, subject) => {
  let courses = user.regis_courses.filter(
    c => c.course.subjectId == subject.subjectId &&
    c.regisType == 0  
  ).length
  return courses;
}

const funcs = {
  calculate: (user, subject) => {
    if (user.regis_courses.length <= 0 || user.regis_courses.every(c => c.course.subjectId != subject.subjectId)) {
      return null;
    }
    
    return {
      rate: parseFloat(calculateRate(user, subject).toFixed(2)),
      timeTest: parseFloat(calculateTimeTest(user, subject).toFixed(2)),
      timeVideo: parseFloat(calculateTimeVideo(user, subject).toFixed(2)),
      score: parseFloat(calculateScore(user, subject).toFixed(2)),
      testTimes: parseFloat(calculateTestTimes(user, subject).toFixed(2)),
      videoTimes: parseFloat(calculateVideoTimes(user, subject).toFixed(2)),
      courseTotal: parseFloat(calculateCourseTotal(user, subject).toFixed(2)),
      userId: user.userId,
      subjectId: subject.subjectId
    }
  }
}

module.exports = funcs