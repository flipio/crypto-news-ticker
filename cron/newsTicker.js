#!/usr/bin/env node

require('dotenv').config();
const db = require('../db/config.js');

const request = require('request-promise');
const Model = require('../models/NewsTicker');

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

let findOrInsert = function (obj) {
    return new Promise((resolve, reject) => {
            Model
            .query()
            .where('source_name', obj.source_name)
            .where('author', obj.author)
            .where('title', obj.title)
            .where('published_at', obj.published_at)
            .then((news) => {

                if (news.length === 0) {

                    console.log(MODULE_NAME + ' Adding news: ', obj);

                    Model
                        .query()
                        .insert(obj)
                        .then(resolve)
                        .catch((e) => {
                            console.log(obj);
                            reject(e);
                        });
                } else {
                    console.log('News allready exist, skip inserting.', obj.title, obj.author);
                    resolve();
                }
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
    });

};

let options = {
    uri: 'https://newsapi.org/v2/everything',
    qs: {
        apiKey: newsApiKey,
        q: search.join(','),
        sortBy: 'relevancy',
        page: 1
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};

request(options)
    .then((body) => {

        let articles = body.articles || [];

        let toDefer = [];
        articles.forEach((a) => {

            let data = {
                url: extractField(a, 'url'),
                source_id: extractField(a.source, 'id'),
                source_name: extractField(a.source, 'name'),
                author: extractField(a, 'author'),
                title: extractField(a, 'title'),
                description: extractField(a,'description'),
                img_url: extractField(a, 'urlToImage'),
                published_at: new Date(extractField(a, 'publishedAt')).toUTCString()
            };

            toDefer.push(findOrInsert(data));

        });

        Promise.all(toDefer)
            .then(() => {
                console.log(MODULE_NAME + ' News crone done.');
                db.destroy();
                process.exit(0)
            })
            .catch((e) => {
                console.log(e);
                console.log(MODULE_NAME + ' Err happened while inserting new news.');
                process.exit(1);
            });

    })
    .catch((err) => {
        console.log(MODULE_NAME + ' Err happened in news ticker cron.');
        console.log(err);
        process.exit(1);
    });

