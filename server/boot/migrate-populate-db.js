'use strict';

//async migration to DBs: mySQL, mongoDs
var async = require('async');
var chance = require('chance').Chance();
var countries = require('./data/countries.json');
var regions = require('./data/regions.json');
var _ = require('lodash');

// turn callbacks into promises
function create(model, objects) {
  //http://apidocs.strongloop.com/loopback/#persistedmodel-create
  return new Promise(function (resolve, reject) {
    model.create(objects, function (err, results) {
      if (err) {
        //add console.log Error, if Error validation is happened we will see it on details
        console.error(model.modelName, 'Error!\n', err, '\n\n\n');
        return reject(err);
      }
      console.log(model.modelName, 'created\n', results, '\n\n\n');
      resolve(results);
    });
  });
}


function createRoles(roles) {
    var promises = roles.map(function(role) {
      return app.models.Role.create({name: role});
    });
    return Promise.all(promises);
}

function createRegions(countries) {
    var promises = _.map(countries, function(country) {
      return create(app.models.Region, _.filter(regions, {'country_code': country.code}));
    });
    return Promise.all(promises);
}

module.exports = function(app) {
  var mongoDs = app.dataSources.mongo;
  //var memoryDs = app.dataSources.db;
  //add postgresql connector
  async.parallel([
      //for mongo connector, lists of functions:  function(callback) works in parallels
      function(callback) {
        mongoDs.automigrate()
          .then(function() {
            return createRoles(['root', 'supplier'], app.models.Role)
          })
          .then(function(){
          //create countries
            return create(app.models.Country, countries);
          })

        .then(function(resp){
        // regions belongs to country
        return createRegions(resp) 
        // create(app.models.Region, [
        //       {name: 'Pernambuco', countryId: res[0].id}
        //     ]);

        })
        .then(function(res){

          console.log('regions', res);

          return Promise.all([
          //  create type..
            create(app.models.Type, [
              {title: 'white'},
              {title: 'red'},
              {title: 'rose'}

            ]),
            //  create  winery belongs to region..
            create(app.models.Winery, [

              {name: 'Sebastiani 酒庄', regionId: res[0].id },
              {name: 'Ravenswood Winery', regionId: res[1].id},
              {name: 'Weingut Rademacher', regionId: res[2].id },
              {name: 'Schloss Vollrads', regionId: res[3].id },
              {name: 'Fewo Weingut Clauer', regionId: res[4].id },
              {name: 'Weingut Villa Wolf', regionId: res[5].id },
              {name: 'Gunderloch', regionId: res[6].id }
            ]),

            // create grapes
            create(app.models.Grape, [
              {name: 'Sangiovese'},
              {name: 'Merlot'},
              {name: 'Zinfandel'},
              {name: 'Chardonnay'},
              {name: 'Pinot noir'},
              {name: 'Cabernet sauvignon'},
              {name: 'Abouriou'},
              {name: 'Syrah'},
              {name: 'Malbec'},
              {name: 'Barbera'}
            ]),



          ]);
        })
        .then(function(res){
           // create wine items
           console.log('res', res[2][0].id);
           create(app.models.Product, [
              {year: chance.year({min: 1900, max: 2016}), title: 'Chateau Montelena', wineryId: res[1][0].id, typeId: res[0][0].id, description: 'In the glass, the aromatics lean toward the floral and citrus families with rose petals, lemon blossom, and just a hint of ripe melon sneaking ...', grapeIds: [res[2][0].id, res[2][1].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'Cliffside Cabernet', wineryId: res[1][1].id, typeId: res[0][1].id, description: 'A great gift for people who enjoy both reds and whites. Item 033...', grapeIds: [res[2][2].id, res[2][3].id, res[2][4].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'Vinstanto', wineryId: res[1][2].id, typeId: res[0][1].id, description: 'Aromatic white wines are defined by dominant floral aromas caused by a special ', grapeIds: [res[2][0].id, res[2][1].id, res[2][4].id], price: 250},
              {year: chance.year({min: 1900, max: 2016}), title: 'Amazoto', wineryId: res[1][3].id, typeId: res[0][1].id, description: 'Some wines have more of a bouquet than others, our friends at Drync and us are here ', grapeIds: [res[2][5].id], price: 95},
              {year: chance.year({min: 1900, max: 2016}), title: 'Ametistio', wineryId: res[1][4].id, typeId: res[0][0].id, description: 'Assyrtiko can also be used together with the aromatic Aidani and Athiri grapes for the production of the unique, naturally sweet wines called', grapeIds: [res[2][5].id], price: 145},
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
