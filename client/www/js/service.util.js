angular.module('service.util', [])
    .factory('Util', function ($window) {
        var obj = {};
        var gaArray = [];

        //region Function

        //endregion

        //region APIs

        obj.ga = {
            startTrackerWithId: function (id, dispatchPeriod) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.startTrackerWithId(id, dispatchPeriod, function(result) {
                        console.log("startTrackerWithId success = " + result);
                    }, function(error) {
                        console.log("startTrackerWithId error = " + error);
                    });
                }
            },
            setAllowIDFACollection: function (enable) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.setAllowIDFACollection(enable, function(result) {
                        console.log("setAllowIDFACollection success = " + result);
                    }, function(error) {
                        console.log("setAllowIDFACollection error = " + error);
                    });
                }
            },
            setUserId: function (id) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.setUserId(id, function(result) {
                        console.log("setUserId success = " + result);
                    }, function(error) {
                        console.log("setUserId error = " + error);
                    });
                }
            },
            setAnonymizeIp: function (anonymize) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.setAnonymizeIp(anonymize, function(result) {
                        console.log("setAnonymizeIp success = " + result);
                    }, function(error) {
                        console.log("setAnonymizeIp error = " + error);
                    });
                }
            },
            setOptOut: function (optout) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.setOptOut(optout, function(result) {
                        console.log("setOptOut success = " + result);
                    }, function(error) {
                        console.log("setOptOut error = " + error);
                    });
                }
            },
            setAppVersion: function (version) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.setAppVersion(version, function(result) {
                        console.log("setAppVersion success = " + result);
                    }, function(error) {
                        console.log("setAppVersion error = " + error);
                    });
                }
            },
            debugMode: function () {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.debugMode(function(result) {
                        console.log("debugMode success = " + result);
                    }, function(error) {
                        console.log("debugMode error = " + error);
                    });
                }
            },
            trackMetric: function (key, value) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.trackMetric(key, value, function(result) {
                        console.log("trackMetric success = " + result);
                    }, function(error) {
                        console.log("trackMetric error = " + error);
                    });
                }
            },
            trackView: function (screen, campaingUrl, newSession) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.trackView(screen, campaingUrl, newSession, function(result) {
                        console.log("trackView success = " + result);
                    }, function(error) {
                        console.log("trackView error = " + error);
                        gaArray.push(["trackView", screen, campaingUrl]);
                    });
                } else {
                    console.log("trackView undefined");
                    gaArray.push(["trackView", screen, campaingUrl]);
                }
            },
            addCustomDimension: function (key, value) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.addCustomDimension(key, value, function(result) {
                        console.log("addCustomDimension success = " + result);
                    }, function(error) {
                        console.log("addCustomDimension error = " + error);
                    });
                }
            },
            trackEvent: function (category, action, label, value, newSession) {
                if (twClientConfig.debug) {
                   console.log('category='+category+' action='+action+' label='+label+' value='+value);
                }
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.trackEvent(category, action, label, value, newSession, function(result) {
                        console.log("trackEvent success = " + result);
                    }, function(error) {
                        console.log("trackEvent error = " + error);
                        gaArray.push(["trackEvent", category, action, label, value, newSession]);
                    });
                } else {
                    console.log("trackEvent undefined");
                    gaArray.push(["trackEvent", category, action, label, value, newSession]);
                }
            },
            trackException: function (description, fatal) {
                if (twClientConfig.debug) {
                   console.log('description='+description+' fatal='+fatal);
                }
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.trackException(description, fatal, function(result) {
                        console.log("trackException success = " + result);
                    }, function(error) {
                        console.log("trackException error = " + error);
                        gaArray.push(["trackException", description, fatal]);
                    });
                } else {
                    console.log("trackException undefined");
                    gaArray.push(["trackException", description, fatal]);
                }
            },
            trackTiming: function (category, intervalInMilliseconds, name, label) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.trackTiming(category, intervalInMilliseconds, name, label, function(result) {
                        console.log("trackTiming success = " + result);
                    }, function(error) {
                        console.log("trackTiming error = " + error);
                    });
                }
            },
            addTransaction: function (transactionId, affiliation, revenue, tax, shipping, currencyCode) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.addTransaction(transactionId, affiliation, revenue, tax, shipping, currencyCode, function(result) {
                        console.log("addTransaction success = " + result);
                    }, function(error) {
                        console.log("addTransaction error = " + error);
                    });
                }
            },
            addTransactionItem: function (transactionId, name, sku, category, price, quantity, currencyCode) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.addTransactionItem(transactionId, name, sku, category, price, quantity, currencyCode, function(result) {
                        console.log("addTransactionItem success = " + result);
                    }, function(error) {
                        console.log("addTransactionItem error = " + error);
                    });
                }
            },
            enableUncaughtExceptionReporting: function (enable) {
                if (typeof $window.ga !== "undefined") {
                    return $window.ga.enableUncaughtExceptionReporting(enable, function(result) {
                        console.log("enableUncaughtExceptionReporting success = " + result);
                    }, function(error) {
                        console.log("enableUncaughtExceptionReporting error = " + error);
                    });
                }
            },
            platformReady: function() {
                if (typeof $window.ga !== "undefined") {
                    for (var i = 0; i < gaArray.length; i++) {
                        if (gaArray[i][0] === "trackView") {
                            this.trackView(gaArray[i][1]);
                        } else if (gaArray[i][0] === "trackEvent") {
                            this.trackEvent(gaArray[i][1], gaArray[i][2], gaArray[i][3], gaArray[i][4]);
                        }
                    }
                }
                gaArray = [];
            }
        };

        //endregion

        obj.imgPath = 'img/weatherIcon2-color';
        obj.version = '';
        obj.guideVersion = 1.0;
        obj.suiteName = "group.net.wizardfactory.todayweather";
        obj.language;
        obj.region;

        //obj.url = "/v000803";
        //obj.url = "https://todayweather-wizardfactory.rhcloud.com/v000803";
        //obj.url = "https://tw-wzdfac.rhcloud.com/v000803";
        //obj.url = "https://todayweather.wizardfactory.net/v000803";
        //obj.url = window.twClientConfig.serverUrl;

        // android는 diagnostic.locationMode, ios는 diagnostic.permissionStatus를 나타냄
        obj.locationStatus = undefined;

        obj.isLocationEnabled = function() {
            var that = this;

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.diagnostic) {
                if (ionic.Platform.isIOS()) {
                    if (that.locationStatus === cordova.plugins.diagnostic.permissionStatus.GRANTED
                        || that.locationStatus === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                        return true;
                    }
                } else if (ionic.Platform.isAndroid()) {
                    if (that.locationStatus === cordova.plugins.diagnostic.locationMode.HIGH_ACCURACY
                        || that.locationStatus === cordova.plugins.diagnostic.locationMode.BATTERY_SAVING
                        || that.locationStatus === cordova.plugins.diagnostic.locationMode.DEVICE_ONLY) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return true;
            }
        };

        return obj;
    });