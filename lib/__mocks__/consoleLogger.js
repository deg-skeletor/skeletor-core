'use strict';

const consoleLogger = jest.genMockFromModule('../consoleLogger');

const noop = () => {};

consoleLogger.mockReturnValue({
	log: noop,
	info: noop,
	warn: noop,
	error: noop
});

module.exports = consoleLogger;