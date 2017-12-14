#!/usr/bin/env node

require('dotenv').config();
const db = require('../db/config.js');

const request = require('request-promise');
const Model = require('../models/NewsTicker');

const newsApiKey = process.env.NEWS_API_KEY;
const MODULE_NAME = '[CRON:NEWS]';
const NEWS_TOP_HEADLIENS = 'top-headlines';
const NEWS_EVERYTHING = 'everything';

/**
 * Number of pages to retrive from news api
 * @type {number}
 */
const PAGES_NUM = 2;

let countAdded = 0;
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
                        .then((d) => {
                            console.log('Added new news', obj);
                            countAdded++;
                            resolve(d);
                        })
                        .catch((e) => {
                            console.log('Error inserting new news: ', obj);
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


let sendRequest = function (pageNum, section) {
    section = section || 'top-headlines';

    console.log('Fetching news for page: ' + pageNum + ', for section: ' + section);

    let options = {
        uri: 'https://newsapi.org/v2/' + section,
        qs: {
            apiKey: newsApiKey,
            q: search.join(','),
            sortBy: 'relevancy',
            page: pageNum
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    return new Promise((resolve, reject) => {

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
                        description: extractField(a, 'description'),
                        img_url: extractField(a, 'urlToImage'),
                        published_at: new Date(extractField(a, 'publishedAt')).toUTCString()
                    };

                    toDefer.push(findOrInsert(data));

                });

                Promise.all(toDefer)
                    .then(() => {
                        console.log(MODULE_NAME + ' News crone for page ' + pageNum + ' done. Section: ' + section);
                        resolve()
                    })
                    .catch((e) => {
                        console.log(e);
                        console.log(MODULE_NAME + ' Err happened while inserting new news. Page: ' + pageNum + ', Section: ' + section);
                        reject();
                    });


            })
            .catch((err) => {
                console.log(MODULE_NAME + ' Err happened while fetching news page ' + pageNum);
                console.log(err);
                reject();
            });

    });

};

let runCollector = function () {

    let toDefer = [];

    for (let i = 1; i <= PAGES_NUM; i++) {
        toDefer.push(sendRequest(i, NEWS_TOP_HEADLIENS));
        toDefer.push(sendRequest(i, NEWS_EVERYTHING));
    }

    Promise
        .all(toDefer)
        .then(() => {
            console.log('Finished news cron ticker job. New news added: ' + countAdded);
            db.destroy();
            process.exit(0);
        })
        .catch(() => {
            console.log(MODULE_NAME + ' Err happened in news ticker cron. New news added: ' + countAdded );
            process.exit(1);
        });

};

runCollector();
