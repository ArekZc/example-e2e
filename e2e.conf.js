'use strict';

var protractorConfig = require('./node_modules/gulp-protractor/node_modules/protractor/config.json');

exports.config = {
    baseUrl: 'http://localhost:3000/',
    seleniumServerJar: './node_modules/gulp-protractor/node_modules/' +
    'protractor/selenium/selenium-server-standalone-' + protractorConfig.webdriverVersions.selenium + '.jar',
    chromeDriver: './node_modules/gulp-protractor/node_modules/protractor/selenium/chromedriver',
    // seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    framework: 'cucumber',
    restartBrowserBetweenTests: false,

    specs: [
        'tests/e2e/**/*.feature'
    ],

    allScriptsTimeout: 500000,

    capabilities: {
        browserName: 'chrome',
        version: '',
        platform: 'ANY',
        chromeOptions: {
            // disable debugging in chrome, fixes some bugs with chrome on CI server
            args: ['--no-sandbox']
        }
    },
    cucumberOpts: {
        require: [
            'tests/e2e/**/*scenario.js'
        ],
        format: 'pretty'
    }
};