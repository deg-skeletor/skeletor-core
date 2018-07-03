const skeletor = require('../index');

const validConfig = {
	tasks: [
		{
			name: 'task1',
			subTasks: [
				{
					name: 'subTask1',
					plugins: []
				},
				{
					name: 'subTask2',
					plugins: []
				},
				{
					name: 'subTask3',
					plugins: []
				}
			]
		}
	]
};

const skeletorPluginConfig = {
	name: 'skeletorPlugin',
	config: { test: 1 }
};

const validConfigWithPlugin = {
	tasks: [
		{
			name: 'task1',
			subTasks: [
				{
					name: 'subTask1',
					plugins: [skeletorPluginConfig]
				}
			]
		}
	]
};

const validResponse = {
	taskName: 'task1',
    status: 'complete',
    subTasks: [ 
    	{ taskName: 'subTask1', status: 'complete', plugins: [] },
        { taskName: 'subTask2', status: 'complete', plugins: [] },
        { taskName: 'subTask3', status: 'complete', plugins: [] } 
    ]
};

jest.mock('../lib/consoleLogger');
jest.mock('skeletorPlugin');
jest.mock('path');

beforeEach(() => {
  jest.restoreAllMocks();
});

test('A custom logger is used by runTask()', () => {
	const skel = skeletor();
	const logger = {
		error: jest.fn()
	};
	skel.setLogger(logger);

	expect.assertions(1);
	skel.runTask('build')
		.catch(e => expect(logger.error.mock.calls.length).toBe(1));
});

test('runTask() returns an error if no config is specified', () => {
	expect.assertions(1);
  	return skeletor().runTask('build')
  		.catch(e => expect(e).toMatch("Configuration Error -- Error: ENOENT: no such file or directory, access './skeletor.config.js'"));
});

test('runTask() returns an error if task does not exist in config', () => {
	const skel = skeletor();
	skel.setConfig({tasks: [{name: 'task1'}]});

	expect.assertions(1);
	return skel.runTask('task2')
		.catch(e => expect(e).toMatch('ERROR: Could not find task "task2"'));
});

test('runTask() runs specified task', () => {
	const skel = skeletor();
	skel.setConfig(validConfig);

	expect.assertions(1);
	return skel.runTask('task1')
		.then(response => expect(response).toEqual(validResponse));
});

test('runTask() runs only specified subtasks', () => {
	const skel = skeletor();
	const options = { subTasksToInclude: ['subTask1', 'subTask2'] };
	const expectedResponse = {
		taskName: 'task1',
	    status: 'complete',
	    subTasks: [ 
	    	{ taskName: 'subTask1', status: 'complete', plugins: [] },
	        { taskName: 'subTask2', status: 'complete', plugins: [] }
	    ]
	};

	skel.setConfig(validConfig);

	expect.assertions(1);
	return skel.runTask('task1', options)
		.then(response => expect(response).toEqual(expectedResponse));
});

test('runTask() runs plugin', () => {
	const skeletorPlugin = require('skeletorPlugin')();
	const runSpy = jest.spyOn(skeletorPlugin, 'run');

	const skel = skeletor();
	skel.setConfig(validConfigWithPlugin);

	const pluginOptions = {
		logger: {
			info: jest.fn()
		}
	};
	
	expect.assertions(2);
	return skel.runTask('task1', pluginOptions)
		.then(response => {
			expect(runSpy.mock.calls.length).toEqual(1);
			expect(runSpy.mock.calls[0]).toEqual([skeletorPluginConfig.config, pluginOptions, skel]);		
		});
});

describe('runTask() sets the node environment variable', () => {
	const originalNodeEnv = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	test('when the task config specifies production', () => {
		const environment = 'production';

		const prodConfig = {...validConfigWithPlugin};
		prodConfig.tasks[0].environment = environment;

		const skel = skeletor();
		skel.setConfig(validConfigWithPlugin);
		
		expect.assertions(1);
		return skel.runTask('task1')
			.then(() => {
				expect(process.env.NODE_ENV).toEqual(environment);
			});
	})
});