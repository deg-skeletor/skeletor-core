const path = require('path');
const { formatDuration } = require('./formatters'); 

function runTask(taskConfig, options, api) {
	const {logger} = options;

	logger.info(`Starting ${logger.format.bold(taskConfig.name)} task...`);

	if(!Array.isArray(taskConfig.subTasks) && !Array.isArray(taskConfig.plugins)) {
		logger.info(`Task  ${logger.format.bold(taskConfig.name)} has no subTasks or plugins.`);
		return Promise.resolve({
			taskName: taskConfig.name
		});
	}

	const startTime = Date.now();

	setEnvironment(taskConfig);

	let runPromise;

	if(taskConfig.subTasks) {
		runPromise = runSubTasks(taskConfig.subTasks, options, api)
			.then(results => buildTaskResult(taskConfig.name, results, 'subTasks', startTime));
	} else {
		runPromise = runPlugins(taskConfig.plugins, options, api)
			.then(results => buildTaskResult(taskConfig.name, results, 'plugins', startTime));
	}

	return runPromise.then(taskResult => {
		logTaskResult(taskResult, logger);
		return taskResult;
	});
}

function setEnvironment(taskConfig) {
	if(taskConfig.environment) {
		process.env.NODE_ENV = taskConfig.environment;
	}
}

function buildTaskResult(taskName, results, resultsType, startTime) {
	let status;
	if(areResultsComplete(results)) {
		status = 'complete';
	} else if(doResultsHaveErrors(results)) {
		status = 'error';
	}

	return {
		taskName,
		status,
		duration: Date.now() - startTime,
		[resultsType]: results
	};
}

function logTaskResult(taskResult, logger) {
	if(taskResult.status === 'complete') {
		logger.success(`Finished ${logger.format.bold(taskResult.taskName)} task after ${formatDuration(taskResult.duration)}.`);
	} else if(taskResult.status === 'error') {
		logger.error(`Task ${logger.format.bold(taskResult.taskName)} encountered an error.`);
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
	const pluginFilepath = path.resolve(process.cwd(), 'node_modules', pluginConfig.name);

	const plugin = require(pluginFilepath);

	return plugin().run(pluginConfig.config, options, api)
		.then(result => {
			return {
				pluginName: pluginConfig.name,
				status: result.status,
				message: result.message
			};
		})
		.catch(e => {
			options.logger.error(`Plugin ${options.logger.format.bold(pluginConfig.name)} encountered an error: ${e}`);

			return {
				pluginName: pluginConfig.name,
				status: 'error',
				error: e
			};
		});
}

exports.runTask = runTask;