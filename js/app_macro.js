﻿/*jshint multistr: true */
//##/////////////////##//
//## GET FULLHISTORY ##//
//##/////////////////##//
function getFullHistory() {
	var fullArray   = [];
	var oldestEntry = new Date().getTime();
	var now         = new Date().getTime();
	var day         = 60*60*24*1000;
	var week        = day*7;
	var month       = day*30;
	var months      = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var monthName   = months[new Date().getMonth()];
	var todaysTime  = Date.parse(new Date(monthName + " " +  new Date().getDate() + ", " + new Date().getFullYear()));
	/////////////////
	// GET ENTRIES //
	/////////////////
	getEntries(function(data) {
		for(var g=0, len=data.length; g<len; g++) {
			fullArray.push({ date: DayUtcFormat(parseInt(data[g].published)),val: data[g].title});
			//GET OLDEST
			if(oldestEntry > parseInt(data[g].published)) {
				oldestEntry = parseInt(data[g].published);
			}
		}
		//SORT
		fullArray = fullArray.sort(function(a, b) {
			return (a.date > b.date) ? 1 : ((a.date < b.date) ? -1 : 0);
		});
		// at least a week
		if(now - oldestEntry < week) {
			oldestEntry = now - week;
		}
		//at most a month
		if(now - oldestEntry > month) {
			//oldestEntry = now - month;
		}
		//MORE THAN A DAY
		//if(DayUtcFormat(now) != DayUtcFormat(oldestEntry)) {
		var countBack = todaysTime;
		var dayArray  = [];
		/////////////////////
		// DAY INJECT LOOP //
		/////////////////////
		while(oldestEntry-(day*1) < countBack) {
			var daySum = 0;
			//dump all day data in date array
			for(var h=0, hen=fullArray.length; h<hen; h++) {
				if(fullArray[h].date == DayUtcFormat(countBack)) {
					daySum = daySum + parseInt(fullArray[h].val);
				}
			}
			//insert
			dayArray.push([countBack,daySum]);
			//while
			countBack = countBack - day;
		}
		/////////////////
		// MANUAL TICK //
		/////////////////
		/*
		var upperTick = 0;
		var lowerTick = 0;
		//HIGHEST/LOWEST
		for(var i=0, ien=dayArray.length; i<ien; i++) {
			if(dayArray[i][1] > upperTick) {
				upperTick = dayArray[i][1]
			}
			if(dayArray[i][1] < lowerTick) {
				lowerTick = dayArray[i][1]
			}
		}
		lowerTick = lowerTick*1.5;
		upperTick = upperTick*1.5;
		// MID TICK
		midTick = parseInt(window.localStorage.getItem("config_kcals_day_0"));
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				midTick = parseInt(window.localStorage.getItem("config_kcals_day_2"));
			} else {
				midTick = parseInt(window.localStorage.getItem("config_kcals_day_1"));
			}
		}
		// CHECK
		if(upperTick < 600) {
			upperTick = midTick+600;
		}
		if(midTick >= upperTick) {
			upperTick = midTick*1.5;
		}
		*/
		//////////////
		// HANDLERS //
		//////////////
		var appHistoryHandlers = function () {
			//#/////////////////////////#//
			//# REBUILD HISTORY SNIPPET #//
			//#/////////////////////////#//
			rebuildHistory = function () {
				////////////////
				// LOCAL DATE //
				////////////////
				Highcharts.setOptions({
					lang : {
						shortMonths : LANG.MONTH_SHORT[lang].split(', '),
						weekdays : LANG.WEEKDAY_SHORT[lang].split(', ')
					}
				});
				///////////////
				// MIN WIDTH //
				///////////////
				var minWidth = $("#appContent").width() / dayArray.length;
				if (minWidth < 20) {
					minWidth = 20;
				}
				if (minWidth > 100) {
					minWidth = 100;
				}
				minWidth = dayArray.length * minWidth;
				if (minWidth < $("#appContent").width()) {
					minWidth = $("#appContent").width();
				}
				////////////////
				// STATISTICS //
				////////////////
				var heightAdjust = $('body').hasClass('android2') ? 19 : 9;
				$('#appHistory').highcharts({
					chart : {
						reflow : false,
						spacingLeft : 0,
						spacingRight : 0,
						spacingTop : 0,
						spacingBottom : 9,
						height : $("#newWindow").height() - heightAdjust,
						width : minWidth
					},
					credits : {
						enabled : false
					},
					legend : {
						enabled : false
					},
					title : {
						text : ''
					},
					tooltip : {
						enabled : true
					},
					subtitle : {
						text : ''
					},
					yAxis : {
						title : {
							text : ''
						},
						//tickPositions : [lowerTick, midTick, upperTick],
						gridLineColor : 'rgba(0,0,0,.12)',
						//gridLineDashStyle : 'longdash',
						labels : {
							enabled : true,
							align : 'left',
							x : 2, //31,
							y : -1,
							textSize : '9px'
						},
						showFirstLabel : false,
						showLastLabel : false
					},
					xAxis : {
						type : 'datetime'
					},
					plotOptions : {
						series : {
							marker : {
								enabled : true,
								lineWidth : 2,
								lineColor : '#2F7ED8',
								fillColor : 'white',
								states : {
									hover : {
										lineWidth : 2
									}
								}
							},
							allowPointSelect : false,
							lineWidth : 2,
							states : {
								hover : {
									lineWidth : 2
								}
							}
						},
						line : {
							dataLabels : {
								enabled : false,
								style : {
									textShadow : '0 0 3px white',
									fontSize : '12px'
								},
								y : -9
							},
							enableMouseTracking : true
						}
					},
					series : [{
							type : 'line',
							name : LANG.KCAL[lang],
							animation : false,
							data : dayArray.sort()
						}
					]
				});
			};
			/////////////
			// EXECUTE //
			/////////////
			rebuildHistory();
		};
		//////////
		// HTML //
		//////////
		var appHistoryHtml = "<div id='appHistory'></div>";
		/////////////
		// CONFIRM //
		/////////////
		var appHistoryConfirm = function() {
			return true;
		};
		/////////////////
		// CALL WINDOW //
		/////////////////
		getNewWindow(LANG.STATISTICS[lang],appHistoryHtml,appHistoryHandlers);
	});
}
//##////////////////##//
//## INTAKE HISTORY ##//
//##////////////////##//
function intakeHistory() {
	//check exists
	if(window.localStorage.getItem("app_last_tab") != "tab1")	{ return; }
	if(!$('#appStatusIntake').html())							{ return; } 
	//if($('#appStatusIntake div').length === 0) { return; }
	//go
	var firstTick = 0;
	var lastTick  = parseInt(window.localStorage.getItem("config_kcals_day_0")) * 1.5;
	var origTick  = parseInt(window.localStorage.getItem("config_kcals_day_0"));
	/////////////////
	// CYCLIC CASE //
	/////////////////
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		if(window.localStorage.getItem("config_kcals_day") == "d") {
			lastTick = parseInt(window.localStorage.getItem("config_kcals_day_2")) * 1.5;
			origTick = parseInt(window.localStorage.getItem("config_kcals_day_2"));
		} else {
			lastTick = parseInt(window.localStorage.getItem("config_kcals_day_1")) * 1.5;
			origTick = parseInt(window.localStorage.getItem("config_kcals_day_1"));
		}
	}
	///////////////////////////////////////
	// localized short weekday countback //
	///////////////////////////////////////
	var day = 60 * 60 * 24 * 1000;
	var now = new Date().getTime();
	//count back 7 days
	var past0days = DayUtcFormat(now);
	var past1days = DayUtcFormat(now - (day*1));
	var past2days = DayUtcFormat(now - (day*2));
	var past3days = DayUtcFormat(now - (day*3));
	var past4days = DayUtcFormat(now - (day*4));
	var past5days = DayUtcFormat(now - (day*5));
	var past6days = DayUtcFormat(now - (day*6));
	var past7days = DayUtcFormat(now - (day*7));
	//weekday lang array
	var weekdaysArray = LANG.WEEKDAY_SHORT[lang].split(", ");
	//parse date as time
	var past0daysTime = Date.parse(DayUtcFormat(past0days));
	var past1daysTime = Date.parse(DayUtcFormat(past1days));
	var past2daysTime = Date.parse(DayUtcFormat(past2days));
	var past3daysTime = Date.parse(DayUtcFormat(past3days));
	var past4daysTime = Date.parse(DayUtcFormat(past4days));
	var past5daysTime = Date.parse(DayUtcFormat(past5days));
	var past6daysTime = Date.parse(DayUtcFormat(past6days));
	var past7daysTime = Date.parse(DayUtcFormat(past7days));
	//get weekday n. from time
	var past0daysNumber = (new Date(past0daysTime)).getDay();
	var past1daysNumber = (new Date(past1daysTime)).getDay();
	var past2daysNumber = (new Date(past2daysTime)).getDay();
	var past3daysNumber = (new Date(past3daysTime)).getDay();
	var past4daysNumber = (new Date(past4daysTime)).getDay();
	var past5daysNumber = (new Date(past5daysTime)).getDay();
	var past6daysNumber = (new Date(past6daysTime)).getDay();
	var past7daysNumber = (new Date(past7daysTime)).getDay();
	///////////////////////////
	// usable weekday labels //
	///////////////////////////
	var past0daysLabel = weekdaysArray[past0daysNumber];
	var past1daysLabel = weekdaysArray[past1daysNumber];
	var past2daysLabel = weekdaysArray[past2daysNumber];
	var past3daysLabel = weekdaysArray[past3daysNumber];
	var past4daysLabel = weekdaysArray[past4daysNumber];
	var past5daysLabel = weekdaysArray[past5daysNumber];
	var past6daysLabel = weekdaysArray[past6daysNumber];
	var past7daysLabel = weekdaysArray[past7daysNumber];
	//////////////////////
	// WEEKDAY SUM LOOP //
	//////////////////////
	//sum vars
	var past0daysSum = 0;
	var past1daysSum = 0;
	var past2daysSum = 0;
	var past3daysSum = 0;
	var past4daysSum = 0;
	var past5daysSum = 0;
	var past6daysSum = 0;
	var past7daysSum = 0;
	//LOOP
	getEntries(function(data) {
		var dataPublished;
		var dataTitle;
		for(var i=0, len=data.length; i<len; i++) {
			dataPublished = DayUtcFormat(parseInt(data[i].published));
			dataTitle     = parseInt(data[i].title);
			if(dataPublished == past0days) { past0daysSum = past0daysSum + dataTitle; }
			if(dataPublished == past1days) { past1daysSum = past1daysSum + dataTitle; }
			if(dataPublished == past2days) { past2daysSum = past2daysSum + dataTitle; }
			if(dataPublished == past3days) { past3daysSum = past3daysSum + dataTitle; }
			if(dataPublished == past4days) { past4daysSum = past4daysSum + dataTitle; }
			if(dataPublished == past5days) { past5daysSum = past5daysSum + dataTitle; }
			if(dataPublished == past6days) { past6daysSum = past6daysSum + dataTitle; }
			if(dataPublished == past7days) { past7daysSum = past7daysSum + dataTitle; }
			//reset
			dataPublished = 0;
			dataTitle     = 0;
		}
		//null for zero
		//if(past0daysSum == 0) { past0daysSum = null; }
		//if(past1daysSum == 0) { past1daysSum = null; }
		//if(past2daysSum == 0) { past2daysSum = null; }
		//if(past3daysSum == 0) { past3daysSum = null; }
		//if(past4daysSum == 0) { past4daysSum = null; }
		//if(past5daysSum == 0) { past5daysSum = null; }
		//if(past6daysSum == 0) { past6daysSum = null; }
		//if(past7daysSum == 0) { past7daysSum = null; }
		//lastTick 500kcal buffer
		if(past0daysSum > lastTick-500)									{ lastTick = past0daysSum*1.5; }
		if(past1daysSum > lastTick-500 && past1daysSum > past0daysSum)	{ lastTick = past1daysSum*1.5; }
		if(past2daysSum > lastTick-500 && past2daysSum > past1daysSum)	{ lastTick = past2daysSum*1.5; }
		if(past3daysSum > lastTick-500 && past3daysSum > past2daysSum)	{ lastTick = past3daysSum*1.5; }
		if(past4daysSum > lastTick-500 && past4daysSum > past3daysSum)	{ lastTick = past4daysSum*1.5; }
		if(past5daysSum > lastTick-500 && past5daysSum > past4daysSum)	{ lastTick = past5daysSum*1.5; }
		if(past6daysSum > lastTick-500 && past6daysSum > past5daysSum)	{ lastTick = past6daysSum*1.5; }
		if(past7daysSum > lastTick-500 && past7daysSum > past6daysSum)	{ lastTick = past7daysSum*1.5; }
		//min lastTick val
		//if(lastTick < 300) { lastTick = 300; }
		if(lastTick < 600) { lastTick = lastTick+600; }
		//firstTick -500kcal buffer
		if(past0daysSum < 0)								{ firstTick = past0daysSum*2; }
		if(past1daysSum < 0 && past1daysSum < past0daysSum)	{ firstTick = past1daysSum*2; }
		if(past2daysSum < 0 && past2daysSum < past1daysSum)	{ firstTick = past2daysSum*2; }
		if(past3daysSum < 0 && past3daysSum < past2daysSum)	{ firstTick = past3daysSum*2; }
		if(past4daysSum < 0 && past4daysSum < past3daysSum)	{ firstTick = past4daysSum*2; }
		if(past5daysSum < 0 && past5daysSum < past4daysSum)	{ firstTick = past5daysSum*2; }
		if(past6daysSum < 0 && past6daysSum < past5daysSum)	{ firstTick = past6daysSum*2; }
		if(past7daysSum < 0 && past7daysSum < past6daysSum)	{ firstTick = past7daysSum*2; }
		//min neg pad start at -500
		if(firstTick < 0 && firstTick > -500) { firstTick = -500; }
		//no null yesterday label
		var past1daysColor = 'rgba(0,0,0,1)';
		var past2daysColor = 'rgba(0,0,0,1)';
		var past3daysColor = 'rgba(0,0,0,1)';
		var past4daysColor = 'rgba(0,0,0,1)';
		//
		if(past1daysSum == 0) { past1daysColor = 'rgba(0,0,0,0)'; }
		if(past2daysSum == 0) { past2daysColor = 'rgba(0,0,0,0)'; }
		if(past3daysSum == 0) { past3daysColor = 'rgba(0,0,0,0)'; }
		if(past4daysSum == 0) { past4daysColor = 'rgba(0,0,0,0)'; }
		////////////////////
		// GENERATE CHART //
		////////////////////
		$('#appStatusIntake div').css("padding-top", "0px");
		var checkHeight = hasTap() ? 64 : 66;
		var catFontSize = "9px";
		if(lang == "fa") { catFontSize = "8px"; }
		//check exists
		if(window.localStorage.getItem("app_last_tab") != "tab1")	{ return; }
		if(!$('#appStatusIntake').html())							{ return; } 
		$('#appStatusIntake').highcharts({
			chart : {
				reflow: false,
				spacingLeft   : $("#appStatusIntake").width() / -6,
				spacingRight  : $("#appStatusIntake").width() / -9.2,
				spacingTop    : -1,
				spacingBottom : -12,
				height : checkHeight,
				width : $("#appStatusIntake").width()
			},
			credits : {
				enabled : false
			},
			legend : {
				enabled : false
			},
			title : {
				text : ''
			},
			subtitle : {
				text : ''
			},
			xAxis : {
				categories : ['', past4daysLabel, past3daysLabel, past2daysLabel, past1daysLabel, ''],
				labels : {
					style : {
						color : "rgba(47, 126, 216, .45)",
						fontSize : catFontSize
					},
					y : -2,
					x : 0
				}
			},
			yAxis : {
				title : {
					text : ''
				},
				tickPositions : [firstTick, origTick, lastTick],
				gridLineColor : 'rgba(0,0,0,.16)',
				gridLineDashStyle : 'longdash',
				labels : {
					enabled : false,
					align : 'left',
					x : 31,
					y : -1,
					textSize : '8px'
				},
				showFirstLabel : false,
				showLastLabel : false
			},
			tooltip : {
				enabled : false,
				formatter : function () {
					return '<b>' + this.series.name + '</b><br/>' + this.x + ': ' + this.y + '°C';
				}
			},
			plotOptions : {
            series: {
				allowPointSelect: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                }
            },
				line : {
					dataLabels : {
						enabled : true,
						style : {
							textShadow : '0 0 3px white',
							fontSize : '8px'
						}
					},
					enableMouseTracking : false
				}
			},
			series : [{
					type : 'area',
					name : 'solid filler',
					animation : false,
					data : [
						past5daysSum,
						past4daysSum,
						past3daysSum,
						past2daysSum,
						past1daysSum,
						past0daysSum
					],
					lineWidth : 1,
					lineColor : "rgba(47, 126, 216, .5)",
					fillColor : "rgba(47, 126, 216, .1)",
					marker : {
						enabled : false,
						lineWidth : 0,
						lineColor : "rgba(0, 0, 0, 0)",
						fillColor : "rgba(0, 0, 0, 0)",
						states: {
							hover: {
								lineWidth : 1
							}
						}
					}
				},
				{
					type : 'line',
					name : 'line with labels',
					animation : false,
					data : [
						{ y : past5daysSum, dataLabels : { x : 0, color : 'rgba(0,0,0,0)' } },
						{ y : past4daysSum, dataLabels : { x : 0, color : past4daysColor  } },
						{ y : past3daysSum, dataLabels : { x : 0, color : past3daysColor  } },
						{ y : past2daysSum, dataLabels : { x : 0, color : past2daysColor  } },
						{ y : past1daysSum, dataLabels : { x : 0, color : past1daysColor  } },
						{ y : past0daysSum, dataLabels : { x : 0, color : 'rgba(0,0,0,0)' } }
					],
					lineWidth : 0,
					lineColor : 'rgba(0,0,0,.2)',
					fillColor : 'rgba(0,0,0,.05)',
					marker : {
						enabled : false
					},
					line : {
						dataLabels : {
							enabled : true,
							style : {
								textShadow : '0 0 3px white',
								fontSize : '8px'
							}
						}
					}
				}
			]
		});
		//write cache
		window.localStorage.setItem("appStatusIntake",$('#appStatusIntake').html());
		$('#appStatusIntake div').css("padding-top", "0px");
	});
	//wp8 nonstandand
	$('#appStatusIntake').on(touchend,function(){
		return false;
	});
}
//##///////////////////##//
//## GET NUTRI SLIDERS ##//
//##///////////////////##//
function getNutriSliders() {
	///////////////////
	// AUTOFIX RATIO //
	///////////////////
	if(isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[0])) || isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[1])) || isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[2]))  ) {
		window.localStorage.setItem("appNutrients",'25|50|25');
	}
	///////////////////
	// SAVE CALLBACK //
	///////////////////
	var save = function() {
		if(parseInt(document.getElementById('sliderProInput').value) + parseInt(document.getElementById('sliderCarInput').value) + parseInt(document.getElementById('sliderFatInput').value) == 100) {
			window.localStorage.setItem('appNutrients',parseInt(document.getElementById('sliderProInput').value) + '|' + parseInt(document.getElementById('sliderCarInput').value) + '|' + parseInt(document.getElementById('sliderFatInput').value));
			updateNutriRatio();
			return true;
		} else {
			if(hasTouch()) {
				navigator.notification.alert(LANG.PLEASE_REVIEW[lang], voidThis,LANG.TOTAL_ERROR[lang],LANG.OK[lang]);
			} else {
				if(alert(LANG.TOTAL_ERROR[lang] + "\n" + LANG.PLEASE_REVIEW[lang]));
			}
			return false;
		}
	};
	///////////////////////
	// HANDLERS CALLBACK //
	///////////////////////
	var handlers = function() {
		///////////////////
		// PREVENT FOCUS //
		///////////////////
		$("#newWindow input").on(touchstart,function() {
			return false; 
		});
		///////////
		// CARPE //
		///////////
		if(document.getElementById('sliderProRange')) {
			$(document).trigger('carpeSlider');
			document.getElementById('sliderProRange').slider.setValue(0);
			document.getElementById('sliderCarRange').slider.setValue(0);
			document.getElementById('sliderFatRange').slider.setValue(0);
			document.getElementById('sliderProRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[0]));
			document.getElementById('sliderCarRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[1]));
			document.getElementById('sliderFatRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[2]));
		}
		////////////////
		// PRO.UPDATE //
		////////////////
		if(document.getElementById('sliderProInput')) {
		document.getElementById('sliderProInput').update = function() {
			if(document.getElementById('sliderProInput')) {
				document.getElementById('sliderProInput').value = parseInt(document.getElementById('sliderProRange').value)+ '%';
				if(parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value) + parseInt(document.getElementById('sliderFatRange').value) > 100) { 
					document.getElementById('sliderProInput').value = (100 - (parseInt(document.getElementById('sliderCarRange').value)) - (parseInt(document.getElementById('sliderFatRange').value))) + '%'; 
					document.getElementById('sliderProRange').slider.setValue(100 - (parseInt(document.getElementById('sliderCarRange').value)) - parseInt((document.getElementById('sliderFatRange').value)));
				}
				//update total
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		};
		}
		////////////////
		// CAR.UPDATE //
		////////////////
		if(document.getElementById('sliderCarInput')) {
		document.getElementById('sliderCarInput').update = function() {
			if(document.getElementById('sliderCarInput')) {
				document.getElementById('sliderCarInput').value = parseInt(document.getElementById('sliderCarRange').value)+ '%';
				if(parseInt(document.getElementById('sliderCarRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderFatRange').value) > 100) { 
					document.getElementById('sliderCarInput').value = (100 - (parseInt(document.getElementById('sliderProRange').value)) - (parseInt(document.getElementById('sliderFatRange').value))) + '%'; 
					document.getElementById('sliderCarRange').slider.setValue(100 - (parseInt(document.getElementById('sliderProRange').value)) - parseInt((document.getElementById('sliderFatRange').value)));
				}
				//update total	
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		}}
		////////////////
		// FAT.UPDATE //
		////////////////
		if(document.getElementById('sliderFatInput')) {
		document.getElementById('sliderFatInput').update = function() {
			if(document.getElementById('sliderFatInput')) {
				document.getElementById('sliderFatInput').value = parseInt(document.getElementById('sliderFatRange').value) + '%';
				if(parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value) > 100) { 
					document.getElementById('sliderFatInput').value = (100 - (parseInt(document.getElementById('sliderProRange').value)) - (parseInt(document.getElementById('sliderCarRange').value))) + '%'; 
					document.getElementById('sliderFatRange').slider.setValue(100 - (parseInt(document.getElementById('sliderProRange').value)) - parseInt((document.getElementById('sliderCarRange').value)));
				}
				//update total	
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		}}	
		/////////////////
		// INIT VALUES //
		/////////////////
		if(document.getElementById('sliderProRange')) {
			$("#sliderProInput").trigger('update');
			$("#sliderCarInput").trigger('update');
			$("#sliderFatInput").trigger('update');
		}
	}
	////////////////
	// HTML BLOCK //
	////////////////
	var htmlContent = '\
		<input type="text" id="sliderTotalInput" />\
		<div id="sliderPro">\
			<input type="text" id="sliderProInput" />\
			<div id="sliderProLabel">' + LANG.PROTEINS[lang] + '</div>\
			<div id="sliderProWrapper"><input id="sliderProRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderProInput" data-carpe-decimals="0" /></div>\
		</div>\
		<div id="sliderCar">\
			<input type="text" id="sliderCarInput" />\
			<div id="sliderCarLabel">' + LANG.CARBS[lang] + '</div>\
			<div id="sliderCarWrapper"><input id="sliderCarRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderCarInput" data-carpe-decimals="0" /></div>\
		</div>\
		<div id="sliderFat">\
			<input type="text" id="sliderFatInput" />\
			<div id="sliderFatLabel">' + LANG.FATS[lang] + '</div>\
			<div id="sliderFatWrapper"><input id="sliderFatRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderFatInput" data-carpe-decimals="0" /></div>\
		</div>\
	';
	/////////////////////
	// CALL NEW WINDOW //
	/////////////////////
	getNewWindow(LANG.NUTRIENT_TITLE[lang],htmlContent,handlers,save);
}
//##///////////////##//
//## TODAYOVERVIEW ##//
//##///////////////##//
function updateTodayOverview() {
	////////////
	// DEFINE //
	////////////
	var totalConsumed = parseInt(window.localStorage.getItem("config_ttf"));
	var totalIntake   = parseInt(window.localStorage.getItem("config_kcals_day_0")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
	var totalPercent  = totalConsumed / (totalIntake / 100);
	/////////////////////////
	// UPDATE BLOCK VALUES //
	/////////////////////////
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		if(window.localStorage.getItem("config_kcals_day") == "d") {
			totalIntake = parseInt(window.localStorage.getItem("config_kcals_day_2")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
			totalPercent  = totalConsumed / (totalIntake / 100);
			$("#appStatusWeight div p").html(totalConsumed + '<strong> / ' + window.localStorage.getItem("config_kcals_day_1") + '~<b>' + totalIntake + '</b></strong>');
		} else {
			totalIntake = parseInt(window.localStorage.getItem("config_kcals_day_1")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
			totalPercent  = totalConsumed / (totalIntake / 100);
			$("#appStatusWeight div p").html(totalConsumed + '<strong> / <b>' + totalIntake + '</b>~' + window.localStorage.getItem("config_kcals_day_2") + '</strong>');
		}
	} else {
		$("#appStatusWeight div p").html(totalConsumed + '<strong> / ' + totalIntake + ' ' + LANG.KCAL[lang] + '</strong>');
	}
	///////////////////////
	// INDICATE ADDITION //
	///////////////////////
	if(Math.abs(parseInt(window.localStorage.getItem("config_tte")) != 0)) {
		$("#appStatusWeight span").html(LANG.TODAY[lang] + ' (+' + Math.abs(parseInt(window.localStorage.getItem("config_tte"))) + ')');
	}
	/////////////////
	// PERCENT BAR //
	/////////////////
	$('#appStatusWeight em').css('width',totalPercent + "%");
	if(totalPercent >= 115) {
		$('#appStatusWeight em').addClass('exceed');
	} else {
		$('#appStatusWeight em').removeClass('exceed');
	}
	/////////////////////
	// SET CURRENT DAY //
	/////////////////////
	if(window.localStorage.getItem("config_kcals_day")) {
		$('.current').removeClass('current');
		$('#' + 'appDay' + window.localStorage.getItem("config_kcals_day").toUpperCase()).addClass('current');
	}
}
//##/////////////##//
//## CYCLIC MENU ##//
//##/////////////##//
function getCyclicMenu() {
	//////////
	// HTML //
	//////////
	var isCyclic = (window.localStorage.getItem("config_kcals_type") == "cyclic") ? 'checked' : '';
	var appModeHtml = "\
	<div id='appMode'>\
		<input id='appModeToggle' class='toggle' type='checkbox' " + isCyclic + ">\
		<label for='appModeToggle'></label>\
		<div id='appModeEnable'>\
			<input id='appCyclic1' type='number' value='" + window.localStorage.getItem("config_kcals_day_1") + "' />\
			<div id='appCyclic1Title'>" + LANG.DAYS[lang] + " A B C</div>\
			<input id='appCyclic2' type='number' value='" + window.localStorage.getItem("config_kcals_day_2") + "' />\
			<div id='appCyclic2Title'>" + LANG.DAY[lang] + " D</div>\
			<div id='appModeEnableInfo'><p>" + LANG.CYCLIC_INFO[lang].split('. ').join('_').split('.').join('.</p><p>').split('_').join('. ') + "</p></div>\
		</div>\
	</div>";
	//////////////
	// HANDLERS //
	//////////////
	var appModeHandlers = function() {	
		/////////////////////////
		// backport validation //
		/////////////////////////
		var defaultInputHeaderi = "keypress";
		if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderi = "keydown"; }		
		$("#appCyclic1,#appCyclic2").on(defaultInputHeaderi, function(evt) {
			//no dots
			if((evt.which || evt.keyCode) == 46) { return false; }
			if((evt.which || evt.keyCode) == 8)  { return true; }
			if((evt.which || evt.keyCode) == 13) { return true; }
			//max
			if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
				$(this).val( parseInt($(this).val()) );
				if(isNumberKey(evt)) {	
					$(this).val( $(this).val().slice(0,-1) );
				}
			}
			//num only
			return isNumberKey(evt);
		});
		//////////////////////
		// BASIC VALIDATION //
		//////////////////////
		$("#appCyclic1").blur(defaultInputHeaderi, function(evt) {
			if($(this).val() == "")  { $(this).val(1600); }
			if($(this).val() == 0)   { $(this).val(1600); }
			if(isNaN($(this).val())) { $(this).val(1600); }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_kcals_day_1",$(this).val());
			if(window.localStorage.getItem("config_kcals_type") == "cyclic" && window.localStorage.getItem("config_kcals_day") != "d") {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_1")));
			}
			updateTodayOverview();
		});
		$("#appCyclic2").blur(defaultInputHeaderi, function(evt) {
			if($(this).val() == "")  { $(this).val(2000); }
			if($(this).val() == 0)   { $(this).val(2000); }
			if(isNaN($(this).val())) { $(this).val(2000); }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_kcals_day_2",$(this).val());
			if(window.localStorage.getItem("config_kcals_type") == "cyclic" && window.localStorage.getItem("config_kcals_day") == "d") {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_2")));
			}
			updateTodayOverview();
		});
		//////////////
		// TAP BLUR //
		//////////////
		$('#appMode').on(touchend,function(evt) {
			evt.stopPropagation();
			if($("#appCyclic1").is(':focus') || $("#appCyclic2").is(':focus')) {
				if(evt.target.id != "appCyclic1" && evt.target.id != "appCyclic2") {
					evt.preventDefault();
				}
			}
			if(evt.target.id != "appCyclic1" && evt.target.id != "appCyclic2") {
				$("#appCyclic1").blur();
				$("#appCyclic2").blur();
			}
		});
		/////////////////////
		// SWITCH LISTENER //
		/////////////////////
		//set default
		if(!window.localStorage.getItem("config_kcals_type")) {
			window.localStorage.setItem("config_kcals_type","simple");
		}
		//read stored
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			$("#appModeToggle").prop('checked',true);
		}
		$('#appModeToggle + label').on(touchstart,function(obj) {
			$('#appModeToggle').trigger("change");
			updateTodayOverview();
		});
		//read changes
		$('#appModeToggle').on("change",function(obj) {
			if($('#appModeToggle').prop('checked')) {
				appMode = "cyclic";
				window.localStorage.setItem("config_kcals_type","cyclic");
				$("body").removeClass("simple");
				$("body").addClass("cyclic");
			} else {
				appMode = "simple";
				window.localStorage.setItem("config_kcals_type","simple");
				$("body").removeClass("cyclic");
				$("body").addClass("simple");
			}
			//update underlying
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_2")));
				} else {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_1")));
				}
			} else {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_0")));
			}
		});
	}
	/////////////
	// CONFIRM //
	/////////////
	var appModeConfirm = function() {
		$("#appCyclic1").blur();
		$("#appCyclic2").blur();		
		updateTodayOverview();
		intakeHistory();
		return true;
	}
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.CYCLIC_TITLE[lang],appModeHtml,appModeHandlers,'',appModeConfirm);
}
//##///////////////##//
//## BALANCE METER ##//
//##///////////////##//
function balanceMeter(kcalsInput,update) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return false; }
	if(isNaN(parseInt(kcalsInput)))							  { return false; }
	if(!kcalsInput)											  { return false; }
	kcalsInput = kcalsInput*-1;
	var balancePos = 0;
	//GET DEFINED
	var llim = parseInt(window.localStorage.getItem("config_limit_1"));
	var ulim = parseInt(window.localStorage.getItem("config_limit_2"));
	var ml = (Math.abs(llim));
	var pl = (ml*2)/100;
	var pu = (ulim*2)/100;
	// LIMITS 
	if(kcalsInput == 0) {
		balancePos = '50%';
	} else {
		////////////////////
		// SELF REFERENCE //
		////////////////////
		//balancePos = 100 - (((parseFloat(kcalsInput)+600)/12) ) + "%";
		if(parseInt(kcalsInput)*-1 > 0) {
			//postive
			balancePos = 100 - (((parseFloat(kcalsInput)+ulim)/pu) ) + "%";
		} else {
			//negative
			balancePos = 100 - (((parseFloat(kcalsInput)+ml)/pl) ) + "%";
		}
	}
	// LIMITS
	if(parseInt(balancePos) > 100) {
		balancePos = '100%';
	}
	if(parseInt(balancePos) < 0) {
		balancePos = '0';
	}
	//////////////////////
	// UPDATE NO-REPEAT //
	//////////////////////
	var roundedBar = (Math.round(parseFloat($("#balanceBar").css("text-indent")) * 100) / 100);
	var roundedNum = (Math.round(parseFloat(balancePos) * 100) / 100);
	if(roundedBar != roundedNum || update == 'now') {
		$("#balanceBar").css("text-indent",roundedNum + '%');
	}
}
//##/////////////##//
//## LIMIT MENU ##//
//##/////////////##//
function getLimitMenu() {
	//////////
	// HTML //
	//////////
	var appLimitHtml = "\
	<div id='appLimit'>\
		<div id='appLimitEnable'>\
			<input id='appLimit1' type='number' value='" + Math.abs(window.localStorage.getItem("config_limit_1")) + "' />\
			<div id='appLimit1Title'>" + LANG.LIMIT_LOWER[lang] + " <span>(" + LANG.DEFICIT[lang] + ")</span></div>\
			<input id='appLimit2' type='number' value='" + window.localStorage.getItem("config_limit_2") + "' />\
			<div id='appLimit2Title'>" + LANG.LIMIT_UPPER[lang] + " <span>(" + LANG.SURPLUS[lang] + ")</span></div>\
			<div id='appLimitInfo'><p>" + LANG.LIMIT_INFO[lang].split('. ').join('_').split('.').join('.</p><p>').split('_').join('. ') + "</p></div>\
		</div>\
	</div>";
	//////////////
	// HANDLERS //
	//////////////
	var appLimitHandlers = function() {	
		/////////////////////////
		// backport validation //
		/////////////////////////
		var defaultInputHeaderl = "keypress";
		if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderl = "keydown"; }		
		$("#appLimit1,#appLimit2").on(defaultInputHeaderl, function(evt) {
			//no dots
			if((evt.which || evt.keyCode) == 46) { return false; }
			if((evt.which || evt.keyCode) == 8)  { return true; }
			if((evt.which || evt.keyCode) == 13) { return true; }
			//max
			if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
				$(this).val( parseInt($(this).val()) );
				if(isNumberKey(evt)) {	
					$(this).val( $(this).val().slice(0,-1) );
				}
			}
			//num only
			return isNumberKey(evt);
		});
		//////////////////////
		// BASIC VALIDATION //
		//////////////////////
		$("#appLimit1").blur(defaultInputHeaderl, function(evt) {
			if($(this).val() == "")  { $(this).val(600);  }
			if($(this).val() == 0)   { $(this).val(600);  }
			if(isNaN($(this).val())) { $(this).val(600);  }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_limit_1",$(this).val()*-1);
		});
		$("#appLimit2").blur(defaultInputHeaderl, function(evt) {
			if($(this).val() == "")  { $(this).val(600);  }
			if($(this).val() == 0)   { $(this).val(600);  }
			if(isNaN($(this).val())) { $(this).val(600);  }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_limit_2",$(this).val());
		});
		//////////////
		// TAP BLUR //
		//////////////
		$('#appLimit').on(touchend,function(evt) {
			evt.stopPropagation();
			if($("#appLimit1").is(':focus') || $("#appLimit2").is(':focus')) {
				if(evt.target.id != "appLimit1" && evt.target.id != "appLimit2") {
					evt.preventDefault();
				}
			}
			if(evt.target.id != "appLimit1" && evt.target.id != "appLimit2") {
				$("#appLimit1").blur();
				$("#appLimit2").blur();
			}
		});
	}
	/////////////
	// CONFIRM //
	/////////////
	var appLimitConfirm = function() {
		$("#appLimit1").blur();
		$("#appLimit2").blur();
		return true;
	}
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.CALORIC_THRESHOLD[lang],appLimitHtml,appLimitHandlers,'',appLimitConfirm);
}
//##/////////////##//
//## GET ELAPSED ##//
//##/////////////##//
function getElapsed(swap) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return false; }
	////////////////
	// FIRST LOAD //
	////////////////
	if(!window.localStorage.getItem("config_swap")) {
		window.localStorage.setItem("config_swap",1);
	}
	//////////////
	// HOT SWAP //
	//////////////
	if(swap == "next") {
		     if(window.localStorage.getItem("config_swap") == 1) { window.localStorage.setItem("config_swap",2); swap = 2; }
		else if(window.localStorage.getItem("config_swap") == 2) { window.localStorage.setItem("config_swap",3); swap = 3; }
		else if(window.localStorage.getItem("config_swap") == 3) { window.localStorage.setItem("config_swap",1); swap = 1; }
		//$("#appStatusElapsed div span").stop().animate({ color: "#007aff" }, 1).animate({ color: "#aaa" }, 450);
		//$("#appStatusElapsed").stop().animate({ borderColor: "rgba(0,117,255,0.7)" }, 1).animate({ borderColor: "#eee" }, 350);
		//$("#appStatusElapsed").stop().animate({ backgroundColor: "rgba(255,255,0,0.2)" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.2)" }, 325);
	}
	//////////
	// VARS //
	//////////
	swap = window.localStorage.getItem("config_swap");
	var swapData;
	var swapSub;
	//////////////////
	// ELAPSED TIME //
	//////////////////
	if(swap == 1) {
		//DATA
		swapData = dateDiff(window.localStorage.getItem("config_start_time"),new Date().getTime());
		swapSub  = LANG.ELAPSED_TIME[lang];
	///////////////////
	// RELATIVE TIME //
	///////////////////
	} else if(swap == 2) {
		//PER DAY
		eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_0"));
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_2"));
			} else {
				eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_1"));
			}
		}
		var nowDate = new Date().getTime();
		var eqRatio = (60*60*24*1000) / eqPerDay;
		var eqDiff  = nowDate - Math.floor(Math.abs(timerKcals*eqRatio));
		//DATA
		swapData = dateDiff(eqDiff,nowDate);
		swapSub  = LANG.RELATIVE_TIME[lang];
	/////////////////
	// WEIGHT LOSS //
	/////////////////
	} else if(swap == 3) {
		var weightLoss;
		var weightLossUnit = (window.localStorage.getItem("calcForm#pA6H") == "kilograms") ? LANG.KG[lang] : LANG.LB[lang];
		if(window.localStorage.getItem("appStatus") == "running") {
			weightLoss = ((((Number(window.localStorage.getItem("calcForm#pA6G"))) * ((Number(new Date().getTime()) - (Number(window.localStorage.getItem("config_start_time")))) / (60*60*24*7))) / 1000)).toFixed(7);
		} else {
			weightLoss = "0.0000000";
		}
		//DATA
		swapData = weightLoss + ' ' + weightLossUnit;
		swapSub  = LANG.WEIGHT_LOSS[lang];
	}
	////////////////////
	// SHRINK ELIPSIS //
	////////////////////
	if(swap == 1 || swap == 2) {
		//selective shrink
		if(swapData) {
			swapData = swapData.split(LANG.AGO[lang]).join('').split(LANG.PREAGO[lang]).join('');
			if(swapData.length > 20 && window.innerWidth <= 360) {
				swapData = swapData.replace(LANG.MINUTES[lang],LANG.MIN[lang]);
				swapData = swapData.replace(LANG.MINUTE[lang],LANG.MIN[lang]);
				swapData = trim(swapData.replace('.',''));
				if(swapData.match('min')) {
					swapData = swapData + '.';	
				}
			}
		}
	}
	/////////////////////
 	// UPDATE CONTENTS //
	/////////////////////
	if($("#appStatusElapsed div p").html() != swapData) {
		$("#appStatusElapsed div p").html(swapData);
	}
	if($("#appStatusElapsed div p").html() != swapSub) {
		$("#appStatusElapsed div span").html(swapSub);
		$('#elapsedIndicators div').removeClass('activeSwap');
		$('#ind' + swap).addClass('activeSwap');
	}
}
//##////////////////##//
//## GET ENTRY EDIT ##//
//##////////////////##//
function getEntryEdit(eid) {
	//swap food/exercise button
	getEntry(eid,function(data) {
		//////////////
		// HANDLERS //
		//////////////
		var getEntryHandler = function() {
			//food/exercise
			if($("#getEntryTitle").val() >= 0) { 
				$("#divEntryTitle").addClass('food');
			} else {
				$("#getEntryTitle").val( Math.abs($("#getEntryTitle").val()) );
				$("#divEntryTitle").addClass('exercise');
			}
			//MOBISCROLL
			$('#getEntryDate').mobiscroll().datetime({
				preset: 'datetime',
				minDate: new Date((new Date().getFullYear() - 1),1,1, 0, 0),
				maxDate: new Date(),
				theme: 'ios7',
				lang: 'en',
		       	dateFormat: 'yyyy/mm/dd',
        		dateOrder:  'dd MM yy',
		        timeWheels: 'HH:ii',
		        timeFormat: 'HH:ii',
				setText: LANG.OK[lang],
				closeText: LANG.CANCEL[lang],
				cancelText: LANG.CANCEL[lang],
				display: 'modal',
				stepMinute: 1,
				animate: 'none',
				monthNames: LANG.MONTH_SHORT[lang].split(', '),
				monthNamesShort: LANG.MONTH_SHORT[lang].split(', '),
				mode: 'scroller'
			});
			//HOLD FLICKER
			if(isMobile.Android() ) {
				$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
				$('#dummyInput').focus();
				$('#dummyInput').blur();
				$('#dummyInput').remove();
			}
			//SET
			$('#getEntryDate').scroller('setDate',new Date(parseInt($('#getEntryDate').val())), true);
			//SAVE IF CHANGED
			$('#getEntryDate').on('change',function() {
				$('#getEntryDateHidden').val(Date.parse($(this).val()));
			});
			$('#getEntryDate').on(touchstart,function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				// HARD PROPAGATION FIX
				if($("#getEntryWrapper input").is(':focus')) {
					kickDown();
					$("#getEntryWrapper input").blur();
					$("#getEntryWrapper input").css('pointer-events','none');
					setTimeout(function() {
						$('#getEntryDate').click();
						$("#getEntryWrapper input").css('pointer-events','auto');
					},900);
				} else {
					$('#getEntryDate').click();
				}
			});
			$('#getEntryDate').on('focus',function() {
				$('#getEntryDate').blur();
			});
			/////////////////////////
			// backport validation //
			/////////////////////////
			var defaultInputHeaderi = "keypress";
			if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderi = "keydown"; }
			$("#getEntryTitle,#getEntryPro,#getEntryCar,#getEntryFat").on(defaultInputHeaderi, function(evt) {
				//no dots
				if((evt.which || evt.keyCode) == 46) { return false; }
				if((evt.which || evt.keyCode) == 8)  { return true; }
				if((evt.which || evt.keyCode) == 13) { return true; }
				//max
				if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
					$(this).val( parseInt($(this).val()) );
					if(isNumberKey(evt)) {
						$(this).val( $(this).val().slice(0,-1) );
					}
				}
				//num only
				return isNumberKey(evt);
			});
			//////////////////////
			// BASIC VALIDATION //
			//////////////////////
			$("#getEntryTitle,#getEntryPro,#getEntryCar,#getEntryFat").blur(defaultInputHeaderi, function(evt) {
				if(evt.target.id == "getEntryTitle") {
					$(this).val(parseInt($(this).val()));
				} else {
					$(this).val(parseFloat($(this).val()));					
				}
				if($(this).val() == "")   { $(this).val(0); }
				if($(this).val() == 0)    { $(this).val(0); }
				if(isNaN($(this).val()))  { $(this).val(0); }
				if(evt.target.id != "getEntryTitle") {
					if($(this).val() < 0) { $(this).val(0); }
				}
				if($(this).val() > 9999)  { $(this).val(9999); }
			});
			$("#getEntryTitle,#getEntryPro,#getEntryCar,#getEntryFat").on('focus', function(evt) {
				if($(this).val() == 0)    { $(this).val(''); }
			});
			//////////////
			// TAP BLUR //
			//////////////
			$('#newWindow').on(touchend,function(evt) {
				evt.stopPropagation();
				if($("#getEntryWrapper input").is(':focus')) {
					if((evt.target.id).indexOf('getEntry') === -1) {
						evt.preventDefault();
					}
				}
				if((evt.target.id).indexOf('getEntry') === -1) {
					kickDown();
					//HARD PROPAGATION FIX
					$("#getEntryWrapper input").blur();
					$("#getEntryWrapper input").css('pointer-events','none');
					setTimeout(function() {
						$("#getEntryWrapper input").css('pointer-events','auto');
					},300);
				}
			});
		};
		/////////////
		// CONFIRM //
		/////////////
		var getEntrySave = function() {
			var FoE = $("#divEntryTitle").hasClass('exercise') ? -1 : 1; 
			//WRITE
			updateEntry({
				id:parseInt($('#getEntryId').val()),
				title:($("#getEntryTitle").val() * FoE)            + '',
				body:$("#getEntryBody").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ") + '',
				published:parseInt($('#getEntryDateHidden').val()) + '',
				pro:parseFloat($("#getEntryPro").val())            + '',
				car:parseFloat($("#getEntryCar").val())            + '',
				fat:parseFloat($("#getEntryFat").val())            + '',
			});
			//REFRESH DATA
			setTimeout(function() {
				//$('#' + $('#getEntryId').val()).remove();
				updateEntries(parseInt($('#getEntryDateHidden').val()));
				updateEntriesSum();
			}, 0);
			return true;
		};
		//////////
		// HTML //
		//////////
		var pro = data[0].pro;
		var car = data[0].car;
		var fat = data[0].fat;
		if(!data[0].pro || isNaN(pro)) { pro = 0; }
		if(!data[0].car || isNaN(car)) { car = 0; }
		if(!data[0].fat || isNaN(fat)) { fat = 0; }
		var getEntryHtml = "\
			<div id='getEntryWrapper'>\
				<div id='divEntryBody'><span>"  + LANG.ADD_NAME[lang] + "</span><input type='text' id='getEntryBody' value='"    + data[0].body      + "' /></div>\
				<div id='divEntryTitle'><span>" + LANG.KCAL[lang]     + "</span><input type='number' id='getEntryTitle' value='" + data[0].title     + "' /></div>\
				<div id='divEntryPro'><span>"   + LANG.PRO[lang]      + "</span><input type='number' id='getEntryPro' value='"   + pro               + "' /></div>\
				<div id='divEntryCar'><span>"   + LANG.CAR[lang]      + "</span><input type='number' id='getEntryCar' value='"   + car               + "' /></div>\
				<div id='divEntryFat'><span>"   + LANG.FAT[lang]      + "</span><input type='number' id='getEntryFat' value='"   + fat               + "' /></div>\
				<div id='divEntryDate'><span>"  + LANG.DATE[lang]     + "</span><input type='text' id='getEntryDate' value='"    + data[0].published + "' /></div>\
				<input type='hidden' id='getEntryId'         value='" + data[0].id        + "' />\
				<input type='hidden' id='getEntryDateHidden' value='" + data[0].published + "' />\
			</div>";
		/////////////////
		// CALL WINDOW //
		/////////////////
		getNewWindow(LANG.EDIT[lang],getEntryHtml,getEntryHandler,getEntrySave);
	});
}
//##////////////////##//
//## BILLING MODULE ##//
//##////////////////##//
function expireNotice() {
	////////////
	// UNLOCK //
	////////////
	function doBuy(button) {
		if(button != 1) { return; }
		setTimeout(function() {
			$("#tab4").trigger(touchstart);
		},0);
		setTimeout(function() {
			$("#optionBuy").trigger(touchend);
		},300);
	}
	////////////////////
	// CONFIRM/NOTIFY //
	////////////////////
	if(isMobile.MSApp()) {
		var md = new Windows.UI.Popups.MessageDialog(LANG.BUY_FULL_VERSION[lang] + '?', LANG.EVALUATION_EXPIRED[lang]);
		md.commands.append(new Windows.UI.Popups.UICommand(LANG.BUY[lang]));
		md.commands.append(new Windows.UI.Popups.UICommand(LANG.NO_THANKS[lang]));
		md.showAsync().then(function (command) { if(command.label == LANG.BUY[lang]) { doBuy(1); } if(command.label == LANG.NO_THANKS[lang]) { doBuy(0); } });	
	} else if(hasTouch()) {
		navigator.notification.confirm(LANG.BUY_FULL_VERSION[lang] + '?', doBuy, LANG.EVALUATION_EXPIRED[lang], [LANG.BUY[lang],LANG.NO_THANKS[lang]]);
	} else {
		if(confirm(LANG.EVALUATION_EXPIRED[lang] + "\n" + LANG.BUY_FULL_VERSION[lang] + '?')) { doBuy(1); }
	}
}
///////////////
// DAYS LEFT //
///////////////
function daysLeft() {
	var expired = 0;
	var now  = new Date().getTime();
	var day  = 1000 * 1 * 24 * 60 * 60;
	var week = 1000 * 7 * 24 * 60 * 60;
	var installTime = parseInt(window.localStorage.getItem('config_install_time'));
	var expireTime  = installTime+week;
	var daysLeft    = Math.ceil((expireTime-now) / day);
	//check range
	if(daysLeft < 0 || daysLeft > 7) { daysLeft = 0; }
	//write expired if not paid
	if(daysLeft == 0) {
		if(window.localStorage.getItem("config_mode") != 'full') {
			if(window.localStorage.getItem("config_mode") != 'expired') {
				$("body").removeClass("full trial");
				$("body").addClass("expired");
				window.localStorage.setItem("config_mode","expired");
				window.localStorage.setItem("config_install_time",(new Date().getTime()) - (60*60*24*8*1000));
				expireNotice();
				getAnalytics('expired');
			}
		}
	}
	//update fix
	if(isNaN(daysLeft))	{ daysLeft = 7; }
	//return
	return daysLeft;
}
/////////////
// IS PAID //
/////////////
function isPaid() {
	var isPaid = false;
	///////////////////
	// ANDROID CHECK //
	///////////////////
	//isMobile.iOS() || 
	if((isMobile.Android() || isMobile.Windows() || isMobile.MSApp()) && isCordova()) {
		//start trial
		if(!window.localStorage.getItem("config_install_time")) {
			window.localStorage.setItem("config_install_time",new Date().getTime());
		}	
		if(window.localStorage.getItem("config_mode") == 'full') {
			isPaid = true;
		} else {
			isPaid = false;	
		}
	////////////////////////
	// BILLING UNVAILABLE //
	////////////////////////
	} else {
		isPaid = true;	
	}
	//return bool
	return isPaid;
}
///////////////////
// CHECK LICENSE //
///////////////////
function checkLicense() {
	if(isPaid()) {
		//real paid
		if(window.localStorage.getItem("config_mode") == 'full') {
			$("body").removeClass("trial expired");
			$("body").addClass("full");	
		} else {
		//non-paying
		}
	} else if(daysLeft() == 0) {
		//paid expired
		if(window.localStorage.getItem("config_mode") == 'expired') {
			$("body").removeClass("full trial");
			$("body").addClass("expired");
		}
	} else {
		$("body").removeClass("full expired");
		$("body").addClass("trial");
	}
}
//#//////////////////#//
//# AUTORIZE ROUTINE #//
//#//////////////////#//
var didUnlock = false;
function billingAuthorize(auth,msg) {
	if(auth == 1) { didUnlock = 1; } else { didUnlock = 0; }
	////////////
	// UNLOCK //
	////////////
	function doUnlock(auth) {
		if(didUnlock != 1) { return; }
		$("#backButton").trigger(touchend);
		//auto login
		setTimeout(function() {
			window.localStorage.setItem('config_mode','full');
			isPaid();
			checkLicense();
			getAnalytics('fullVersion');
		},500);
	}
	////////////////////
	// CONFIRM/NOTIFY //
	////////////////////
	var msgTitle = (auth == 1) ? LANG.SUCCESS[lang] : LANG.ERROR[lang];
	if(isMobile.MSApp()) {
		var md = new Windows.UI.Popups.MessageDialog(msg, msgTitle);
		md.commands.append(new Windows.UI.Popups.UICommand(LANG.OK[lang]));
		md.showAsync().then(function (command) { if(command.label == LANG.OK[lang]) { doUnlock(); } });
	} else if(hasTouch()) {
		navigator.notification.confirm(msg, doUnlock, msgTitle, [LANG.OK[lang]]);
	} else {
		if(confirm(msgTitle + "\n" + msg)) { doUnlock(); }
	}
}
//#/////#//
//# BUY #//
//#/////#//
function billingBuy() {
	/*///////////
	// ANDROID //
	///////////*/
	if(isMobile.Android()) {
		inappbilling.init(function(e) {
			inappbilling.buy(function(e) {
				billingAuthorize(1, LANG.TRANSACTION_SUCCESS[lang]);
			}, function(e) {
				if((JSON.stringify(e)).indexOf('Owned') !== -1) {
					billingAuthorize(1, LANG.ALREADY_OWN[lang]);
				} else {
					billingAuthorize(0, LANG.TRANSACTION_UNSUCCESSFUL[lang]);
				}
			}, 'com.cancian.fullversion');
		}, function(e) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		}, true);
	}
	/*///////
	// WP8 //
	///////*/
	if(isMobile.Windows()) {
		window.plugins.inAppPurchaseManager.requestProductData("com.cancian.fullversion", function (productId, title, description, price) {
			//request success
			window.plugins.inAppPurchaseManager.makePurchase(productId, 1,
				//restore success
				function() {
				billingAuthorize(1, LANG.TRANSACTION_SUCCESS[lang]);
				//restore fail
			}, function() {
				billingAuthorize(0, LANG.TRANSACTION_UNSUCCESSFUL[lang]);
			});
		},
			//request fail
			function (id) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		});
	}
	/*/////////
	// MSAPP //
	/////////*/
	if(isMobile.MSApp()) {
		try {
			if(!isInAppPurchaseValid("com.cancian.fullversion")) {
				 (Windows.ApplicationModel.Store.CurrentApp).requestProductPurchaseAsync("com.cancian.fullversion", false).then(function () {
					if(isInAppPurchaseValid("com.cancian.fullversion")) {
						billingAuthorize(1, LANG.TRANSACTION_SUCCESS[lang]);
					} else {
						billingAuthorize(0, LANG.TRANSACTION_UNSUCCESSFUL[lang]);
					}
				}, function () {
					billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
				});
			} else {
				billingAuthorize(1, LANG.ALREADY_OWN[lang]);
			}
		} catch (e) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		}
	}
	/*///////
	// IOS //
	///////*/
	if(isMobile.iOS()) {
		try {
	/*		
    window.storekit.init({

        debug: true,

        purchase: function (transactionId, productId) {
            console.log('purchased: ' + productId);
        },
        restore: function (transactionId, productId) {
            console.log('restored: ' + productId);
        },
        restoreCompleted: function () {
           console.log('all restore complete');
        },
        restoreFailed: function (errCode) {
            console.log('restore failed: ' + errCode);
        },
        error: function (errno, errtext) {
            console.log('Failed: ' + errtext);
        },
        ready: function () {
            var productIds = [
                "com.cancian.mylivediet"
            ];
            window.storekit.load(productIds, function(validProducts, invalidProductIds) {
                $.each(validProducts, function (i, val) {
                    alert.log("id: " + val.id + " title: " + val.title + " val: " + val.description + " price: " + val.price);
                });
                if(invalidProductIds.length) {
                    alert.log("Invalid Product IDs: " + JSON.stringify(invalidProductIds));
                }
            });
        }
    });
	*/
	///window.storekit.verifyReceipt(function(){ alert('s'); },function(){ alert('x'); });



    window.storekit.loadReceipts(function (receipts) {
		var appReceipt      = Base64.decode(receipts.appStoreReceipt);
		var originalDatePos = (Base64.decode(receipts.appStoreReceipt)).indexOf('com.cancian.mylivediet');
		var originalDate    = appReceipt.slice((originalDatePos-32),(originalDatePos-13));
		if(Date.parse(originalDate) > Date.UTC(2014,6,22)) {
			alert('free');
		} else {
			alert('paid');		
		}
    });	
	//

		} catch (e) {
alert(e);
		}
	}	
}
//#/////////#//
//# RESTORE #//
//#/////////#//
function billingRestore() {
	/*///////////
	// ANDROID //
	///////////*/
	if(isMobile.Android()) {
		inappbilling.init(function(e) {
			inappbilling.getPurchases(function(e) {
				if((JSON.stringify(e)).indexOf('com.cancian.fullversion') !== -1) {
					billingAuthorize(1, LANG.PURCHASE_RESTORED[lang]);
				} else {
					billingAuthorize(0, LANG.RESTORE_FAILED[lang]);
				}
			}, function(e) {
				billingAuthorize(0, LANG.RESTORE_FAILED[lang]);
			});
			//android.test.purchased
		}, function(e) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		}, true);
	}
	/*///////
	// WP8 //
	///////*/
	if(isMobile.Windows()) {
		window.plugins.inAppPurchaseManager.requestProductData("com.cancian.fullversion", function (productId, title, description, price) {
			//request success
			window.plugins.inAppPurchaseManager.restoreCompletedTransactions(
				//restore success
				function() {
				billingAuthorize(1, LANG.PURCHASE_RESTORED[lang]);
				//restore fail
			}, function() {
				billingAuthorize(0, LANG.RESTORE_FAILED[lang]);
			});
		},
			//request fail
			function (id) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		});
	}
	/*/////////
	// MSAPP //
	/////////*/
	if(isMobile.MSApp()) {
		try {
			if(isInAppPurchaseValid("com.cancian.fullversion")) {
				billingAuthorize(1, LANG.PURCHASE_RESTORED[lang]);
			} else { 
				billingAuthorize(0, LANG.RESTORE_FAILED[lang]);
			}
		} catch(e) {
			billingAuthorize(0, LANG.UNEXPECTED_ERROR[lang]);
		}
	}
}
//#////////////////#//
//# BILLING WINDOW #//
//#////////////////#//
function billingWindow() {
	/////////////
	// HANDLER //
	/////////////
	var getBillingHandler = function() {
		$('#buyButton').on(touchend,function(evt) {
			evt.stopPropagation();
			billingBuy();
		});
		$('#restoreButton').on(touchend,function(evt) {
			evt.stopPropagation();
			billingRestore();
		});
	}
	//////////
	// HTML //
	//////////
	var getBillingHtml = "\
		<div id='premiumInfo'>"   + LANG.DAYS_LEFT[lang]         + ': ' + daysLeft() + "</div>\
		<div id='buyButton'>"     + LANG.BUY[lang]               + "</div>\
		<div id='restoreButton'>" + LANG.RESTORE_PURCHASES[lang] + "</div>\
	";
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.FULL_VERSION[lang],getBillingHtml,getBillingHandler,'');	
}
//##///////////////##//
//## ADVANCED MENU ##//
//##///////////////##//
function buildAdvancedMenu() {
	$("#advancedMenuWrapper").remove();
	$("body").append("\
	<div id='advancedMenuWrapper'>\
		<div id='advancedMenuHeader'>\
			<div id='advBackButton'></div>\
			<div id='advancedMenuTitle'>" + LANG.SETTINGS_ADVANCED[lang] + "</div>\
		</div>\
		<div id='advancedMenu'></div>\
	</div>");
	//WRAPPER HEIGHT
	$("#advancedMenuWrapper").css("top",($("#appHeader").height()) + "px");
	$("#advancedMenuWrapper").css("bottom",($("#appFooter").height()) + "px");
	$("#advancedMenuWrapper").height($("#appContent").height());
	///////////////
	// CORE HTML //
	///////////////
	$("#advancedMenu").html("\
	<ul>\
		<li id='advancedAutoUpdate'>" + LANG.AUTO_UPDATE[lang] + "</li>\
		<li id='advancedChangelog'>" + LANG.CHANGELOG[lang] + "</li>\
		<li id='advancedReview'>" + LANG.REVIEW[lang] + "</li>\
		<li id='advancedContact'>" + LANG.CONTACT[lang] + "</li>\
		<li id='advancedAbout'>" + LANG.ABOUT[lang] + "</li>\
	</ul>\
	<ul>\
		<li id='advancedReload'>" + LANG.REBUILD_FOOD_DB[lang] + "</li>\
	</ul>\
	<ul>\
		<li id='advancedReset'>" + LANG.SETTINGS_WIPE[lang] + "</li>\
	</ul>\
	");
	//CONTENT HEIGHT
	$("#advancedMenu").css("top",($("#advancedMenuHeader").height()+1) + "px");	
	$("#advancedMenuWrapper").height($("#appContent").height());	
	//SHOW
	$("#advancedMenuWrapper").hide();
	$("#advancedMenuWrapper").fadeIn(200,function() {
		//SCROLLER
		if(!isMobile.iOS() && androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS()) {
			$("#advancedMenu").css("overflow","hidden");
			$("#advancedMenu").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		} else {
			$("#advancedMenu").css("overflow","auto");
		}
	});
	//////////////////
	// LIST HANDLER //
	//////////////////
	//LIST CLOSER HANDLER
	$("#advBackButton").on(touchend,function() {
		$("#advancedMenuWrapper").fadeOut(200,function() {
			$('#advancedMenuWrapper').remove();
		});
	});
	//CHECKBOX BLOCK SWITCH
	$("#advancedMenu li").on(tap,function(evt) {
		if((/checkbox/).test($(this).html())) {
			$('input[type=checkbox]', this).trigger('click');
		}
	});
	//ADD ACTIVE
	$("#advancedMenu li").on(touchstart,function(evt) {
		if(!(/checkbox/).test($(this).html())) {
			$(this).addClass("activeRow");
		}
	});
	//REMOVE ACTIVE
	$("#advancedMenu, #advancedMenu li").on(touchend + " " + touchmove + " mouseout scroll",function(evt) {
		$(".activeRow").removeClass("activeRow");
	});
	//#////////////#//
	//# CHANGE LOG #//
	//#////////////#//
	$("#advancedChangelog").on(tap, function(evt) {
		$.get(hostLocal + "version.txt",function(logFile) {
			var logContent = '';
			//////////
			// HTML //
			//////////
			$.each((logFile.split('\n')),function(l,logLine) {
				if(logLine.indexOf('##') !== -1 || logLine.length < 4) {
					//logContent.push('<p>' + logLine + '</p>');
				} else if(logLine.indexOf('#') !== -1) {
					logLine = (trim(logLine.replace('#',''))).split(' ');
					logContent += '<p>Version ' + logLine[0] + '<span>' + logLine[1].replace('[','').replace(']','') + '</span></p>';
				} else {
					logContent += logLine + '<br />';
				}
			});
			logContent = "<div id='logContent'>" + logContent + "</div>";
			//////////////
			// HANDLERS //
			//////////////
			var logHandler = function () {
				setTimeout(function () {
					$("#newWindowWrapper").on(transitionend, function () {
						$("#advancedMenuWrapper").hide();
					});
				}, 1);
			}
			////////////
			// CLOSER //
			////////////
			var logCloser = function() {
				$("#advancedMenuWrapper").show();
			}
			/////////////////
			// CALL WINDOW //
			/////////////////
			getNewWindow(LANG.CHANGELOG[lang],logContent,logHandler,'',logCloser);
		});
	});
	//#////////#//
	//# REVIEW #//
	//#////////#//
	if(isMobile.iOS() || isMobile.Android() || isMobile.Windows() || isMobile.MSApp() || isMobile.FirefoxOS()) {
		$("#advancedReview").on(tap,function(evt) {
			getStoreUrl(1);
		});	
	} else {
		$("#advancedReview").remove();
	}
	//#///////#//
	//# ABOUT #//
	//#///////#//
	$("#advancedAbout").remove();
	/*
	$("#advancedAbout").on(tap, function(evt) {
		if(hasTouch()) {
			navigator.notification.alert(LANG("ABOUT_DIALOG"), voidThis,LANG("ABOUT_TITLE"),LANG("OK"));
		} else {
			alert(LANG("ABOUT_TITLE") + " \n" + LANG("ABOUT_DIALOG"));
			setTimeout(function() {
				//$(".nextChild").removeClass("nextChild");
				$(".activeRow").removeClass("activeRow");
			},0);
		}
	});
	*/
	//#/////////#//
	//# CONTACT #//
	//#/////////#//
	$("#advancedContact").on(tap,function(evt) {
             if(isMobile.iOS())       { window.open('mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(iOS)', '_system', 'location=yes');                               }
		else if(isMobile.Android())   { window.open('mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(Android)', '_system', 'location=yes');                           }
		else if(isMobile.Windows())   { ref = window.open('mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(WP)', '_blank', 'location=no');                            }
		else if(isMobile.MSApp())     { Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri('mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(MSApp)')); }
		else if(isMobile.FirefoxOS()) { ref = window.open('mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(FirefoxOS)', '_system', 'location=no');                    }
		else                          { window.location='mailto:support@kcals.net?Subject=Kcals%20-%20Support%20(other)';                                                     } 
	});
	//#////////////////#//
	//# RELOAD FOOD DB #//
	//#////////////////#//
	$('#advancedReload').on(tap,function(evt) {
		evt.preventDefault();
		function onConfirmWipe(button) {
			if(button == 1) {
				window.localStorage.removeItem("foodDbLoaded");
				window.localStorage.removeItem("startLock");
				updateFoodDb();
				return false;
			}
		}
		//SHOW DIALOG
		if(isMobile.MSApp()) {
			var md = new Windows.UI.Popups.MessageDialog(LANG.ARE_YOU_SURE[lang], LANG.REBUILD_FOOD_DB[lang]);
			md.commands.append(new Windows.UI.Popups.UICommand(LANG.OK[lang]));
			md.commands.append(new Windows.UI.Popups.UICommand(LANG.CANCEL[lang]));
			md.showAsync().then(function (command) { if(command.label == LANG.OK[lang]) {onConfirmWipe(1); } });
		} else if(hasTouch()) {
			navigator.notification.confirm(LANG.ARE_YOU_SURE[lang], onConfirmWipe, LANG.REBUILD_FOOD_DB[lang], [LANG.OK[lang],LANG.CANCEL[lang]]);
			return false;
		} else {
			if(confirm(LANG.REBUILD_FOOD_DB[lang])) { onConfirmWipe(1); } else { return false; }
		}
	});
	//#////////////////#//
	//# RESET SETTINGS #//
	//#////////////////#//
	$('#advancedReset').on(tap,function(evt) {
		evt.preventDefault();
		function onConfirmWipe(button) {
			if(button == 1) {
				$("#advancedReset").off();
				deSetup();
				return false;
			}
		}
		//SHOW DIALOG
		if(isMobile.MSApp()) {
			var md = new Windows.UI.Popups.MessageDialog(LANG.ARE_YOU_SURE[lang], LANG.SETTINGS_WIPE_TITLE[lang]);
			md.commands.append(new Windows.UI.Popups.UICommand(LANG.OK[lang]));
			md.commands.append(new Windows.UI.Popups.UICommand(LANG.CANCEL[lang]));
			md.showAsync().then(function (command) { if(command.label == LANG.OK[lang]) {onConfirmWipe(1); } });
		} else if(hasTouch()) {
			navigator.notification.confirm(LANG.ARE_YOU_SURE[lang], onConfirmWipe, LANG.SETTINGS_WIPE_TITLE[lang], [LANG.OK[lang],LANG.CANCEL[lang]]);
			return false;
		} else {
			if(confirm(LANG.SETTINGS_WIPE_TITLE[lang])) { onConfirmWipe(1); } else { return false; }
		}
	});
	//#/////////////////////#//
	//# TOGGLE: AUTO UPDATE #//
	//#/////////////////////#//
	//read stored
	var isAUChecked = (window.localStorage.getItem("config_autoupdate") == "on") ? 'checked' : '';
	//$("#advancedAutoUpdate").remove();
	$("#advancedAutoUpdate").append("\
	<div>\
		<input id='appAutoUpdateToggle' class='toggle' type='checkbox' " + isAUChecked + ">\
		<label for='appAutoUpdateToggle'></label>\
	</div>\
	");
	//read changes
	$('#appAutoUpdateToggle').on("change",function(obj) {
		if($(this).prop('checked')) {
			window.localStorage.setItem("config_autoupdate","on");
			setTimeout(function() {
				buildRemoteSuperBlock('cached');  
			},3000);
		} else {
			window.localStorage.setItem("config_autoupdate","off");
			//window.localStorage.removeItem("remoteSuperBlockJS");
			//window.localStorage.removeItem("remoteSuperBlockCSS");
		}
	});
}
//##//////////////////##//
//## GET CATEGORY~IES ##//
//##//////////////////##//
function getCategory(catId, callback) {
	if(arguments.length == 1) {
		callback = arguments[0];
	}
	if(hasSql) {
		db.transaction(function (t) {
			var orType = '';
			if (catId == "9999") { orType = ', "food"';     }
			if (catId == "0000") { orType = ', "exercise"'; }
			t.executeSql('select * from diary_food where TYPE IN (?' + orType + ') order by TERM COLLATE NOCASE ASC', [catId], function (t, results) {
				callback(fixResults(results));
			});
		});
	} else {
		var orType = '';
		if(catId == "9999") { orType = 'food';     }
		if(catId == "0000") { orType = 'exercise'; }
		var favArray = lib2.query("diary_food", function (row) {
				if(row.type == catId || row.type == orType) {
					return true;
				}
			});
		favArray = favArray.sort(function (a, b) {
			return (a["term"] > b["term"]) ? 1 : ((a["term"] < b["term"]) ? -1 : 0);
		});
		callback(favArray);
	}
}



function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push([
               prop,
               obj[prop]
            ]);
        }
    }
    arr.sort();
    return arr;
}

function getCatList(callback) {
	//STARTLOCK
	var startLock = 1;
	//BUILD CONTENT ARRAY
	var helpTopics = LANG.FOOD_CATEGORIES[lang];
	var helpHtml = "";
	$.each(sortObject(helpTopics), function (key, value) {
		helpHtml = helpHtml + "<li id='cat" + value[0] + "'><div>" + value[1] + "</div></li>";
	});
	/////////////////////
	// RE-INSERT INTRO //
	/////////////////////
	///////////////////////
	// INSERT TOPIC LIST //
	///////////////////////
	$("#tabMyCatsBlock").html('<ul>' + helpHtml + '</ul>');
	if(callback == 'open') { callbackOpen(); }
	setTimeout(function() { niceResizer(); },300);
	/////////////
	// HANDLER //
	/////////////
	var catBlockTap = false;
	var catBlockTimer;
	var catMoveCount = 0;
	$("#foodList").scroll(function() {
		//block tap
		catBlockTap = true;
		//hide under
		if($('#pageSlideFood').hasClass("open")) {
			$("#appContent").hide();
		} else {
			$("#appContent").show();
		}
		if(catMoveCount > 1) {
			$(".activeRow").removeClass("activeRow");
		}
		clearTimeout(catBlockTimer);
		catBlockTimer = setTimeout(function() { 
			catBlockTap = false;
			$("#appContent").show();
		},300);
	});
	//TOPIC HANDLERS	
	$("#tabMyCatsBlock li").on(touchstart,function(evt) {
		if($("#foodSearch").is(":focus")) {
			$("#foodSearch").trigger("blur");
			return false;
		};
		$(".activeRow").removeClass("activeRow");
		if(catBlockTap == true) {
			return;
		} else {
			if(catMoveCount >= 0) {
				$(this).addClass('activeRow');
			}
		}
		catMoveCount = 0;
	});
	$("#tabMyCatsBlock, #tabMyCatsBlock li").on(touchend + ' mouseleave mouseout',function() {
		if(catMoveCount > 0) {
			$(".activeRow").removeClass("activeRow");
		}
	});
	$("#tabMyCatsBlock, #tabMyCatsBlock li").on(touchmove,function() {
		catMoveCount++;
		if(catMoveCount > 1) {
			$(".activeRow").removeClass("activeRow");
			catMoveCount = 0;
		}
	});	
	///////////////////////////////////
	// INVOKE NEWWINDOW SELF-HANDLER //
	///////////////////////////////////
	$("#tabMyCatsBlock div").on(tap, function (evt) {
		if(catBlockTap == true) { 
			$(".activeRow").removeClass("activeRow");
			return;
		} else {
			catMoveCount = -100;
			catBlockTap = true;
			clearTimeout(catBlockTimer);
			catBlockTimer = setTimeout(function() { 
				catBlockTap = false;
				$("#appContent").show();
			},300);
		}
		//
		$(".activeRow").removeClass("activeRow");
		$(this).parent('li').addClass('activeRow');
		var catCode = ($(this).parent('li').attr('id')).replace('cat', '');
		//SQL QUERY
		getCategory(catCode, function(data) {
			//////////
			// HTML //
			//////////
			var catListHtml = '';
			var catLine     = '';
			for(var c=0, len=data.length; c<len; c++) {
				//get current weight
				var totalWeight = 80;
				if(window.localStorage.getItem("calcForm#pA3B")) {
					totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
				}
				//convert to kg
				if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
					totalWeight = Math.round( (totalWeight) / (2.2) );
				}
				//ADJUST TO EXERCISE
				var cKcal    = (data[c].type == "0000" || data[c].type == "exercise") ? Math.round(((data[c].kcal * totalWeight) / 60) * 30) : Math.round(data[c].kcal * 100) / 100;
				var Ktype    = (data[c].type == '0000' || data[c].type == 'exercise') ? "exercise" : "food";
				var favClass = (data[c].fib == "fav") ? "favItem" : "";
				catLine      = "<div class='searcheable " + favClass + " " + Ktype + "' id='" + data[c].code + "' title='" + cKcal + "'><div class='foodName " + Ktype + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + cKcal + "</span><span class='foodPro " + Ktype + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + data[c].pro + "</span><span class='foodCar " + Ktype + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>" + data[c].car + "</span><span class='foodFat " + Ktype + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>" + data[c].fat + "</span></div>";
				catListHtml += catLine;
			}
			//EMPTY
			if(catListHtml == '') {
				catListHtml = '<span id="noMatches"> ' + LANG.NO_ENTRIES[lang] +' </span>';
			}
			/////////////
			// HANDLER //
			/////////////
			var catListHandler = function () {
				$("#newWindow").addClass('firstLoad');
				//////////////////////
				// ENDSCROLL LOADER //
				//////////////////////
				var catLock = 0;
				var catTimer;
				$('#newWindow').scroll(function() {
					clearTimeout(catTimer);
					catTimer = setTimeout(function() {
						//
						var catlistHeight = $('#newWindow').height() * .5;
						if(catLock != 0)                  { return; }
						if(!$('#newWindow').hasClass("firstLoad")) { return; }
						if($('#newWindow').scrollTop()+500 > catlistHeight) {
							catLock = 1;
							$("#newWindow").removeClass('firstLoad');
							kickDown();
							return false;
							setTimeout(function () {
								niceResizer();
								kickDown();
								return false;
							}, 100);
						}
					},300);
				});
				$("#tabMyCatsBlock").addClass('out');
				setTimeout(function () {
					$("#newWindowWrapper").on(transitionend, function() {
						$("#pageSlideFood").hide();
					});
				}, 0);
				//////////////////
				// MODAL CALLER //
				//////////////////
				$("#newWindow div.searcheable").on(singletap, function(evt) {
					evt.preventDefault();
					if(blockModal == true) {
						return;
					}
					getModalWindow($(this).attr("id"));
				});
				$("#newWindow div.searcheable").on(tap, function (evt) {
					$("#activeOverflow").removeAttr("id");
					$(".activeOverflow").removeClass("activeOverflow");
					$(this).addClass("activeOverflow");
					$(".foodName", this).attr("id", "activeOverflow");
					$(".foodName").css("overflow", "auto");
				});
			}
			////////////
			// CLOSER //
			////////////
			var catListCloser = function () {
				$(".activeRow").removeClass("activeRow");
				if(isMobile.Windows()) {
					$("#tabMyCatsBlock").removeClass('out');
				}
				$("#pageSlideFood").show();
				setTimeout(function () {
					$("#tabMyCatsBlock").removeClass('out');	
					niceResizer();
				}, 0);
			}
			/////////////////
			// CALL WINDOW //
			/////////////////
			getNewWindow(LANG.FOOD_CATEGORIES[lang][catCode], catListHtml, catListHandler, '', catListCloser,'sideload','flush');
		});
	});
}
