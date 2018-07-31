'use strict';

const consoleLogger = jest.genMockFromModule('../consoleLogger');

const noop = () => {};

consoleLogger.mockReturnValue({
	log: noop,
	info: noop,
	warn: noop,
	error: noop,
	success: noop,
	format: {
		bold: noop
	}
});

module.exports = consoleLogger;