/* eslint-disable no-console */

const MESSAGE_TYPES = {
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error'
};

const log = (message, messageType = MESSAGE_TYPES.INFO) => {
	switch(messageType) {
		case MESSAGE_TYPES.ERROR:
			console.error(message);
			break;
		case MESSAGE_TYPES.WARN:
			console.warn(message);
			break;
		default:
			console.log(message);
	}
};

const info = message => {
	log(message);
};

const warn = message => {
	log(message, MESSAGE_TYPES.WARN);
};

const error = message => {
	log(message, MESSAGE_TYPES.ERROR);
};

const consoleLogger = () => ({
	log,
	info,
	warn,
	error
});

module.exports = consoleLogger;