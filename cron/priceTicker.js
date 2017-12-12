#!/usr/bin/env node
require('dotenv').config();

const db = require('../db/config.js');
const PriceTicker = require('../models/PriceTicker');
const MODULE_NAME = '[CRON:PRICE:BTC]';

const Kraken = require('kraken-js-client');

const Ticker = new Kraken.Kraken({
    retryCount: 5
}).Ticker;

const parts = Kraken.TickerParts;
const PAIR = 'XBTUSD';

Ticker
    .getSinglePairTicker(PAIR)
    .then((ticker) => {

        const [closePrice, closePriceVolume] = ticker.getParts([parts.ClosePrice, parts.CloseLotVolume]);
        const spread = ticker.getAskPrice() - ticker.getBidPrice();

        const openPrice = ticker.getPart(parts.OpenPrice);

        let data = {
            ask_price: ticker.getAskPrice(),
            bid_price: ticker.getBidPrice(),
            price: parseFloat(closePrice),
            close_price: parseFloat(closePrice),
            close_price_volume: parseFloat(closePriceVolume),
            spread: parseFloat(spread),
            open_price: parseFloat(openPrice),
            source_id: 1,
            type: 'BTC'
        };

        console.log(MODULE_NAME + ' Data to store: ', data);

        PriceTicker
            .query()
            .insertAndFetch(data)
            .then((Tick) => {
                console.log(MODULE_NAME + ' Inserted Tick: ', Tick);
                process.exit(0);
            }).catch((err) => {
                console.log(MODULE_NAME + ' Err happened while storing tick into db.');
                console.log(err);
                process.exit(1);
            });

    })
    .catch((err) => {
        console.log(MODULE_NAME + ' Err happened in price ticker cron.');
        console.log(MODULE_NAME, err);
        process.exit(1);
    });

