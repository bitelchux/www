//##/////////////##//
//## APP LIBRARY ##//
//##/////////////##//
/////////////////
// GLOBAL VARS //
/////////////////
var db;
var dbName            = "mylivediet.app";
var lib;
var hasSql			  = (window.openDatabase && window.localStorage.getItem("config_nodb") != "active") ? true : false;
var AND               = " ";
var initialScreenSize = window.innerHeight;
var lastScreenSize    = window.innerHeight;
var lastScreenResize  = window.innerHeight;
var opaLock           = 0;
var loadingDivTimer;
var timerPerf         = (new Date().getTime());
var timerDiff         = 100;
var timerWait         = 100;
function voidThis() { }
////////////////
//            //
////////////////
var prefix = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? ''    :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? ''     :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? ''      : '';

var transitionend = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? 'transitionend' :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? 'webkitTransitionEnd' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? 'transitionend' :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? 'transitionend' : '';

var vendorClass = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? 'moz' :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? 'webkit' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? 'msie' :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? 'opera' : '';

///////////////////
// TOUCH ? CLICK //
///////////////////
function isCordova() {
	return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
}
function androidVersion() {
	if(navigator.userAgent.match(/Android/i) && document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
		return parseFloat(navigator.userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return -1;
	}
}
function hasTouch() {
	return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);	
}
function hasTap() {
	return ("ontouchstart" in document.documentElement) || ("ontouchstart" in window);
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobile = {
	Cordova: function() {
		return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
	},
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	}
};
/////////////////
// NUMBER ONLY //
/////////////////
function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
    if(!input) return "";
	input = new Date(input);
    var res = (input.getMonth()+1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
    var hour = input.getHours(); //+1;
    var ampm = "AM";
	if(hour === 12) ampm = "PM";
    if(hour > 12){
        hour-=12;
        ampm = "PM";
    }
    var minute = input.getMinutes(); //+1;
    if(minute < 10) minute = "0" + minute;
    res += hour + ":" + minute + " " + ampm;
    return res;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	//Get 1 day in milliseconds
	var one_day  = 1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = date1;
	var date2_ms = date2;
	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var minutes   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var hours     = Math.floor(difference_ms % 24);
	var days      = Math.floor(difference_ms/24);

	var lMinutes = " " + LANG('MINUTES') + " ";
	var lHours   = " " + LANG('HOURS') + " ";
	var lDays    = " " + LANG('DAYS') + " ";

	if(minutes == 0) { var lMinutes = ""; minutes = ""; }
	if(hours   == 0) { var lHours   = ""; hours   = ""; }
	if(days    == 0) { var lDays    = ""; days    = ""; }

	if(minutes == 1) { var lMinutes = " " + LANG('MINUTE') + " "; }
	if(hours   == 1) { var lHours   = " " + LANG('HOUR') + " ";   }
	if(days    == 1) { var lDays    = " " + LANG('DAY') + " ";    }

	if(days    > 3)                             { var lHours   = ""; hours   = ""; }
	if(days    > 0)                             { var lMinutes = ""; minutes = ""; }
	if(days    > 0 && hours   > 0)              { var lDays    = lDays  + LANG('AND') + " "; }
	if(hours   > 0 && minutes > 0)              { var lHours   = lHours + LANG('AND') + " "; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; var lMinutes = " " + LANG('MINUTES') + " "; }

	return days + lDays + hours + lHours + minutes + lMinutes + " " + LANG('AGO') + " ";
}
//////////////////
// TIME ELAPSED //
//////////////////
function timeElapsed() {
	var seconds = (new Date().getTime() - window.localStorage.getItem("config_start_time")) / 1000;
var date = new Date(seconds * 1000);
var dd   = Math.floor(seconds/86400);
var hh   = date.getUTCHours();
var mm   = date.getUTCMinutes();
var ss   = date.getSeconds();
//if (hh > 12) {hh = hh - 12;}
if (hh < 10) { hh = "0" + hh; }
if (mm < 10) { mm = "0" + mm; }
if (ss < 10) { ss = "0" + ss; }
// This formats your string to HH:MM:SS
if(dd > 0) { dd = dd + "d "; } else { dd = ""; }
return dd+hh+":"+mm+":"+ss;
}
//////////
// TRIM //
//////////
function trim(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
////////////////////////////
// GET WINDOW ORIENTATION //
////////////////////////////
function getOrientation() {
	if(window.orientation == 90 || window.orientation == -90) {
		return "landscape";
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return "portrait";
	}
}















