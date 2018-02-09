const skeletor = () => {

	const configManager = require('./lib/configManager')();
	const taskRunner = require('./lib/taskRunner')();

	const setConfig = config => {
		configManager.setConfig(config);
	};

	const getConfig = () => {
		return configManager.getConfig();
	};

	const runTask = (taskName, options) => {

		const config = configManager.getConfig();

		if(config === null) {
			const errorMsg = 'ERROR: No configuration specified';
			console.error(errorMsg);
			return Promise.reject(errorMsg);
		}

		const taskConfig = configManager.getTaskConfig(taskName);

		if(taskConfig === undefined) {
			const errorMsg = `ERROR: Could not find task "${taskName}"`;
			console.error(errorMsg);
			return Promise.reject(errorMsg);
		}

		return taskRunner.runTask(taskConfig, options);
	};

	return {
		getConfig,
		setConfig,
		runTask
	};
};

module.exports = skeletor;