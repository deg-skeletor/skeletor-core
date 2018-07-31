const skeletor = require('../index');
const mockNow = require('jest-mock-now');

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
	duration: 0,
    subTasks: [ 
    	{ taskName: 'subTask1', status: 'complete', plugins: [], duration: 0 },
        { taskName: 'subTask2', status: 'complete', plugins: [], duration: 0 },
        { taskName: 'subTask3', status: 'complete', plugins: [], duration: 0 } 
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

describe('runTask() returns an error', () => {
	test('if no config is specified', () => {
		expect.assertions(1);
		  return skeletor().runTask('build')
			  .catch(e => expect(e).toMatch("Configuration Error -- Error: ENOENT: no such file or directory, access './skeletor.config.js'"));
	});
	
	test('if task does not exist in config', () => {
		const skel = skeletor();
		skel.setConfig({tasks: [{name: 'task1'}]});
	
		expect.assertions(1);
		return skel.runTask('task2')
			.catch(e => expect(e).toMatch('ERROR: Could not find task "task2"'));
	});
});

describe('runTask() runs', () => {
	beforeEach(() => {
		mockNow(new Date('2018-02-17'));
	});

	test('specified task', () => {
		const skel = skeletor();
		skel.setConfig(validConfig);
		expect.assertions(1);
		return skel.runTask('task1')
			.then(response => expect(response).toEqual(validResponse));
	});
	
	test('only specified subtasks', () => {
		const skel = skeletor();
		const options = { subTasksToInclude: ['subTask1', 'subTask2'] };
		const expectedResponse = {
			taskName: 'task1',
			status: 'complete',
			duration: 0,
			subTasks: [ 
				{ taskName: 'subTask1', status: 'complete', plugins: [], duration: 0 },
				{ taskName: 'subTask2', status: 'complete', plugins: [], duration: 0 }
			]
		};
	
		skel.setConfig(validConfig);
	
		expect.assertions(1);
		return skel.runTask('task1', options)
			.then(response => expect(response).toEqual(expectedResponse));
	});
	
	test('plugin', () => {
		const skeletorPlugin = require('skeletorPlugin')();
		const runSpy = jest.spyOn(skeletorPlugin, 'run');
	
		const skel = skeletor();
		skel.setConfig(validConfigWithPlugin);
	
		const pluginOptions = {};
		
		expect.assertions(2);
		return skel.runTask('task1', pluginOptions)
			.then(response => {
				expect(runSpy.mock.calls.length).toEqual(1);
				expect(runSpy.mock.calls[0]).toEqual([skeletorPluginConfig.config, pluginOptions, skel]);		
			});
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