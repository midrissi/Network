﻿var result = {};result.extend = function extend(target, source) {    for (var prop in source)        if (prop in target)            extend(target[prop], source[prop]);        else            target[prop] = source[prop];    return target;}module.exports = result;