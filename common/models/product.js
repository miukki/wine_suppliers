"use strict";

module.exports = function (model) {
  model.validateFormatOf('year', {with: /[1-2][0-9][0-9][0-9]]/});
};
