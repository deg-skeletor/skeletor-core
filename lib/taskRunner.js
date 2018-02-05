const path = require('path');

const runTask = (taskConfig, options = {}) => {
	console.log(`Running "${taskConfig.name}" task`);

	const resultObj = {
		taskName: taskConfig.name,
		status: 'complete'
	};

	if(!Array.isArray(taskConfig.subTasks) && !Array.isArray(taskConfig.plugins)) {
		console.log(`Task "${taskConfig.name}" has no subTasks or plugins`);
		return Promise.resolve(resultObj);
	}
	const result = taskConfig.subTasks ? 
		runSubTasks(taskConfig.subTasks, options) :
		runPlugins(taskConfig.plugins, options);

	return result.then(statusObj => {
		console.log(`Task "${taskConfig.name}" is complete`);
		return {...resultObj, ...statusObj}; 
	});	
}

const runSubTasks = (subTasks, options) => {
	const filteredSubTasks = filterSubTasks(subTasks, options.subTasksToInclude);

	return Promise.all(filteredSubTasks.map(runTask))
		.then(statuses => (
			{ subTasks: statuses }
		));
}

const filterSubTasks = (subTasks, subTasksToInclude = []) => {
	return subTasksToInclude && subTasksToInclude.length ? 
		subTasks.filter(subTask => subTasksToInclude.includes(subTask.name)) :
		subTasks;
}

const runPlugins = (plugins, options) => {
	return Promise.all(plugins.map(pluginConfig => runPlugin(pluginConfig, options)))
		.then(statuses => (
			{ plugins: statuses }
		));
}

const runPlugin = (pluginConfig, options) => {
	console.log(`Running "${pluginConfig.name}" plugin`);

	const pluginFilepath = path.resolve(process.cwd(), 'node_modules', pluginConfig.name);

	const plugin = require(pluginFilepath);
	
	return plugin().run(pluginConfig.config, options)
		.then(() => ({
			pluginName: pluginConfig.name,
			status: 'complete'
		}));
}

module.exports = taskRunner = () => {

	return {
		runTask
	}
};