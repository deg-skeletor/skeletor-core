const skeletor = require('../index');

test('getConfig() returns obj with error msg if no config has been set', () => {
	const skel = skeletor();
	expect(skel.getConfig()).toHaveProperty('errorMessage');
});

test('getConfig() returns previously set config', () => {
	const skel = skeletor();
	const config = {tasks: [{name: 'task1'}]};
	skel.setConfig(config);
	expect(skel.getConfig()).toEqual(config);
});