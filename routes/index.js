var express = require('express');
var router = express.Router();

// Require controllers

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express-Boilerplate'});
});

module.exports = router;
