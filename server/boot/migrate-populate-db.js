'use strict';

//async migration to DBs: mySQL, mongoDs
var async = require('async');
var chance = require('chance').Chance();

// turn callbacks into promises
function create(model, objects) {
  return new Promise(function(resolve, reject) {
    model.create(objects, function (err, results) {
      if (err) {
        //add console.log Error, if Error validation is happened we will see it on details
        console.log('Error!', err);
        return reject(err);
      };
      resolve(results);
    });
  });
};

function parallel() {
  return new Promise(function(resolve, reject){

  })
}

module.exports = function(app) {
  var mongoDs = app.dataSources.mongo;
  var memoryDs = app.dataSources.db;
  //add postgresql connector
  async.parallel([
      //for mongo connector, lists of functions:  function(callback) works in parallels
      function(callback){
        mongoDs.automigrate()
        .then(function(){
          //create countries
          return create(app.models.Country, [
              {name: 'France'},
              {name: 'Spain'},
              {name: 'New Zealand'}
            ]);
        })

        .then(function(res){
       // regions belongs to country
        return create(app.models.Region, [
              {name: 'Bordaux', countryId: res[0].id},
              {name: 'Catalan', countryId: res[1].id},
              {name: 'White', countryId: res[2].id}
            ]);

        })
        .then(function(res){

         console.log('res!', res);

          return Promise.all([
          //  create type..
            create(app.models.Type, [
              {title: 'white'},
              {title: 'red'},
              {title: 'rose'}

            ]),
          //  create  winery belongs to region..
            create(app.models.Winery, [
              {name: 'winery1', regionId: res[0].id },
              {name: 'winery2', regionId: res[1].id},
              {name: 'winery3', regionId: res[2].id }
            ]),

        // create grapes
            create(app.models.Grape, [
              {name: 'Cabernet franc'},
              {name: 'Merlot'},
              {name: 'Trempanillo'},
              {name: 'Chardonnay'},
              {name: 'Cabernec sauvignon'}
            ]),



          ]);
        })
        .then(function(res){
           // create wine items
           console.log('res', res[2][0].id);
           create(app.models.Product, [
              {year: chance.year({min: 1900, max: 2016}), title: 'Chateau Montelena', wineryId: res[1][0].id, typeId: res[0][0].id, description: 'In the glass, the aromatics lean toward the floral and citrus families with rose petals, lemon blossom, and just a hint of ripe melon sneaking ...', grapeIds: [res[2][0].id, res[2][1].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'Cliffside Cabernet', wineryId: res[1][1].id, typeId: res[0][1].id, description: 'A great gift for people who enjoy both reds and whites. Item 033...', grapeIds: [res[2][2].id, res[2][3].id, res[2][4].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'title1', wineryId: res[1][2].id, typeId: res[0][1].id, description: 'wine 1 description', grapeIds: [res[2][0].id, res[2][1].id, res[2][4].id], price: 250},
              {year: chance.year({min: 1900, max: 2016}), title: 'title2', wineryId: res[1][2].id, typeId: res[0][1].id, description: 'wine 2 description', grapeIds: [res[2][2].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'title3', wineryId: res[1][2].id, typeId: res[0][0].id, description: 'wine 3 description', grapeIds: [res[2][3].id], price: 145},
            ]).then(function(wines){
              callback(null, res.concat(wines));
            }).catch(function(err){
              callback(err);
            })

        }).catch(function(err){
          callback(err);
        })

      },
         //for new (perhpas other) connector, if in future we want to use new  DBs
      function(callback){
        mongoDs.automigrate().then(function(){
          return Promise.all([
          //  example how to use other connector


          ]);
        }).then(function(res){
          callback(null, res);
        }).catch(function(err){
          callback(err);
        })

      }



  ],
  // optional callback
  function(err, results){
      if (err) throw err;
      console.log('data created successfully!', results);
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
  });
};
