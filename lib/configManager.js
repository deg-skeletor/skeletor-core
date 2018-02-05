const path = require('path');
const fs = require('fs');

const defaultConfigFilepath = './skeletor.config.js';
	
const loadConfigFile = () => {
	const configFilepath = path.resolve(process.cwd(), defaultConfigFilepath);

	try {
		fs.accessSync(configFilepath);
		return require(configFilepath);
	} catch (e) {
	 	return null;
	}
}

module.exports = configManager = () => {
	let config = null;

	const getConfig = () => {
		if(config === null) {
			config = loadConfigFile();
		}

		return config;
	}

	const setConfig = cfg => {
		config = cfg;
	}

	const getTaskConfig = taskName => {
		if(config === null) {
			throw new Error('No configuration specified');
		}
		return config.tasks.find(task => task.name === taskName);
	}

	return {
		getConfig,
		setConfig,
		getTaskConfig
	};
}