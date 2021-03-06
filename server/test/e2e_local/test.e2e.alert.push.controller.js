/**
 * Created by aleckim on 18. 2. 8..
 */

"use strict";

const Logger = require('../../lib/log');
global.log  = new Logger(__dirname + "/debug.log");

const assert  = require('assert');
const mongoose = require('mongoose');
const async = require('async');

var controllerManager = require('../../controllers/controllerManager');
global.manager = new controllerManager();

const AlertPushController = require('../../controllers/alert.push.controller');

describe('unit test - alert push controller', function() {

    before(function (done) {
        this.timeout(10*1000);
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/todayweather', function(err) {
            if (err) {
                console.error('Could not connect to MongoDB!');
            }
            done();
        });
        mongoose.connection.on('error', function(err) {
            if (err) {
                console.error('MongoDB connection error: ' + err);
                done();
            }
        });
    });

    it('disable by fcm', function (done) {
        var pushInfo2 = {
            fcmToken: "cueGIoY15Lc:APA91bEm3iNk8HoC9M-KBIP84vuhS04VGOUjVjIk5XI-sOGlKD_JVL_yKgYvZYOOLNHpGHqJNk--tEKhZFsXhOVUqxemBrHf-RCsi7Ij-h0LkCnOpfW5KMyBPRF7VB6lHMP-exp_iXcv",
            startTime: 3600,     //10H to utc 1H
            endTime: 46800,      //22H to utc 13H
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
            timezoneOffset: 540,
            airAlertsBreakPoint: 2
        };
        let ctrlAlertPush = new AlertPushController();
        ctrlAlertPush.updateAlertPush(pushInfo2, (err, result)=> {
            if (err) {
                console.error(err);
            }
            console.log(result);

            ctrlAlertPush._disableByFcm(pushInfo2.fcmToken, (err, result)=> {
                if (err) {
                    console.error(err);
                }
                console.log(result);
                done();
            });
        });
    });

    // it ('test remove RegistrationId Changed To Fcm', function (done) {
    //     this.timeout(60*1000);
    //     let ctrlAlertPush = new AlertPushController();
    //     ctrlAlertPush._removeDuplicates(function (err, results) {
    //         done();
    //     });
    // });

    // it ('find duplicate alert', function (done) {
    //     this.timeout(10*60*1000);
    //
    //     const AlertPush = require('../../models/alert.push.model');
    //     AlertPush.find().lean().exec((err, list) => {
    //        if (err)  {
    //            return console.error(err);
    //        }
    //        console.info('list.length=',list.length);
    //        list.forEach(obj => {
    //            var sameObjList = list.filter(b=>{
    //                return obj.registrationId === b.registrationId && obj.cityIndex === b.cityIndex;
    //            });
    //            if (sameObjList.length > 1) {
    //                console.info(JSON.stringify(obj));
    //            }
    //        });
    //        done();
    //     });
    // });

    // var pushInfo1 = {
    //     registrationId: 'push1',
    //     startTime: 79200,    //7H to utc 22h
    //     endTime: 32400,      //18H to utc 9h
    //     cityIndex: 0,
    //     type: 'ios',
    //     town: {first: '서울특별시', second: '송파구', third: '잠실본동'},
    //     geo: [127.0864194, 37.5033556],
    //     lang: 'ko',
    //     name: 'jamsil',
    //     source: 'KMA',
    //     units: {
    //         temperatureUnit: "C",
    //         windSpeedUnit: "m/s",
    //         pressureUnit: "hPa",
    //         distanceUnit: "km",
    //         precipitationUnit: "mm",
    //         airUnit: "airkorea"
    //     },
    //     dayOfWeek: [false, true, false, false, false, true, false],
    //     timezoneOffset: 540,
    //     airAlertsBreakPoint: 2
    // };
    //
    // var pushInfo2 = {
    //     registrationId: 'push2',
    //     startTime: 3600,     //10H to utc 1H
    //     endTime: 46800,      //22H to utc 13H
    //     cityIndex: 1,
    //     type: 'ios',
    //     town: {first: '', second: '', third: ''},
    //     geo: [139.6917064, 35.6894875],
    //     lang: 'en',
    //     name: 'Tokyo',
    //     source: 'DSF',
    //     units: {
    //         temperatureUnit: "F",
    //         windSpeedUnit: "mph",
    //         pressureUnit: "mbar",
    //         distanceUnit: "miles",
    //         precipitationUnit: "inch"
    //     },
    //     dayOfWeek: [false, true, true, true, true, true, false],
    //     timezoneOffset: 540,
    //     airAlertsBreakPoint: 2
    // };
    //
    // let ctrlAlertPush = new AlertPushController();
    //
    // it('test remove push1', function (done) {
    //     ctrlAlertPush.removeAlertPush(pushInfo1, ()=> {
    //         done();
    //     });
    // });
    //
    // it('test remove push2', function (done) {
    //     ctrlAlertPush.removeAlertPush(pushInfo2, ()=> {
    //         done();
    //     });
    // });
    //
    // it('test update1', function (done) {
    //     ctrlAlertPush.updateAlertPush(pushInfo1, (err, result)=> {
    //         if (err) {
    //             console.error(err);
    //         }
    //         console.log(result);
    //         done();
    //     });
    // });
    //
    // it('test update2', function (done) {
    //     ctrlAlertPush.updateAlertPush(pushInfo2, (err, result)=> {
    //         if (err) {
    //             console.error(err);
    //         }
    //         console.log(result);
    //         done();
    //     });
    // });
    //
    // it('test get alert push by time', function (done) {
    //     this.timeout(10*1000);
    //     let timeList = [];
    //     (() => {
    //        for (let i=0; i<=24; i++)  {
    //            timeList.push(i);
    //        }
    //     })();
    //
    //     console.log('getAlertPushByTime');
    //     async.mapSeries(timeList,
    //         function (time, callback) {
    //             time *= 3600;
    //             ctrlAlertPush._getAlertPushByTime(time, (err, results) => {
    //                 if (err) {
    //                     console.error(err);
    //                 }
    //                 results.forEach((result)=> {
    //                     console.log({current:time/3600, startTime:result.startTime/3600, endTime: result.endTime/3600, reverseTime: result.reverseTime});
    //                 });
    //                callback(null, results) ;
    //             });
    //         },
    //         function () {
    //             done();
    //         });
    // });
    //
    // it('test init alert push list', function (done) {
    //     this.timeout(10*1000);
    //     ctrlAlertPush.sendAlertPushList(4*3600+45*60, function () {
    //        done();
    //     });
    // });
    //
    // it('test send alert push list', function (done) {
    //     ctrlAlertPush._sendNotification = function (pushInfo, notification, callback) {
    //         console.info(notification);
    //         callback();
    //     };
    //
    //     this.timeout(10*1000);
    //     ctrlAlertPush.sendAlertPushList(23*3600, function () {
    //         done();
    //     });
    // });
    //
    // it('test send alert push list', function (done) {
    //     ctrlAlertPush._sendNotification = function (pushInfo, notification, callback) {
    //         console.info(notification);
    //         callback();
    //     };
    //
    //     this.timeout(10*1000);
    //     ctrlAlertPush.sendAlertPushList(11*3600, function () {
    //         done();
    //     });
    // });
    //
    // it('test send alert push list', function (done) {
    //     ctrlAlertPush._sendNotification = function (pushInfo, notification, callback) {
    //         console.info(notification);
    //         callback();
    //     };
    //
    //     this.timeout(10*1000);
    //     ctrlAlertPush.sendAlertPushList(23*3600+46*60, function () {
    //        done();
    //     });
    // });
    //
    // it('test send alert push list', function (done) {
    //     ctrlAlertPush._sendNotification = function (pushInfo, notification, callback) {
    //         console.info(notification);
    //         callback();
    //     };
    //
    //     this.timeout(10*1000);
    //     ctrlAlertPush.sendAlertPushList(11*3600+46*60, function () {
    //         done();
    //     });
    // });

    // it('test tw alert fcm notification', function(done) {
    //     var alertPush = {
    //         fcmToken: "cvQm_aycwIE:APA91bE-ioed2OUOHbmHPBb-3L_CTvscdzs5JtJzPhKVxvnUF7Ydg0QZ0V0HfsxoiubJhAsvqIjL9QOodRzo9mrWua9eQUZXPVgy28msrBT7coa80kGIn0p-2mCgGDYHspXS9RcnwP27",
    //         cityIndex: 0,
    //         type: "android",
    //         package: "todayWeather"
    //     };
    //     var notification = {
    //         title: 'tw alert fcm test',
    //         text: 'tw alert fcm send test'
    //     };
    //
    //     let ctrlAlertPush = new AlertPushController();
    //     ctrlAlertPush._sendNotification(alertPush, notification, function(err, result) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         else {
    //             console.info(result);
    //         }
    //         done();
    //     });
    // });

    // it('test ta alert fcm notification', function(done) {
    //     var alertPush = {
    //         fcmToken: "eiz96kEmVLk:APA91bGoM1W2g6UMrG5eE3rBrMrmNLx20Co6u6IAYyP39u0FX9sZAuWwZsShQ7ZB8M4s4XBLqKDvfTBoeLN9D2yVcQkefEfDClhHAtHKiLDmBZ8Z3IQ28O5XrfnKwZJXzsbT1Zgj2Kml",
    //         cityIndex: 0,
    //         type: "android",
    //         package: "todayAir"
    //     };
    //     var notification = {
    //         title: 'ta alert fcm test',
    //         text: 'ta alert fcm send test'
    //     };
    //
    //     let ctrlAlertPush = new AlertPushController();
    //     ctrlAlertPush._sendNotification(alertPush, notification, function(err, result) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         else {
    //             console.info(result);
    //         }
    //         done();
    //     });
    // });

});

