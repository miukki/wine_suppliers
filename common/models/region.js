"use strict";

module.exports = function (model) {
  model.validateFormatOf('id', {with: /[a-z][a-z-]+]/});
};
