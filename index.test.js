const skeletor = require('./index');

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

const validResponse = {
	taskName: 'task1',
    status: 'complete',
    subTasks: [ 
    	{ taskName: 'subTask1', status: 'complete', plugins: [] },
        { taskName: 'subTask2', status: 'complete', plugins: [] },
        { taskName: 'subTask3', status: 'complete', plugins: [] } 
    ]
};

jest.mock('./lib/consoleLogger');

test('getConfig() returns null if no config has been set', () => {
	const skel = skeletor();
	expect(skel.getConfig()).toEqual(null);
});

test('getConfig() returns previously set config', () => {
	const skel = skeletor();
	const config = {tasks: [{name: 'task1'}]};
	skel.setConfig(config);
	expect(skel.getConfig()).toEqual(config);
});

test('A custom logger is used by runTask()', () => {
	const skel = skeletor();
	const logger = {
		error: jest.fn()
	};
	skel.setLogger(logger);

	expect.assertions(1);
	skel.runTask('build')
		.catch(e => expect(logger.error.mock.calls.length).toBe(2));
});

test('runTask() returns an error if no config is specified', () => {
	expect.assertions(1);
  	return skeletor().runTask('build')
  		.catch(e => expect(e).toMatch('ERROR: No configuration specified'));
});

test('runTask() returns an error if task does not exist in config', () => {
	expect.assertions(1);
	const skel = skeletor();
	skel.setConfig({tasks: [{name: 'task1'}]});
	return skel.runTask('task2')
		.catch(e => expect(e).toMatch('ERROR: Could not find task "task2"'));
});

test('runTask() runs specified task', () => {
	const skel = skeletor();
	skel.setConfig(validConfig);
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
	return skel.runTask('task1', options)
		.then(response => expect(response).toEqual(expectedResponse));
});