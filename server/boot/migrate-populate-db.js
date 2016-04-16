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


module.exports = function(app) {
  var mongoDs = app.dataSources.mongo;

  mongoDs.automigrate().then(function(){
    return Promise.all([
     // create Product
      create(app.models.Product, [
        {title: 'test1', description: '...bla'},
        {title: 'test2', description: 'something'}
      ])

    ]);
  }).then(function(products){
    return mongoDs.automigrate().then(function(){
      return Promise.all([
     // create Category
        create(app.models.Category, [
          {name: 'Category1'},
          {name: 'Category2'}
        ])
      ]).then(function(categories) {
        return Array.prototype.concat(products, categories);
      });

    });


  }).then(function(result){
    const products = result[0];
    const categories = result[1];

    console.log('Models created successfully: \n', products, '\n', categories);
  }).catch(function(err) {
    throw err;
  });

};
