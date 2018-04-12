'use strict';

const path = jest.genMockFromModule('path');

const resolve = (...args) => args[args.length - 1];

path.resolve = resolve;

module.exports = path;