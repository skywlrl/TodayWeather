var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var fs = require('fs');

var shell = require('gulp-shell');

var deleteLines = require('gulp-delete-lines');

var twJson = JSON.parse(fs.readFileSync('./tw.package.json'));
var taJson = JSON.parse(fs.readFileSync('./ta.package.json'));

var TW_BILLING_KEY = process.env.TW_BILLING_KEY || '111';
var TA_BILLING_KEY = process.env.TA_BILLING_KEY || '111';
var SENDER_ID = process.env.SENDER_ID || '111';
var FABRIC_API_KEY = process.env.FABRIC_API_KEY || '111';
var FABRIC_API_SECRET = process.env.FABRIC_API_SECRET || '111';
var FACEBOOK_TW_APP_ID = process.env.FACEBOOK_TW_APP_ID || '111';
var FACEBOOK_TW_APP_NAME = process.env.FACEBOOK_TW_APP_NAME || '111';
var FACEBOOK_TA_APP_ID = process.env.FACEBOOK_TA_APP_ID || '111';
var FACEBOOK_TA_APP_NAME = process.env.FACEBOOK_TA_APP_NAME || '111';

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('build', shell.task([
  'ionic state reset',
  'cp -a ../ios platforms/',
  'ionic state restore --plugins',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build'
]));

gulp.task('build_tw_ios', shell.task([
  'cp tw.package.json package.json',
  'cp tw.config.xml config.xml',
  'cp ../tw.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a tw.resources resources',
  'cp package.json import_today_ext/package.json.backup',
  'cp import_today_ext/tw.empty.package.json package.json',
  'ionic state reset',
  'cp -a ../tw.ios/* platforms/ios/',
  'mv import_today_ext/package.json.backup package.json',
  'ionic state restore --plugins',
  'cordova plugin add cordova-plugin-inapppurchase',
  'cp -f www/js/controller.purchase.alexdisler.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build ios'
]));

gulp.task('build_tw_android', shell.task([
  'cp tw.package.json package.json',
  'cp tw.config.xml config.xml',
  'cp ../tw.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a tw.resources resources',
  'ionic state reset',
  'cordova plugin add cc.fovea.cordova.purchase  --variable BILLING_KEY="'+TW_BILLING_KEY+'"',
  'cp -f www/js/controller.purchase.j3k0.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build android'
]));

gulp.task('release-tw-android-min20-nonpaid', shell.task([
  'cp tw.package.json package.json',
  'cp tw.config-androidsdk20.xml config.xml',
  'cp ../tw-google-services.json google-services.json',
  'cp ../tw.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a tw.resources resources',
  'ionic state reset',
  'cordova platform rm ios',
  'cordova plugin rm cordova-plugin-console',
  'cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY="'+FABRIC_API_KEY+'" --variable FABRIC_API_SECRET="'+FABRIC_API_SECRET+'"',
  'cordova plugin add cc.fovea.cordova.purchase  --variable BILLING_KEY="'+TW_BILLING_KEY+'"',
  'cordova plugin add https://github.com/WizardFactory/cordova-plugin-facebook4 --variable APP_ID="'+FACEBOOK_TW_APP_ID+'" --variable APP_NAME="'+FACEBOOK_TW_APP_NAME+'"',
  'yarn install',
  'bower install',
  'gulp sass',
  'cp -f www/js/controller.purchase.j3k0.js www/js/controller.purchase.js',
  'ionic build android --release',
  'cp platforms/android/build/outputs/apk/android-release.apk ./TodayWeather_ads_playstore_v'+twJson.version+'_min20.apk'
]));

gulp.task('release-tw-android-min16-nonpaid', shell.task([
  'cp tw.package-androidsdk16.json package.json',
  'cp tw.config-androidsdk16.xml config.xml',
  'cp ../tw.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a tw.resources resources',
  'ionic state reset',
  'cordova platform rm ios',
  'cordova plugin rm cordova-plugin-console',
  'cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY="'+FABRIC_API_KEY+'" --variable FABRIC_API_SECRET="'+FABRIC_API_SECRET+'"',
  'cordova plugin add cc.fovea.cordova.purchase  --variable BILLING_KEY="'+TW_BILLING_KEY+'"',
  'yarn install',
  'bower install',
  'gulp sass',
  'cp -f www/js/controller.purchase.j3k0.js www/js/controller.purchase.js',
  'cordova plugin add cordova-plugin-crosswalk-webview',
  'ionic build android --release',
  'cp -a platforms/android/build/outputs/apk/android-armv7-release.apk ./TodayWeather_ads_playstore_v'+twJson.version+'_min16.apk'
]));

gulp.task('release-tw-ios-nonpaid', shell.task([
  'cp tw.package.json package.json',
  'cp tw.config-androidsdk20.xml config.xml',
  'cp ../tw-GoogleService-Info.plist GoogleService-Info.plist',
  'cp ../tw.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a tw.resources resources',
  'cp package.json import_today_ext/package.json.backup',
  'cp import_today_ext/tw.empty.package.json package.json',
  'ionic state reset',
  'cp -a ../tw.ios/* platforms/ios/',
  'mv import_today_ext/package.json.backup package.json',
  'ionic state restore --plugins',
  'cordova plugin rm cordova-plugin-console',
  'cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY="'+FABRIC_API_KEY+'" --variable FABRIC_API_SECRET="'+FABRIC_API_SECRET+'"',
  'cordova plugin add https://github.com/WizardFactory/cordova-plugin-facebook4 --variable APP_ID="'+FACEBOOK_TW_APP_ID+'" --variable APP_NAME="'+FACEBOOK_TW_APP_NAME+'"',
  'cordova plugin add cordova-plugin-inapppurchase',
  'cp -f www/js/controller.purchase.alexdisler.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build ios --release'
  //'xcodebuild -project TodayWeather.xcodeproj -scheme TodayWeather -configuration Release clean archive'
  //'xcodebuild -exportArchive -archivePath ~/Library/Developer/Xcode/Archives/2016-10-27/TodayWeather\ 2016.\ 10.\ 27.\ 13.48.xcarchive -exportPath TodayWeather.ipa''
  //'/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool --validate-app -f TodayWeather.ipa -u kimalec7@gmail.com'
  //'/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool --upload-app -f TodayWeather.ipa -u kimalec7@gmail.com'
]));

gulp.task('build_ta_ios', shell.task([
  'cp ta.package.json package.json',
  'cp ta.config.xml config.xml',
  'cp ../ta.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a ta.resources resources',
  'cp package.json import_today_ext/package.json.backup',
  'cp import_today_ext/ta.empty.package.json package.json',
  'ionic state reset',
  'cp -a ../ta.ios/* platforms/ios/',
  'mv import_today_ext/package.json.backup package.json',
  'ionic state restore --plugins',
  'cordova plugin add cordova-plugin-inapppurchase',
  'cp -f www/js/controller.purchase.alexdisler.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build ios'
]));

gulp.task('build_ta_android', shell.task([
  'cp ta.package.json package.json',
  'cp ta.config.xml config.xml',
  'cp ../ta.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a ta.resources resources',
  'ionic state reset',
  'cordova plugin add cc.fovea.cordova.purchase  --variable BILLING_KEY="'+TA_BILLING_KEY+'"',
  'cp -f www/js/controller.purchase.j3k0.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build android'
]));

gulp.task('release-ta-android-nonpaid', shell.task([
  'cp ta.package.json package.json',
  'cp ta.config.xml config.xml',
  'cp ../ta-google-services.json google-services.json',
  'cp ../ta.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a ta.resources resources',
  'ionic state reset',
  'cordova platform rm ios',
  'cordova plugin rm cordova-plugin-console',
  'cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY="'+FABRIC_API_KEY+'" --variable FABRIC_API_SECRET="'+FABRIC_API_SECRET+'"',
  'cordova plugin add cc.fovea.cordova.purchase  --variable BILLING_KEY="'+TA_BILLING_KEY+'"',
  'cordova plugin add https://github.com/WizardFactory/cordova-plugin-facebook4 --variable APP_ID="'+FACEBOOK_TA_APP_ID+'" --variable APP_NAME="'+FACEBOOK_TA_APP_NAME+'"',
  'yarn install',
  'bower install',
  'gulp sass',
  'cp -f www/js/controller.purchase.j3k0.js www/js/controller.purchase.js',
  'ionic build android --release',
  'cp platforms/android/build/outputs/apk/android-release.apk ./TodayAir_ads_playstore_v'+taJson.version+'_min20.apk'
]));

gulp.task('release-ta-ios-nonpaid', shell.task([
  'cp ta.package.json package.json',
  'cp ta.config.xml config.xml',
  'cp ../ta-GoogleService-Info.plist GoogleService-Info.plist',
  'cp ../ta.ads.client.config.js www/client.config.js',
  'rm -rf resources;cp -a ta.resources resources',
  'cp package.json import_today_ext/package.json.backup',
  'cp import_today_ext/ta.empty.package.json package.json',
  'ionic state reset',
  'cp -a ../ta.ios/* platforms/ios/',
  'mv import_today_ext/package.json.backup package.json',
  'ionic state restore --plugins',
  'cordova plugin rm cordova-plugin-console',
  'cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY="'+FABRIC_API_KEY+'" --variable FABRIC_API_SECRET="'+FABRIC_API_SECRET+'"',
  'cordova plugin add https://github.com/WizardFactory/cordova-plugin-facebook4 --variable APP_ID="'+FACEBOOK_TA_APP_ID+'" --variable APP_NAME="'+FACEBOOK_TA_APP_NAME+'"',
  'cordova plugin add cordova-plugin-inapppurchase',
  'cp -f www/js/controller.purchase.alexdisler.js www/js/controller.purchase.js',
  'yarn install',
  'bower install',
  'gulp sass',
  'ionic build ios --release'
  //'xcodebuild -project TodayWeather.xcodeproj -scheme TodayWeather -configuration Release clean archive'
  //'xcodebuild -exportArchive -archivePath ~/Library/Developer/Xcode/Archives/2016-10-27/TodayWeather\ 2016.\ 10.\ 27.\ 13.48.xcarchive -exportPath TodayWeather.ipa''
  //'/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool --validate-app -f TodayWeather.ipa -u kimalec7@gmail.com'
  //'/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool --upload-app -f TodayWeather.ipa -u kimalec7@gmail.com'
]));

/**
 * it does not works perfectly
 */
gulp.task('rmplugins', function () {
  var pluginList = json.cordovaPlugins;
  pluginList = pluginList.map(function (plugin) {
    if (typeof plugin === 'string') {
      var index = plugin.indexOf('@');
      if (index != -1) {
        return plugin.slice(0,index);
      }
      else {

        return plugin;
      }
    }
    else {
      if (plugin.hasOwnProperty('id')) {
        return plugin.id;
      }
    }
  });
  //console.log(pluginList);
  var shellLists=[];
  for (var i=pluginList.length-1; i>=0; i--) {
    shellLists.push('cordova plugin rm '+pluginList[i]);
  }
  return gulp.src('./').pipe(shell(shellLists));
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
