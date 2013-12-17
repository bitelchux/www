////////////////////////
// DEVICE READY EVENT //
////////////////////////
//document.addEventListener('deviceready', init, false);
$(document).ready(function() {
	$("body").css("opacity","0");
	//console.log('deviceready');
	init();
});
function init() {
	diary = new Diary();
	diary.setup(startApp);
}
//#////////////////#//
//# CORE KICKSTART #//
//#////////////////#//
function startApp() {
//console.log("startApp()");

//#///////////////#//
//# DEFINE LAYOUT #//
//#///////////////#//	
$("ul#appFooter li").on(touchstart, function(e) {
	$("ul#appFooter li").removeClass("active");
	$(this).addClass("active");
});


$("#appHeader").append('<div id="timer"></div>');











///////////////////
// START WORKING //
///////////////////
afterShow(0);
updateTimer();
updateEntries();
updateEntriesTime();
(function startTimer() {
	updateTimer();
	setTimeout(startTimer,99);
})();
///////////////
// ANALYTICS //
///////////////
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
	var gaPlugin;
	gaPlugin = window.plugins.gaPlugin;
	gaPlugin.init(successHandler, errorHandler, "UA-46450510-1", 10);
	function successHandler(result) {}
	function errorHandler(error)	{}
}
/////////////////////
// ADJUST ELEMENTS //
/////////////////////
if(window.localStorage.getItem("config_kcals_type") == "cyclic")  {
	if(window.localStorage.getItem("config_kcals_day") == "d") {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
	} else {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
	}
} else {
	var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
}
$("#timer").after('<div class="editable" id="editableDiv">' + getKcalsItem + '</div>');


$('#startDateBar').prepend("<div id='appVersion'>" + appVersion + "</div>");

//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobile = {
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
	var scrollPad = 0;
	/////////////////
	// IOS VERSION //
	/////////////////
	if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
		$("body").addClass("ios");
		scrollPad = -1;
		
			if(/OS [1-5](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 5 //
				///////////
				//document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'none';
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//stuff...
			} else if(/OS [6](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 6 //
				///////////
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//stuff...
			} else if(/OS [7-9](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 7 //
				///////////
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//IOS7 HEIGHT FIX
				var ios7Height = "71px";
				//$('input#editable').css("top", "44px");
				//$("div#entryListFix").css("margin-top", "71px");
				//$("div#deficit,div#surplus,div#balanced").css("line-height", "83px");
				//$("div#timerFix,#timer,siv#deficit,div#surplus,div#balanced,div.editable").css("height", "71px");
				//$('div#pageSlideInfo,div#pageSlideFood,div#pageSlideCalc,div#editableBlock').css("top", "71px");
				$("body").addClass("ios7");
				//$("span#subKcalsRange").css("bottom", "42px");
				//$("span#subCurrentDay").css("bottom", "32px");
				//$("span#statusStop").css("line-height", "66px");
				//stuff...
			}
		} else {
			/////////////
			// NOT IOS //
			/////////////
			document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
			//stuff...
		}
if(hasTouch()) {
	////////////
	// MOBILE //
	////////////
	//set fixed height
	$('#entryListWrapper').css("min-height",                       ((window.innerHeight) - (234 + scrollPad + $('#timer').height())) + "px");
	$('#entryListScroller').css("height",                          ((window.innerHeight) - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",((window.innerHeight) - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
	/////////////
	// ANDROID //
	/////////////
	if(isMobile.Android()) {
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","absolute");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");
		$("body").addClass("android");
		//$("#iconInfo").hide();
		//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","absolute");
		//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");
		// PRELOAD SIDE MENUS
		setTimeout(function(){
			//re-set fixed height
			//$('#entryListWrapper').css("min-height",                       ($('#afterLoad').height() - (230 + $('#timer').height())) + "px");
			//$('#entryListScroller').css("height",                          ($('#afterLoad').height() - (      $('#timer').height())) + "px");
			//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",($('#afterLoad').height() - (      $('#timer').height())) + "px");
		},1000);
	}
	//////////////////
	// INTRO NOTICE //
	//////////////////
	if(window.localStorage.getItem("config_swipe_tooltip") != "seen") {
		$('#entryListForm').addClass("toolTip");
	}
}// else {
	//APP OR BROWSER
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(!app) {
	////////////////////
	// WEBKIT BROWSER //
	////////////////////
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","fixed");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");	
	//set fixed height  
	$('#entryListWrapper').css("min-height",                       ((window.innerHeight) - (234 + scrollPad + $('#timer').height())) + "px");
	$('#entryListScroller').css("height",                          ((window.innerHeight) - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",((window.innerHeight) - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
	//INTRO NOTICE
	if(window.localStorage.getItem("config_swipe_tooltip") != "seen") {
		$('#entryListForm').addClass("toolTip");
	}
	//$("#configNow").html($("#configNow").html().replace(LANG("RESET_COUNTER"),"<a id='mailTo' href='#'>support@mylivediet.com</a>"))
	$("#mailTo").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		window.location='mailto:support@mylivediet.com?Subject=MyLiveDiet%20-%20Support';
	});
	//APP STORE ICONS ON DESKTOP
	$('#entryListWrapper').append("<div id='appStore'><span class='ios'><img src='http://mylivediet.com/img/appstore_ios.png' /></span><span class='android'><img src='http://mylivediet.com/img/appstore_android.png' /></span></div");	
	$(".ios img").on(touchstart,function(evt) {
		window.location='https://itunes.apple.com/us/app/mylivediet-realtime-calorie/id732382802?mt=8';
	});
	$(".android img").on(touchstart,function(evt) {
		window.location='https://play.google.com/store/apps/details?id=com.cancian.mylivediet';
	});
	}
//}
// PRELOAD SIDE MENUS
setTimeout(function(){
	//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	//$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
	$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	$.get("info_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
},1000);
//$.get("food.html", function(data) { $("#pageSlideFood").html("<div id='sideMenuFood'>" + data + "</div>"); });
//#/////////////////#// tap hold singleTap doubleTap swipe swiping swipeLeft swipeRight swipeDown swipeUp
//# STATIC HANDLERS #// touchstart touchmove touchend longTap
//#/////////////////#// taphold doubleTap singleTap swipe
	//HIDE TOOLTIP //
	$("#entryListForm").on(touchstart, function(evt) {
		if($("#entryListForm").hasClass("toolTip")) {
			evt.preventDefault();
			evt.stopPropagation();
			$("#entryListForm").removeClass("toolTip");
			window.localStorage.setItem("config_swipe_tooltip","seen");
		}
	});
	///////////////////
	// ARROW BUTTONS //
	///////////////////
	$("#sliderNum").off().on(touchstart, function(evt) {
		evt.preventDefault();
		$("#entryTime").blur();
		$("#entryBody").blur();
		//console.log("reset slider value");
		var sliderNum = document.getElementById('slider').slider.resetValue();
		makeRound();
				return false;
	});
	$("#sliderPos").off().on(touchstart, function(evt) {
		evt.preventDefault();
		//console.log("increase slider value");
		var sliderPos = document.getElementById('slider').slider.increment(1);
		makeRound();
		return false;
	});
	$("#sliderNeg").off().on(touchstart, function(evt) {
		evt.preventDefault();
		//console.log("decrease slider value");
		var sliderNeg = document.getElementById('slider').slider.increment(-1);
		makeRound();
		return false;
	});
	////////////////////////////////
	// SAVE ENTRY (SUBMIT BUTTON) //
	////////////////////////////////
	$("#entrySubmit").on(touchstart, function(evt) {
		evt.preventDefault();
		makeRound();
		//grab values
		var title     = $("#entryTitle").val();
		var body      = $("#entryBody").val();
		var published = new Date().getTime();
		//hours ago
		if(Number($("#entryTime").val()) >= 1) {
			published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000) );
		}
		//SAVE (NOT NULL)
		if(title != 0) {
			//console.log("new entry added");
			diary.saveEntry({title:title,body:body,published:published});
		//}
		//RELOAD IF-KCALS
		//if(title != 0) {
			var resetSlider = document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			//DISMISS KEYBOARD
			$('#entryTime').blur();
			$('#entryBody').blur();
			$('#editable').blur();
			//REFRESH DATA
			updateEntries(published);
			updateTimer();
			updateEntriesTime();
		}
	});
	//#//////////////#//
	//# FORCE RELOAD #//
	//#//////////////#//
	$("#go").on("hold", function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
		//REFRESH DATA
		updateTimer();
		updateEntries();
		updateEntriesTime();
		//return false;
	});
	//////////////////
	// SLIDER ROUND //
	//////////////////
	function makeRound() {
		n = document.getElementById('entryTitle').value / 25;
		n = Math.round(n) * 25;
		if($("#entryTitle").val() != n) {
			$("#entryTitle").val(n);
		}
	}
	//#//////////////////////#//
	//# SLIDER VALUE CHANGES #//
	//#//////////////////////#//
	!function() {
		document.getElementById('entryTitle').update = function() {
			//UPDATE INPUT
			document.getElementById('entryTitle').value = document.getElementById('slider').value;
			//force reset < 25
			if(document.getElementById('entryTitle').value == -0) {
				document.getElementById('entryTitle').value = 0;
			}
			if(!(Math.abs(document.getElementById('entryTitle').value) >= 25)) {
				makeRound();
			}
			////////////////////////
			// CHANGE TRACK COLOR //
			////////////////////////
			function checkTrack() {
				if(document.getElementById('entryTitle').value == 0) {
					$('.carpe-slider-track').css("background-color", "#666");
				} else
				if(document.getElementById('entryTitle').value > 0) {
					$('.carpe-slider-track').css("background-color", "#0000dd");
				} else {
					$('.carpe-slider-track').css("background-color", "#cc3300");
				}
			}
			checkTrack();
			/////////////////////////
			// CHANGE SUBMIT COLOR //
			/////////////////////////
			function checkSubmit() {
				if(document.getElementById('entryTitle').value == 0) {
					if($('#entrySubmit').hasClass('submitActive')) {
						$('#entrySubmit').removeClass('submitActive');
					}
				} else
				if(!$('#entrySubmit').hasClass('submitActive')) {
					$('#entrySubmit').addClass('submitActive');
				}
			}
			checkSubmit();
		return;
		};
	}();
	/////////////////////
	// REPEATER SHARED //
	/////////////////////
	function clearRepeater() {
		clearTimeout(pressTimerNeg);
		clearTimeout(pressTimerPos);
		clearInterval(pressRepeatNeg);
		clearInterval(pressRepeatPos);
	}
	///////////////
	// autoclear //
	///////////////
	$("#sliderPos,#sliderNeg,#sliderNum").on(touchend + "mouseout", function(evt) {
		evt.preventDefault();
		clearRepeater();
	});
	///////////////////////
	// POSITIVE REPEATER //
	///////////////////////
	var pressTimerPos;
	var pressRepeatPos;
	$("#sliderPos").on(touchend, function(evt) {
		evt.preventDefault();
		clearRepeater();
	});
	$("#sliderPos").on(touchstart, function(evt) {
		evt.preventDefault();
		clearRepeater();
		pressTimerPos  = window.setTimeout(function()  {
		pressRepeatPos = window.setInterval(function() {
			//ACTION
			var repeatPos = document.getElementById('slider').slider.increment(1);
			makeRound();
		},275);
		},275);
	});
	///////////////////////
	// NEGATIVE REPEATER //
	///////////////////////
	var pressTimerNeg;
	var pressRepeatNeg;
	$("#sliderNeg").on(touchend, function(evt) {
		evt.preventDefault();
		clearRepeater();
	});
	$("#sliderNeg").on(touchstart, function(evt) {
		evt.preventDefault();
		clearRepeater();
		pressTimerNeg  = window.setTimeout(function()  {
		pressRepeatNeg = window.setInterval(function() {
			//ACTION
			var repeatNeg = document.getElementById('slider').slider.increment(-1);
			makeRound();
		},275);
		},275);
	});
	/////////////////////
	// NUM DE-REPEATER //
	/////////////////////
	$("#sliderNum").on(touchstart + "touchmove", function(evt) {
		evt.preventDefault();
		clearRepeater();
		var sliderNum = document.getElementById('slider').slider.resetValue();
		return false;
	});
	//#//////////////////#//
	//# BOTTOM RESET BAR #//
	//#//////////////////#//
	//LONG TAP
	$("#configNow").on("hold", function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//console.log('wipe all data');
		//CONFIRMATION DIALOG
		//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmWipe, LANG("WIPE_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
		} else {
			//if(confirm('Wipe all data?')) { onConfirmWipe(1); } else {  }
			onConfirmWipe(1);
		}
	});
	//TAP
	$("#configNow").on('singleTap', function(evt) {
		//console.log('reset timer');
		evt.preventDefault();
		evt.stopPropagation();
		//CONFIRMATION DIALOG
		//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmReset, LANG("RESET_DIALOG") , [LANG("OK"),LANG("CANCEL")]);
		} else {
			//if(confirm('Reset counter? (set to now)')) { onConfirmReset(1); } else {  }
			onConfirmReset(1);
		}
	});
	////////////////////
	// RESET FUNCTION //
	////////////////////
	function onConfirmReset(button) {
		if(button == 1) {
			//set to now
			window.localStorage.setItem("config_start_time",Number(new Date().getTime()));
			fillDate(Number(window.localStorage.getItem("config_start_time")),'startDate');
			//reset form
			document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			//refresh timer
			updateTimer();
			updateEntries();
			updateEntriesTime();
		}
	}
	///////////////////
	// WIPE FUNCTION //
	///////////////////
	function onConfirmWipe(button) {
		if(button == 1) {
			//drop
			diary.deSetup();
			//update entrylist
			document.getElementById("entryList").style.display = 'none';
			$("#entryList").html("<div id='noEntries'><span>" + LANG('NO_ENTRIES') + "</span></div>");
			document.getElementById("entryList").style.display = 'block';
			//refresh timer
			updateTimer();
			updateEntriesTime();
			//reset form
			document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			window.location='#top';
		}
	}
	//////////////////
	// small tweaks //
	//////////////////
	//fixed bottom bar
	$("#configNow, #startDateBarToggle, #iconRepeatToggle").on("touchmove", function(evt) {
		evt.preventDefault();
	});
	//date fastfocus
	$('#startDate').on(tap,function(evt) {
		$('#startDate').focus();
	});
	//////////////////
	// DEV KEYCODES //
	//////////////////
	//ICONINFO GREEN
	if(window.localStorage.getItem("config_debug") == "active") {
		$("#iconInfo").css("color","#00cc00");
	}
	///////////
	// CODES //
	///////////
	$("#entryBody").keyup(function(evt) {
		//DEV DEBUG
		if($("#entryBody").val().toLowerCase() == "devdebug") {
			if(window.localStorage.getItem("config_debug") == "active") {
				window.localStorage.setItem("config_debug","inactive");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			} else {
				window.localStorage.setItem("config_debug","active");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			}
		}
		//drop food db
		if($("#entryBody").val().toLowerCase() == "devfood") {
			window.localStorage.setItem("foodDbLoaded","empty");
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//refresh
		if($("#entryBody").val().toLowerCase() == "devreload") {
			window.location='';
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//wipe data
		if($("#entryBody").val().toLowerCase() == "devwipe") {
			onConfirmWipe(1);
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//rewipe
		if($("#entryBody").val().toLowerCase() == "devrewipe") {
			onConfirmWipe(1);
			$("#entryBody").val('');
			$("#entryBody").blur();
			afterHide();
		}
		if($("#entryBody").val().toLowerCase() == "devstress") {
			stressTest.bookmarklet();
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
	});
	$("#iconInfo").on("touchmove", function(evt) {
		evt.preventDefault();
	});
	$("#iconInfo").on(tap, function(evt) {
	//NATIVE USERVOICE
	if(isMobile.iOS()) {
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
				evt.preventDefault();
				evt.stopPropagation();
				var cfg = {
					task:'launchFeedback',//[launchFeedback|contactUs|viewForum|postIdea]
					site:'cancian.uservoice.com',
					key:'62oo7AhcRoQuvozU6ya6A',
					secret:'g911MyHj3qs92pDDa6f1XOgT9fHSi7pNBZoXO4E',
					topicId:0,//[0|453|333 (any valid topicId as interger)]
					showContactUs:1,//[0|1], Show/hide Contact us button
					showForum:1,//[0|1] Show/hide Forum button
					showPostIdea:1,//[0|1] Show/hide Post an idea button
					showKnowledgeBase:1//[0|1] Show/hide Search
				};
				showUserVoice(cfg);
			}}
	//WEB URL
	} else {
		window.location='http://cancian.uservoice.com';
	}
		return false;
	});
	/////////////////
	// RELOAD ICON //
	/////////////////
	$("#iconRepeatToggle").on(tap, function(evt) {
		evt.preventDefault();
		//prevent click
		if(!$('#startDate').is(':visible')) {
			afterHide();
			return false;
		}
	});
	////////////////////
	// START DATE BAR //
	////////////////////
	$("#startDateBarToggle").on(tap, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//save on close click
		if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
			$('#startDate').blur();
		}
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
		//not with delete button
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			//edit...
		//PRE-FILL WITH STORED DATE
		fillDate((window.localStorage.getItem("config_start_time")),'startDate');
		//ANIMATE
		if(!$('#configNow').is(':animated')) {
			if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
			} else {
				//open and show
				$('#startDate').show();
				$('#configNow').animate({"bottom": '-48px'});
			}}
		}}}
	});
	// ON BLUR //
	var onChange = 0;
	$("#startDate").change(function(){
		onChange++;
	});
	$("#startDate").blur(function(){
		//write if changed
		if(onChange > 0) {
			//if not future
			if(Number(Date.parse($("#startDate").val()) + ((((new Date($("#startDate").val())).getTimezoneOffset()) * 60 * 1000))) < Number((new Date().getTime())) ) {
				//write input date as time
				window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val()) + ((((new Date($("#startDate").val())).getTimezoneOffset()) * 60 * 1000))) );
				//window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val()) + ((((new Date()).getTimezoneOffset()) * 60 * 1000))) );
			} else {
				//REVERT TO STORED
				fillDate(Number(window.localStorage.getItem("config_start_time")),'startDate');
			}
		onChange = 0;
		updateTimer();
		updateEntries();
		//updateEntriesTime();
		}
	});
	// AUTOCLOSE n' hide //
	$("#timerTouch,#editableDiv,#entryList,#go,#entryListForm").on(tap + "swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		//save on close click
		if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
			$('#startDate').blur();
		}
		if(!$('#configNow').is(':animated')) {
			if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
			}
		}
	});
	// AUTOCLOSE WRAPPER //
	$("#entryListWrapper").on(tap, function(evt) {
		if(evt.target.id == "entryListWrapper") {
			//save on close click
			if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#startDate').blur();
			}
			if(!$('#configNow').is(':animated')) {
				if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
					$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
				}
			}
		}
	});
	//##//////////////////////##//
	//## MISC. GESTURE EVENTS ##//
	//##//////////////////////##//
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').on("touchmove",function(evt) {
		//evt.preventDefault();
		evt.stopPropagation();		
	});
	//#//////////////////#//
	//# FOOD SEARCH ICON #//
	//#//////////////////#//
	$("#entryBodySearch").on(touchstart,function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from info nor calc
		if(!$("#pageSlideInfo").hasClass("open") && !$("#pageSlideCalc").hasClass("open")) {
			//hide
			if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
				$('#pageSlideFood').addClass('busy');
				$('#pageSlideFood').removeClass("open");
				$('#entryListScroller').removeClass("food");
				$('#pageSlideFood').on('webkitTransitionEnd',function(e) { $('#pageSlideFood').removeClass('busy'); /*$('#pageSlideFood').css("opacity","0");*/ $("#foodSearch").blur(); });
			} else {
				if(!$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')) {
					//load html
					//if(document.getElementById('pageSlideFood').innerHTML == "") {
						//$.get("food.html", function(data) {
							//$("#pageSlideFood").html("<div id='sideMenuFood'>" + data + "</div>"); 
							$(document).trigger("pageReload");
						//});
					//}
					//show
					$("#entryBody").blur();
					$("#entryTime").blur();
					//$('#pageSlideFood').css("opacity",".925");
					$('#pageSlideFood').addClass('busy');
					$('#pageSlideFood').addClass("open");
					$('#entryListScroller').addClass("food");
					$('#pageSlideFood').on('webkitTransitionEnd',function(e) { $('#pageSlideFood').removeClass('busy'); });
				}}
			}}
		}}
	});
	////////////////////
	// READ INFO.HTML //
	////////////////////
	//$("#timerTouch,#editableDiv").on("swipeRight", function(evt) {
	$("#timerTouch, #editableDiv").swipe({
	swipe:function(evt,direction) {
	if(direction == 'right') {
		evt.preventDefault();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from calc
		if(!$("#pageSlideCalc").hasClass("open")) {
			//hide
			if($('#pageSlideInfo').hasClass("open") && !$('#pageSlideInfo').hasClass("busy")) {
				$('#pageSlideInfo').addClass("busy");
				$('#pageSlideInfo').removeClass("open");
				$('#entryListScroller').removeClass("info");
				$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy'); $("#CyclicInput1").blur(); $("#CyclicInput2").blur(); });
				//wipe tmp
				//$("#pageSlideInfo").html('');
			} else {
				if(!$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')  && !$('#pageSlideFood').hasClass('open')) {
					//load html
					if(document.getElementById('pageSlideInfo').innerHTML == "") {
						//$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) {
						$.get("info_" + LANG("LANGUAGE") + ".html", function(data) {
							$("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>");
						});
					}
					//show
					$('#pageSlideInfo').addClass("open");
					$('#entryListScroller').addClass("info");
					$('#pageSlideInfo').addClass('busy');
					$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy');
						//INTRO TOOLTIP
						window.localStorage.setItem("config_swipe_tooltip","seen");
						$('#entryListForm').removeClass("toolTip");
					});
				}}
			}}
		}}
	//});
	////////////////////
	// READ CALC.HTML //
	////////////////////
	//$("#timerTouch,#editableDiv").on("swipeLeft", function(evt) {
	} else if(direction == 'left') {
		evt.preventDefault();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from info
		if(!$("#pageSlideInfo").hasClass("open")) {
			//hide
			if($('#pageSlideCalc').hasClass("open") && !$('#pageSlideCalc').hasClass("busy")) {
				$('#pageSlideCalc').addClass('busy');
				$('#pageSlideCalc').removeClass("open");
				$('#entryListScroller').removeClass("calc");
				$('#pageSlideCalc').on('webkitTransitionEnd',function(e) { $('#pageSlideCalc').removeClass('busy'); $("*").blur(); });
			} else {
				if(!$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')  && !$('#pageSlideFood').hasClass('open')) {
					//load html
					if(document.getElementById('pageSlideCalc').innerHTML == "") {
						//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) {
						$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) {
							$("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>");
						});
					}
					//show
					$('#pageSlideCalc').addClass('busy');
					$('#pageSlideCalc').addClass("open");
					$('#entryListScroller').addClass("calc");
					$('#pageSlideCalc').on('webkitTransitionEnd',function(e) { $('#pageSlideCalc').removeClass('busy'); });
					}}
				}}
			}}
		}}
	});
	$("#timerTouch, #editableDiv").swipe("option", "threshold", 20);
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$("#timerTouch,#editableDiv").on(tap + "swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		//hide info
		if($('#pageSlideInfo').hasClass("open") && !$('#pageSlideInfo').hasClass("busy")) {
			$('#pageSlideInfo').addClass('busy');
			$('#pageSlideInfo').removeClass("open");
			$('#entryListScroller').removeClass("info");
			$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy'); $("#CyclicInput1").blur(); $("#CyclicInput2").blur(); });
			//wipe tmp
			//$("#pageSlideInfo").html('');
		}
		//hide calc
		if($('#pageSlideCalc').hasClass("open") && !$('#pageSlideCalc').hasClass("busy")) {
			$('#pageSlideCalc').addClass('busy');
			$('#pageSlideCalc').removeClass("open");
			$('#entryListScroller').removeClass("calc");
			$('#pageSlideCalc').on('webkitTransitionEnd',function(e) {
				$('#pageSlideCalc').removeClass('busy'); 
				//WIPE ON CLOSE
				if(!$('#pageSlideCalc').hasClass("open")) {
					$('#pageSlideCalc').html('');
					//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
					$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
				}
			});
		}
		//hide food
		if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
			$("#foodSearch").blur();
			$('#pageSlideFood').addClass('busy');
			$('#pageSlideFood').removeClass("open");
			$('#entryListScroller').removeClass("food");
			$('#pageSlideFood').on('webkitTransitionEnd',function(e) {
				$('#pageSlideFood').removeClass('busy'); 
				//WIPE ON CLOSE
				if(!$('#pageSlideFood').hasClass("open")) {
					$('#pageSlideFood').removeClass('busy');
					//$('#pageSlideFood').css("opacity","0");
				}
			});
		}
	});
	//////////////////////////
	// AJAX IN-PLACE EDITOR //
	//////////////////////////
	$('div.editable').on(tap, function(evt) {
		evt.preventDefault();
		//not with sidemenu
		if(!$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')) {
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') ) {
		//not with delete button
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			////////////////////////
			// DEFINE KCALS VALUE //
			////////////////////////
			var resetValue = 2000;
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					var getKcalsKey  = "config_kcals_day_2";
					var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
					var eqPerDay     = window.localStorage.getItem("config_kcals_day_2");
				} else {
					var getKcalsKey  = "config_kcals_day_1";
					var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
					var eqPerDay     = window.localStorage.getItem("config_kcals_day_1");
					var resetValue   = 1600;
				}
			} else {
				var getKcalsKey  = "config_kcals_day_0";
				var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
				var eqPerDay     = window.localStorage.getItem("config_kcals_day_0");
			}	
			//edit...
			if(!$(this).has('input').length) {
				var value = $(this).html();
				var input = $('<input/>', {
					'type':'number',
					'id':'editable',
					'class':'editable',
					'value': Number(value),
					//ONCHANGE HANDLER
					blur: function() {
						var new_value = Math.ceil($(this).val());
						//NULL-MIN-MAX
						if(isNaN( $(this).val()) || $(this).val() == 0 || $(this).val() <= 1)    { this.value = resetValue; document.getElementById('editableDiv').innerHTML = resetValue; }
						if(this.value < 500 && !isNaN(this.value) && this.value > 1)             { this.value = 500;  document.getElementById('editableDiv').innerHTML = 500;  }
						if(this.value > 9999)													{ this.value = 9999; document.getElementById('editableDiv').innerHTML = 9999; }
						//filter zeros
						this.value = Math.round(Number(this.value));
						document.getElementById('editableDiv').innerHTML = this.value;
						//IF ENTERED VALUE WAS OK, PASS IT
						window.localStorage.setItem(getKcalsKey,$(this).val());
						//IF MAIN VALUE IS SOMESHOW STILL BOGUS, RESET BOTH TO 2000
						if(isNaN(window.localStorage.getItem(getKcalsKey)) || window.localStorage.getItem(getKcalsKey) == 0 || window.localStorage.getItem(getKcalsKey) < 1) {
							window.localStorage.setItem(getKcalsKey,resetValue);
							document.getElementById('editableDiv').innerHTML = window.localStorage.getItem(getKcalsKey);
						}
						$(this).replaceWith(new_value);
						//update info inputs
						$("#CyclicInput1").val(window.localStorage.getItem("config_kcals_day_1"));
						$("#CyclicInput2").val(window.localStorage.getItem("config_kcals_day_2"));
						//WRITE TO DB
						window.localStorage.setItem(getKcalsKey,$(this).val());
						updateTimer();
						updateEntriesTime();
						$("#editableBlock").hide();
					},
					change: function() {
						$("#editable").blur();
					},
					keypress: function(evt) {
					return isNumberKey(evt);
					}
				});
				$(this).empty();
				$(this).append(input);
				//FOCUS, THEN SET VALUE
				var editableValue = $("#editable").val();
				$("#editableBlock").show();
				$("#editable").focus();
				$(this).val(editableValue);
				$("#editable").select();
			}}}}
		}
	});
	// blur edit / entrybody
	$('#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
			if($("#entryBody").is(":focus") && evt.target.id == "entryTime") {
				$("#entryTime").focus();
			} else if($("#entryTime").is(":focus") && evt.target.id == "entryBody") {
				$("#entryBody").focus();
			} else if(evt.target.id != "entryTime" && evt.target.id != "entryBody") {
				$("#editable").blur();
				$("#entryTime").blur();
				$("#entryBody").blur();
			}
	});
	// timer blur
	$('#timerTouch').on(touchstart, function(evt) {
	//	evt.preventDefault();
		if($(this).attr("id") == "timerTouch") {
			$("#editable").blur();
			$("#entryTime").blur();
			$("#entryBody").blur();
		}
	});
	////////////////////////
	// QUICK FOCUS INPUTS //
	////////////////////////
	$('#entryBody').on(touchstart, function(evt) {
		//evt.preventDefault();
		evt.stopPropagation();
		//android keyboard focus
		$("#entryBody").focus();		
		if(!$("#entryBody").is(":focus") && !$(".delete").is(":visible")) {
			evt.preventDefault();
			$("#entryBody").focus();
		}
	});
	$('#entryTime').on(touchstart, function(evt) {
		if(!$("#entryTime").is(":focus") && !$(".delete").is(":visible")) {
			evt.preventDefault();
			$("#entryTime").focus();
		}
	});
	//SUPERBORDER FOCUS
	$('#entryTime').focus(function(evt) {
		$('#entryBody').removeClass("focusMy");
		$('#entryBody').addClass("focusMe");
	});
	$('#entryBody').focus(function(evt) {
		//evt.preventDefault();
		//evt.stopPropagation();
		//evt.stopImmediatePropagation();
		$('#entryBody').removeClass("focusMe");
		$('#entryBody').addClass("focusMy");
	});	
	$('#entryTime,#entryBody').blur(function(evt) {
		$('#entryBody').removeClass("focusMe");
		$('#entryBody').removeClass("focusMy");
	});
	//////////////////////////////
	// FIX KEYBOARD PROPAGATION //
	//////////////////////////////
	$('#entryListForm,#go').on(touchstart, function(evt) {
		if(evt.target.id == "entryTime") {
			//$("#entryTime").focus();
		} else if(evt.target.id == "entryBody") {
			//$("#entryBody").focus();
		} else {
			if($("#entryTime").is(":focus") || $("#entryBody").is(":focus") ) {
				//block re-keyboarding on dismiss
				evt.preventDefault();
				evt.stopPropagation();
				//autoclose bug on return
				if(evt.target.id != "entryBody") {
					$("#entryBody").blur();
				}
				$("#entryTime").blur();
			}
		}
	});
	//#///////////////#//
	//# RESIZE SLIDER #//
	//#///////////////#//
	function adjustPos(t) {
		var carpeTimer;
		function carpeLoad() {
			clearTimeout(carpeTimer);
			$('#sliderNum').css("left",((Number($(".carpe-slider-knob").css("left").replace("px",""))) - (22)) + "px");
		}
		function carpeShow(t) {
			carpeTimer = setTimeout(carpeLoad,t);
		}
		carpeShow(t);
	}
	adjustPos(200);
	///////////////////
	// WINDOW RESIZE // ++keyb
	///////////////////
	$(window).on("resize", function(evt) {
		//$('#entryListScroller').css("height","auto");
		//$('#entryListWrapper').css("height","auto");
		//$('#entryListScroller').css("height","100%");
		//$('#entryListWrapper').css("height","100%");
		//$('#entryListScroller').css("height",(Number($('#afterLoad').css("height").replace("px","")) - (51)) + "px");
		//$('#entryListWrapper').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - (279)) + "px");
		//NO WHITE FLICKE 
		//$('#entryListScroller').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - (($('#timer').height()))) + "px");
		//$('#entryListWrapper').css("min-height",($('#entryListScroller').height() - ((229 + $('#timer').height()))) + "px");
		//$('#pageSlideInfo').css("min-height",($('#entryListScroller').height()));		
		//$('#pageSlideCalc').css("min-height",($('#entryListScroller').height()));		
		//$('#pageSlideFood').css("min-height",($('#entryListScroller').height() - (61)) + "px");
		//$('#foodList').css("min-height",($('#entryListScroller').height()));		
		$('#pageSlideInfo').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		$('#pageSlideCalc').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		$('#pageSlideFood').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
	});
	////////////////////////
	// ORIENTATION CHANGE //
	////////////////////////
	if('ontouchstart' in document) {
		var mobileBrowserWindow = "orientationchange";
	} else {
		var mobileBrowserWindow = "resize";
	}
	$(window).on(mobileBrowserWindow, function(evt) {
//	$(window).on("orientationchange" + resizeDesktop, function(evt) {
		//update if different than stored
		if(getOrientation() != window.localStorage.getItem("absOrientation")) {
			window.localStorage.setItem("absOrientation",getOrientation());
			//switch values
			var prevHeight = window.localStorage.getItem("absWindowHeight");
			var prevWidth  = window.localStorage.getItem("absWindowWidth");
			window.localStorage.setItem("absWindowHeight",prevWidth);
			window.localStorage.setItem("absWindowWidth",prevHeight);
			//$("#entryBody").val(window.localStorage.getItem("absWindowHeight") + " x " + window.localStorage.getItem("absWindowWidth"));
		//reajust num
		adjustPos(0);
		//resize input
		$('#entryBody').css("left","16px");
		$('#entryBody').css("right","16px");
		$('#entryBody').css("borderColor","transparent");
		//main
		$('#entryListWrapper').css("height","auto");
		//RESIZE
		//RESIZE
		//suspend animation
		$('#entryListWrapper').css("min-height",((window.innerHeight) - ((234 + scrollPad + $('#timer').height()))) + "px");
		$('#entryListScroller').css("-webkit-transition-duration","0");
		$('#entryListScroller').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#entryListScroller').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideInfo').css("-webkit-transition-duration","0");
		$('#pageSlideInfo').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#pageSlideInfo').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideCalc').css("-webkit-transition-duration","0");
		$('#pageSlideCalc').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#pageSlideCalc').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideFood').css("-webkit-transition-duration","0");
		$('#pageSlideFood').css("height",($('#entryListScroller').height() - (61)) + "px");
		setTimeout(function() { $('#pageSlideFood').css("-webkit-transition-duration",".25s");},0);
			//adjust results scroller
		//$('#sideMenuFood').css("height",window.localStorage.getItem("absWindowHeight") - ($('#timer').height()) + "px");
		$('#foodList').css("height",($('#entryListScroller').height() - (61)) + "px");
		}
	//clearRepeater();
	//food input
	$('#foodSearch').css("left","0px");
	$('#foodSearch').css("right","0px");
	$('#foodSearch').css("margin-bottom","1px");
	/////////////////////////
	// fix scrolling delay //
	/////////////////////////
	scrollFix = setTimeout(function() {
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) + (1)) + "px");
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) - (1)) + "px");
		//$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",((window.innerHeight) - ((234 + scrollPad + $('#timer').height()))) + "px");
		$('#entryListScroller').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
	},300);
});
////#//
} //#//
////#//

