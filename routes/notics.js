var express = require('express');
var router = express.Router();
const { Notic } = require('../models/index');
const { checkAuth } = require('./middlewave');

router.get("/all", checkAuth, async (req, res) => {
  try {
    const notics = await Notic.findAll({userId: req.user.userId})
    res.json({value: notics})
  } catch(e) {
    console.error(e);
    res.json({value: null, message: "Có lỗi khi lấy thông tin"})
  }
})

router.get("/read:noticId", checkAuth, async (req, res) => {
  try {
    const notic = await Notic.update({status: 1}, {where: {noticId: req.params.noticId, userId: req.user.userId}})
    res.json({value: notic})
  } catch(e) {
    console.error(e);
    res.json({value: null, message: "Có lỗi khi lấy thông tin"})
  }
})

router.get("/delete:noticId", checkAuth, async (req, res) => {
  try {
    await Notic.destroy({where: {noticId: req.params.noticId}})
    res.json({value: true})
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi khi xóa thông báo"})
  }
})

module.exports = router;
