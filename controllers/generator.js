var express = require('express');
var Generator = require('../generator');
var router = express.Router();

const validateType = (value, type) => {
    return typeof value === type;
};

const validatePayload = (payload) => {
    let valid = {valid: true, field: null};
    const fields = [{key: 'name', type: 'string'}, {key: 'amount', type: 'number'}, {key: 'identifier', type: 'number'}, {key: 'counter_start', type: 'number'}];

    fields.forEach((value) => {
        if (!validateType(payload[value.key], value.type)) {
            valid.valid = false;
            valid.field = value.key;
        }
    });

    return valid;
};

router.post('/', function (req, res) {
    let data = req.body;

    const valid = validatePayload(data);
    if (!valid.valid) {
        return res.status('500').json({
            status: 'ERROR',
            error: `Field: "${valid.field}" missing or invalid.`
        });
    }

    if (data.amount > 30) {
        return res.status('500').json({
            status: 'ERROR',
            error: `Amount needs to be < 30.`
        });
    }

    let tsv;

    try {
        tsv = Generator.generate(data);
    } catch (e) {
        console.error(e);
        return res.status('500').json({
            status: 'ERROR Generating results',
            error: e.message
        });
    }

    return res.json(tsv);
});

module.exports = router;
