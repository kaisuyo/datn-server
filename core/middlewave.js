const { ROLE } = require("./enum")
const Message = require("./message")

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({value: null, message: Message.ROLE_NOT_CORRECTED})
  }
}

const checkLearner = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.LEARNER) {
    next()
  } else {
    res.json({value: null, message: Message.ROLE_NOT_CORRECTED})
  }
}

const checkProvider = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.PROVIDER) {
    next()
  } else {
    res.json({value: null, message: Message.ROLE_NOT_CORRECTED})
  }
}

const checkApprover = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.APPROVER) {
    next()
  } else {
    res.json({value: null, message: Message.ROLE_NOT_CORRECTED})
  }
}

const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.SYSTEM) {
    next()
  } else {
    res.json({message: Message.ROLE_NOT_CORRECTED})
  }
}

const tryCatchExe = async (callback, functionName) => {
  try {
    return await callback()
  } catch(e) {
    console.error(e)
    console.error("Function error: " + functionName);
    return {value: null, message: Message.EXECUTE_QUERY_ERR}
  }
}

module.exports = {
  checkAuth,
  checkLearner,
  checkProvider,
  checkApprover,
  checkAdmin,
  tryCatchExe
}