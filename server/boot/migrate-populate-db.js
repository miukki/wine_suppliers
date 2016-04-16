'use strict';

//async migration to DBs: mySQL, mongoDs
var async = require('async');
var chance = require('chance').Chance();
var _ = require('lodash');
var slug = require('slug')

module.exports = function(app) {
  var pg = app.dataSources.pg;
  var countries, provinces;

  pg.automigrate()
    .then(function(){
      countries = chance.pickset(chance.countries(), 20).map((data) => {
          return {
            'id': data['abbreviation'],
            'name': data['name']
          };
      });

      return app.models.Country.create(countries);
    })
    .then(function(countries){
      provinces = _.times(50, () => {
        let last = chance.last();
        return {
          'id': slug(last),
          'name': last
        };
      });

      return app.models.Region.create(provinces);
    })
    .then(function(provinces){
      return app.models.Category.create([
        {'id': 'red', 'name': 'Red'},
        {'id': 'white', 'name': 'White'},
        {'id': 'rose', 'name': 'Rose'}
      ]);
    })
    .then(function (types) {
      var products = _.times(1000, function() {
        return {
          "name": chance.last() + ' ' + chance.pickset(['Pinot', 'Chardonnay', 'Sauvignon', 'Merlot']),
          "description": chance.paragraph({sentences: 5}),
          "year": chance.year({min: 1900, max: 2016})
          "average_price": chance.integer({min: 20, max: 10000})
        };
      }));

      return app.models.Product.create(products);
    })
    .catch(function(err) {
      throw err;
    });

};
