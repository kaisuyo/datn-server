var express = require('express');
var router = express.Router();
const {Subject} = require('../models/index');
const { checkAdmin } = require('./middlewave');

router.get("/all", async (req, res) => {
  const subjects = await Subject.findAll()
  res.json({value: subjects, message: "Tải dữ liệu thành công"})
})

router.post("/create", checkAdmin, async (req, res) => {
  const { title, description } = req.body
  try {
    const newSubject = await Subject.create({title, description})
    res.json({value: newSubject, message: "Tạo môn học thành công"})
  } catch (e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình tạo môn học"})
  }
})

router.post("/delete", checkAdmin, async (req, res) => {
  const { subjectId } = req.body
  try {
    await Subject.destroy({where: {subjectId}})
    res.json({value: {}, message: "Xóa môn học thành công"})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình xóa môn học"})
  }
})

router.post("/edit", checkAdmin, async (req, res) => {
  const { subjectId, title, description } = req.body
  try {
    const updated = await Subject.update({title, description}, {where: {subjectId}})
    res.json({value: updated, message: "Thay đổi môn học thành công"})
  } catch(e) {
    res.json({value: null, message: "Có lỗi khi sửa thông tin môn học"})
  }
})

module.exports = router;
