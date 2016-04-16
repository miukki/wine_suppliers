module.exports = function(Model, options) {
  // Model is the model class
  Model.defineProperty('createdAt', {type: Date, default: '$now'});
  Model.defineProperty('updatedAt', {type: Date, default: '$now'});

  // update the updatedAt timestamp
  Model.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.updatedAt = new Date();
    } else {
      ctx.data.updatedAt = new Date();
    }
    next();
  });
}
