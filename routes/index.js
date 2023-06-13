var express = require('express');
var router = express.Router();
const Subject = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/subjects/all", async (req, res) => {
  const subjects = await Subject.findAll()
  res.json({value: subjects})
})


module.exports = router;
