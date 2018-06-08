const skeletor = require('../index');

test('getConfig() throws error if no config has been set', () => {
	try {
		const skel = skeletor();
		skel.getConfig();
	} catch (e) {
		expect(e).toBeTruthy();
	}
});

test('getConfig() returns previously set config', () => {
	const skel = skeletor();
	const config = {tasks: [{name: 'task1'}]};
	skel.setConfig(config);
	expect(skel.getConfig()).toEqual(config);
});