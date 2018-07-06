# Skeletor!
[![Build Status](https://travis-ci.org/deg-skeletor/skeletor-core.svg?branch=master)](https://travis-ci.org/deg-skeletor/skeletor-core)

Skeletor is a simple task runner for automating common development chores. It has a growing [ecosystem of plugins](#plugin-ecosystem) to handle a wide variety of tasks. 

Skeletor is built and looked after by the front-end web development team at [DEG](https://www.degdigital.com/).

## Installation
Skeletor can be installed via npm:

`npm install @deg-skeletor/core`

Nice job! Next, you'll want to install some [plugins](#plugin-ecosystem).

## Plugin Ecosystem
At its core, Skeletor is just a delegator. Plugins do the real work. 

A typical Skeeltor plugin does one thing and one thing well. That one thing could be anything. There are plugins for file copying, PostCSS, Pattern Lab, Express, Rollup, and more. [Go on, have a look](https://github.com/deg-skeletor).

## Configuration
Skeletor needs a configuration object to tell it what tasks to run and what those tasks are comprised of. A sample configuration object might look like the following:
```js
{
    tasks: [
        {
            /* a task to build all the code in a project */
            name: 'build',
            subTasks: [
                {
                    /* a sub-task to build the CSS code */
                    name: 'css', 
                    plugins: [
                        {
                            /* a plugin to process CSS via PostCSS */
                            name: '@deg-skeletor/plugin-postcss',
                            config: {
                                //Plugin-specific config
                            }
                        }
                    ]
                },
                {
                    /* a sub-task to build static files */
                    name: 'static',
                    plugins: [
                        {
                            /* a plugin to copy static files from one directory to another */
                            name: '@deg-skeletor/plugin-copy',
                            config: {
                                //Plugin-specific config
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```
A Skeletor configuration object consists of an array of `tasks`. A `task` consists of either `plugins` or `subTasks`. A `subTask` is itself a `task` with its own `plugins` or `subTasks` properties.

By default, Skeletor will look for a configuration file named `skeletor.config.js` relative to the working directory. Alternatively, a configuration object can be passed directly to Skeletor. See the [API](#api) section for more details.

## CLI
Included within the Skeletor ecosystem is a command line interface for interacting with Skeletor via a terminal. Visit the [Skeletor CLI project](https://github.com/deg-skeletor/skeletor-cli) for more information.

## API
Skeletor exposes a compact API for programmatic interaction.
### getConfig()
Returns the configuration object.
### setConfig()
Sets the configuration object.
### setLogger()
Sets the logger for outputting information, warnings, and errors. A simple console logger is used by default.
### runTask(taskName, [options])
Runs the specified task.
