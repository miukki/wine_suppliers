'use strict';

//async migration to DBs: mySQL, mongoDs
var async = require('async');
var chance = require('chance').Chance();

// turn callbacks into promises
function create(model, objects) {
  return new Promise(function(resolve, reject) {
    //http://apidocs.strongloop.com/loopback/#persistedmodel-create
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

function createRoles(roles, Role) {
    var promises = roles.map(function(role) {
      return Role.create({name: 'role'});
    });

    return Promise.all(promises);
}

module.exports = function(app) {
  var mongoDs = app.dataSources.mongo;
  var memoryDs = app.dataSources.db;
  //add postgresql connector
  async.parallel([
      //for mongo connector, lists of functions:  function(callback) works in parallels
      function(callback){
        mongoDs.automigrate()
          .then(createRoles(['root', 'supplier'], app.models.Role))
          // .then(function () {
          //   var User = app.models.user;
          //   var Role = app.models.Role;
          //   var RoleMapping = app.models.RoleMapping;
          //   return User.create([{username: 'root', email: 'admin@admin.com', password: 'admin'}])
          //     .then(function (users) {
          //       console.log('Created admin user - ok');
          //       return Role.create({name: 'root'})
          //         .then(
          //           function (role) {
          //             console.log('Created role:', role);
          //             return role.principals.create({
          //               principalType: RoleMapping.USER,
          //               principalId: users[0].id
          //             });
          //           }).then(
          //           function (principal) {
          //             console.log('Created principal:', principal);
          //           });
          //     });
          // })
          .then(function(){
          //create countries
          return create(app.models.Country, [
              {name: 'France'},
              {name: 'Spain'},
              {name: 'New Zealand'},
              {name: 'Canada'},
              {name: 'Chile'},
              {name: 'Mexico'},
              {name: 'Peru'}
            ]);
        })

        .then(function(res){
       // regions belongs to country
        return create(app.models.Region, [
              {name: 'Pernambuco', countryId: res[0].id},
              {name: 'Catalan', countryId: res[1].id},
              {name: 'Santa Catarina', countryId: res[2].id},
              {name: 'British Columbia', countryId: res[3].id},
              {name: 'Aconcagua', countryId: res[4].id},
              {name: 'Aguascalientes', countryId: res[5].id},
              {name: 'Lima', countryId: res[6].id}
            ]);

        })
        .then(function(res){

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
