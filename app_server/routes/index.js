var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
/*var homepageController = function (req,res) {
  /!*
    index represents name of template file to use---in this case referencing index.jade
    ,{} represents javascript object containing data for template to use
   *!/
  res.render('index',{title: 'Express'});
};*/
router.get('/',ctrlMain.index);

module.exports = router;
