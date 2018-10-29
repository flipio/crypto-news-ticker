var TSV = require('tsv');
TSV.header = false;

var BigNumber = require('../util/BigNumber');


const calculateControlNumber = function(num) {
    const _n = new BigNumber(num)
        .mul(100)
        .div(97);

    const _t = new BigNumber(num).mul(100);
    const temp = _n.floor();
    const _res = _t.sub(temp.mul(97));
    const result = new BigNumber(98).sub(_res).toString();

    return result.length === 1 ? '0' + result : result;
};

const getFullCount = function (c) {
    const c_arr = c.toString().split('');

    while(c_arr.length < 6) {
        c_arr.unshift('0');
    }

    return c_arr.join('');
}

const generate = (data) => {

    const counter_start = data.counter_start;
    const amount = data.amount;
    const cityIdentifier = data.identifier;
    const cityName = data.name;

    const randCNum = data.rand_c_num || 9; // za 2018 = 8, za 2019 = 9
    const entriesPerBlock = data.entries_per_block || 50;

    const baseNum = `60110521${cityIdentifier}${randCNum }`;

    const result = [];

    for (let i = counter_start; i < counter_start + amount * entriesPerBlock; i++) {
        const _res = [];
        const counter = getFullCount(i);
        const num = baseNum + counter;
        const c_num = calculateControlNumber(num);

        _res.push(counter);

        const template = `${c_num}-601-10521-${cityIdentifier}-${randCNum }-${counter}`;
        _res.push(template);

        result.push(_res);
    }

    return TSV.stringify(result);

};

module.exports = {
    generate: generate,
};