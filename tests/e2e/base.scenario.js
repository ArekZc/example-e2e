'use strict';

var Q = require('q'),
    scenario = require('./lib/Scenario'),
    /* eslint-disable */
    should = require('should'),
    /* eslint-enable */
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

module.exports = function () {

    scenario.use(this);

    /* eslint-disable */
    this.BeforeFeature(function (event, callback) {

        callback();

    });

    this.AfterScenario(function (event, callback) {

        callback();

    });

    this.BeforeStep(function (event, callback) {

        callback();

    });
    /* eslint-enable */

    scenario.define(
        /^I go to page "(.*)"$/, function iGoToPage (url, callback) {

            browser.get(url).then(function () {

                var shouldBeOnPage = scenario.context(
                    /^I should be on page "(.*)"$/,
                    url
                );

                shouldBeOnPage.then(function () {

                    callback();

                });

            });

        });

    scenario.define(
        /^I should be on page "(.*)"$/,
        function iShouldBeOnPage (url, callback) {

            browser.getCurrentUrl().then(function (result) {

                result.should.equal(browser.baseUrl + url);
                callback();

            });

        }
    );

    scenario.define(
        /^I should not be on page "(.*)"$/,
        function iShouldBeOnPage (url, callback) {

            browser.getCurrentUrl().then(function (result) {

                result.should.notEqual(browser.baseUrl + url);
                callback();

            });

        }
    );

    scenario.define(
        /^I fill in "(.*)" with "(.*)"$/,
        function iFillInWith (locator, text, callback) {

            browser.findElement(by.css(locator)).then(function (result) {

                result.clear().then(function () {

                    result.sendKeys(text).then(function () {

                        callback();

                    });

                });

            });

        }
    );

    scenario.define(
        /^I click "(.*)" element$/,
        function iClickElement (locator, callback) {

            browser.findElement(by.css(locator)).then(function (result) {

                result.click().then(function () {

                    callback();

                });

            });

        }
    );

    scenario.define(
        /^I press "(.*)" button$/,
        function iPressButton (locator, callback) {

            var buttonPromise = scenario.context(
                /^I click "(.*)" element$/,
                locator
            );

            buttonPromise.then(function () {

                callback();

            });

        }
    );

    scenario.define(/^I follow "(.*)" link$/,
        function iFollowLink (locator, callback) {

            var buttonPromise = scenario.context(
                /^I click "(.*)" element$/,
                locator
            );

            buttonPromise.then(function () {

                callback();

            });

        }
    );

    scenario.define(
        /^I follow "(.*)" link to "(.*)"$/,
        function iFollowLinkTo (locator, url, callback) {

            var buttonPromise = scenario.context(
                /^I follow "(.*)" link$/,
                locator
            );

            buttonPromise.then(function () {

                var pagePromise = scenario.context(
                    /^I should be on page "(.*)"$/,
                    url
                );

                pagePromise.then(function () {

                    callback();

                });

            });

        }
    );

    scenario.define(/^I should see an "(.*)" element$/,
        function iShouldSeeElement (locator, callback) {

            browser.isElementPresent(by.css(locator)).then(function (result) {

                result.should.equal(true);
                callback();

            });

        }
    );

    scenario.define(
        /^I should not see an "(.*)" element$/,
        function iShouldNotSeeElement (locator, callback) {

            browser.isElementPresent(by.css(locator)).then(function (result) {

                result.should.equal(false);
                callback();

            });

        }
    );

    scenario.define(
        /^I select "(.*)" from "(.*)"$/,
        function iSelectFrom (optionNum, locator, callback) {

            browser.findElements(by.css(locator + '-dropdown li')).then(function (options) {

                options[optionNum].click().then(function () {

                    callback();

                });

            });

        }
    );

    scenario.define(
        /^I should see "(.*)" text$/,
        function iShouldSeeText (text, callback) {

            browser.findElements(by.xpath('//*[contains(text(),"' + text + '")]')).then(function () {

                callback();

            });

        }
    );

    scenario.define(
        /^I should see "(.*)" text in element "(.*)"$/,
        function iShouldSeeTextInElement (text, locator, callback) {

            var elementWithText = element(by.css(locator));

            elementWithText.getText().then(function (resultText) {

                resultText.should.equal(text);
                callback();

            });

        }
    );

    scenario.define(
        /^I should not see "(.*)" text in element "(.*)"$/,
        function iShouldSeeTextInElement (text, locator, callback) {

            var elementWithText = element(by.css(locator));

            elementWithText.getText().then(function (resultText) {

                resultText.should.not.equal(text);
                callback();

            });

        }
    );

    scenario.define(
        /^the checkbox "(.*)" should (?:be unchecked|not be checked)$/,
        function (locator, callback) {

            var checkbox = element(by.css(locator));

            checkbox.isSelected().then(function (value) {

                if (value === false) {

                    callback();

                } else {

                    throw new Error('is not checked');

                }

            });

        }
    );

    scenario.define(
        /^the checkbox "(.*)" should be checked$/,
        function (locator, callback) {

            var checkbox = element(by.css(locator));

            checkbox.isSelected().then(function (value) {

                if (value === true) {

                    callback();

                } else {

                    throw new Error('is checked');

                }

            });

        }
    );

    scenario.define(
        /^I check "(.*)"$/,
        function (locator, callback) {

            var checkboxPromise = scenario.context(
                /^the checkbox "(.*)" should (?:be unchecked|not be checked)$/,
                locator
            );

            checkboxPromise.then(function () {

                var checkedPromise = scenario.context(
                    /^I click "(.*)" element$/,
                    locator
                );

                checkedPromise.then(function () {

                    callback();

                });

            });

        }
    );

    scenario.define(
        /^I uncheck "(.*)"$/,
        function (locator, callback) {

            var checkboxPromise = scenario.context(
                /^the checkbox "(.*)" should be checked$/,
                locator
            );

            checkboxPromise.then(function () {

                var checkedPromise = scenario.context(
                    /^I click "(.*)" element$/,
                    locator
                );

                checkedPromise.then(function () {

                    callback();

                });

            });

        }
    );


    scenario.define(/^I should see disabled "(.*)" button$/,
        function (locator, callback) {

            var button = element.all(by.css(locator + ':disabled'));

            button.count().then(function (count) {

                if (count > 0) {

                    callback();

                } else {

                    throw new Error('button is enabled');

                }

            });

        }
    );

    scenario.define(
        /^I should see disabled "(.*)" link/,
        function (locator, callback) {

            var button = element.all(by.css(locator + '[disabled]'));

            button.count().then(function (count) {

                if (count > 0) {

                    callback();

                } else {

                    throw new Error('link is enabled');

                }

            });

        }
    );

    scenario.define(
        /^I select "(.*)" option from "(.*)"$/,
       function (optionId, selectId, callback) {

           var chooseConditionVariablePromise = scenario.context(
               /^I click "(.*)" element$/,
               selectId
           );

           chooseConditionVariablePromise.then(function () {

               var chooseOptionFromConditionVariablePromise = scenario.context(
                   /^I click "(.*)" element$/,
                   optionId
               );

               chooseOptionFromConditionVariablePromise.then(function () {

                   callback();

               });

           });

       }
   );

    scenario.define(
        /^I should not see hidden "(.*)" element$/,
        function (locator, callback) {

            var hiddenElement = element(by.css(locator));

            hiddenElement.isDisplayed().then(function (isVisible) {

                if (isVisible === false) {

                    callback();

                } else {

                    throw new Error('is visible');

                }

            });

        }
    );

};