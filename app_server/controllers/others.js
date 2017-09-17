var request = require('request');

/* Get 'about' page*/
module.exports.about = function (req, res) {
    res.render('generic-text', {title: 'About'});
};