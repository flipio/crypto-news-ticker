var express = require('express');
var router = express.Router();

// Require controllers

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', {title: 'Express-Boilerplate'});
    res.status(404).json({status: 404, message: 'NOT FOUND'});
});

module.exports = router;
