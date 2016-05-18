'use strict';

module.exports = function(Product) {

  Product.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    //req.body.supplierId = req.accessToken.userId;
    next();
  });

};
