exports.seed = function(knex, Promise) {
  // Initial seed data
  var prices = [];

  var news = [];

  return knex('news_ticker').del()
    .then(function(){
      return knex('price_ticker').del()
    }).then(function(){
      return knex('price_ticker').insert(prices, 'id')
    }).then(function(){
      return knex('news_ticker').insert(news, 'id');
    });

};
