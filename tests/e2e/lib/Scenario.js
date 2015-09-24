'use strict';

var Q = require('q');

var Scenario = function () {

    var $frame;
    var $contextCollection = {};

    this.use = function (frame) {

        $frame = frame;

    };

    this.define = function (stepRegex, stepDefinition) {

        if ($contextCollection[stepRegex] !== undefined) {

            throw new Error('Step already defined: "' + stepRegex + '"');

        }

        if ($frame === undefined) {

            throw new Error('Cucumber not set');

        }

        $contextCollection[stepRegex] = stepDefinition;

        /* eslint-disable */
        $frame.Given(stepRegex, function () {

            stepDefinition.apply(undefined, arguments);

        });

        $frame.When(stepRegex, function () {

            stepDefinition.apply(undefined, arguments);

        });

        $frame.Then(stepRegex, function () {

            stepDefinition.apply(undefined, arguments);

        });
        /* eslint-enable */

    };

    this.context = function (stepRegex) {

        if ($contextCollection[stepRegex] === undefined) {

            throw new Error('Step not defined yet: "' + stepRegex + '"');

        }

        var deferred = Q.defer();

        var callback = function () {

            deferred.resolve();

        };

        var parameters = arguments;

        if (parameters instanceof Object) {

            var tmp = [];

            for (var index in parameters) {

                if (parameters.hasOwnProperty(index)) {

                    tmp.push(parameters[index]);

                }

            }

            parameters = tmp;

        }

        parameters.shift();
        parameters.push(callback);

        try {

            $contextCollection[stepRegex].apply(undefined, parameters);

        } catch (ex) {

            deferred.reject(ex);

        }

        return deferred.promise;

    };

};

module.exports = new Scenario();