'use strict';

const browser = require('../mini-testium-mocha').browser;
const assert = require('assertive');
const co = require('co');

const getConfig = require('testium-core').getConfig;

const browserName = getConfig().get('browser');

describe('dialogs', () => {
  if (browserName === 'phantomjs') {
    xit("skipping tests because browser phantomjs doesn't support alerts");
    return;
  }

  before(browser.beforeHook());

  let target;
  before(
    co.wrap(function*() {
      yield browser.loadPage('/');

      target = yield browser.getElement('#alert_target');
      yield browser.clickOn('.link_to_clear_alert_target');
    })
  );

  describe('alert', () => {
    if (browserName === 'chrome') {
      xit('Chrome sometimes crashes with many alerts');
      return;
    }

    beforeEach(() => browser.clickOn('.link_to_open_an_alert'));

    it(
      'can get an alert text',
      co.wrap(function*() {
        const text = yield browser.getAlertText();
        yield browser.acceptAlert();
        assert.equal('Alert text was not found', 'An alert!', text);
      })
    );

    it(
      'can accept an alert',
      co.wrap(function*() {
        yield browser.acceptAlert();
        assert.equal('alerted', yield target.text());
      })
    );

    it(
      'can dismiss an alert',
      co.wrap(function*() {
        yield browser.dismissAlert();
        assert.equal('alerted', yield target.text());
      })
    );
  });

  describe('confirm', () => {
    beforeEach(() => browser.clickOn('.link_to_open_a_confirm'));

    it(
      'can get confirm text',
      co.wrap(function*() {
        const text = yield browser.getAlertText();
        yield browser.acceptAlert();
        assert.equal('Confirm text was not found', 'A confirmation!', text);
      })
    );

    it(
      'can accept a confirm',
      co.wrap(function*() {
        yield browser.acceptAlert();
        assert.equal('confirmed', yield target.text());
      })
    );

    it(
      'can dismiss a confirm',
      co.wrap(function*() {
        yield browser.dismissAlert();
        assert.equal('dismissed', yield target.text());
      })
    );
  });

  describe('prompt', () => {
    beforeEach(() => browser.clickOn('.link_to_open_a_prompt'));

    it(
      'can get prompt text',
      co.wrap(function*() {
        const text = yield browser.getAlertText();
        yield browser.acceptAlert();
        assert.equal('Confirm text was not found', 'A prompt!', text);
      })
    );

    it(
      'can send text to and accept a prompt',
      co.wrap(function*() {
        yield browser.typeAlert('Some words').acceptAlert();
        assert.equal('Some words', yield target.text());
      })
    );

    it(
      'can dismiss a prompt',
      co.wrap(function*() {
        yield browser.dismissAlert();
        assert.equal('dismissed', yield target.text());
      })
    );
  });
});
