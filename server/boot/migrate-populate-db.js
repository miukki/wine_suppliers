'use strict';

//async migration to DBs: mySQL, mongoDs
var async = require('async');

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
        mongoDs.automigrate().then(function(){
          return Promise.all([
          //  create type..
            create(app.models.Type, [
              {title: 'white'},
              {title: 'red'},
              {title: 'rose'}

            ]),
          //  create  winery..
            create(app.models.Winery, [
              {name: 'Napa Valley'},
              {name: 'Salcheto'},
              {name: 'San Guido Sassicaia'}

            ]),
        // create grapes
            create(app.models.Grape, [
              {name: 'Cabernet franc'},
              {name: 'Merlot'},
              {name: 'Trempanillo'},
              {name: 'Chardonnay'},
              {name: 'Cabernec sauvignon'}
            ]),

            // countries
            create(app.models.Country, [
              {id: 1, name: 'France'},
              {id: 2, name: 'Spain'},
              {id: 3, name: 'New Zealand'},
            ]),
            // regions
            create(app.models.Region, [
              {name: 'Bordaux', countryId: 1},
              {name: 'Catalan', countryId: 2},
              {name: 'White', countryId: 3},
            ]),


          ]);
        }).then(function(res){
           // create wine items
           console.log('res', res[2][0].id);
           create(app.models.Product, [
              {title: 'Chateau Montelena', wineryId: res[1][0].id, typeId: res[0][0].id, description: 'In the glass, the aromatics lean toward the floral and citrus families with rose petals, lemon blossom, and just a hint of ripe melon sneaking ...', grapeIds: [res[2][0].id, res[2][1].id]},
              {title: 'Cliffside Cabernet', wineryId: res[1][1].id, typeId: res[0][1].id, description: 'A great gift for people who enjoy both reds and whites. Item 033...', grapeIds: [res[2][2].id, res[2][3].id, res[2][4].id]},
              {title: 'wine 1', regionId: 1, typeId: res[0][1].id, grapeIds: [res[2][0].id, res[2][1].id, res[2][4].id], description: 'wine 1 description', price: 250},
              {title: 'wine 2', regionId: 2, typeId: res[0][1].id, grapeIds: [res[2][2].id], description: 'wine 2 description', price: 95},
              {title: 'wine 3', regionId: 3, typeId: res[0][0].id, grapeIds: [res[2][3].id], description: 'wine 3 description', price: 145},
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
