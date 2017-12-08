#!/usr/bin/env node

require('dotenv').config();

const request = require('request-promise');
const newsApiKey = process.env.NEWS_API_KEY;
const MODULE_NAME = '[CRON:NEWS]';

// let search = ['bitcoin', 'cryptocurrency', 'cryptocoins'];
let search = ['bitcoin'];

if (!newsApiKey) {
    console.log(MODULE_NAME + ' NEWS_API_KEY not present, aborting.');
    process.exit(1);
}

let extractField = function (o, f) {
  return o[f] || '';
};

let options = {
    uri: 'https://newsapi.org/v2/everything',
    qs: {
        apiKey: newsApiKey,
        q: search.join(','),
        sortBy: 'popularity'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};

request(options)
    .then((body) => {

        let articles = body.articles || [];

        let data = {
            url: '',
            source_id: '',
            source_name: '',
            author: '',
            title: '',
            description: '',
            img_url: '',
            published_at: ''
        };

    })
    .catch((err) => {
        console.log(MODULE_NAME + ' Err happened in news ticker cron.');
        console.log(err);
        process.exit(1);
    });

