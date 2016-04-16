"use strict";

module.exports = function (model) {
  model.validateFormatOf('id', {with: /[A-Z][A-Z]/});
};
