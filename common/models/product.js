'use strict';
var parse = require('csv-parse');
var multiparty = require('multiparty');
var fs = require('fs');

module.exports = function(Product) {

  //http://loopback.io/doc/en/lb2/Using-current-context.html#use-current-authenticated-user-in-remote-methods
  //how to use context
  Product.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    req.body.supplierId = req.accessToken.userId;
    next();
  });

  /**
   * Upload csv file
   * @param {Function(Error)} callback
   */
  //https://github.com/strongloop/loopback/issues/1087
  Product.uploadFile = function(req, res, cb) {
    var Winery = Product.app.models.Winery;

    parseCsv(req, function (err, data) {
      if (err || !data || data.length === 0) {
        return cb({error: err, code: 'parse_csv_error'}, null);
      }
      var parsedData = parseDataFromTbl(data);
      var iterator = getIterator(parsedData, Product);
      var wineryId = '5995f70601a4b2db36e2e884'; //TODO получить winnery id
      saveData(iterator, wineryId, Product).then(
        function () {

          var result = {created: 0, errors: 0};

          result.items = parsedData.map(function (item) {
            if (item.errors) {
              result.errors ++;
              return {created: false,  errors: item.errors};
            } else {
              result.created++;
              return {created: 'ok'};
            }
          });

          cb(null, result);
        },
        function (err) {
          cb(err);
        });

    });
  };
};


function getIterator(arr) {

  var index = 0;
  var length = arr.length;
  var isFinish;
  return {
    next: function () {
      index ++;
      isFinish = index >= length;
      index = isFinish ? length : index;

      return {
        value: arr[index - 1],
        isFinish: index === length
      };
    }
  };
}


function saveData(items, wineryId, Product) {
  var item = items.next() || {value: {}};
  item.value.wineryId = wineryId;
  var promises = [getGrapesAndType(item, Product).then(
    function (result) {
      var errors = {
        'type': result[1].length === 0 ? 'Wrong type' : '',
        'grapes': result[0].length === 0 || result[0].length !== item.value.grapes.split(',').length ? 'Wrong grapes': ''
      };
      if (errors.type || errors.grapes) {
        errors.fields = {type: item.value.type, grapes: item.value.grapes};
        item.value.errors = errors;
        return item.value.errors;
      }

      item.value.typeId = result[1][0].id;
      item.value.grapeIds = result[0].map(function (model) {
        return model.id;
      });

      return Product.create(item.value).then(
        function (product) {
          console.log('Created Product: ', product);
          return product;
        },
        function (err) {
          item.value.error = err;
          return err;
        }
      );
    },
    function (err) {
      item.value.error = err;
      return err;
    }
  )];

  if (!item.isFinish) {
    promises.push(saveData(items, wineryId, Product));
  }

  return Promise.all(promises);
}

function getGrapesAndType(item, Product) {
  var Grape = Product.app.models.Grape;
  var Type = Product.app.models.Type;

  var grapes = (item.value.grapes && item.value.grapes.toString() || '')
    .split(',')
    .map(function (grape) { return { name: grape }; });

  var grapesPromise = Grape.find({where: {'or': grapes}});
  var typePromise = Type.find({where: {title: item.value.type}});

  return Promise.all([grapesPromise, typePromise]);
}

function parseDataFromTbl(data) {
  var headers = data.shift();
  var result = data.map(function (item) {
    var prod = {};
    for (var i = headers.length; i--;) {
      prod[headers[i]] = item[i];
    }
    return prod;
  });

  return result;
}


function parseCsv(req, cb) {
  var output = [];

  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) {
      return  cb('Invalid form data');
    }

    Object.keys(fields).forEach(function(name) {
      console.log('got field named ' + name);
    });

    Object.keys(files).forEach(function(name) {
      console.log('got file named ' + name);
    });

    //TODO here past winery ID and delimiter from form fields
    var parser = parse({delimiter: ';'});

    fs.createReadStream(files.file[0].path).pipe(parser);

    parser.on('readable', function() {
      var record;
      while(record = parser.read()) {
        output.push(record);
      }
    });

    parser.on('error', function(err) {
      console.log(err.message);
      cb(err.message);
    });

    parser.on('finish', function() {
      cb(null, output);
    });
  });
}
