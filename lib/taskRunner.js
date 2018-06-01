const path = require('path');

function runTask(taskConfig, options, api) {
	const {logger} = options;

	logger.info(`Running "${taskConfig.name}" task...`);

	const taskResult = {
		taskName: taskConfig.name
	};

	if(!Array.isArray(taskConfig.subTasks) && !Array.isArray(taskConfig.plugins)) {
		logger.info(`Task "${taskConfig.name}" has no subTasks or plugins.`);
		return Promise.resolve(taskResult);
	}

	let runPromise;

	if(taskConfig.subTasks) {
		runPromise = runSubTasks(taskConfig.subTasks, options, api)
			.then(results => buildTaskResult(taskConfig.name, results, 'subTasks'));
	} else {
		runPromise = runPlugins(taskConfig.plugins, options, api)
			.then(results => buildTaskResult(taskConfig.name, results, 'plugins'));
	}

	return runPromise.then(taskResult => {
		logTaskResult(taskResult, logger);
		return taskResult;
	});
}

function buildTaskResult(taskName, results, resultsType) {
	let status;
	if(areResultsComplete(results)) {
		status = 'complete';
	} else if(doResultsHaveErrors(results)) {
		status = 'error';
	}

	return {
		taskName,
		status,
		[resultsType]: results
	};
}

function logTaskResult(taskResult, logger) {
	if(taskResult.status === 'complete') {
		logger.info(`Task "${taskResult.taskName}" is complete.`);
	} else if(taskResult.status === 'error') {
		logger.error(`Task "${taskResult.taskName}" encountered an error.`);
	}
}

function areResultsComplete(results) {
	return results.every(result => result.status === 'complete');
}

function doResultsHaveErrors(results) {
	return results.some(result => result.status === 'error');
}

function runSubTasks(subTasks, options, api) {
	const filteredSubTasks = filterSubTasks(subTasks, options.subTasksToInclude);

	return Promise.all(filteredSubTasks.map(subTask => runTask(subTask, options, api)));
}

function filterSubTasks(subTasks, subTasksToInclude = []) {
	return subTasksToInclude && subTasksToInclude.length ?
		subTasks.filter(subTask => subTasksToInclude.includes(subTask.name)) :
		subTasks;
}

function runPlugins(plugins, options, api) {
	return Promise.all(plugins.map(pluginConfig => runPlugin(pluginConfig, options, api)));
}

function runPlugin(pluginConfig, options, api) {
	options.logger.info(`Running plugin "${pluginConfig.name}"...`);

	const pluginFilepath = path.resolve(process.cwd(), 'node_modules', pluginConfig.name);

	const plugin = require(pluginFilepath);

	return plugin().run(pluginConfig.config, options, api)
		.then(result => {
			if(result.status === 'complete') {
				options.logger.info(`Plugin "${pluginConfig.name}" is complete.`);
			}

			return {
				pluginName: pluginConfig.name,
				status: result.status,
				message: result.message
			};
		})
		.catch(e => {
			options.logger.error(`Plugin "${pluginConfig.name}" encountered an error: ${e}`);

			return {
				pluginName: pluginConfig.name,
				status: 'error',
				error: e
			};
		});
}

exports.runTask = runTask;