/* eslint-disable no-console */
const chalk = require('chalk');

const MESSAGE_TYPES = {
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error',
	SUCCESS: 'success'
};

const log = (message, messageType = MESSAGE_TYPES.INFO) => {
	switch(messageType) {
		case MESSAGE_TYPES.ERROR:
			console.error(chalk.bold.red(message));
			break;
		case MESSAGE_TYPES.WARN:
			console.warn(chalk.yellow(message));
			break;
		case MESSAGE_TYPES.SUCCESS:
			console.log(chalk.green(message));
			break;
		default:
			console.log(message);
	}
};

const info = message => log(message);

const warn = message => log(message, MESSAGE_TYPES.WARN);

const error = message => log(message, MESSAGE_TYPES.ERROR);

const success = message => log(message, MESSAGE_TYPES.SUCCESS);

const format = {
	bold: chalk.bold
};

const consoleLogger = () => ({
	log,
	info,
	warn,
	error,
	success,
	format
});

module.exports = consoleLogger;