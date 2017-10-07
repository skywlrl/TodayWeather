/**
 * Created by Peter on 2017. 9. 26..
 */

var async = require('async');

var modelKmaTownCurrent = require('../../models/kma/kma.town.current.model.js');

function kmaTownCurrentController(){
}

function _leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if(n.length < digits) {
        for(var i = 0; i < digits - n.length; i++){
            zero += '0';
        }
    }
    return zero + n;
}

function _getLimitedTime(curTime){
    var now = new Date(curTime.getTime());
    var tz = now.getTime() + (-72 * 3600000);
    //var tz = now.getTime() + (3 * 3600000);
    now.setTime(tz);

    return now;
}

function _getDate(curTime){
    return new Date(curTime.slice(0,4)+ '-' + curTime.slice(4,6) + '-' + curTime.slice(6,8) + 'T' + curTime.slice(8,10) + ':00:00+09:00');
}

function _getKoreaTimeString(curTime){
    var now = new Date(curTime.getTime());
    var tz = now.getTime() + (9 * 3600000);

    now.setTime(tz);

    var result =
        _leadingZeros(now.getUTCFullYear(), 4) +
        _leadingZeros(now.getUTCMonth() + 1, 2) +
        _leadingZeros(now.getUTCDate(), 2) +
        _leadingZeros(now.getUTCHours(), 2) +
        _leadingZeros(now.getUTCMinutes(), 2);

    return result;
}

kmaTownCurrentController.prototype.saveCurrent = function(newData, callback){
    var self = this;
    var invalid = false;

    //log.info('KMA Town C> save :', newData);
    var coord = {
        mx: newData[0].mx,
        my: newData[0].my
    };

    var pubDate = _getDate(newData[0].pubDate);
    log.info('KMA Town C> pubDate :', pubDate.toString());
    //log.info('KMA Town C> db find :', coord);

    try{
        async.mapSeries(newData,
            function(item, cb){
                var newItem = {mCoord: coord, pubDate: pubDate, currentData: item};
                //log.info('KMA Town C> item : ', JSON.stringify(item));

                modelKmaTownCurrent.update({mCoord: coord, pubDate: pubDate}, newItem, {upsert:true}, function(err){
                    if(err){
                        log.error('KMA Town C> Fail to update current item');
                        log.info(JSON.stringify(newItem));
                        return cb();
                    }

                    cb();
                });
            },
            function(err){
                var limitedTime = _getLimitedTime(pubDate);
                log.info('KMA Town C> finished to save town.current data');
                log.info('KMA Town C> remove item if it is before : ', limitedTime.toString());

                modelKmaTownCurrent.remove({"mCoord": coord, "pubDate": {$lte:limitedTime}}).exec();

                callback(err);
            }
        );
    }
    catch(e){
        if(callback){
            callback(e);
        }
        else {
            log.error(e);
        }
    }

    return this;

};

kmaTownCurrentController.prototype._getCurrentFromDB = function(modelCurrent, coord, req, callback) {
    var self = this;
    var errorNo = 0;

    try{
        if(req != undefined && req['modelCurrent'] != undefined){
            return callback(errorNo, req['modelCurrent']);
        }

        modelKmaTownCurrent.find({'mCoord.mx': coord.mx, 'mCoord.my': coord.my}, {_id: 0}).sort({"pubDate":1}).lean().exec(function(err, result){
            if(err){
                log.warn('KMA Town C> Fail to file&get current data from DB');
                return callback(err);
            }

            if(result.length == 0){
                log.warn('KMA Town C> There are no current datas from DB');
                errorNo = 1;
                return callback(errorNo);
            }

            var ret = [];
            var pubDate = _getKoreaTimeString(result[result.length-1].pubDate);

            log.info('KMA Town C> get Data : ', result.length);
            result.forEach(function(item){
                var newItem = {};
                var curData = item.currentData;

                //log.info(JSON.stringify(item));
                commonString.forEach(function(string){
                    newItem[string] = curData[string];
                });
                curString.forEach(function(string){
                    newItem[string] = curData[string];
                });
                ret.push(newItem);
            });

            callback(errorNo, {pubDate: pubDate, ret:ret});
        });

    }catch(e){
        if (callback) {
            callback(e);
        }
        else {
            log.error(e);
        }
    }
};

module.exports = kmaTownCurrentController;