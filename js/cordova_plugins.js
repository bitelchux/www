cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.adobe.plugins.GAPlugin/www/GAPlugin.js",
        "id": "com.adobe.plugins.GAPlugin.GAPlugin",
        "clobbers": [
            "GAPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.dialogs": "0.2.5",
    "org.apache.cordova.splashscreen": "0.2.6",
    "org.apache.cordova.inappbrowser": "0.3.0",
    "com.adobe.plugins.GAPlugin": "2.3.1"
}
// BOTTOM OF METADATA
});