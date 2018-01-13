var express = require('express');
var router = express.Router();
var Traps = require('../models/Traps');
var Q = require('q');

var insertOrUpdate = function (data) {
    var deferred = Q.defer();

    Traps
        .query()
        .where('nickname', data.nickname)
        .then((records) => {

            if (records.length !== 0) {

                if (records[0].record <= data.record) {
                    return deferred.resolve(records[0])
                }

                Traps
                    .query()
                    .update(data)
                    .where('nickname', data.nickname)
                    .then(() => {
                        console.log('Updated record', data);
                        deferred.resolve(data);
                    })
                    .catch((e) => {
                        console.log('Error inserting new record: ', data);
                        console.log(e);
                        deferred.reject(e);
                    });

            } else {

                Traps
                    .query()
                    .insert(data)
                    .then((d) => {
                        console.log('Added new record', data);
                        deferred.resolve(d);
                    })
                    .catch((e) => {
                        console.log('Error inserting new record: ', data);
                        console.log(e);
                        deferred.reject(e);
                    });
            }

        });

    return deferred.promise;
};

router.get('/leaderboard', function (req, res, next) {
    Traps
        .query()
        .orderBy('record')
        .limit(10)
        .then(function (data) {
            res.status(200).json({
                status: 'OK',
                data: data
            })
        });
});

router.post('/leaderboard', function (req, res, next) {
    let data = req.body;

    if (!data.nickname || typeof data.nickname !== 'string') {
        return res.status('500').json({
            status: 'ERROR',
            error: 'Nickname required. Accepts type string.'
        });
    }

    if (!data.record || typeof data.record !== 'number') {
        return res.status('500').json({
            status: 'ERROR',
            error: 'Nickname required. Accepts type string.'
        });
    }

    insertOrUpdate({
        nickname: data.nickname,
        record: data.record
    }).then((record) => {
        res.json({
            status: 'OK',
            message: 'Successful inserted/updated record.',
            data: record
        })
    })
    .catch((err) => {
        res.json({
            status: 'ERROR',
            error: err,
            message: 'Insert of a new record failed.'
        })
    })


});

module.exports = router;
