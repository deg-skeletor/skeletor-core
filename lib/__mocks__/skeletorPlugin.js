'use strict';

const run = () => Promise.resolve({
	pluginName: 'skeletorPlugin',
	status: 'complete'
});

const skeletorPlugin = jest.fn();

skeletorPlugin.mockReturnValue({
	run
});

module.exports = skeletorPlugin;