/**
 * Created by aleckim on 2016. 5. 3..
 */

"use strict";

var assert  = require('assert');
var Logger = require('../lib/log');
global.log  = new Logger(__dirname + "/debug.log");

var ControllerPush = require('../controllers/controllerPush');

var i18n = require('i18n');
i18n.configure({
    // setup some locales - other locales default to en silently
    locales: ['en', 'ko', 'ja', 'zh-CN', 'de', 'zh-TW'],
    // sets a custom cookie name to parse locale settings from
    cookie: 'twcookie',

    // where to store json files - defaults to './locales'
    directory: __dirname + './../locales',

    register: global
});
global.i18n = i18n;

describe('unit test - controller push', function() {
    //it('test start push', function(done) {
    //    var count = 0;
    //    var co = new ControllerPush();
    //    co.timeInterval = 1000;
    //    co.sendPush = function () {
    //        assert(true);
    //        return done();
    //    };
    //    co.start();
    //});

    var pushInfo = {
        registrationId: 'asdf',
        pushTime: 6900,
        cityIndex: 0,
        type: 'ios',
        town: {first: '서울특별시', second: '송파구', third: '잠실본동'},
        geo: [36, 102],
        lang: 'ko',
        name: 'jamsil',
        source: 'KMA',
        units: {
            temperatureUnit: "C",
            windSpeedUnit: "m/s",
            pressureUnit: "hPa",
            distanceUnit: "km",
            precipitationUnit: "mm",
            airUnit: "airkorea"
        },
        dayOfWeek: [false, true, false, false, false, true, false],
        timezoneOffset: 540
    };

    //var pushInfo0 = {
    //    registrationId: 'asdf',
    //    pushTime: 6900,
    //    cityIndex: 0,
    //    type: 'ios',
    //    town: {first: '서울특별시', second: '송파구', third: '잠실본동'}
    //};

    //var pushInfo2 = {
    //    registrationId: 'asdf',
    //    pushTime: 6900,
    //    cityIndex: 0,
    //    type: 'ios',
    //    town: {first: '서울특별시', second: '송파구', third: '잠실본동'},
    //    geo: [36, 102],
    //    lang: 'en',
    //    name: 'jamsil',
    //    source: 'KMA',
    //    units: {
    //        temperatureUnit: "F",
    //        windSpeedUnit: "mph",
    //        pressureUnit: "mbar",
    //        distanceUnit: "miles",
    //        precipitationUnit: "inch"
    //    }
    //};

    var pushInfo3 = {
       registrationId: 'asdf',
       pushTime: 6900,
       cityIndex: 1,
       type: 'ios',
       town: {first: '', second: '', third: ''},
       geo: [139.6917064, 35.6894875],
       lang: 'en',
       name: 'Tokyo',
       source: 'DSF',
       units: {
           temperatureUnit: "F",
           windSpeedUnit: "mph",
           pressureUnit: "mbar",
           distanceUnit: "miles",
           precipitationUnit: "inch"
       },
        dayOfWeek: [false, true, true, true, true, true, false],
        timezoneOffset: 540
    };

    it('test update push list', function(done) {
        var PushInfo = require('../models/modelPush');

        PushInfo.update = function(condition, push, options, callback) {
            console.log('update');
            assert.equal(push.registrationId, pushInfo.registrationId, 'error');
            return callback();
        };

        var pushList = [];
        pushList.push(pushInfo);
        pushList.push(pushInfo3);

        var co = new ControllerPush();
        co.updatePushInfoList(pushInfo.lang, pushList, function (err, result) {
            assert.equal(err, undefined, 'error');
            assert.equal(result.length, 2, 'error');
            done();
        });
    });

    it('test update push info', function(done) {
        var PushInfo = require('../models/modelPush');

        PushInfo.update = function(condition, push, options, callback) {
            console.log('update');
            assert.equal(push.registrationId, pushInfo.registrationId, 'error');
            return callback();
        };

        var co = new ControllerPush();
        co.updatePushInfo(pushInfo, function () {
            done();
        });
    });

    it('test remove push info', function(done) {
        var PushInfo = require('../models/modelPush');
        PushInfo.remove = function(push, callback) {
            console.log('remove');
            assert.equal(push.registrationId, pushInfo.registrationId, 'error');
            return callback();
        };

        var co = new ControllerPush();
        co.removePushInfo(pushInfo, function () {
          done();
        });
    });

});



