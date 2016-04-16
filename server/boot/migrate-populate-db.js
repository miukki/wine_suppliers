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
      //for mongo connector
      function(callback){
        mongoDs.automigrate().then(function(){
          return Promise.all([
           // create Product
            create(app.models.Product, [
              {title: 'test1', description: '...bla'},
              {title: 'test2', description: 'something'}
            ]),
          //  create other data..
            create(app.models.Category, [
              {name: 'Category1'},
              {name: 'Category2'}
            ]),


          ]);
        }).then(function(res){
          callback(null, res);
        })

      },

      function(callback){
        memoryDs.automigrate().then(function(){
          return Promise.all([
           // create Product
            create(app.models.Product, [
              {title: 'test1', description: '...bla'},
              {title: 'test2', description: 'something'}
            ]),
          //  create other data..
            create(app.models.Category, [
              {name: 'Category1'},
              {name: 'Category2'}
            ]),


          ]);
        }).then(function(res){
          callback(null, res);
        })

      }
         //for new connector



  ],
  // optional callback
  function(err, results){
      if (err) throw err;
      console.log('results!!', results[0], results[1]);
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
  });
};
