const skeletor = () => {

	const configManager = require('./lib/configManager')();
	const taskRunner = require('./lib/taskRunner')();
	let logger = require('./lib/consoleLogger')();

	const setLogger = newLogger => {
		logger = newLogger;
	};

	const setConfig = config => {
		configManager.setConfig(config);
	};

	const getConfig = () => configManager.getConfig();

	const runTask = (taskName, options = {}) => {

		const config = configManager.getConfig();

		if(config === null) {
			const errorMsg = 'ERROR: No configuration specified';
			logger.error(errorMsg);
			return Promise.reject(errorMsg);
		}

		const taskConfig = configManager.getTaskConfig(taskName);

		if(taskConfig === undefined) {
			const errorMsg = `ERROR: Could not find task "${taskName}"`;
			logger.error(errorMsg);
			return Promise.reject(errorMsg);
		}

		if(!options.logger) {
			options.logger = logger;
		}

		return taskRunner.runTask(taskConfig, options, api);
	};

	const api = {
		getConfig,
		setConfig,
		setLogger,
		runTask
	};

	return api;
};

module.exports = skeletor;