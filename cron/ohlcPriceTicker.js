#!/usr/bin/env node
require('dotenv').config();
const _ = require('lodash');
const db = require('../db/config.js');
const Model = require('../models/OHLCTicker');
const MODULE_NAME = '[CRON:OHLC:BTC]';

const Kraken = require('kraken-js-client');

const OHLC = new Kraken.Kraken({
    logLevel: 'debug',
    retryCount: 5
}).OHLC;

let findOrInsert = function (obj) {

    return new Promise((resolve, reject) => {
        console.log(obj.time);
        Model
            .query()
            .where('time', obj.time)
            .then((ticks) => {

                if (ticks.length === 0) {

                    console.log(MODULE_NAME + ' Adding ohlc tick: ', obj);

                    Model
                        .query()
                        .insert(obj)
                        .then((d) => {
                            console.log('Added new ohcl tick', obj);
                            resolve(d);
                        })
                        .catch((e) => {
                            console.log('Error inserting new ohcl tick: ', obj);
                            console.log(e);
                            reject(e);
                        });

                } else {
                    console.log('ohcl tick allready exist, skip inserting.', obj.time);
                    resolve();
                }
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        });

};

const PAIR = 'XXBTZUSD';

OHLC
    .get(PAIR, {
        interval: 1
    })
    .then((response) => {
        const toDefer = [];

        _.forEach(response[PAIR], (d) => {
            console.log('Date: ', new Date(d.time * 1000).toUTCString());

            let data = {
                'open_price': d.open,
                'close_price': d.close,
                'volume': d.volume,
                'high_price': d.high,
                'low_price': d.low,
                'volume_weighted_average_price': d.volumeWeightedAveragePrice,
                'count': d.count,
                'time': new Date(d.time * 1000).toUTCString(),
                'type': 'BTC',
                'source_id': 1
            };

            toDefer.push(findOrInsert(data, d.time));

        });

        Promise
            .all(toDefer)
            .then(() => {
                console.log(MODULE_NAME + ' Finished ohlc ticker cron.');
                db.destroy();
                process.exit(0);
            })
            .catch(() => {
                console.log(MODULE_NAME + ' Err happened in ohlc price ticker cron while inserting into DB.');
                db.destroy();
                process.exit(1);
            });


    })
    .catch((err) => {
        console.log(MODULE_NAME + ' Err happened in ohlc price ticker cron.');
        console.log(MODULE_NAME, err);
        process.exit(1);
    });

