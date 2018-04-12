const path = require('path');

const runTask = (taskConfig, options, api) => {
	const {logger} = options;

	logger.info(`Running "${taskConfig.name}" task`);

	const resultObj = {
		taskName: taskConfig.name,
		status: 'complete'
	};

	if(!Array.isArray(taskConfig.subTasks) && !Array.isArray(taskConfig.plugins)) {
		logger.info(`Task "${taskConfig.name}" has no subTasks or plugins`);
		return Promise.resolve(resultObj);
	}
	const result = taskConfig.subTasks ?
		runSubTasks(taskConfig.subTasks, options, api) :
		runPlugins(taskConfig.plugins, options, api);

	return result.then(statusObj => {
		logger.info(`Task "${taskConfig.name}" is complete`);
		return {...resultObj, ...statusObj};
	});
};

const runSubTasks = (subTasks, options, api) => {
	const filteredSubTasks = filterSubTasks(subTasks, options.subTasksToInclude);

	return Promise.all(
			filteredSubTasks.map(subTask => runTask(subTask, options, api))
		)
		.then(statuses => ({subTasks: statuses}));
};

const filterSubTasks = (subTasks, subTasksToInclude = []) =>
	subTasksToInclude && subTasksToInclude.length ?
		subTasks.filter(subTask => subTasksToInclude.includes(subTask.name)) :
		subTasks;

const runPlugins = (plugins, options, api) =>
	Promise.all(plugins.map(pluginConfig => runPlugin(pluginConfig, options, api)))
		.then(statuses => (
			{
				plugins: statuses
			}
	));

const runPlugin = (pluginConfig, options, api) => {
	options.logger.info(`Running "${pluginConfig.name}" plugin`);

	const pluginFilepath = path.resolve(process.cwd(), 'node_modules', pluginConfig.name);

	const plugin = require(pluginFilepath);

	return plugin().run(pluginConfig.config, options, api)
		.then(() => ({
			pluginName: pluginConfig.name,
			status: 'complete'
		}))
		.catch(e => ({
			pluginName: pluginConfig.name,
			status: 'error',
			error: e
		}));
};

module.exports = taskRunner = () => (
	{
		runTask
	}
);