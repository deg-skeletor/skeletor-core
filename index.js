const skeletor = () => {

	/* 
		API Method: setConfig
		Description: Set configuration for all tasks
		
		Parameter: config
		Type: string|object|function
		Required: true
		Example: () => 'TBD'
	*/

	const setConfig = (config) => {

	}

	/* 
		API Method: runTask
		Description: Run a top-level task 
		
		Parameter: taskName
		Type: string
		Required: true
		Example: 'build'

		Parameter: options
		Type: object
		Required: false
		Example: {
			include: ['js', 'css'],
			exclude: ['html'],
			debug: true,
			taskConfig: {}
		}
	*/

	const runTask = (taskName, options) => {
		 
	}

	return {
		setConfig,
		runTask
	}
}

module.exports = skeletor;