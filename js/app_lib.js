﻿//#////////////#//
//# APP OBJECT #//
//#////////////#//
var app = {
	width: window.innerWidth,
	height: window.innerHeight,
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
	is: {},
	config: {},
	db: {},
	tab: {},
	get: {},
	call: {},
	exec: {},
	info: {},
	exists: function(targetId) {
		if(targetId) {
			targetId = targetId.replace('#','');
		}
		if(document.getElementById(targetId)) { 
			return true;
		} else {
			return false;
		}
	},
	ua:   navigator.userAgent,
	http: window.location.protocol.indexOf('http') !== -1 ? true : false,
	now: function() {
		return new Date().getTime();
	},
	define: function(key,value) {
		if(!window.localStorage.getItem(key)) {
			window.localStorage.setItem(key,value);
			return false;
		}
		return true;
	},
	read: function(key,value,type) {
		if(type == 'object') {
			if(!window.localStorage.getItem(key)) {
				return [];
			}
			var value = window.localStorage.getItem(key)
			return value && JSON.parse(value);			
			
		}
		//
		if(typeof value !== 'undefined') {
			if(window.localStorage.getItem(key) == value) {
				return true;
			} else {
				return false;
			}
		}
		if(!window.localStorage.getItem(key)) {
			return false;
		} else {
			if(isNaN(Number(window.localStorage.getItem(key)))) {
				return window.localStorage.getItem(key);
			} else {
				return Number(window.localStorage.getItem(key));
			}
		}
	},
	save: function(key,value,type) {
		if(type == 'object') {
			if(value) {
				window.localStorage.setItem(key,JSON.stringify(value));
			}
			return;	
		}
		//
		if(window.localStorage.getItem(key) != value) {
			window.localStorage.setItem(key,value);
		}
	},
	remove: function(key) {
		if(window.localStorage.getItem(key)) {
			window.localStorage.removeItem(key);
		}
	},
	clear: function() {
		app.define('config_install_time',app.now());
		var installTime = app.read('config_install_time');
		window.localStorage.clear();
		app.save('config_install_time',installTime);
	},
	show: function(target,callback) {
		$(target).css('pointer-events','auto');
		$(target).css(prefix + 'transition', 'opacity ease .32s');
		$(target).css('opacity',1);
		setTimeout(function() {
			if(callback) {
				callback(target);	
			}
		},320);
	},
	hide: function(target,callback) {
		$(target).css('pointer-events','none');
		$(target).css(prefix + 'transition', 'opacity ease .12s');
		$(target).css('opacity',0);	
		setTimeout(function() {
			if(callback) {
				callback(target);	
			}
		},120);
	}
}
//////////////////
// TOTAL WEIGHT //
//////////////////
app.get.totalweight = function() {
	if (!app.read('calcForm#pA3B')) {
		return 80;
	}
	if (app.read('calcForm#pA3C','pounds')) {
		return Math.round(app.read('calcForm#pA3B')/2.2);
	}	
	return app.read('calcForm#pA3B');
};
app.get.androidVersion = function() {
	if((/Android/i).test(app.ua) && window.location.protocol.indexOf('http') === -1) {
		//android L
		if((/Build\/L/i).test(app.ua)) { return 4.4; }
		return parseFloat(app.ua.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return false;
	}
};
app.get.isChromeApp = function() {
	if(typeof chrome !== 'undefined') {
		if(typeof chrome.app !== 'undefined') {
			if(chrome.app.isInstalled) {
				return true;	
			}
		}
	}
	return false;
}
app.get.isDesktop = function() {

};
//////////////////
// PRINT OBJECT //
//////////////////
app.print = function(obj, maxDepth, prefix) {
	if(!maxDepth) {
		maxDepth = 3;
	}
	var result = '';
	if (!prefix)
		prefix = '';
	for (var key in obj) {
		if (typeof obj[key] == 'object') {
			if (maxDepth !== undefined && maxDepth <= 1) {
				result += (prefix + key + '=object [max depth reached]\n');
			} else {
				result += app.print(obj[key], (maxDepth) ? maxDepth - 1 : maxDepth, prefix + key + '.');
			}
		} else {
			result += (prefix + key + '=' + obj[key] + '\n');
		}
	}
	return result;
}
////////////////
// APP DEVICE //
////////////////
app.device = {
	cordova    : ((typeof cordova || typeof Cordova) !== 'undefined') ? true : false,
	android    : (/Android/i).test(app.ua) ? app.get.androidVersion() : false,
	android2   : (/Android/i).test(app.ua) && app.get.androidVersion() < 4 ? true : false,
	ios        : (/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	ios7       : (/OS [7-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios8       : (/OS [8-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	wp8        : (/IEMobile/i).test(app.ua) ? true : false,
	wp81       : (/Windows Phone 8.1/i).test(app.ua) ? true : false,
	wp81JS     : (/Windows Phone 8.1/i).test(app.ua) && (/MSApp/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IEMobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IEMobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IEMobile/i).test(app.ua) ? true : false,
	firefoxos  : ((/firefox/i).test(app.ua) && (/mobile/i).test(app.ua) && (/gecko/i).test(app.ua)) ? true : false,
	osx        : ((/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua)) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,	
	chromeos   : app.get.isChromeApp() ? true : false,
	blackberry : (/BB10|BlackBerry/i).test(app.ua) ? true : false,
	amazon     : (/Amazon|FireOS/i).test(app.ua) ? true : false,
	desktop    : (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Touch/i.test(app.ua) || document.createTouch) ? false : true,
};
//STATIC
if(typeof staticVendor !== 'undefined') {
	if(staticVendor == 'blackberry') {
		app.device.blackberry = true;	
	}
	if(staticVendor == 'amazon') {
		app.device.amazon = true;	
	}	
}
//////////////////////
// GLOBAL SHORTCUTS //
//////////////////////
app.get.platform = function(noweb) {
	if(app.device.ios && app.http)     { return 'web';           }
	if(app.device.android && app.http) { return 'web';           }
	if(app.device.wp8 && app.http)     { return 'web';           }
	if(app.device.ios)                 { return 'iOS';           }
	if(app.device.amazon)              { return 'FireOS';        }
	if(app.device.blackbery)           { return 'BlackBerry';    }
	if(app.device.android)             { return 'Android';       }
	if(app.device.wp8)                 { return 'Windows Phone'; }
	if(app.device.windows8)            { return 'Windows 8';     }
	if(app.device.firefoxos)           { return 'FirefoxOS';     }	
	if(app.device.osxapp)              { return 'Mac';           }
	if(app.device.chromeos)            { return 'ChromeOS';      }
	return 'web';
};
////////////////////
// GLOBAL BOOLEAN //
////////////////////
app.is.scrollable = ($.nicescroll && !app.device.ios && !app.device.wp8 && !app.device.firefoxos && !app.device.windows8T && app.device.android < 4.4) ? true : false;
//////////////////
// APP.REBOOT() //
//////////////////
app.reboot = function(type,error) {
	var timeout = type == 'now' ? 0 : 500;
	//CLEAR CACHE
	if(type == 'reset') {
		app.remove('remoteSuperBlockJS');
		app.remove('remoteSuperBlockCSS');
		app.remove('app_autoupdate_hash');
	}
	//WIPE STORAGE
	if(type == 'clear') {
		app.clear();	
	}
	setTimeout(function() {	
		//RELOAD
		if(app.device.android >= 3) {
			if(typeof window.MyReload !== 'undefined') {
				window.MyReload.reloadActivity();
			} else {
				window.location.reload(true);	
			}
		} else {
			window.location.reload(true);
		}
	},timeout);
	if(error) {
		throw error;
	}
};
//////////
// ZOOM //
//////////
/**/
app.zoom = function(ratio) {
	if(!ratio) {
		//ratio = app.read('app_zoom');
	}
	if(ratio == 1 || app.read('app_zoom',1)) {
		$('html').addClass('zoomx1');
		$('html').removeClass('zoomx2 zoomx3');
		app.save('app_zoom',1);
	}
	if(ratio == 2 || app.read('app_zoom',1.2)) {
		$('html').addClass('zoomx2');
		$('html').removeClass('zoomx1 zoomx3');
		app.save('app_zoom',1.2);
	}
	if(ratio == 3 || app.read('app_zoom',1.4)) {
		$('html').addClass('zoomx3');
		$('html').removeClass('zoomx1 zoomx2');		
		app.save('app_zoom',1.4);
	}
	//$('body').css('zoom',Math.round(app.read('app_zoom') * 100) + '%');
	//$('body').css('zoom',app.read('app_zoom'));
	//$('body').css('-moz-transform','scale(' + app.read('app_zoom') + ',' + app.read('app_zoom') + ')');
	if(typeof appResizer == 'function') {
		appResizer();
		$('.nicescroll-rails').css('display','none');
		clearTimeout(app.timers.zoomRails);
		app.timers.zoomRails = setTimeout(function() {
			$('.nicescroll-rails').css('display','block');
		},400);
	}
};
//app.zoom();

///////////////
// APP READY //
///////////////
app.ready = function(callback) {
	//READY
	$('body').addClass('ready');
	//////////////
	// VIEWPORT //
	//////////////
	if(app.device.ios) {
		$('#viewPort').attr('content', $('#viewPort').attr('content').split('height=device-height').join('minimal-ui') );
	}
	//////////////
	// CALLBACK //
	//////////////
	if(typeof callback === 'function') {
		callback();	
	}
};
///////////////////
// APPEND SCRIPT //
///////////////////
app.appendScript = function(url) {
	var script   = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};
/////////
// URL //
/////////
app.url = function(url) {
	//STORES
	var store = {
		web:        'http://kcals.net',
		ios:        'https://itunes.apple.com/app/id732382802',
		android:    'https://play.google.com/store/apps/details?id=com.cancian.kcals',
		wp8:        'http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e',
		windows8:   app.device.windows8 ? 'ms-windows-store:PDP?PFN=27631189-ce9d-444e-a46b-31b8f294f14e' : 'http://apps.microsoft.com/windows/app/kcals/27631189-ce9d-444e-a46b-31b8f294f14e',
		firefoxos:  'https://marketplace.firefox.com/app/kcals',
		osxapp:     app.device.osx ? 'macappstores://itunes.apple.com/app/id898749118' : 'https://itunes.apple.com/app/id898749118',
		chromeos:   'https://chrome.google.com/webstore/detail/kcals-calorie-counter/ipifmjfbmblepifflinikiiboakalboc',
		blackberry: app.device.blackberry ? 'appworld://content/59937667' : 'http://appworld.blackberry.com/webstore/content/59937667',
		amazon:     'http://www.amazon.com/Kcals-net-KCals-Calorie-Counter/dp/B00NDSQIHK/qid=1411265533',
	};
	//SHORTCUT
	     if((!url && app.device.ios)       || url == 'ios')        { url = store.ios;        }
	else if((!url && app.device.amazon)    || url == 'amazon')     { url = store.amazon; store.android = store.amazon; }
	else if((!url && app.device.blackbery) || url == 'blackberry') { url = store.blackberry; }
	else if((!url && app.device.android)   || url == 'android')    { url = store.android;    }
	else if((!url && app.device.wp8)       || url == 'wp8')        { url = store.wp8;        }
	else if((!url && app.device.windows8)  || url == 'windows8')   { url = store.windows8;   }
	else if((!url && app.device.firefoxos) || url == 'firefoxos')  { url = store.firefoxos;  }	
	else if((!url && app.device.osxapp)    || url == 'osxapp')     { url = store.osxapp;     }
	else if((!url && app.device.chromeos)  || url == 'chromeos')   { url = store.chromeos;   }
	else if(url == 'www')										   { url = store.web;        }
	//OPEN
	if(url) {
		     if(app.device.ios)			{ window.open(url, '_system', 'location=yes');								}
		else if(app.device.android)		{ window.open(url, '_system', 'location=yes');								}
		else if(app.device.wp8)			{ ref = window.open(url, '_blank', 'location=no');							}
		else if(app.device.windows8)	{ Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(url));	}
		else if(app.device.firefoxos)	{ ref = window.open(url, '_system', 'location=yes');						}
		else if(app.device.osxapp)		{ macgap.app.open(url);														}
		else 							{ window.open(url, '_blank'); 												}
	}
};
//////////////
// APP INFO //
//////////////
var userAgent           = navigator.userAgent;
var appBalance;
var appBalanceOver;
var appStatus;
var appHeader;
var appFooter;
var db;
var dbName              = "mylivediet.app";
var lib;
var lib2;
var storeEntry;
var storeFood;
var hasSql              = (window.openDatabase && window.localStorage.getItem("config_nodb") != "active") ? true : false;
var AND                 = " ";
var initialScreenWidth  = window.innerWidth;
var initialScreenHeight = window.innerHeight;
var orientationSwitched = 0;
var initialScreenSize   = window.innerHeight;
var lastScreenSize      = window.innerHeight;
var lastScreenResize    = window.innerHeight;
var opaLock             = 0;
var loadingDivTimer;
var timerPerf           = (new Date().getTime());
var timerDiff           = 100;
var timerWait           = 100;
var noteContent         = '';
var noTimer;
var ref;
var preTab;
var afterTab;
var timerKcals;
var rebuildHistory;
var blockModal = false;
var modalTimer;
var rowsEntry = [];
var rowsFood  = [];
function voidThis()   { }
function voidMe()     { }
/////////////////
// APP COUNTER //
/////////////////
//app.counter.start();
//app.counter.stop(0,'before callback');
app.counter = {
	startTime: 0,
	start: function() {
		app.counter.startTime = new Date().getTime();
	},
	stop: function(action,msg) {
		if(msg) {
			msg = msg + ':  ';
		} else {
			msg = 0;
		}
		if(action == 1) {
			alert(msg + (new Date().getTime() - app.counter.startTime));
		} else {
			console.log(msg + (new Date().getTime() - app.counter.startTime));
		}
	}
}
//////////////////
// APP HANDLERS //
//////////////////
app.handlers = {
	//////////////////
	// CSS FADE OUT //
	//////////////////
	fade : function(inOut,target,callback,duration) {
		if(!duration) {
			duration = 200;
		}
		//PRE-HIDE FADE-IN
		if(inOut == 1) {
			$(target).css(prefix + 'transition-duration', '0s');
			$(target).css('opacity',0);
			$(target).hide();
		}
		////////////////////
		// TRANSITION END //
		////////////////////
		$(target).off(transitionend).on(transitionend,function() {
			if(inOut == 0) {
				$(target).remove();
			} else {
				//fast resizing
				$(target).css(prefix + 'transition-duration', '0s');
			}
			if(callback) {
				callback();
				callback = '';
			}
		});
		//////////////////
		// SET ANIMATED //
		//////////////////
		$(target).css(prefix + 'transition', 'opacity ease ' + (duration/1000) + 's');
		///////////////////////////////////
		// SET OPACITY ~ ENFORCE REMOVAL //
		///////////////////////////////////
		if(inOut == 1) {
			$(target).show();
		}
		//setTimeout(function() {
			$(target).css('opacity',inOut);
			setTimeout(function() {
				if($(target).length && callback !== '') {
					$(target).trigger(transitionend);
				}
			//ENFORCE
			},300);
		//DEFER
		//},0);
	},
	////////////////
	// ACTIVE ROW //
	////////////////
	activeRowTouches : 0,
	activeRowBlock   : 0,
	activeRowTimer   : '',
	activeLastId     : '',
	activeRow : function (target, style, callback,callbackCondition) {
		var isButton = style == 'button' ? 40 : 40;
		//RESET
		app.handlers.activeRowTouches = 0;
		app.handlers.activeRowBlock   = 0;
		app.handlers.activeLastId     = '';				
		clearTimeout(app.handlers.activeRowTimer);
		////////////////
		// SET PARENT //
		////////////////
		var targetParent = target;
		if (target.match(' ')) {
			targetParent = target.split(' ')[0] + ', ' + target;
		}
		//////////////
		// TOUCHEND //
		//////////////
		$(target).on(touchend, function (evt) {
			if($(this).hasClass(style) && app.handlers.activeRowBlock == 0) {
				if (callback) {
					app.handlers.activeRowBlock = 1;
					if(isButton == 0) {
						callback(evt);
					} else {
						callback($(this).attr('id'));
					}
					$(this).addClass(style);
					app.handlers.activeLastId = '#' + $(this).attr('id');
					app.handlers.activeRowTouches = 0;
					app.handlers.activeRowBlock   = 0;
					clearTimeout(app.handlers.activeRowTimer);
					if(style != 'activeOverflow') {
						$(app.handlers.activeLastId).removeClass(style);
					}
				}
			} else {
				app.handlers.activeRowTouches = 0;
				app.handlers.activeRowBlock   = 0;
				clearTimeout(app.handlers.activeRowTimer);
			}
		});
		////////////////
		// TOUCHSTART //
		////////////////
		setTimeout(function () {
			$(target).on(touchstart, function (evt) {
				if(!$(this).hasClass(style)) {
					$(app.handlers.activeLastId).removeClass(style);
				}
				var localTarget = this;
				app.handlers.activeRowTouches = 0;
				clearTimeout(app.handlers.activeRowTimer);
				app.handlers.activeRowTimer = setTimeout(function () {
					if (app.handlers.activeRowTouches == 0 && app.handlers.activeRowBlock == 0) {
						$(localTarget).addClass(style);
						app.handlers.activeLastId = '#' + $(localTarget).attr('id');
					} else {
						$(app.handlers.activeLastId).removeClass(style);
					}
				}, isButton);
				//CALLBACK CONDITION
				if(callbackCondition) {
					if(callbackCondition() === false) {
						clearTimeout(app.handlers.activeRowTimer);
					}
				}
				if(isButton == 0) {
					return false;
				}
			});
		}, 400);
		//////////////////////
		// ROW LEAVE CANCEL //
		//////////////////////
		if(app.device.windows8) {
			$(target).on('pointerleave pointercancel pointerout', function (evt) {
				$(app.handlers.activeLastId).removeClass(style);
				clearTimeout(app.handlers.activeRowTimer);
			});
		}
		if(!app.device.windows8) {
			$(targetParent).on('mouseout mouseleave touchleave touchcancel', function (evt) {
				app.handlers.activeRowTouches++;
				if(!app.device.wp8 && style != 'activeOverflow') {
					clearTimeout(app.handlers.activeRowTimer);
					$(app.handlers.activeLastId).removeClass(style);
				}
			});
		}
		////////////////////////
		// SCROLL/MOVE CANCEL //
		////////////////////////
		if(!app.device.windows8) {
			var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove;
			$(targetParent).on('scroll ' + moveCancel, function (evt) {
				app.handlers.activeRowTouches++;
				clearTimeout(app.handlers.activeRowTimer);
				if (app.handlers.activeRowTouches > 7 || (app.handlers.activeRowTouches > 1 && app.device.android)) {
					$(app.handlers.activeLastId).removeClass(style);
					if(app.device.osxapp || app.device.osx) {
						$('.activeOverflow').removeClass(style);
					}
					app.handlers.activeRowTouches = 0;
				}
			});
		}
		///////////////////////
		// SCROLL TIME BLOCK //
		///////////////////////
		$(targetParent).on('scroll', function (evt) {
			app.handlers.activeRowBlock = 1;
			setTimeout(function () {
				app.handlers.activeRowBlock = 0;
			}, 100);
		});
	},
	///////////////////
	// HIGHLIGHT ROW //
	///////////////////
	highlight: function(target,callback) {
		$(target).removeClass('activeOverflow');
		$(target).addClass('yellow');
		setTimeout(function () {
			$(target).css(prefix + 'transition','background linear .5s');
			setTimeout(function () {		
				$(target).removeClass('yellow');
				setTimeout(function () {
					$(target).css(prefix + 'transition','background linear 0s');
					if(callback) {
						callback();
					}
				}, 500);
			}, 100);
		}, 100);
	},
	///////////////
	// BUILD ROW //
	///////////////
	buildRows: function(data,filter) {
		//////////////////
		// TOTAL WEIGHT //
		//////////////////
		var totalWeight = app.get.totalweight();
		////////////////
		// LOOP ARRAY //
		////////////////
		var rowHtml = '';
		var rowSql  = '';
		var lastRowId = '';
		var i = data.length;
		//data = data.reverse();
		while(i--) {
			/////////////////////
			// FILTER REPEATED //
			/////////////////////
			if (data[i].id && data[i].id !== lastRowId) {
				lastRowId = data[i].id;
				var favClass = (data[i].fib === 'fav') ? ' favItem' : '';
				if((JSON.stringify(data[i].id)).length >= 13) {
					favClass = favClass + ' customItem';
				}
				var rowType  = (data[i].type == '0000' || data[i].type == 'exercise') ? 'exercise' : 'food';
				var catClass = 'cat' + (data[i].type).split('food').join('9999').split('exercise').join('0000');
				///////////////////////////
				// AJUST WEIGHT EXERCISE //
				///////////////////////////
				var kcals = data[i].kcal;
				if (rowType == 'exercise') {
					kcals = Math.round(((data[i].kcal * totalWeight) / 60) * 30);
				}
				//FORCE DECIMAL
				data[i].name = sanitizeSql(data[i].name);
				if(!data[i].pro)  { data[i].pro  = 0; }
				if(!data[i].car)  { data[i].car  = 0; }
				if(!data[i].fat)  { data[i].fat  = 0; }
				data[i].pro  = Math.round(data[i].pro  * 100) / 100;
				data[i].car  = Math.round(data[i].car  * 100) / 100;
				data[i].fat  = Math.round(data[i].fat  * 100) / 100;
				data[i].fib  = (data[i].fib).split('diary_food').join('');
				//////////////
				// ROW HTML //
				//////////////
				rowHtml += '\
				<div class="searcheable' + favClass + ' ' + rowType + ' ' + data[i].id + ' ' + catClass + '" id="' + data[i].id + '">\
				<div class="foodName ' + rowType + '">' + data[i].name + '</div>\
				<span class="foodKcal"><span class="preSpan">' + LANG.KCAL[lang] + '</span>' + kcals + '</span>';
				////////////////////////
				// ADD NUTRITION INFO //
				////////////////////////
				if (rowType === 'food') {
					rowHtml += '\
					<span class="foodPro ' + rowType + '"><span class="preSpan">' + LANG.PRO[lang] + '</span>' + data[i].pro + '</span>\
					<span class="foodCar ' + rowType + '"><span class="preSpan">' + LANG.CAR[lang] + '</span>' + data[i].car + '</span>\
					<span class="foodFat ' + rowType + '"><span class="preSpan">' + LANG.FAT[lang] + '</span>' + data[i].fat + '</span>';
				}
				rowHtml += '</div>';
				///////////////
				// BUILD SQL //
				///////////////
				if(filter) {
					rowSql += "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + data[i].id + ",'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + data[i].kcal + "','" + data[i].pro + "','" + data[i].car + "','" + data[i].fat + "','" + data[i].fib + "');\n";
				}
			}
		}
		///////////////
		// WRITE SQL //
		///////////////
		if(filter) {
			//PREPARE
			if(rowSql == '') {
				rowSql = ' ';	
			}
			rowSql = rowSql.split('undefined').join('');
			//
			if(filter === 'fav') {
				app.save('customFavSql', rowSql);
			} else {
				app.save('customItemsSql', rowSql);				
			}
		}
		/////////////////
		// RETURN HTML //
		/////////////////
		if(rowHtml == '') {
			if($('#foodSearch').is(':focus')) {
				rowHtml = '<div class="searcheable noContent"><div><em>' + LANG.NO_MATCHES[lang] + '</em></div></div>';
			} else {
				//rowHtml = '<span id="noMatches"> ' + LANG.NO_ENTRIES[lang] +' </span>'; //
				rowHtml = '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>';
			}
		}
		////////////
		// OUTPUT //
		////////////
		return rowHtml;
	},
	//@//////////@//
	//@ REPEATER @//
	//@//////////@//
	repeaterTrigger: '',
	repeaterLoop:    '',
	repeater: function(target,style,triggerMs,repeatMs,callback) {
		$(target).removeClass(style);
		clearTimeout(app.repeaterTrigger);
		clearTimeout(app.repeaterLoop);
		///////////////
		// AUTOCLEAR //
		///////////////
		var clearActions = touchend + ' mouseout mouseleave touchleave touchcancel';
		$(target).off(clearActions).on(clearActions, function (evt) {
			evt.preventDefault();
			$(target).removeClass(style);
			clearTimeout(app.repeaterTrigger);
			clearTimeout(app.repeaterLoop);
		});
		/////////////
		// TRIGGER //
		/////////////
		$(target).off(touchstart).on(touchstart, function (evt) {
			evt.preventDefault();
			clearTimeout(app.repeaterTrigger);
			clearTimeout(app.repeaterLoop);
			//TAP
			$(target).addClass(style);
			callback();
			//START
			app.repeaterTrigger = setTimeout(function() {
				//REPEAT
				(function repeatMe() {
					clearTimeout(app.repeaterTrigger);
					clearTimeout(app.repeaterLoop);
					callback();
					app.repeaterLoop = setTimeout(repeatMe,repeatMs);
				})();
			}, triggerMs);
			return false;
		});
	},
};
////////////////
// ADD/REMOVE //
////////////////
app.handlers.addRemove = function(target,minValue,maxValue,valueType) {
	if(!minValue) { minValue = 0;    }
	if(!maxValue) { maxValue = 9999; }
	//HTML
	if(!$( target + 'Neg').html()) {
		$(target).before('<p class="neg" id="' + target.replace('#','') + 'Neg"></p><p class="pos" id="' + target.replace('#','') + 'Pos"></p>');
	}
	//NEG
	app.handlers.repeater(target + 'Neg','active',400,25,function() {
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue >= minValue + 1) {
			inputValue = inputValue - 1;
		} else {
			inputValue = 0;
		}
		$(target).val(decimalize(inputValue,-1));
	})
	//POS
	app.handlers.repeater(target + 'Pos','active',400,25,function() {
		if($(target).val() == '') { 
			$(target).val(0);
		}
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue <= maxValue - 1) {
			inputValue = inputValue + 1;
		}
		$(target).val( decimalize(inputValue,-1) );
	})				
};
/////////////
// APP GET //
/////////////
////////////////
// SCREENSHOT //
////////////////
app.get.screenshot = function() {
//SCREENSHOT
	var day = 60 * 60 * 24 * 1000;
	clearEntries(function() {
		saveEntry({raw: true, id: app.now()-(0*day), title: 1300, body: '', published: app.now()-(0*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(1*day), title: 1800, body: '', published: app.now()-(1*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(2*day), title: 1500, body: '', published: app.now()-(2*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(3*day), title: 1000, body: '', published: app.now()-(3*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(4*day), title: 1300, body: '', published: app.now()-(4*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(5*day), title: 1800, body: '', published: app.now()-(5*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(6*day), title: 1300, body: '', published: app.now()-(6*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(7*day), title: 1000, body: '', published: app.now()-(7*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		app.save('config_start_time',app.now()-(7.7*day));
		app.save('config_kcals_day_0',1400);
		$('#timerDailyInput').val(app.read('config_kcals_day_0'));
		updateTimer();
		app.exec.updateEntries();
	});
};
//KCALS
app.get.kcals = function(opt) {
	if(app.read('config_kcals_type','cyclic')) {
		if(app.read('config_kcals_day','d')) {
			if(opt == 'reset') {
				return 2000;
			}
			if(opt == 'key') {
				return 'config_kcals_day_2';
			}
			return app.read('config_kcals_day_2');
		} else {
			if(opt == 'reset') {
				return 1600;
			}
			if(opt == 'key') {
				return 'config_kcals_day_1';
			}
			return app.read('config_kcals_day_1');
		}
	} else {
		if(opt == 'reset') {
			return 2000;
		}
		if(opt == 'key') {
			return 'config_kcals_day_0';
		}
		return app.read('config_kcals_day_0');
	}
};
//#///////////#//
//# MOBILE OS #//
//#///////////#//
function getIsDesktop() {
}
var isItDesktop = getIsDesktop();
function isDesktop() {
	return isItDesktop;
}
///////////
// LOADER //
///////////
if($('#loadMask').html() == '') {
	$('#loadMask').html('<span></span>');
}
document.addEventListener("DOMContentLoaded", function(event) {
	$('body').addClass('domcontentloaded');
});
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobileCordova    = (typeof cordova != 'undefined' || typeof Cordova != 'undefined') ? true : false;
var isMobileAndroid    = (/Android/i).test(userAgent) ? true : false;
var isMobileiOS        = (/(iPhone|iPad|iPod)/i).test(userAgent) ? true : false;
var isMobileWindows    = (/IEMobile/i).test(userAgent) ? true : false;
var isMobileWP81       = (/Windows Phone 8.1/i).test(userAgent) ? true : false;
var isMobileMSApp      = (/MSApp/i).test(userAgent) ? true : false;
var isMobileFirefoxOS  = ((/firefox/).test(userAgent.toLowerCase()) && (/mobile/).test(userAgent.toLowerCase()) && (/gecko/).test(userAgent.toLowerCase())) ? true : false;
var isMobileOSX        = ((/(Macintosh|Mac OS X)/i).test(userAgent) && !(/(iPhone|iPad|iPod)/i).test(userAgent)) ? true : false;
var isMobileOSXApp     = (/MacGap/i).test(userAgent) ? true : false;
var isMobileBlackBerry = (/BB10|BlackBerry/i).test(userAgent) ? true : false;
var isMobile = {
	Cordova: function() {
		return isMobileCordova;
	},
	Android: function() {
		return isMobileAndroid;
	},
	iOS: function() {
		return isMobileiOS;
	},
	Windows: function() {
		return isMobileWindows;
	},
	WP81: function() {
		return isMobileWP81;
	},	
	MSApp: function() {
		return isMobileMSApp;
	},	
	FirefoxOS: function() {
		return isMobileFirefoxOS;
	},
	OSX: function() {
		return isMobileOSX;
	},
	OSXApp: function() {
		return isMobileOSXApp;
	},
	BlackBerry: function() {
		return isMobileBlackBerry;
	},	
	ChromeApp: function() {
		if(chrome) {
			if(chrome.app) {
				if(chrome.app.isInstalled) {
					 return true;	
				}
			}
		}
		return false;
	}
};
//#///////////////#//
//# GET USERAGENT #//
//#///////////////#//
var prefix;
var vendorClass; 
var transitionend;
     if((/trident|IEMobile/i).test(app.ua))	{ prefix = '-ms-';     transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/Firefox/i).test(app.ua))			{ prefix = '-moz-';    transitionend = 'transitionend';       vendorClass = 'moz';    }
else										{ prefix = '-webkit-'; transitionend = 'webkitTransitionEnd'; vendorClass = 'webkit'; } 
///////////////////////////////////
// STANDALONE CONVERT CSS PREFIX //
///////////////////////////////////
if (!$("#plainLoad").length && !$("#superBlockCSS").length) {
	if (vendorClass == "moz" || vendorClass == "msie") {
		$.support.cors = true;
		$.ajax({
			url : hostLocal + "css/index.css",
			dataType : "text",
			success : function (dataCSS) {
				if(vendorClass == 'moz') {
					dataCSS = dataCSS.split('-webkit-').join('-moz-');
				}
				if(vendorClass == 'msie') {
					dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
					dataCSS = dataCSS.split('-webkit-').join('-ms-');
				}
				app.safeExec(function () {
					$("#coreCss").remove();
					$("#coreFonts").prepend("<style type='text/css' id='coreCss'></style>");
					$("#coreCss").html(dataCSS);
				});
			}
		});
	}
}
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
function isCordova() {
	return isMobileCordova; //(typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
}
function getAndroidVersion() {
	if((/Android/i).test(userAgent) && window.location.protocol.indexOf('http') === -1) {
		//android L
		if((/Build\/L/i).test(userAgent)) { return 4.4; }
		return parseFloat(userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return -1;
	}
}
var gotAndroidVersion = getAndroidVersion();
var androidVersion = function() {
	return gotAndroidVersion;
};

var varHasTouch = window.location.protocol.indexOf('http') === -1 && (/(iPhone|iPod|iPad|Android|BlackBerry)/).test(userAgent);
function hasTouch() {
	return varHasTouch;
}
var varHasTap = (("ontouchstart" in document) || ("ontouchstart" in window));
function hasTap() {
	return varHasTap;
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
if ((/MSAppHost\/1.0|IEMobile/i).test(app.ua) && !app.device.wp81JS && window.navigator.msPointerEnabled) {
	//touchmove  = "MSPointerMove";
	touchend = "MSPointerUp";
	//touchstart = "MSPointerDown";
}
if (app.device.firefoxos) {
	tap       = 'click';
	singletap = 'click';
}
/*
MSPointerDown			pointerdown
MSPointerUp				pointerup
MSPointerCancel			pointercancel
MSPointerMove			pointermove 
MSPointerOver			pointerover 
MSPointerOut			pointerout 
MSPointerEnter			pointerenter 
MSPointerLeave			pointerleave 
*/
///////////////
// SAFE EXEC //
///////////////
app.safeExec = function (callback) {
	if (app.device.windows8) {
		MSApp.execUnsafeLocalFunction(function () {
			callback();
		});
	} else {
		callback();
	}
}
///////////////////
// ERROR HANDLER //
///////////////////
function errorHandler(error) {
	if (window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if (app.device.windows8) {
			if (typeof alert !== 'undefined') {
				alert(JSON.stringify(error));
			}
		} else {
			if (confirm(JSON.stringify(error))) {
				blockAlerts = 0;
			} else {
				blockAlerts = 1;
			}
		}
		console.log(JSON.stringify(error));
	}
}
/////////////////
// NUMBER ONLY //
/////////////////
function isNumberKey(evt){
	var keyCode = (evt.which) ? evt.which : evt.keyCode;
	//backspace, enter, shift, left, right
	if(keyCode == 8 || keyCode == 13 || keyCode == 16 || keyCode == 37 || keyCode == 39) { 
		return true; 
	}
	if(keyCode != 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
		return false;
	}
	return true;
}
app.handlers.validate = function(target,config,preProcess,postProcess,focusProcess,blurProcess) {
	var inputHandler = (app.device.android == 4.1 || app.device.wp8) ? 'keydown' : 'keypress';
	//SETTINGS
	if(!config)           { config = {}; }
	if(!config.maxValue)  { config.maxValue  = 9999; }
	if(!config.maxLength) { config.maxLength = 4;    }
	//if(!config.allowDots) { config.allowDots = 0; }
	//if(!config.inverter)  { config.inverter  = 0; }
	////////////////////////
	// KEYDOWN VALIDATION //
	////////////////////////
	var keydownId;
	var keydownValue;
	$(target).on(inputHandler, function(evt) {
		keydownId    = evt.target.id;
		keydownValue = JSON.stringify($(this).val());
		var keyCode  = evt.which || evt.keyCode;
		//PRE HANDLERS
		if(preProcess) {
			preProcess();	
		}
		////////////
		// CONFIG //
		////////////
		//ENTER
		if(keyCode == 13)								{ $(this).blur(); return true; }
		//MINUS INVERTER
		if(keyCode == 45 && config.inverter == true)	{ $(this).val( $(this).val()*-1 ); return false; }
		if(keyCode == 46 && config.inverter == true)	{ $(this).val( $(this).val()*-1 ); return false; }
		//DOT
		if(keyCode == 46) {
			if(config.allowDots != true || keydownValue.split('.').join('').length < keydownValue.length) {
				return false;
			}
			return true;
		}
		///////////////////
		// ENFORCE LIMIT //
		///////////////////
		keydownValue = $(this).val();
		if(parseInt($(this).val()) > config.maxValue || JSON.stringify($(this).val()).length > config.maxLength+1) {
			if(config.allowDots == true)  {
				$(this).val( parseFloat($(this).val()) );				
			} else {
				$(this).val( parseInt($(this).val()) );
			}
			//PRE-CHECK
			if(isNumberKey(evt)) {
				keydownValue = $(this).val();
				$(this).val( $(this).val().slice(0,-1) );
			}
		}
		//CHECK
		return isNumberKey(evt);
	});
	//////////////////////
	// KEYUP VALIDATION //
	//////////////////////
	$(target).on('keyup change input paste', function(evt) {
		var keyCode = evt.which || evt.keyCode;
		//' bug
		if(keyCode == 222 || isNaN($(this).val())) {
			$('#' + keydownId).val( keydownValue );
		}
		//NO NEGATIVE		
		if(!config.inverter) {
			if(parseInt($(this).val()) < 0) {
				$(this).val( Math.abs($(this).val()) )
			}
		}
		//POST HANDLERS
		if(postProcess) {
			postProcess();
		}
	});
	///////////
	// FOCUS //
	///////////
	$(target).on('focus', function(evt) {
		if($(this).val() == '0') {
			$(this).val('');
		}
		//FOCUS HANDLER
		if(focusProcess) {
			focusProcess();
		}
	});
	//////////
	// BLUR //
	//////////
	$(target).on('blur', function(evt) {
		if($(this).val().length == 0 || parseInt($(this).val()) == 0 || isNaN($(this).val())) {
			if(config.defaultValue) {
				$(this).val(config.defaultValue);
			} else {
				$(this).val('0');
			}
		}
		if(config.minValue) {
			if($(this).val() < config.minValue) {
				$(this).val(config.minValue);
			}
		}
		if(config.maxValue) {
			if($(this).val() > config.maxValue) {
				$(this).val(config.maxValue);
			}
		}
		//BLUR HANDLER
		if(blurProcess) {
			blurProcess();
		}
	});
	/////////////////
	// PROPAGATION //
	/////////////////
	$(target).on(touchmove, function(evt) {	
		evt.preventDefault();
	});
};
//////////
// TRIM //
//////////
function trim(str) {
	if(!str) { return ''; }
	str = str.replace(/^\s+/, '');
	str = str.replace(/(^[ \t]*\n)/gm, "");
	for(var i = str.length - 1; i >= 0; i--) {
		if(/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
//////////////
// HIGHLIGH //
//////////////
function highlight(targetId,startColor,endColor,fadeTime) {
	//$(targetId).animate({backgroundColor : "#ff8"}, 1).animate({backgroundColor : "rgba(255,255,255,0.36)"}, 1500);
	if(!startColor) { startColor = '#ff8'; }
	if(!endColor)   { endColor   = 'rgba(255,255,255,0.36)'; }
	if(!fadeTime)   { fadeTime   = 1500; }
	$(targetId).animate({backgroundColor : startColor}, 1).animate({backgroundColor: endColor}, fadeTime);
}
////////////////
// CAPITALIZE //
////////////////
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
///////////
// isOdd //
///////////
function isOdd(int) {
	return int % Math.round(2);
}
////////////////
// DECIMALIZE //
////////////////
function decimalize(int,p) {
	if((Math.round(Number(int) *  10)  / 10) == 0 && p == -1) { return '0';    }
	if((Math.round(Number(int) *  10)  / 10) == 0 && p == 1)  { return '0.0';  }
	if((Math.round(Number(int) * 100) / 100) == 0)			  { return '0.00'; }
	if(p == 1)				{
		return Math.round(Number(int) * 10) / 10;
	}
	return Math.round(Number(int) * 100) / 100;
}
//////////////
// CONTAINS //
//////////////
String.prototype.contains = function() {
	return String.prototype.indexOf.apply( this, arguments ) !== -1;
};
Array.prototype.contains = function(obj) {
	return JSON.stringify(this).indexOf(obj) > -1;
};
//String.prototype.contains = function(obj) {
//	return this.indexOf(obj) > -1;
//};
////////////////
// SORTBYATTR //
////////////////
Array.prototype.sortbyattr = function(attr,order) {
	// NORMAL ATTR SORT
	this.sort(function(a, b) {
		if(order == 'desc') {
			return (b[attr] > a[attr]) ? 1 : ((b[attr] < a[attr]) ? -1 : 0);
		} else {
			return (a[attr] > b[attr]) ? 1 : ((a[attr] < b[attr]) ? -1 : 0);
		}
	});
	return this;	
}
// OBJECT
function sortObject(obj) {
	var arr = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			arr.push([prop,obj[prop]]);
		}
	}
	return arr.sort().reverse();
}
/////////////////
// PUSH UNIQUE //
/////////////////
Array.prototype.pushUnique = function (item) {
	if (this.indexOf(item) == -1) {
		//if(jQuery.inArray(item, this) == -1) {
		this.push(item);
		return true;
	}
	return false;
}
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
    if(!input) { return ""; }
	input        = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var hour     = input.getHours();
    var minute   = input.getMinutes(); //+1;
    if(minute < 10)   { minute = "0" + minute; }
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	//
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate + ' - ' + hour + ":" + minute;
}
////////////////////
// DAY UTC FORMAT //
////////////////////
function DayUtcFormat(input) {
    if(!input) { return ""; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate;
}
////////////////
// DAY FORMAT //
////////////////
function dayFormat(input) {
    if(!input) { return ""; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	//no future dates
	if(date1 > date2) { date1 = new Date().getTime(); }

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

	var lMinutes = " " + LANG.MINUTES[lang] + " ";
	var lHours   = " " + LANG.HOURS[lang] + " ";
	var lDays    = " " + LANG.DAYS[lang] + " ";

	if(minutes == 0) { lMinutes = ""; minutes = ""; }
	if(hours   == 0) { lHours   = ""; hours   = ""; }
	if(days    == 0) { lDays    = ""; days    = ""; }

	if(minutes == 1) { lMinutes = " " + LANG.MINUTE[lang] + " "; }
	if(hours   == 1) { lHours   = " " + LANG.HOUR[lang] + " ";   }
	if(days    == 1) { lDays    = " " + LANG.DAY[lang] + " ";    }

	if(days    > 3)                             { lHours   = ""; hours   = ""; }
	if(days    > 0)                             { lMinutes = ""; minutes = ""; }
	if(days    > 0 && hours   > 0)              { lDays    = lDays  + LANG.AND[lang] + " "; }
	if(hours   > 0 && minutes > 0)              { lHours   = lHours + LANG.AND[lang] + " "; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; lMinutes = " " + LANG.MINUTES[lang] + " "; }

	return LANG.PREAGO[lang] + " " + days + lDays + hours + lHours + minutes + lMinutes + " " + LANG.AGO[lang] + " ";
}
////////////////////////
// WINDOW ORIENTATION //
////////////////////////
function getOrientation() {
	if(window.orientation == 90 || window.orientation == -90) {
		return "landscape";
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return "portrait";
	}
}
//////////////////////
// ANDROID 2 SELECT //
//////////////////////
function android2Select() {
	if(app.device.android && app.device.android < 4) {
		$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
		$('#dummyInput').focus();
		$('#dummyInput').blur();
		$('#dummyInput').remove();
	}
}
////////////////////
// CSS LOAD COUNT //
////////////////////
function cssLoadCount(num,total) {
	var loadCounter = " (" + num + "/" + total + ")";
	if(num == 0 && total == 0) { loadCounter = ''; }
	app.safeExec(function() {
		$("#cssAutoUpdate").html("\
			.loading #advancedAutoUpdate:before	 { content: '" + LANG.DOWNLOADING[lang]     + loadCounter + "'; }\
			.pending #advancedAutoUpdate:before	 { content: '" + LANG.RESTART_PENDING[lang] + "'; }\
			.uptodate #advancedAutoUpdate:before { content: '" + LANG.UP_TO_DATE[lang]      + "'; }\
			.spinnerMask #loadMask:before		 { content: '" + LANG.PREPARING_DB[lang]    + "'; }\
		");
	});
}
//////////////
// KICKDOWN //
//////////////
function kickDown(el) {
	if(!el) { el = '#appContent'; }
	if(!$('body').hasClass('android2')) {
		if(!app.device.desktop || app.device.windows8) {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			//window.scroll($(el)[0].scrollTop,0,0);
		}
	} else {
		$(el).scrollTop($(el).scrollTop());
	}
}
/////////////////
// MSAPP METRO //
/////////////////
if(app.device.windows8) {
	/////////////////
	// METRO ALERT //
	/////////////////
	(function() {
		var alertsToShow = [];
		var dialogVisible = false;
		function showPendingAlerts() {
			if (dialogVisible || !alertsToShow.length) {
				return;
			}
			dialogVisible = true;
			(new Windows.UI.Popups.MessageDialog(alertsToShow.shift())).showAsync().done(function () {
				dialogVisible = false;
				showPendingAlerts();
			});
		}
		window.alert = function (message) {
			if (window.console && window.console.log) {
				window.console.log(message);
			}
			alertsToShow.push(message);
			showPendingAlerts();
		};
	})();
	/////////////
	// LICENSE //
	/////////////
	function isInAppPurchaseValid(pName) {
		//var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;
		var currentApp    = Windows.ApplicationModel.Store.CurrentApp;
		var inAppLicenses = currentApp.licenseInformation.productLicenses;
		if(inAppLicenses.hasKey(pName)) {
			if(inAppLicenses.lookup(pName).isActive) { 
				return true;
			}
		}
		return false;
	}
}
//#////////////////////////#//
//# Base64 encode / decode #// 
//#////////////////////////#// http://www.webtoolkit.info
var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3,
		enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = Base64._utf8_encode(input);
		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3;
		var enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};
//////////////////// getEntryHtml = Base64.encode(getEntryHtml);
// BASE64 MATCHER // getEntryHtml = Base64.decode(getEntryHtml);
//////////////////// if(base64Matcher.test(getEntryHtml)) {  }
var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
//#////////#//
//# ZIPPER #//
//#////////#//
function zip(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
//UNZIP
function unzip(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}
//##///////////////////##//
//## APP CONFIRM LAYER ##//
//##///////////////////##// appConfirm(title, msg, callback, LANG.OK[lang], LANG.CANCEL[lang]);
var MSDialog;
var MSNext = [];
function appConfirm(title, msg, callback, ok, cancel) { 
	var okCancel = (cancel == 'hide') ? [ok] : [ok, cancel];
	///////////
	// MSAPP //
	///////////
	if (app.device.windows8) {
		//STORE NEXT
		if (MSDialog == true) {
			var isRepeated = 0;
			//NOREPEAT
			$.each(MSNext, function (key, value) {
				if (title == MSNext[key][0]) {
					isRepeated = 1;
				}
			});
			if (isRepeated == 0) {
				MSNext.push([title, msg, callback, ok, cancel]);
			}
			return;
		}
		// SHOW
		try {
			MSDialog = true;
			var md = new Windows.UI.Popups.MessageDialog(msg, title);
			md.commands.append(new Windows.UI.Popups.UICommand(ok));
			if (cancel != "hide") {
				md.commands.append(new Windows.UI.Popups.UICommand(cancel));
			}
			md.showAsync()
			.then(function (command) {
				if (command.label == ok) {
					callback(1);
				}
				if (command.label == cancel) {
					callback(0);
				}
			})
			.done(function () {
				MSDialog = false;
				if (MSNext.length) {
					appConfirm(MSNext[0][0], MSNext[0][1], MSNext[0][2], MSNext[0][3], MSNext[0][4]);
					MSNext.shift();
				}
			});
		} catch (e) {
			MSDialog = false;
			errorHandler(e);
		}
	////////////////////
	// CORDOVA PLUGIN //
	////////////////////
	} else if (typeof navigator.notification !== 'undefined') {
		navigator.notification.confirm(msg, callback, title, okCancel);
	//////////////
	// FALLBACK //
	//////////////
	} else {
		if (confirm(title + "\n" + msg)) {
			callback(1);
		} else {
			callback(0);
		}
	}
}
/////////////////////
// LOCALFORAGE PRE //
/////////////////////
if(!lfloaded){var lfloaded=true;(function(){var e,t,n,r;(function(){var i={},s={};e=function(e,t,n){i[e]={deps:t,callback:n}};r=n=t=function(e){function p(t){if(t.charAt(0)!=="."){return t}var n=t.split("/");var r=e.split("/").slice(0,-1);for(var i=0,s=n.length;i<s;i++){var o=n[i];if(o===".."){r.pop()}else if(o==="."){continue}else{r.push(o)}}return r.join("/")}r._eak_seen=i;if(s[e]){return s[e]}s[e]={};if(!i[e]){throw new Error("Could not find module "+e)}var n=i[e],o=n.deps,u=n.callback,a=[],f;for(var l=0,c=o.length;l<c;l++){if(o[l]==="exports"){a.push(f={})}else{a.push(t(p(o[l])))}}var h=u.apply(this,a);return s[e]=f||h}})();e("promise/all",["./utils","exports"],function(e,t){"use strict";function i(e){var t=this;if(!n(e)){throw new TypeError("You must pass an array to all.")}return new t(function(t,n){function u(e){return function(t){a(e,t)}}function a(e,n){i[e]=n;if(--s===0){t(i)}}var i=[],s=e.length,o;if(s===0){t([])}for(var f=0;f<e.length;f++){o=e[f];if(o&&r(o.then)){o.then(u(f),n)}else{a(f,o)}}})}var n=e.isArray;var r=e.isFunction;t.all=i});e("promise/asap",["exports"],function(e){"use strict";function i(){return function(){process.nextTick(a)}}function s(){var e=0;var t=new n(a);var r=document.createTextNode("");t.observe(r,{characterData:true});return function(){r.data=e=++e%2}}function o(){return function(){r.setTimeout(a,1)}}function a(){for(var e=0;e<u.length;e++){var t=u[e];var n=t[0],r=t[1];n(r)}u=[]}function l(e,t){var n=u.push([e,t]);if(n===1){f()}}var t=typeof window!=="undefined"?window:{};var n=t.MutationObserver||t.WebKitMutationObserver;var r=typeof global!=="undefined"?global:this===undefined?window:this;var u=[];var f;if(typeof process!=="undefined"&&{}.toString.call(process)==="[object process]"){f=i()}else if(n){f=s()}else{f=o()}e.asap=l});e("promise/config",["exports"],function(e){"use strict";function n(e,n){if(arguments.length===2){t[e]=n}else{return t[e]}}var t={instrument:false};e.config=t;e.configure=n});e("promise/polyfill",["./promise","./utils","exports"],function(e,t,n){"use strict";function s(){var e;if(typeof global!=="undefined"){e=global}else if(typeof window!=="undefined"&&window.document){e=window}else{e=self}var t="Promise"in e&&"resolve"in e.Promise&&"reject"in e.Promise&&"all"in e.Promise&&"race"in e.Promise&&function(){var t;new e.Promise(function(e){t=e});return i(t)}();if(!t){e.Promise=r}}var r=e.Promise;var i=t.isFunction;n.polyfill=s});e("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(e,t,n,r,i,s,o,u){"use strict";function b(e){if(!c(e)){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}if(!(this instanceof b)){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}this._subscribers=[];w(e,this)}function w(e,t){function n(e){A(t,e)}function r(e){M(t,e)}try{e(n,r)}catch(i){r(i)}}function E(e,t,n,r){var i=c(n),s,o,u,a;if(i){try{s=n(r);u=true}catch(f){a=true;o=f}}else{s=r;u=true}if(L(t,s)){return}else if(i&&u){A(t,s)}else if(a){M(t,o)}else if(e===T){A(t,s)}else if(e===N){M(t,s)}}function C(e,t,n,r){var i=e._subscribers;var s=i.length;i[s]=t;i[s+T]=n;i[s+N]=r}function k(e,t){var n,r,i=e._subscribers,s=e._detail;for(var o=0;o<i.length;o+=3){n=i[o];r=i[o+t];E(t,n,r,s)}e._subscribers=null}function L(e,t){var n=null,r;try{if(e===t){throw new TypeError("A promises callback cannot return that same promise.")}if(l(t)){n=t.then;if(c(n)){n.call(t,function(n){if(r){return true}r=true;if(t!==n){A(e,n)}else{O(e,n)}},function(t){if(r){return true}r=true;M(e,t)});return true}}}catch(i){if(r){return true}M(e,i);return true}return false}function A(e,t){if(e===t){O(e,t)}else if(!L(e,t)){O(e,t)}}function O(e,t){if(e._state!==S){return}e._state=x;e._detail=t;a.async(_,e)}function M(e,t){if(e._state!==S){return}e._state=x;e._detail=t;a.async(D,e)}function _(e){k(e,e._state=T)}function D(e){k(e,e._state=N)}var a=e.config;var f=e.configure;var l=t.objectOrFunction;var c=t.isFunction;var h=t.now;var p=n.all;var d=r.race;var v=i.resolve;var m=s.reject;var g=o.asap;var y=0;a.async=g;var S=void 0;var x=0;var T=1;var N=2;b.prototype={constructor:b,_state:undefined,_detail:undefined,_subscribers:undefined,then:function(e,t){var n=this;var r=new this.constructor(function(){});if(this._state){var i=arguments;a.async(function(){E(n._state,r,i[n._state-1],n._detail)})}else{C(this,r,e,t)}return r},"catch":function(e){return this.then(null,e)}};b.all=p;b.race=d;b.resolve=v;b.reject=m;u.Promise=b});e("promise/race",["./utils","exports"],function(e,t){"use strict";function r(e){var t=this;if(!n(e)){throw new TypeError("You must pass an array to race.")}return new t(function(t,n){var r=[],i;for(var s=0;s<e.length;s++){i=e[s];if(i&&typeof i.then==="function"){i.then(t,n)}else{t(i)}}})}var n=e.isArray;t.race=r});e("promise/reject",["exports"],function(e){"use strict";function t(e){var t=this;return new t(function(t,n){n(e)})}e.reject=t});e("promise/resolve",["exports"],function(e){"use strict";function t(e){if(e&&typeof e==="object"&&e.constructor===this){return e}var t=this;return new t(function(t){t(e)})}e.resolve=t});e("promise/utils",["exports"],function(e){"use strict";function t(e){return n(e)||typeof e==="object"&&e!==null}function n(e){return typeof e==="function"}function r(e){return Object.prototype.toString.call(e)==="[object Array]"}var i=Date.now||function(){return(new Date).getTime()};e.objectOrFunction=t;e.isFunction=n;e.isArray=r;e.now=i});t("promise/polyfill").polyfill()})();(function(){"use strict";function i(i){if(i){for(var s in i){n[s]=i[s]}}return new e(function(e,i){var s=r.open(n.name,n.version);s.onerror=function(){i(s.error)};s.onupgradeneeded=function(){s.result.createObjectStore(n.storeName)};s.onsuccess=function(){t=s.result;e()}})}function s(r,i){var s=this;return new e(function(e,o){s.ready().then(function(){var s=t.transaction(n.storeName,"readonly").objectStore(n.storeName);var u=s.get(r);u.onsuccess=function(){var t=u.result;if(t===undefined){t=null}h(i,t);e(t)};u.onerror=function(){if(i){i(null,u.error)}o(u.error)}},o)})}function o(r,i,s){var o=this;return new e(function(e,u){o.ready().then(function(){var o=t.transaction(n.storeName,"readwrite").objectStore(n.storeName);if(i===null){i=undefined}var a=o.put(i,r);a.onsuccess=function(){if(i===undefined){i=null}h(s,i);e(i)};a.onerror=function(){if(s){s(null,a.error)}u(a.error)}},u)})}function u(r,i){var s=this;return new e(function(e,o){s.ready().then(function(){var s=t.transaction(n.storeName,"readwrite").objectStore(n.storeName);var u=s["delete"](r);u.onsuccess=function(){h(i);e()};u.onerror=function(){if(i){i(u.error)}o(u.error)};u.onabort=function(e){var t=e.target.error;if(t==="QuotaExceededError"){if(i){i(t)}o(t)}}},o)})}function a(r){var i=this;return new e(function(e,s){i.ready().then(function(){var i=t.transaction(n.storeName,"readwrite").objectStore(n.storeName);var o=i.clear();o.onsuccess=function(){h(r);e()};o.onerror=function(){if(r){r(null,o.error)}s(o.error)}},s)})}function f(r){var i=this;return new e(function(e,s){i.ready().then(function(){var i=t.transaction(n.storeName,"readonly").objectStore(n.storeName);var o=i.count();o.onsuccess=function(){if(r){r(o.result)}e(o.result)};o.onerror=function(){if(r){r(null,o.error)}s(o.error)}},s)})}function l(r,i){var s=this;return new e(function(e,o){if(r<0){if(i){i(null)}e(null);return}s.ready().then(function(){var s=t.transaction(n.storeName,"readonly").objectStore(n.storeName);var u=false;var a=s.openCursor();a.onsuccess=function(){var t=a.result;if(!t){if(i){i(null)}e(null);return}if(r===0){if(i){i(t.key)}e(t.key)}else{if(!u){u=true;t.advance(r)}else{if(i){i(t.key)}e(t.key)}}};a.onerror=function(){if(i){i(null,a.error)}o(a.error)}},o)})}function c(r){var i=this;return new e(function(e,s){i.ready().then(function(){var i=t.transaction(n.storeName,"readonly").objectStore(n.storeName);var o=i.openCursor();var u=[];o.onsuccess=function(){var t=o.result;if(!t){if(r){r(u)}e(u);return}u.push(t.key);t["continue"]()};o.onerror=function(){if(r){r(null,o.error)}s(o.error)}},s)})}function h(e,t){if(e){return setTimeout(function(){return e(t)},0)}}var e=typeof module!=="undefined"&&module.exports?require("promise"):this.Promise;var t=null;var n={};var r=r||this.indexedDB||this.webkitIndexedDB||this.mozIndexedDB||this.OIndexedDB||this.msIndexedDB;if(!r){return}var p={_driver:"asyncStorage",_initStorage:i,getItem:s,setItem:o,removeItem:u,clear:a,length:f,key:l,keys:c};if(typeof define==="function"&&define.amd){define("asyncStorage",function(){return p})}else if(typeof module!=="undefined"&&module.exports){module.exports=p}else{this.asyncStorage=p}}).call(this);(function(){"use strict";function s(r){if(r){for(var i in r){t[i]=r[i]}}e=t.name+"/";return n.resolve()}function w(e){var t=this;return new n(function(n,i){t.ready().then(function(){r.clear();if(e){e()}n()},i)})}function E(t,i){var s=this;return new n(function(n,o){s.ready().then(function(){try{var s=r.getItem(e+t);if(s){s=C(s)}if(i){i(s)}n(s)}catch(u){if(i){i(null,u)}o(u)}},o)})}function S(t,i){var s=this;return new n(function(n,o){s.ready().then(function(){var s;try{s=r.key(t)}catch(o){s=null}if(s){s=s.substring(e.length)}if(i){i(s)}n(s)},o)})}function x(t){var i=this;return new n(function(n,s){i.ready().then(function(){var i=r.length;var s=[];for(var o=0;o<i;o++){s.push(r.key(o).substring(e.length))}if(t){t(s)}n(s)},s)})}function T(e){var t=this;return new n(function(n,i){t.ready().then(function(){var t=r.length;if(e){e(t)}n(t)},i)})}function N(t,i){var s=this;return new n(function(n,o){s.ready().then(function(){r.removeItem(e+t);if(i){i()}n()},o)})}function C(e){if(e.substring(0,u)!==o){return JSON.parse(e)}var t=e.substring(b);var n=e.substring(u,b);var r=new ArrayBuffer(t.length*2);var i=new Uint16Array(r);for(var s=t.length-1;s>=0;s--){i[s]=t.charCodeAt(s)}switch(n){case a:return r;case f:return new Blob([r]);case l:return new Int8Array(r);case c:return new Uint8Array(r);case h:return new Uint8ClampedArray(r);case p:return new Int16Array(r);case v:return new Uint16Array(r);case d:return new Int32Array(r);case m:return new Uint32Array(r);case g:return new Float32Array(r);case y:return new Float64Array(r);default:throw new Error("Unkown type: "+n)}}function k(e){var t="";var n=new Uint16Array(e);try{t=String.fromCharCode.apply(null,n)}catch(r){for(var i=0;i<n.length;i++){t+=String.fromCharCode(n[i])}}return t}function L(e,t){var n="";if(e){n=e.toString()}if(e&&(e.toString()==="[object ArrayBuffer]"||e.buffer&&e.buffer.toString()==="[object ArrayBuffer]")){var r;var i=o;if(e instanceof ArrayBuffer){r=e;i+=a}else{r=e.buffer;if(n==="[object Int8Array]"){i+=l}else if(n==="[object Uint8Array]"){i+=c}else if(n==="[object Uint8ClampedArray]"){i+=h}else if(n==="[object Int16Array]"){i+=p}else if(n==="[object Uint16Array]"){i+=v}else if(n==="[object Int32Array]"){i+=d}else if(n==="[object Uint32Array]"){i+=m}else if(n==="[object Float32Array]"){i+=g}else if(n==="[object Float64Array]"){i+=y}else{t(new Error("Failed to get type for BinaryArray"))}}t(i+k(r))}else if(n==="[object Blob]"){var s=new FileReader;s.onload=function(){var e=k(this.result);t(o+f+e)};s.readAsArrayBuffer(e)}else{try{t(JSON.stringify(e))}catch(u){if(this.console&&this.console.error){this.console.error("Couldn't convert value into a JSON string: ",e)}t(null,u)}}}function A(t,i,s){var o=this;return new n(function(n,u){o.ready().then(function(){if(i===undefined){i=null}var o=i;L(i,function(i,a){if(a){if(s){s(null,a)}u(a)}else{try{r.setItem(e+t,i)}catch(f){if(f.name==="QuotaExceededError"||f.name==="NS_ERROR_DOM_QUOTA_REACHED"){if(s){s(null,f)}u(f)}}if(s){s(o)}n(o)}})},u)})}var e="";var t={};var n=typeof module!=="undefined"&&module.exports?require("promise"):this.Promise;var r=null;try{if(!this.localStorage||!("setItem"in this.localStorage)){return}r=this.localStorage}catch(i){return}var o="__lfsc__:";var u=o.length;var a="arbf";var f="blob";var l="si08";var c="ui08";var h="uic8";var p="si16";var d="si32";var v="ur16";var m="ui32";var g="fl32";var y="fl64";var b=u+a.length;var O={_driver:"localStorageWrapper",_initStorage:s,getItem:E,setItem:A,removeItem:N,clear:w,length:T,key:S,keys:x};if(typeof define==="function"&&define.amd){define("localStorageWrapper",function(){return O})}else if(typeof module!=="undefined"&&module.exports){module.exports=O}else{this.localStorageWrapper=O}}).call(this);(function(){"use strict";function b(e){var s=this;if(e){for(var o in e){i[o]=typeof e[o]!=="string"?e[o].toString():e[o]}}return new t(function(e,t){try{r=n(i.name,i.version,i.description,i.size)}catch(o){return s.setDriver("localStorageWrapper").then(e,t)}r.transaction(function(n){n.executeSql("CREATE TABLE IF NOT EXISTS "+i.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){e()},function(e,n){t(n)})})})}function w(e,n){var s=this;return new t(function(t,o){s.ready().then(function(){r.transaction(function(r){r.executeSql("SELECT * FROM "+i.storeName+" WHERE key = ? LIMIT 1",[e],function(e,r){var i=r.rows.length?r.rows.item(0).value:null;if(i){i=L(i)}if(n){n(i)}t(i)},function(e,t){if(n){n(null,t)}o(t)})})},o)})}function E(e,n,s){var o=this;return new t(function(t,u){o.ready().then(function(){if(n===undefined){n=null}var o=n;A(n,function(n,a){if(a){u(a)}else{r.transaction(function(r){r.executeSql("INSERT OR REPLACE INTO "+i.storeName+" (key, value) VALUES (?, ?)",[e,n],function(){if(s){s(o)}t(o)},function(e,t){if(s){s(null,t)}u(t)})},function(e){if(e.code===e.QUOTA_ERR){if(s){s(null,e)}u(e)}})}})},u)})}function S(e,n){var s=this;return new t(function(t,o){s.ready().then(function(){r.transaction(function(r){r.executeSql("DELETE FROM "+i.storeName+" WHERE key = ?",[e],function(){if(n){n()}t()},function(e,t){if(n){n(t)}o(t)})})},o)})}function x(e){var n=this;return new t(function(t,s){n.ready().then(function(){r.transaction(function(n){n.executeSql("DELETE FROM "+i.storeName,[],function(){if(e){e()}t()},function(t,n){if(e){e(n)}s(n)})})},s)})}function T(e){var n=this;return new t(function(t,s){n.ready().then(function(){r.transaction(function(n){n.executeSql("SELECT COUNT(key) as c FROM "+i.storeName,[],function(n,r){var i=r.rows.item(0).c;if(e){e(i)}t(i)},function(t,n){if(e){e(null,n)}s(n)})})},s)})}function N(e,n){var s=this;return new t(function(t,o){s.ready().then(function(){r.transaction(function(r){r.executeSql("SELECT key FROM "+i.storeName+" WHERE id = ? LIMIT 1",[e+1],function(e,r){var i=r.rows.length?r.rows.item(0).key:null;if(n){n(i)}t(i)},function(e,t){if(n){n(null,t)}o(t)})})},o)})}function C(e){var n=this;return new t(function(t,s){n.ready().then(function(){r.transaction(function(n){n.executeSql("SELECT key FROM "+i.storeName,[],function(n,r){var i=r.rows.length;var s=[];for(var o=0;o<i;o++){s.push(r.rows.item(o).key)}if(e){e(s)}t(s)},function(t,n){if(e){e(null,n)}s(n)})})},s)})}function k(t){var n=new Uint8Array(t);var r;var i="";for(r=0;r<n.length;r+=3){i+=e[n[r]>>2];i+=e[(n[r]&3)<<4|n[r+1]>>4];i+=e[(n[r+1]&15)<<2|n[r+2]>>6];i+=e[n[r+2]&63]}if(n.length%3===2){i=i.substring(0,i.length-1)+"="}else if(n.length%3===1){i=i.substring(0,i.length-2)+"=="}return i}function L(t){if(t.substring(0,o)!==s){return JSON.parse(t)}var n=t.substring(y);var r=t.substring(o,y);var i=n.length*.75;var b=n.length;var w;var E=0;var S,x,T,N;if(n[n.length-1]==="="){i--;if(n[n.length-2]==="="){i--}}var C=new ArrayBuffer(i);var k=new Uint8Array(C);for(w=0;w<b;w+=4){S=e.indexOf(n[w]);x=e.indexOf(n[w+1]);T=e.indexOf(n[w+2]);N=e.indexOf(n[w+3]);k[E++]=S<<2|x>>4;k[E++]=(x&15)<<4|T>>2;k[E++]=(T&3)<<6|N&63}switch(r){case u:return C;case a:return new Blob([C]);case f:return new Int8Array(C);case l:return new Uint8Array(C);case c:return new Uint8ClampedArray(C);case h:return new Int16Array(C);case d:return new Uint16Array(C);case p:return new Int32Array(C);case v:return new Uint32Array(C);case m:return new Float32Array(C);case g:return new Float64Array(C);default:throw new Error("Unkown type: "+r)}}function A(e,t){var n="";if(e){n=e.toString()}if(e&&(e.toString()==="[object ArrayBuffer]"||e.buffer&&e.buffer.toString()==="[object ArrayBuffer]")){var r;var i=s;if(e instanceof ArrayBuffer){r=e;i+=u}else{r=e.buffer;if(n==="[object Int8Array]"){i+=f}else if(n==="[object Uint8Array]"){i+=l}else if(n==="[object Uint8ClampedArray]"){i+=c}else if(n==="[object Int16Array]"){i+=h}else if(n==="[object Uint16Array]"){i+=d}else if(n==="[object Int32Array]"){i+=p}else if(n==="[object Uint32Array]"){i+=v}else if(n==="[object Float32Array]"){i+=m}else if(n==="[object Float64Array]"){i+=g}else{t(new Error("Failed to get type for BinaryArray"))}}t(i+k(r))}else if(n==="[object Blob]"){var o=new FileReader;o.onload=function(){var e=k(this.result);t(s+a+e)};o.readAsArrayBuffer(e)}else{try{t(JSON.stringify(e))}catch(y){if(this.console&&this.console.error){this.console.error("Couldn't convert value into a JSON string: ",e)}t(null,y)}}}var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var t=typeof module!=="undefined"&&module.exports?require("promise"):this.Promise;var n=this.openDatabase;var r=null;var i={};var s="__lfsc__:";var o=s.length;var u="arbf";var a="blob";var f="si08";var l="ui08";var c="uic8";var h="si16";var p="si32";var d="ur16";var v="ui32";var m="fl32";var g="fl64";var y=o+u.length;if(!n){return}var O={_driver:"webSQLStorage",_initStorage:b,getItem:w,setItem:E,removeItem:S,clear:x,length:T,key:N,keys:C};if(typeof define==="function"&&define.amd){define("webSQLStorage",function(){return O})}else if(typeof module!=="undefined"&&module.exports){module.exports=O}else{this.webSQLStorage=O}}).call(this);(function(){"use strict";function f(e){a[e]=function(){var t=arguments;return a.ready().then(function(){return a[e].apply(a,t)})}}var e=typeof module!=="undefined"&&module.exports?require("promise"):this.Promise;var t={INDEXEDDB:"asyncStorage",LOCALSTORAGE:"localStorageWrapper",WEBSQL:"webSQLStorage"};var n=[t.INDEXEDDB,t.WEBSQL,t.LOCALSTORAGE];var r=["clear","getItem","key","keys","length","removeItem","setItem"];var i={DEFINE:1,EXPORT:2,WINDOW:3};var s=i.WINDOW;if(typeof define==="function"&&define.amd){s=i.DEFINE}else if(typeof module!=="undefined"&&module.exports){s=i.EXPORT}var o=function(e){var n=n||e.indexedDB||e.webkitIndexedDB||e.mozIndexedDB||e.OIndexedDB||e.msIndexedDB;var r={};r[t.WEBSQL]=!!e.openDatabase;r[t.INDEXEDDB]=!!(n&&typeof n.open==="function"&&n.open("_localforage_spec_test",1).onupgradeneeded===null);r[t.LOCALSTORAGE]=!!function(){try{return localStorage&&typeof localStorage.setItem==="function"}catch(e){return false}}();return r}(this);var u=this;var a={INDEXEDDB:t.INDEXEDDB,LOCALSTORAGE:t.LOCALSTORAGE,WEBSQL:t.WEBSQL,_config:{description:"",name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},_driverSet:null,_ready:false,config:function(e){if(typeof e==="object"){if(this._ready){return new Error("Can't call config() after localforage "+"has been used.")}for(var t in e){this._config[t]=e[t]}return true}else if(typeof e==="string"){return this._config[e]}else{return this._config}},driver:function(){return this._driver||null},ready:function(t){var n=new e(function(e,t){a._driverSet.then(function(){if(a._ready===null){a._ready=a._initStorage(a._config)}a._ready.then(e,t)},t)});n.then(t,t);return n},setDriver:function(t,n,r){var o=this;if(typeof t==="string"){t=[t]}this._driverSet=new e(function(a,f){var l=o._getFirstSupportedDriver(t);if(!l){var c=new Error("No available storage method found.");o._driverSet=e.reject(c);if(r){r(c)}f(c);return}o._ready=null;if(s===i.DEFINE){require([l],function(e){o._extend(e);if(n){n()}a()});return}else if(s===i.EXPORT){var h;switch(l){case o.INDEXEDDB:h=require("./drivers/indexeddb");break;case o.LOCALSTORAGE:h=require("./drivers/localstorage");break;case o.WEBSQL:h=require("./drivers/websql")}o._extend(h)}else{o._extend(u[l])}if(n){n()}a()});return this._driverSet},supports:function(e){return!!o[e]},_extend:function(e){for(var t in e){if(e.hasOwnProperty(t)){this[t]=e[t]}}},_getFirstSupportedDriver:function(e){var t=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"};if(e&&t(e)){for(var n=0;n<e.length;n++){var r=e[n];if(this.supports(r)){return r}}}return null}};for(var l=0;l<r.length;l++){f(r[l])}a.setDriver(n);if(s===i.DEFINE){define(function(){return a})}else if(s===i.EXPORT){module.exports=a}else{this.localforage=a}}).call(this)};

