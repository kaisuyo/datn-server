var express = require('express');
const { ROLE, USER_STATUS } = require('../core/enum');
const { checkAdmin } = require('../core/middlewave');
const SubjectManage = require('../services/AdminManage/SubjectManage');
const UserManage = require('../services/AdminManage/UserManage');
var router = express.Router();

router.post("/subjects/", async (req, res) => {
  const result = await SubjectManage.getAll()
  res.json(result)
})

router.post("/subjects/create", checkAdmin, async (req, res) => {
  const { title, description } = req.body
  const result = await SubjectManage.create(title, description)
  res.json(result)
})

router.post('/subjects/edit', checkAdmin, async (req, res) => {
  const { subjectId, title, description } = req.body
  const result = await SubjectManage.update(subjectId, title, description)
  res.json(result)
})

router.post("/subjects/delete", checkAdmin, async (req, res) => {
  const { subjectId } = req.body
  const result = await SubjectManage.delete(subjectId)
  res.json(result)
})

router.post("/users/", checkAdmin, async (req, res) => {
  const { roleType } = req.body
  if (roleType == ROLE.APPROVER) {
    const result = await UserManage.getAllApprover()
    res.json(result)
  } else {
    const result = await UserManage.getAllProvider()
    res.json(result)
  }
})

router.post("/users/create", checkAdmin, async (req, res) => {
  const { roleType, username, password } = req.body
  if (roleType == ROLE.APPROVER) {
    const result = await UserManage.createApprover(username, password)
    res.json(result)
  } else {
    const result = await UserManage.createProvider(username, password)
    res.json(result)
  }
})

router.post("/users/delete", checkAdmin, async (req, res) => {
  const { userId } = req.body
  const result = await UserManage.deleteUser(userId)
  res.json(result)
})

router.post("/users/resetPass", checkAdmin, async (req, res) => {
  const { userId } = req.body
  const result = await UserManage.resetPassword(userId)
  res.json(result)
})

router.post("/users/block", checkAdmin, async (req, res) => {
  const { userId } = req.body
  const result = await UserManage.changeStatusUser(userId, USER_STATUS.BLOCK)
  res.json(result)
})

router.post("/users/unblock", checkAdmin, async (req, res) => {
  const { userId } = req.body
  const result = await UserManage.changeStatusUser(userId, USER_STATUS.ACTIVE)
  res.json(result)
})

module.exports = router;
