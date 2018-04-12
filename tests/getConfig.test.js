const skeletor = require('../index');

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