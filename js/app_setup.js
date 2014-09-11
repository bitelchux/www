﻿$.support.cors = true;
////////////////
// SHOW INTRO //
////////////////
var myScroll;
function showIntro(isNew) {
	$('#gettingStarted').remove();
	$('body').append('\
	<div id="gettingStarted">\
		<div id="viewport">\
			<div id="wrapper">\
				<div id="scroller">\
					<div class="slide" id="slide1"><p>' + LANG.INTRO_SLIDE_1[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide2"><p>' + LANG.INTRO_SLIDE_2[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide3"><p>' + LANG.INTRO_SLIDE_3[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide4"><p>' + LANG.INTRO_SLIDE_4[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide5"><p>' + LANG.INTRO_SLIDE_5[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide6"><p>' + LANG.INTRO_SLIDE_6[lang].split('.').join('. ') + '</p><div id="closeDiv">' + LANG.CLOSE_INTRO[lang] + '</div></div>\
				</div>\
			</div>\
		</div>\
		<div id="nextDiv"></div>\
		<div id="prevDiv"></div>\
		<div id="indicator">\
			<div id="dotty"></div>\
		</div>\
		<div id="appLang">'   + LANG.LANGUAGE_NAME[lang] + '</div>\
		<div id="skipIntro">' + LANG.SKIP[lang]          + '</div>\
	</div>');
	//////////////
	// HANDLERS //
	//////////////
	$('#skipIntro, #closeDiv').on(touchend,function(evt) {
		evt.stopPropagation();
		if(typeof myScroll !== 'undefined') {
			myScroll.destroy();
		}
		app.handlers.fade(0,'#gettingStarted',function() {
			if(isNew == true) {
				setTimeout(function() {
					if(typeof baseVersion !== 'undefined') {
						if(app.http) {
							app.analytics('webinstall');
						} else {
							app.analytics('install');
						}
					}
				},5000);
			}
		});
		evt.preventDefault();
	});
	$('#gettingStarted').on(touchstart,function(evt) {
		evt.stopPropagation();
	});
	$('#appLang').on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		buildLangMenu('intro');
	});
	///////////////
	// NEXT/PREV //
	///////////////	
	$('#nextDiv').on(touchstart,function(evt) {
		evt.stopPropagation();
		if(typeof myScroll !== 'undefined') {
			if(myScroll.currentPage.pageX == 5) {
				$('#skipIntro').trigger(touchend);	
			}
			myScroll.next();
		}
	});
	$('#prevDiv').on(touchstart,function(evt) {
		evt.stopPropagation();
		if(typeof myScroll !== 'undefined') {
			myScroll.prev();
		}
	});
	///////////////
	// INDICATOR //
	///////////////
	$(window).on('resize',function() {
		$('#indicator').css('left',( ($('body').width() - $('#indicator').width()) / 2) + 'px');
	});
	$(window).trigger('resize');
	/////////////
	// ISCROLL //
	/////////////
	setTimeout(function() {
		if($('#gettingStarted').html()) {
			try {
				myScroll = new IScroll('#wrapper', {
					scrollX : true,
					scrollY : false,
					momentum : false,
					snap : 'div',
					snapSpeed : 600,
					snapThreshold : 1 / ($('body').width() * 0.01),
					keyBindings : true,
					//bindToWrapper: true,
					indicators : {
						el : document.getElementById('indicator'),
						resize : false
					}
				});
			} catch(e) {
				console.log('iscroll error');
			}
		}
	}, 300);
}
///////////////////
// INITIAL CACHE //
///////////////////
function loadDatabase() {
	localforage.getItem('diary_entry',function(rows) {
		if(!rows) { rows = []; }
		rowsEntry = rows;
		localforage.getItem('diary_food',function(rows) {
			if(!rows) { rows = []; }
			rowsFood = rows;
			setTimeout(function() {
				//INIT
				startApp();
			},0);
		});
	});
}
////////////////////
// IMPORT ENTRIES //
////////////////////
function importEntries(res) {
	if(!res) { return []; }
	var result = [];
	//FIX SQL RESULTS
	if(hasSql) {
		if(res.rows) {
			for (var i=0; i<res.rows.length; i++) { 
				result.push(res.rows.item(i));
			}
		}
	} else {
		result = res;
	}
	var rowsArray = [];
	for(var r=0, ren=result.length; r<ren; r++) {
		rowsArray.push({
			id:        result[r].id,
			title:     result[r].title,
			body:      result[r].body,
			published: result[r].published,
			info:      result[r].info,
			kcal:      result[r].kcal,
			pro:       result[r].pro,
			car:       result[r].car,
			fat:       result[r].fat,
			fib:       result[r].fib,
		});
	}
	localforage.setItem('diary_entry',rowsArray,function(rows) {
		rowsEntry = rows;
		app.remove('foodDbLoaded');
		app.remove('startLock');
		updateFoodDb();
		setTimeout(function() {
			//INIT
			startApp();
		},0);
	});
}
///////////////////
// UPDATE OLD DB //
///////////////////
function updateOldDatabase() {
	$('body').addClass('updtdb');
	try {
		if(hasSql) {
			db = window.openDatabase(dbName, 1, dbName + 'DB', 5*1024*1024);
			db.transaction(function(t) {
				t.executeSql('SELECT id, title, body, published, pro, car, fat FROM "diary_entry" ORDER BY published desc',[],function(t,results) {
					importEntries(results);
				}, errorHandler);
			});
		} else {
			lib = new localStorageDB('mylivediet', localStorage);
			importEntries(lib.query('diary_entry'));
		}
	} catch(e) {
		errorHandler(e);
	}
}
/////////////
// INIT DB //
/////////////
function initDB(t) {
	////////////////////
	// IF NEW INSTALL //
	////////////////////
	if(!app.read('config_install_time') || app.read('config_debug','active')) {
		app.save('config_install_time',app.now());
		showIntro(1);
	} else {
		if(!app.read('config_kcals_day_0')) {
			showIntro(0);
		}
	}
	////////////
	// DEFINE //
	////////////
	app.define('app_last_tab','tab1');
	app.define('config_start_time',app.now());
	app.define('config_kcals_day_0',2000);
	app.define('config_kcals_day_1',1600);
	app.define('config_kcals_day_2',2000);
	app.define('appBalance',LANG.BALANCED[lang]);
	app.define('lastSync','never');
	app.define('searchType','food');
	app.define('lastInfoTab','topBarItem-1');
	app.define('totalEntries',0);
	app.define('totalRecentEntries',0);
	app.define('appNutrients','25|50|25');
	app.define('appNutrientTimeSpan',7);
	app.define('config_ttf',0);
	app.define('config_tte',0);
	app.define('config_limit_1',-600);
	app.define('config_limit_2',600);
	if(!app.read('foodDbVersion') && !app.read('foodDbLoaded','done')) {
		app.save('foodDbVersion',3);
	}	
	//////////////////
	// UPDATE CHECK //
	//////////////////
	//DETECT 2.0/1.0
	if(app.read('foodDbVersion') == 2 || (app.read('foodDbLoaded','done') && !app.read('foodDbVersion'))) {
		updateOldDatabase();
	} else {
		loadDatabase();
	}
}
////////////////////
// RESET DATA+SQL //
////////////////////
function deSetup(callback) {
	blockAlerts = 1;
	localforage.clear(function() {
		afterHide('clear');
	});
}
///////////////////
// CLEAR ENTRIES //
///////////////////
function clearEntries(callback) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		rowsEntry[i].info = 'deleted';
	}
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		rowsEntry = rows;
		setPush();
		callback();
	});
}
//////////////////////////////
// SQL-ENCODE LOCAL STORAGE //
//////////////////////////////
function localStorageSql() {
	var keyList = '';
	//start
	if(app.read('config_start_time') && app.read('appStatus','running')) {
		keyList = keyList + '#@@@#' + 'config_start_time' + '#@@#' + app.read('config_start_time');
		keyList = keyList + '#@@@#' + 'appStatus' + '#@@#' + app.read('appStatus');
	} else {
		keyList = keyList + '#@@@#' + 'appStatus' + '#@@#' + 'stopped';
	}
	//daily
	if(app.read('config_kcals_type'))  { keyList = keyList + '#@@@#' + 'config_kcals_type'  + '#@@#' + app.read('config_kcals_type');  }
	if(app.read('config_kcals_day_0')) { keyList = keyList + '#@@@#' + 'config_kcals_day_0' + '#@@#' + app.read('config_kcals_day_0'); }
	if(app.read('config_kcals_day_1')) { keyList = keyList + '#@@@#' + 'config_kcals_day_1' + '#@@#' + app.read('config_kcals_day_1'); }
	if(app.read('config_kcals_day_2')) { keyList = keyList + '#@@@#' + 'config_kcals_day_2' + '#@@#' + app.read('config_kcals_day_2'); }
	if(app.read('config_measurement')) { keyList = keyList + '#@@@#' + 'config_measurement' + '#@@#' + app.read('config_measurement'); }
	if(app.read('config_limit_1'))     { keyList = keyList + '#@@@#' + 'config_limit_1'     + '#@@#' + app.read('config_limit_1');     }
	if(app.read('config_limit_2'))     { keyList = keyList + '#@@@#' + 'config_limit_2'     + '#@@#' + app.read('config_limit_2');     }	
	//nutrients
	if(app.read('appNutrients'))	   { keyList = keyList + '#@@@#' + 'appNutrients' + '#@@#' + app.read('appNutrients'); }
	//notes
	if(app.read('appNotes')) { 
		keyList = keyList + '#@@@#' + 'appNotes' + '#@@#' + app.read('appNotes').replace(/(\n|\r\n)/g, '#@#').split('/*').join('/ *');
	} else {
		keyList = keyList + '#@@@#' + 'appNotes' + '#@@#' + '';
	}
	//form
	if(app.read('calcForm#feet'))	{ keyList = keyList + '#@@@#' + 'calcForm#feet' + '#@@#' + app.read('calcForm#feet'); }
	if(app.read('calcForm#inches'))	{ keyList = keyList + '#@@@#' + 'calcForm#inches' + '#@@#' + app.read('calcForm#inches'); }
	if(app.read('calcForm#pA1B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA1B' + '#@@#' + app.read('calcForm#pA1B'); }
	if(app.read('calcForm#pA2B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA2B' + '#@@#' + app.read('calcForm#pA2B'); }
	if(app.read('calcForm#pA2C'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA2C' + '#@@#' + app.read('calcForm#pA2C'); }
	if(app.read('calcForm#pA3B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA3B' + '#@@#' + app.read('calcForm#pA3B'); }
	if(app.read('calcForm#pA3C'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA3C' + '#@@#' + app.read('calcForm#pA3C'); }
	if(app.read('calcForm#pA4B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA4B' + '#@@#' + app.read('calcForm#pA4B'); }
	if(app.read('calcForm#pA5B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA5B' + '#@@#' + app.read('calcForm#pA5B'); }
	if(app.read('calcForm#pA6G'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6G' + '#@@#' + app.read('calcForm#pA6G'); }
	if(app.read('calcForm#pA6H'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6H' + '#@@#' + app.read('calcForm#pA6H'); }
	if(app.read('calcForm#pA6M'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6M' + '#@@#' + app.read('calcForm#pA6M'); }
	if(app.read('calcForm#pA6N'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6N' + '#@@#' + app.read('calcForm#pA6N'); }
	//return
	if(keyList != '') { keyList = '/*' + keyList + '*/'; }
	return keyList;
}
///////////////////////////
// REBUILD LOCAL STORAGE //
///////////////////////////
function rebuildLocalStorage(lsp) {
	if(!lsp.match('#@@@#')) { return; }
	//comments
	lsp = lsp.split('/*').join('').split('*/').join('');
	lsp = lsp.split('#@@@#');
	var lsPart;
	for(i=0; i<lsp.length; i++) {
		lsPart = lsp[i].split('#@@#');
		if(lsPart[0]) {
			if(lsPart[0] == 'appNotes') {
				app.save(lsPart[0],lsPart[1].split('#@#').join('\n'));
			} else {
				app.save(lsPart[0],lsPart[1]);
			}
		}
	}
	//UPDATE UNDERLYING
	$('#timerDailyInput').val(app.get.kcals());
}
///////////////////
// FETCH ENTRIES //
///////////////////
function fetchEntries(callback) {
	callback(rowsEntry.sortbyattr('published','desc'));
}
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries(userId) {
	if(isNaN(userId))           { return; }
	if(app.read('pendingSync')) { return; }
	fetchEntries(function(data) {
		var fetchEntries = '';
		var newLineFetch = '';
		var allFetchIds  = [];
		var id;
		var title;
		var body;
		var published;
		var info;
		var kcal;
		var pro;
		var car;
		var fat;
		var fib;
		if(data) {
		for(var i=0, len=data.length; i<len; i++) {
			if(data[i].id) {
				id        = data[i].id;
				title     = data[i].title;
				body      = sanitizeSql(data[i].body);
				published = parseInt(data[i].published);
				info      = data[i].info;
				kcal      = data[i].kcal;
				pro       = data[i].pro;
				car       = data[i].car;
				fat       = data[i].fat;
				fib       = data[i].fib;
			
				if(!body) { body = ''; }
				if(!kcal) { kcal = ''; }
				if(!info) { info = ''; }
				if(!kcal) { kcal = ''; }
				if(!pro)  { pro  = ''; }
				if(!car)  { car  = ''; }
				if(!fat)  { fat  = ''; }
				if(!fib)  { fib  = ''; }

				if(id && published != '' && allFetchIds.indexOf('#' + id + '#') === -1) { 
					newLineFetch = "INSERT OR REPLACE INTO \"diary_entry\" VALUES(" + id + ",'" + title + "','" + body + "','" + published + "','" + info + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n";
					fetchEntries += newLineFetch; 
					newLineFetch = '';
					allFetchIds.push('#' + id + '#');
					//empty loop
					id        = '';
					title     = '';
					body      = '';
					published = '';
					info      = '';
					kcal      = '';
					pro       = '';
					car       = '';
					fat       = '';
					fib       = '';
				}
			}
		}
		}
		//////////////////////
		// ADD CUSTOM ITEMS //
		//////////////////////
		if(app.read('customItemsSql')) {
			fetchEntries = fetchEntries + trim(app.read('customItemsSql'));
			//padding
			if(app.read('customFavSql')) {
				fetchEntries = fetchEntries + '\n';
			}
		}
		///////////////////
		// ADD FAVORITES //
		///////////////////
		if(app.read('customFavSql')) {
			fetchEntries = fetchEntries + trim(app.read('customFavSql'));
		}
		//////////////////
		// ADD SETTINGS //
		//////////////////
		if(localStorageSql()) {
			fetchEntries = fetchEntries + '\n' + trim(localStorageSql());
		}	
		fetchEntries = fetchEntries.split('undefined').join('');
		fetchEntries = fetchEntries.split('NaN').join('');
		/////////////////
		// POST RESULT //
		/////////////////
		fetchEntries = trim(fetchEntries);
		
		if(fetchEntries == ' ' || !fetchEntries) { fetchEntries = ' '; }
		if(fetchEntries) {
			app.save('lastEntryPush',app.read('lastEntryPush') + 30000);
			$.post('http://kcals.net/sync.php', { 'sql':fetchEntries,'uid':userId }, function(data) {
				//clear marker
				app.remove('lastEntryPush');
				NProgress.done();
			}, 'text');
		}
	});
}
function setPush() {
	if(app.read('facebook_logged')) {
		updateFoodDb();
	}
	app.save('lastEntryPush',app.now());
}
//#///////////////////#//
//# AUX: SYNC ENTRIES #//
//#///////////////////#//
function setComplete() {
	//nprogress
	NProgress.done();
	//set complete
	app.remove('pendingSync');
	if(app.read('foodDbLoaded','done')) {
		updateFoodDb();
	} else {
		setPush();
	}
	//update entrylist sum
	updateEntriesSum();
	//update nutri pseudos
	updateNutriRatio();
	//refresh tabs
	appFooter(app.read('app_last_tab'),1);
	//dump diary_food data
	if(typeof getCatList == 'function' && app.read('foodDbLoaded','done')) {
		setTimeout(function() {
			updateCustomList('fav');
			updateCustomList('items');	
			getCatList();
		},200);
	}
	//update last sync date
	app.save('lastSync',app.now());
	$('#optionLastSync span').html( dateDiff( app.read('lastSync'), app.now()) );
}
///////////////
// ROWS LOOP //
///////////////
function rowsLoop(sqlEntry, hive, callback) {
	if (hive == 'diary_entry') {
		rows = rowsEntry;
	} else {
		rows = rowsFood;
		hive = 'diary_food';
	}
	//////////////////
	// ENTRIES LOOP //
	//////////////////
	var allRows = JSON.stringify(rows);
	for(var i = sqlEntry.length - 1; i > -1; i--) {
	//for (var i = 0, len = sqlEntry.length; i < len; i++) {
		if (sqlEntry[i]) {
			var lookFor = (hive == 'diary_entry') ? sqlEntry[i].id : sqlEntry[i].code;
			var rowIndex = (allRows).indexOf(lookFor);
			if (rowIndex !== -1) {
				//////////////
				// ON MATCH //
				//////////////
				var x = rows.length;
				while(x--) {	
				//for (var x = 0, xen = rows.length; x < xen; x++) {
					if (rows[x]) {
						var rowAttr = (hive == 'diary_entry') ? rows[x].id : rows[x].code;
						if (rowAttr == lookFor) {
							rows[x] = sqlEntry[i];
							break;
						}
					}
				}
			} else {
				////////////////
				// INSERT NEW //
				////////////////
				rows.push(sqlEntry[i])
			}
		}
	}
	//UPDATE CACHE
	if (hive == 'diary_entry') {
		rowsEntry = rows;
	} else {
		rowsFood  = rows;		
	}
	////////////////////
	// WRITE CALLBACK //
	////////////////////
	localforage.setItem(hive, rows, function (rows) {
		callback();
	});
}
/////////////////
// SQL TO JSON //
/////////////////
function sqlToJson(row) {
	if(!row)           { return ''; }
	if(row.length < 5) { return ''; }
	var jsonRow = '';
	if ((/diary_entry|diary_food/).test(row)) {
		row = row.replace(",'", "','").split("');").join("").split('INSERT OR REPLACE INTO "').join('').split('" VALUES(').join("','").split("','");
		if((/diary_entry/).test(row)) {
			jsonRow = {
				id        : row[1],
				title     : row[2],
				body      : row[3],
				published : row[4],
				info      : row[5],
				kcal      : row[6],
				pro       : row[7],
				car       : row[8],
				fat       : row[9],
				fib       : row[10]
			};
		}
		else if((/diary_food/).test(row)) {
			jsonRow = {
				id   : row[1],
				type : row[2],
				code : row[3],
				name : row[4],
				term : row[5],
				kcal : row[6],
				pro  : row[7],
				car  : row[8],
				fat  : row[9],
				fib  : row[10]
			};
		}
	}
	return jsonRow;
}
//////////////////////
// INSERT OR UPDATE //
//////////////////////
function insertOrUpdate(rows, callback) {
	if (!rows || rows == '') {
		callback();
		return;
	}
	/////////////////////
	// POPULATE ARRAYS //
	/////////////////////
	if (rows.match('\n')) {
		rows = rows.split('\n');
	} else {
		var ctts = rows;
		rows = [];
		rows.push(ctts);
	}
	var sqlEntry = [];
	var sqlFood  = [];
	for (var i = 0, len = rows.length;i < len; i++) {
		if (rows[i] && rows[i].length > 5) {
			if((/diary_entry/).test(rows[i])) {
				sqlEntry.push(sqlToJson(rows[i]));
			}
			if((/diary_food/).test(rows[i])) {
				sqlFood.push(sqlToJson(rows[i]));
			}
		}
	}
	//////////////////
	// ENTRIES LOOP //
	//////////////////
	rowsLoop(sqlEntry, 'diary_entry', function () {
		rowsLoop(sqlFood, 'diary_food', function () {
			callback();
		});
	});
}
//##//////////////##//
//## SYNC ENTRIES ##//
//##//////////////##//
function syncEntries(userId) {
	if(app.read('facebook_logged'))  { updateFoodDb(); }
	if(isNaN(userId))                { return; }
	if(!app.read('facebook_logged')) { return; }
	if(!app.read('facebook_userid')) { return; }
	if($('#nprogress').html())       { return; }
	//OK, UPDATE TIME
	app.save('pendingSync',app.now());
	var demoRunning = false;
	if(!demoRunning) {
		demoRunning = true;
		NProgress.start();
		//get remote sql
		$.get('http://kcals.net/sync.php?uid=' + userId,function(sql) {
			sql = sql.split('undefined').join('');
			//local storage slice
			if(sql.match('#@@@#')) {
				rebuildLocalStorage(sql.split('\n').pop());
				sql = sql.replace(/\r?\n?[^\r\n]*$/, '');
			}
			///////////////////////
			// FAKE VALID RESULT //
			///////////////////////empty but valid result ~ trigger success
			if(trim(sql) == '') {
				demoRunning = false;
				setComplete();
			} else {
				insertOrUpdate(sql,function() {
					demoRunning = false;
					setComplete();					
				});
			}
		});
	}
}
/////////////////
// GET ENTRIES //
/////////////////
function getEntries(callback) {
	var rowsArray = [];
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].info !== 'deleted') {
			rowsArray.push(rowsEntry[i]);
		}
	}
	callback(rowsArray);
}
///////////////
// GET ENTRY //
///////////////
function getEntry(eid,callback) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == eid) {
			callback(rowsEntry[i]);
			break;
		}
	}
}
//#//////////////////#//
//# DB: UPDATE ENTRY #//
//#//////////////////#//
function updateEntry(data,callback) {
	var endDate = (data.published.toString()).slice((data.published.toString()).length-4,(data.published.toString()).length);
	var endId   = (data.id.toString()).slice((data.id.toString()).length-4,(data.id.toString()).length);
	if(endDate == '0000') {
		data.published = data.published.split(endDate).join(endId);
	}
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == data.id) {
			rowsEntry[i].id        = data.id;
			rowsEntry[i].title     = parseInt(data.title);
			rowsEntry[i].body      = data.body;
			rowsEntry[i].published = parseInt(data.published);
			rowsEntry[i].info      = '';
			rowsEntry[i].kcal      = '';
			rowsEntry[i].pro       = data.pro;
			rowsEntry[i].car       = data.car;
			rowsEntry[i].fat       = data.fat;
			rowsEntry[i].fib       = '';
			break;
		}
	}
	//return id/date pair
	callback(data.id,data.published);
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		setPush();
	});
}
//#//////////////////#//
//# DB: DELETE ENTRY #//
//#//////////////////#//
function deleteEntry(entry) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == entry.id) {
			rowsEntry[i].info = 'deleted';
			break;
		}
	}
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		//rowsEntry = rows;
		setPush();
	});
}
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data,callback) {
	/////////////////
	// REUSE ENTRY //
	/////////////////
	if(data.reuse == true) {
		//SAVE
		var saveTime = app.now()
		rowsEntry.push({id: saveTime, title: data.title, body: data.body, published: saveTime, info: data.info, kcal: data.kcal, pro: data.pro, car: data.pro, fat: data.fat, fib: data.fib});
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback(saveTime);
			}
		});
	/////////////////
	// UPDATE BODY //
	/////////////////
	} else if(data.id && !data.title) {
		for(var i=0, len=rowsEntry.length; i<len; i++) {
			if(rowsEntry[i].id == data.id) {
				rowsEntry[i].body = data.body;
				break;
			}
		}
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	} else if(data.id && data.title) {
	//////////////////
	// UPDATE TITLE //
	//////////////////
		for(var i=0, len=rowsEntry.length; i<len; i++) {
			if(rowsEntry[i].id == data.id) {
				rowsEntry[i].title = data.title;
				break;
			}
		}
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	} else if(data.pro || data.car || data.fat) {
	/////////////////
	// INSERT FULL //
	/////////////////
		rowsEntry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: '', kcal: '', pro: data.pro, car: data.car, fat: data.fat, fib: ''});
		//SAVE
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	} else {
	//////////////////
	// INSERT QUICK //
	//////////////////
		rowsEntry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: '', kcal: '', pro: '', car: '', fat: '', fib: ''});
		//SAVE
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	}
}
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	if(data.act == 'update') {
		//UPDATE
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i].id == data.id) {
				rowsFood[i].id   = data.id;
				rowsFood[i].type = data.type;
				rowsFood[i].code = data.code;
				rowsFood[i].name = data.name;
				rowsFood[i].term = data.term;
				rowsFood[i].kcal = data.kcal;
				rowsFood[i].pro  = data.pro;
				rowsFood[i].car  = data.car;
				rowsFood[i].fat  = data.fat;
				rowsFood[i].fib  = data.fib;
				break;
			}
		}
		callback();
		localforage.setItem('diary_food',rowsFood,function(rows) {
			rowsFood = rows;
		});
	} else {
	//INSERT
		rowsFood.push({
			id:   data.id,
			type: data.type,
			code: data.code,
			name: data.name,
			term: sanitize(data.name),
			kcal: data.kcal,
			pro:  data.pro,
			car:  data.car,
			fat:  data.fat,
			fib:  data.fib
		});
		callback();
		localforage.setItem('diary_food',rowsFood,function(rows) {	
			rowsFood = rows;
		});
	}
}
//////////////
// GET FOOD //
//////////////
function getFood(foodId,callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].id == foodId) {
			callback(rowsFood[i]);
			break;
		}
	}
}
/////////////////
// DELETE FOOD //
/////////////////
function delFood(foodId, callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].id == foodId) {
			rowsFood.splice(i,1);
			break;
		}
	}
	callback();
	localforage.setItem('diary_food',rowsFood,function(rows) {
		rowsFood = rows;
	});
}
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function getCustomList(listType) {
	//////////////
	// CAT LIST //
	//////////////
	if(!isNaN(listType)) {
		var orType = '';
		if(listType == '9999') { orType = 'food';     }
		if(listType == '0000') { orType = 'exercise'; }
		var rowsArray = [];
		var i = rowsFood.length;
		while(i--) {
			if(rowsFood[i]) {
				if(rowsFood[i].type === listType || rowsFood[i].type === orType) {
					rowsArray.push(rowsFood[i]);
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'));
	//////////////
	// FAV LIST //
	//////////////
	} else if(listType == 'fav') {
		var rowsArray = [];
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i]) {
				if(rowsFood[i].fib) {
					if(rowsFood[i].fib === 'fav') {
						rowsArray.push(rowsFood[i]);
					}
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'));
	////////////////////////
	// FOOD~EXERCISE LIST //
	////////////////////////
	} else {
		var rowsArray = [];
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i]) {
				if(rowsFood[i].id) {
					if((JSON.stringify(rowsFood[i].id)).length >= 13) {
						rowsArray.push(rowsFood[i]);
					}
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'))
	}
}
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].id == data.id) {
			rowsFood[i].fib = data.fib;
			break;
		}
	}
	callback();
	localforage.setItem('diary_food',rowsFood,function(rows) {
		rowsFood = rows;
	});
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	if(window.parent.document.getElementsByTagName('body')) {
		var parentBody = window.parent.document.getElementsByTagName('body')[0];
		$(parentBody).addClass('unloaded');
	}
	//$('body').removeClass('started');
	//$('body').addClass('unloaded');
	noTimer = 'active';
	opaLock = 2;
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		$('*').css('pointer-events','none');
		blockAlerts = 1; 
		//////////////
		// FADE OUT //
		//////////////
		app.handlers.fade(0,'body',function() {
			if(app.read('facebook_logged') && cmd == 'clear') {
				$.post('http://kcals.net/sync.php', { 'sql':' ','uid':app.read('facebook_userid') }, function(data) {
					setTimeout(function() { 
						app.reboot(cmd);
					},200);
				}, 'text');
			} else {
				setTimeout(function() {
					app.reboot(cmd);
				},200);
			}
		});
	},100);
}
/////////////
// SPINNER //
/////////////
function spinner(size) {
	if(!$('#loadMask').length)		{ $('body').prepend('<div id="loadMask"><span></span></div>'); }
	if($('#loadMask').html() == '') { $('#loadMask').html('<span></span>'); }
	if(size == 'stop') {
		$('body').removeClass('spinnerMask');
		//$('body').addClass('started');
		$('#loadMask').css('display','none');
		return;
	} else {
		$('body').addClass('spinnerMask');
		//$('body').removeClass('started');
		$('#loadMask').css('display','block');
		$('#loadMask').css('pointer-events','auto');
		$('#loadMask').off().on(touchstart,function(evt) { 
			return false;
		});
	}
}
////////////////////
// FOOD DB IMPORT //
////////////////////
var demoRunning = false;
var foodDbTimer;
function updateFoodDb(callback) {
	if(app.read('foodDbLoaded','done') && !app.read('foodDbVersion')) { app.remove('foodDbLoaded'); }
	if(app.read('foodDbLoaded','done')) { return; }
	if(!app.read('foodDbLoaded','done') && !app.read('startLock','running')) {
		//reset blocks
		$('#tabMyCatsBlock,#tabMyFavsBlock,#tabMyItemsBlock').html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		if(demoRunning == false) {
			//start
			demoRunning = true;
			app.save('startLock','running');
			clearTimeout(foodDbTimer);
			/////////////////////////
			// PING DEFINE DB PATH //
			/////////////////////////
			var langDB = (lang == 'en' && app.read('config_measurement','metric')) ? 'em' : lang;
			////////////
			// IMPORT //
			////////////
			function doImport(dbExt) {
				spinner();
				foodDbTimer = setTimeout(function() {
					try{
						$.ajax({type: 'GET', dataType: 'text', url: hostLocal + 'sql/searchdb_' + langDB + dbExt, success: function(ls) {
							var rowsArray = [];
							//PARSE
							ls = ls.split('lib2.insert("diary_food", ').join('');
							ls = ls.split(');').join('');
							ls = ls.split('\n');
							for(var l=0, llen=ls.length; l<llen; l++) {
								rowsArray.push(JSON.parse(ls[l]));
							}
							//REINSERT
							var postCustom = '';
							if(trim(app.read('customItemsSql')) != '') { postCustom += trim(app.read('customItemsSql')); }
							if(trim(app.read('customFavSql'))   != '') { postCustom += trim(app.read('customFavSql'));   }
							rowsFood = rowsArray;
							localforage.setItem('diary_food',rowsArray,function() {
								insertOrUpdate(postCustom,function() {
									//success
									demoRunning = false;
									app.save('foodDbLoaded','done');
									app.save('foodDbVersion',3);
									app.remove('startLock');
									niceResizer(300);
									spinner('stop');
									$('body').removeClass('updtdb');
									if(app.read('facebook_userid')) {
										syncEntries(app.read('facebook_userid'));
									} else {
										setTimeout(function() {
											updateCustomList('all');
										},100);
									}
									//////////////
									// CALLBACK //
									//////////////
									if(callback) {
										callback();
									}
								});
							});
						}});
					} catch(e) { 
					//failure
					demoRunning = false;
					app.remove('foodDbLoaded');
					app.remove('startLock');
					spinner('stop');
					errorHandler(e);
				}
			},100);
		}}
		//////////////////////
		// CALLBACK TRIGGER //
		//////////////////////
		if(app.device.ios) {
			doImport('.db');
		} else {
			var ajaxAction = app.device.windows8 || app.device.wp81JS ? 'GET' : 'HEAD';
			setTimeout(function() {
				$.ajax({ url: hostLocal + 'sql/searchdb_' + langDB + '.db', type: ajaxAction,
					success: function() { doImport('.db');  },
					error: function()   { doImport('.sql'); }
				});
			},100);
		}
	}
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	//if partial
	if(published) {
		var arr = [];		
		var entryPos;
		//push 'published' into array
		arr.push(published);
		//build array from time on 'name'
		$('#entryList').children().each(function() {
			if($(this).attr('name')) {
				arr.push($(this).attr('name'));
			}
		});
		//sort it
		var entryArr = arr.sort().reverse();
		//find new row position in current list
		for(var i=0, len=entryArr.length; i<len; i++) {
			if(entryArr[i] == published) {
				entryPos = i;
			}
		}
		// INSERT PARTIAL
		//overwrite 'no entries'
		if(i == 1) {
			app.safeExec(function() {
			$('#entryList').html($(content).animate({ backgroundColor: '#ffffcc' }, 1).animate({ backgroundColor: '#fff' },1000));
			});
		//match div before
		} else if($('#entryList>div:eq(' + entryPos + ')').html()) {
			app.safeExec(function() {
				$('#entryList>div:eq(' + entryPos + ')').before($(content).animate({ backgroundColor: '#ffffcc' }, 1 ).animate({ backgroundColor: '#fff' },1000));
			});
		} else {
			//append if none
			app.safeExec(function() {
				$('#entryList').append($(content).animate({ backgroundColor: '#ffffcc' }, 1).animate({ backgroundColor: '#fff' },1000));
			});
		}
		//target [div#partial] ~time's parent div id as target
		var page = $('#entryList div' + '#' + $('#t' + published).parent('div').attr('id'));
	// FULL DIV REPLACE //
	} else {
		//check existence
		if($(target).html(content)) {
			app.safeExec(function() {
				$(target).html(content);
			});
		}
		var page = $('#entryList');
	}
	// RELOAD HANDLERS //
	if(page[0]) {
		$(page).trigger('pageload');
	}
	return;
}
///////////////
// FILL DATE //
///////////////
function fillDate(timestamp,element) {
	//time [ datetime-local / 2013-01-01T00:00 ]
	var d = (timestamp != '') ? new Date(Number(timestamp)) : new Date();
	//fill
	$('#' + element).val(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + (d.getDate())).slice(-2) + 'T' + ('0' + (d.getHours() + 0)).slice(-2) + ':' + ('0' + (d.getMinutes() + 0)).slice(-2));
	return;
}
//////////////////////
// UPDATE ENTRYLIST //
//////////////////////
var partial = '';
app.exec.updateEntries = function(partial,range,callback) {
	var totalEntryS       = app.read('totalEntries');
	var totalRecentEntryS = app.read('totalRecentEntries');
	//////////////
	// GET LOOP //
	//////////////
	getEntries(function(data) {
		var s = '';
		var p = '';
		var rowClass;
		var lastRow = '';
		var lastId  = '';
		var lastPub = 0;
		var totalArray = [];
		var langFood = LANG.FOOD[lang];
		var langExer = LANG.EXERCISE[lang];
		var langDel  = LANG.DELETE[lang];
		var langKcal = LANG.KCAL[lang];
		var totalEntries       = 0;
		var totalRecentEntries = 0;
		var totalEntried       = app.read('totalEntries');
		var totalRecentEntried = app.read('totalRecentEntries');
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = parseInt(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = parseInt(data[i].published);
			// 0 : 1
			if(data[i].body == '') {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
				} else {
					dataBody = '';
				}
			}
			// row colors
			var rowDate = new Date(dataPublished);
			var rowHour = rowDate.getHours();
                 if(rowHour <  6) { rowClass = 'rowAfterhours'; }
			else if(rowHour < 12) { rowClass = 'rowMorning';    }
			else if(rowHour < 18) { rowClass = 'rowAfternoon';  }
			else if(rowHour < 24) { rowClass = 'rowNight';      }

			if(dataTitle < 0)	{ rowClass = 'e-' + rowClass; }
			// EXPIRED
			if(app.read('config_start_time') > dataPublished || !app.read('appStatus','running')) { rowClass = rowClass + ' expired'; }
			// CORE OUTPUT
			var dataHandler = '\
			<div data-id="' + data[i].id + '" id="' + data[i].id + '" class="entryListRow ' + rowClass + ' day' + dayFormat(dataPublished).split('/').join('x') + '" name="' + dataPublished + '">\
				<p class="entriesTitle">' + dataTitle + '</p>\
				<p class="entriesKcals">' + langKcal + '</p>\
				<p class="entriesBody">' + dataBody + '</p>\
				<p id="t' + dataPublished + '" class="entriesPublished"> ' + dateDiff(dataPublished,app.now()) + '</p>\
				<span class="delete"><span id="reuse"></span><span id="edit"></span><span id="delete"></span></span>\
			</div>';
			///////////////////
			// ROW PRELOADER //
			///////////////////
			totalEntries++;
			if((app.now() - dataPublished) < 60*60*24*5*1000) {
				totalRecentEntries++;
			}
			if(((app.now() - dataPublished) < 60*60*24*5*1000) || totalEntried < 50 || totalRecentEntried < 20 || range == 'full') {
				totalArray.push({dati:dataPublished , dato: dataHandler});
			}
			lastPub = parseInt(data[i].published);
			//partial == last row time
			if(partial == parseInt(data[i].published)) {
				lastRow = dataHandler;
				lastId  = data[i].id;
			}
		}
		///////////////////
		// ORDER BY DATE //
		///////////////////
		totalArray = totalArray.sortbyattr('dati','desc');
		//BUILD OUTPUT
		for(var t=0, ten=totalArray.length; t<ten; t++) {
			s += totalArray[t].dato;
		}
		//////////////
		// CALLBACK //
		//////////////
		if(callback) { 
			if(s != '') {
				app.tab.diary(s);
			} else {
				app.tab.diary('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
			}
		} else {
		////////////////////
		// RETURN CONTENT //
		////////////////////
		if(s != '') {
			if(partial) {
				//IF PARTIAL + nonRepeat
				if($('#' + lastId).html()) {
					$('#' + lastId).remove();
				}
				if(!$('#' + lastId).html()) {
					pageLoad('#entryList',lastRow,partial);
				} else { return false; }
			} else {
				//FULL
				pageLoad('#entryList',s);
				if(range == 'full') { niceResizer(200); }
			}
		///////////
		// EMPTY //
		///////////
		} else {
			//PRE-FILL
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
		}}
		//N# OF ENTRIES
		app.save('totalEntries',totalEntries);
		app.save('totalRecentEntries',totalRecentEntries);
	});
}
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = parseInt(data[i].published);
			$("#t" + dataPublished).html(dateDiff(dataPublished,app.now()));
		}
	});
	//SIDEBAR TIME CLASS
	var currentHour = new Date().getHours();
         if(currentHour <  6) { rowClass = "afterhours"; }
	else if(currentHour < 12) { rowClass = "morning";    }
	else if(currentHour < 18) { rowClass = "afternoon";  }
	else if(currentHour < 24) { rowClass = "night";      }	
	$('body').removeClass(('morning afternoon night afterhours').replace(rowClass));
	$('body').addClass(rowClass);
}
//////////////////////////////
// UPDATE CSS HEADING *SUM* //
//////////////////////////////
function updateEntriesSum() {
	var pushTitle = [];
	var lToday    = LANG.TODAY[lang];
	var lFood     = LANG.FOOD[lang];
	var lExe      = LANG.EXERCISE[lang];
	getEntries(function(data) {
		for(var m=0, men=data.length; m<men; m++) {
			pushTitle.push({ date: dayFormat(parseInt(data[m].published)).split('/').join('x'),val: data[m].title});
		}

		var eachDay  = [];
		for(var p=0, pen=pushTitle.length; p<pen; p++) {
			if(eachDay.indexOf(pushTitle[p].date) == -1) {
				eachDay.push(pushTitle[p].date);
			}
		}

		var totalDayF;
		var totalDayE;
		var reStyle = '';
		var thisDay;

		for(var d=0, den=eachDay.length; d<den; d++) {
			totalDayF = 0;
			totalDayE = 0;
			for(var x=0, xen=pushTitle.length; x<xen; x++) {
				if(eachDay[d] == pushTitle[x].date) {
					if(pushTitle[x].val > 0)  {
						totalDayF = totalDayF + parseInt(pushTitle[x].val);
					} else {
						totalDayE = totalDayE + parseInt(pushTitle[x].val);	
					}
				}
			}
			if(eachDay[d] == dayFormat(app.now()).split('/').join('x')) {
				thisDay = lToday;
			} else {
				thisDay = eachDay[d];
			}

			reStyle = reStyle + '\
			#entryList div.day' + eachDay[d] + ' { border-top: 21px solid #eee; min-height: 66px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ' { margin-top: 0px; min-height: 45px; border-top: 0px solid #eee; }\
			#entryList div.day' + eachDay[d] + ':before { content: "' + lFood + ': ' + totalDayF + '  /  ' + lExe + ': ' + totalDayE + '"; color: #bbb; position: absolute; top: -22px; right: 0px; left: -3px; font-size: 12px; line-height: 16px; background-color: #eee; width: 100%; text-align: right; padding-top: 4px; padding-bottom: 2px; padding-right: 6px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':before { content: ""; padding-top: 0; padding-bottom: 0; }\
			#entryList div.day' + eachDay[d] + ':after { content: "' + thisDay.split("x").join("/") +'"; color: #999; position: absolute; top: -18px; left: 15px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':after { content: "";  }\
			'; 
		}
		//OUTPUT
		app.safeExec(function() {
			$('#daySum').html(reStyle);
		});
	});
}
//#////////////////////////////#//
//# UPDATE NUTRI RATIO PSEUDOS #//
//#////////////////////////////#//
function updateNutriRatio() {
	var appNutrients = app.read('appNutrients').split('|');
	var proRatio = parseInt(appNutrients[0]);
	var carRatio = parseInt(appNutrients[1]);
	var fatRatio = parseInt(appNutrients[2]);

	var nutrientsStyle = '\
		#appStatusBarsPro span:after	{ content: " (' + proRatio + '%)" !important; }\
		#appStatusBarsCar span:after	{ content: " (' + carRatio + '%)" !important; }\
		#appStatusBarsFat span:after	{ content: " (' + fatRatio + '%)" !important; }\
	';
	//////////
	// EXEC //
	//////////
	app.safeExec(function() {
		if(!$('#appNutrients').html()) {
			$('head').append('<style type="text/css" id="appNutrients"></style>');
		}
		if($('#appNutrients').html() != nutrientsStyle) {
			$('#appNutrients').html(nutrientsStyle);
		}
	});
}
//#/////////////////#//
//# NUTRI TIME SPAN #//
//#/////////////////#//
function getNutriTimeSpan(entryTime) {
	var now        = app.now();
	var day        = 60 * 60 * 24 * 1000;
	var todaysTime = (new Date(dayFormat(now))).getTime();
	var last7Time  = (new Date(dayFormat(todaysTime - (7*day)))).getTime();
	var last30Time = (new Date(dayFormat(todaysTime - (30*day)))).getTime();
	/////////
	// ALL //
	/////////
	if(app.read('appNutrientTimeSpan',0)) {
		return true;
	}
	///////////
	// TODAY //
	///////////
	else if(app.read('appNutrientTimeSpan',1))  {
		if(dayFormat(entryTime) == dayFormat(now)) {
			return true;
		} else {
			return false;
		}
	}
	////////////
	// LAST 7 //
	////////////
	else if(app.read('appNutrientTimeSpan',7))  {
		if(entryTime > last7Time) {
			return true;
		} else {
			return false;
		}
	}
	/////////////
	// LAST 30 //
	/////////////
	else if(app.read('appNutrientTimeSpan',30)) { 
		if(entryTime > last30Time) {
			return true;
		} else {
			return false;
		}
	}
}
//##/////////////////##//
//## BUILD HELP MENU ##//
//##/////////////////##//
var subHelperTimer;
function buildHelpMenu() {
	//insert menu
	$('#optionHelp').addClass('activeRow');
	$('body').append('<div id="appHelper"></div>');
	
	$('#appHelper').hide();
	$('#appHelper').css('top',($('#appHeader').height()) + 'px');
	$('#appHelper').height($('#appContent').height());
	$('#appHelper').css('bottom',($('#appFooter').height()) + 'px');
	$('#appHelper').show();
	
	//STARTLOCK
	var startLock = 1;
	//BUILD CONTENT ARRAY
	var helpTopics = LANG.HELP_TOPICS_ARRAY['en'];
	var helpHtml   = '';
	var topicId    = 0;
	$.each(helpTopics, function(key, value) {
		if(key && value) {
			topicId++;
			helpHtml = helpHtml + '<li id="topic' + topicId + '">' + key + '<div class="topicTitle">' + key + '</div><div class="topicContent">' + value + '</div></li>';
		}
	});
	/////////////////////
	// RE-INSERT INTRO //
	/////////////////////
	var introValue = '<p>' + LANG.INTRO_SLIDE_1[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_2[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_3[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_4[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_5[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_6[lang].split('.').join('. ') + '</p>';
	helpHtml = '<li id="topic' + (topicId+1) + '">' + LANG.INTRO[lang] + '<div class="topicTitle">' + LANG.INTRO[lang] + '</div><div class="topicContent">' + introValue + '</div></li>' + helpHtml;
	///////////////////////
	// INSERT TOPIC LIST //
	///////////////////////
	$('#appHelper').html('<h2><span id="backButton"></span><div id="helpTitle">' + LANG.SETTINGS_HELP[lang] + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$('#appHelper').css('opacity','1');
		//$('#appHelper').height($('#appContent').height());
	},0);
	//SCROLLER
	getNiceScroll('#appHelper',250,function() {
		startLock = 0;
	});
	//LIST CLOSER HANDLER
	app.handlers.activeRow('#backButton','button',function(evt) {
	//$('#backButton').on(touchend,function() {
		$('#appHelper').css('opacity',0);
		$('#appHelper').on(transitionend,function() {
			$('#appHelper').remove();
		});
	});
	//////////////////////////////////
	// CONTENT-BUILDER SELF-HANDLER //
	//////////////////////////////////
	app.handlers.activeRow('#appHelper li','activeRow',function(targetId) {
		if(startLock != 0) { return; }
		//PASS CONTENT
		var subTitle   = $('#' + targetId + ' .topicTitle').html();
		var subContent = $('#' + targetId + ' .topicContent').html();
		//BUILD SUB-CONTENT
		$('body').append('<div id="appSubHelper"><h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2><div id="subHelpContent">' + subContent + '</div></div>');
		$('#appSubHelper').hide();
		$('#appSubHelper').css('top',($('#appHeader').height()) + 'px');
		$('#appSubHelper').height($('#appContent').height());
		$('#appSubHelper').css('bottom',($('#appFooter').height()) + 'px');		
		$('#appSubHelper').show();
		/////////////
		// SUBHIDE //
		/////////////
		$('#appSubHelper').on('scroll',function(evt) {
			$('#appContent').hide();
			clearTimeout(subHelperTimer);
			subHelperTimer = setTimeout(function() {
				$('#appContent').show();
			},100);
		});
		///////////////////////////////
		// SUB-CONTENT ANIMATION END //
		///////////////////////////////
		setTimeout(function() {
			//ios horiz-scrolling crazy bug
			$('#appSubHelper').height($('#appContent').height());
		},0);
		$('#appSubHelper').on(transitionend,function(e) { 
			niceResizer(100);
			//IF CLOSED
			if(!$('#appSubHelper').hasClass('open')) {
				$('#appSubHelper').remove();
				setTimeout(function() {
					$('#appHelper').css('width','100%');
					//restore visibility
					$('.nicescroll-rails').css('display','block');
				},100);
			//IF OPENED
			} else {
				$('.activeRow').removeClass('activeRow');
				//SCROLLER
				getNiceScroll('#appSubHelper');
			}
			setTimeout(function() {
				$('#appSubHelper').css('width','100%');
			},100);
		});
		//SUB-CONTENT HANDLERS
		app.handlers.activeRow('#subBackButton','button',function(evt) {
		//$('#subBackButton').on(touchend,function() {
			//remove
			$('#appSubHelper').removeClass('open');
			$('#appHelper').removeClass('out');
			//hide on transision
			$('.nicescroll-rails').css('display','none');
		});
		//////////////////////
		// OPEN SUB-CONTENT //
		//////////////////////
		setTimeout(function() {
			//smooth transition (wp8)
			$('#appSubHelper').css('overflow','hidden');
			$('#appSubHelper').addClass('open');
			$('#appHelper').addClass('out');
		},50);
	});
}
//##//////////////##//
//## GETNEWwINDOW ##//
//##//////////////##//
function getNewWindow(title,content,handlers,save,closer,direction,bottom,top) {
	var newWindow = (title == 'newSearch') ? 'newSearch' : 'newWindow';
	var newClass  = (title == 'newSearch') ? 'newsearch' : 'newwindow';
	if(title == 'newSearch') {
		bottom = 'flush';	
	}
	//
	if($('#timerDailyInput').is(':focus')) { $('#timerDailyInput').trigger('blur'); return; }
	//FLOOD
	if($('#' + newWindow + 'Wrapper').html()) { return; }
	$('body').addClass(newClass);
	//////////
	// HTML //
	//////////
	//add heavy class
	var sideLoader = (direction == 'sideload') ? ' class="firstLoad"' : '';
	$('#' + newWindow + 'Wrapper').remove();
	var newContent = '\
	<div id="' + newWindow + 'Wrapper">\
		<div id="' + newWindow + 'Header">\
			<div id="backButton"></div>\
			<div id="saveButton">' + LANG.OK[lang] + '</div>\
			<div id="' + newWindow + 'Title">' + title + '</div>\
			</div>\
		<div id="' + newWindow + '"' + sideLoader + '>' + content + '</div>\
	</div>';
	app.safeExec(function() {
		$('#appContent').after(newContent);
	});
	$('#' + newWindow + 'Wrapper').hide();
	$('#' + newWindow).hide();
	//configure ui
	if(direction == 'sideload') {
		$('#' + newWindow + 'Wrapper').addClass('sideload');
	}
	if(!save) { $('#saveButton').remove(); }

	$('#' + newWindow + 'Wrapper').css('top',($('#appHeader').height()) + 'px');
	if(bottom != 'flush') {
		$('#' + newWindow + 'Wrapper').height($('#appContent').height());
		$('#' + newWindow + 'Wrapper').css('bottom',($('#appFooter').height()) + 'px');
	} else {
		$('#' + newWindow + 'Wrapper').height($('#appContent').height() + $('#appFooter').height());
		$('#' + newWindow + 'Wrapper').css('bottom','0px');		
	}
	//
	$('#' + newWindow + 'Wrapper').show();
	$('#' + newWindow).show();
	//
	if(title != 'newSearch') {
		$('#' + newWindow).css('top',($('#' + newWindow + 'Header').height()+1) + 'px');
	} else {
		$('#' + newWindow).css('top','0px');
	}
	$('#' + newWindow + 'Wrapper').addClass('open');
	$('#' + newWindow + 'Wrapper').addClass('busy');

	///////////////////
	// EXEC HANDLERS //
	///////////////////
	if(handlers) {
		app.safeExec(function() {
			handlers();
		});
	}
	////////////////////
	// TRANSISION END //
	////////////////////
	$('#' + newWindow + 'Wrapper').off().on(transitionend,function() {
		//scroller
		getNiceScroll('#' + newWindow,250,function() {
			//busy
			$('#' + newWindow + 'Wrapper').removeClass('busy');
		});
		///////////////////
		// GLOBAL CLOSER //
		///////////////////
		var timerCloser;
		function windowCloser() {
			if(closer) {
				app.safeExec(function() {
					closer();
				});
			}
			$('#appContent, #foodSearch, #' + newWindow + 'Wrapper').css('pointer-events','none');
			if($.nicescroll) {
				$('#' + newWindow).getNiceScroll().remove();
			}
			setTimeout(function() {
				$('#' + newWindow + 'Wrapper').removeClass('open');
				$('#' + newWindow + 'Wrapper').css('opacity',0);
			},50);
			$('#' + newWindow + 'Wrapper').off().on(transitionend,function() {
				$('#' + newWindow + 'Wrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass(newClass);
				clearTimeout(timerCloser);
				setPush();	
			});	
			timerCloser = setTimeout(function() {
				$('#' + newWindow + 'Wrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass(newClass);
				setPush();				
			},500);
		}
		///////////////////////////////////
		// TRANSITION-PROTECTED HANDLERS //
		///////////////////////////////////
		// SAVE HANDLER //
		//////////////////
		app.handlers.activeRow('#saveButton','button',function(evt) {
		//$('#saveButton').off().on(touchend,function(evt) {
			//evt.preventDefault();
			//evt.stopPropagation();
			//VALIDATION
			if(save() == true) {
				windowCloser();
			}
		});
		////////////////////
		// CLOSER HANDLER //
		////////////////////
		app.handlers.activeRow('#backButton','button',function(evt) {
		//$('#backButton').off().on(touchend,function(evt) {
			//evt.preventDefault();
			//evt.stopPropagation();
			windowCloser();
		});
	});
}
//##/////////////////##//
//## BUILD LANG MENU ##//
//##/////////////////##//
//dump lang
/*
var langListString = [];
$.each(LANG, function(i, langCode) {
	langListString.push(langCode[lang]);
});
window.localStorage.setItem('langDump',JSON.stringify(langListString));
*/
//pre-process
var langListArray = [];
$.each(LANG.LANGUAGE, function(i, langCode) {
	langListArray.push("<li id='set" + langCode + "'>"+ LANG.LANGUAGE_NAME[langCode] +"</li>");
});
//BUILD ORDERED HTML
langListArray.sort();
var langListCore  = '';
$.each(langListArray, function(l, Langline) {
	langListCore = langListCore + Langline;
});
var langSelectTap;
function buildLangMenu(opt) {
	$('#langSelect').remove();
	/////////////////
	// APPEND HTML //
	/////////////////
	$('body').append("<div id='langSelect'><ul id='langSelectList'><li id='setAuto'>" + LANG.AUTO_DETECT[lang] + " (" + LANG.LANGUAGE_NAME[defaultLang] + ")</li>" + langListCore + "</ul></div>");
	$("#langSelect").hide();
	//intro
	if(opt !== 'intro') {
		$("#langSelect").css("top",($("#appHeader").height()) + "px");
		$("#langSelect").css("bottom",($("#appFooter").height()) + "px");
		$("#langSelect").height($("#appContent").height());

	}
	//intro
	if(opt == 'intro') { 
		$('#langSelect').css('z-index',100);
		//pad
		if($('body').hasClass('ios7')) {
			$('#langSelect').css('padding-top','24px');
		}
	}
	//mark current
	//window.localStorage.setItem("devSetLang",lang);
	if(app.read('devSetLang')) {
		$("#set" + lang).addClass("set");
	} else {
		$("#setAuto").addClass("set");
	}
	$(".set").addClass("preset");
	/////////////
	// FADE IN //
	/////////////
	app.handlers.fade(1,'#langSelect',function(evt) {
		getNiceScroll("#langSelect");
	});
	/////////////
	// handler //
	/////////////
	//FLOOD PROTECTION
	clearTimeout(langSelectTap);	
	langSelectTap = setTimeout(function() {
		app.handlers.activeRow('#langSelect li','set',function(rowId) {
		//$('#langSelect li').on(tap,function(evt) {
			$('.preset').removeClass('preset');
			if(rowId == 'setAuto') {
				app.remove('devSetLang');
			} else {
				app.save('devSetLang',rowId.replace('set',''));
			}
			//////////////
			// fade out //
			//////////////
			app.handlers.fade(0,'#langSelect',function(evt) {
			//$('#langSelect').stop().fadeOut(200,function() {
				setTimeout(function() {
				$('body').removeClass('appLang-' + lang);
				if(app.read('devSetLang')) {
					lang = app.read('devSetLang');
				} else {
					lang = defaultLang;	
				}
				$('body').addClass('appLang-' + lang);
				if(lang != 'en' && lang != 'pt') { 
					LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
				}
				//FOOTER
				$('#tab1').html(LANG.MENU_STATUS[lang]);
				$('#tab2').html(LANG.MENU_DIARY[lang]);
				$('#tab3').html(LANG.MENU_PROFILE[lang]);
				$('#tab4').html(LANG.MENU_SETTINGS[lang]);
				//HEADER
				$('#timerKcals span').html(LANG.CALORIC_BALANCE[lang]);
				$('#timerDaily span').html(LANG.DAILY_CALORIES[lang]);
				//CONTENT
				appFooter(app.read('app_last_tab'),0);
				//start date
				$('#cssStartDate').html("#startDateSpan:before { content: '" + LANG.START_DATE[lang] + "'; }");
				//page title
				$('title').html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
				//heading sum
				updateEntriesSum();
				//AUTO UPDATE CSS TITLES
				$('#cssAutoUpdate').html('\
					.loading #advancedAutoUpdate:before	 { content: "' + LANG.DOWNLOADING[lang]     + '"; }\
					.pending #advancedAutoUpdate:before	 { content: "' + LANG.RESTART_PENDING[lang] + '"; }\
					.uptodate #advancedAutoUpdate:before { content: "' + LANG.UP_TO_DATE[lang]      + '"; }\
					.spinnerMask #loadMask:before		 { content: "' + LANG.PREPARING_DB[lang]    + '"; }\
					.spinnerMask.updtdb #loadMask:before { content: "' + LANG.UPDATING_DB[lang]     + '"; }\
				');		
				///////////////////
				// refresh intro //
				///////////////////
				if(opt == 'intro') {
					$('#slide1 p').html(LANG.INTRO_SLIDE_1[lang].split('.').join('. '));
					$('#slide2 p').html(LANG.INTRO_SLIDE_2[lang].split('.').join('. '));
					$('#slide3 p').html(LANG.INTRO_SLIDE_3[lang].split('.').join('. '));
					$('#slide4 p').html(LANG.INTRO_SLIDE_4[lang].split('.').join('. '));
					$('#slide5 p').html(LANG.INTRO_SLIDE_5[lang].split('.').join('. '));
					$('#slide6 p').html(LANG.INTRO_SLIDE_6[lang].split('.').join('. '));
					$('#closeDiv').html(LANG.CLOSE_INTRO[lang]);
					$('#appLang').html(LANG.LANGUAGE_NAME[lang]);
					$('#skipIntro').html(LANG.SKIP[lang]);
					setTimeout(function() {
						appFooter('tab1',1);
					},100);
				}
				},100);
			});
		});
	},300);
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer(timeout,callback) {
	if(!timeout) { timeout = 100; }
	clearTimeout(niceTimer);
	niceTimer = setTimeout(function() {
		if(app.is.scrollable && app.globals.scrollerList) {
			$(app.globals.scrollerList).getNiceScroll().resize();
		}
		if(callback) {
			callback();
		}
	},timeout);
}
///////////////////
// GETNICESCROLL //
///////////////////
function getNiceScroll(target,timeout,callback) {
	if(!$.nicescroll) { return; }
	if(!timeout)	  { timeout = 0; }
	setTimeout(function() {
	//SETTINGS
	var NSettings = {
		touchbehavior: false,
		nativeparentscrolling: false,
		cursorcolor: 'rgba(0,0,0,1)',
		cursorborderradius: '0px',
		cursorborder: '1px solid rgba(0,0,0,0)',
		cursoropacitymax: .3,
		cursorwidth: '5px',
		horizrailenabled: false,
		hwacceleration: true,
	};
	//HORIZONTAL
	if($('#appHistory').html()) {
		NSettings.horizrailenabled = true;
	}
	if(app.device.desktop) {
		NSettings.touchbehavior = true;
	}
	//UPDATE LIST
	if(!app.globals.scrollerList) {
		app.globals.scrollerList = target;
	}
	if(!(app.globals.scrollerList).contains(target)) {
		app.globals.scrollerList += ',' + target;
	}
	//NOTES
	if(target == '#diaryNotesInput') {			
		if(!app.device.wp8 && !app.device.windows8) {
			$(target).css('overflow','hidden');
			$(target).niceScroll(NSettings);
		} else {
			$(target).css('overflow','auto');
		}
	//APPLY
	} else {
		if(app.is.scrollable) {
			$(target).css('overflow','hidden');
			$(target).niceScroll(NSettings);				
		} else {
			if(app.device.ios) {
				$(target).css('-webkit-overflow-scrolling','touch');
			}
			$(target).css('overflow','auto');
		}
	}
	if(callback) {
		setTimeout(function() {
			callback();
		},0);
	}
	//
	niceResizer(100);
	},timeout);
}
//#/////////////#//
//# APP RESIZER #//
//#/////////////#//
function appResizer(time) {
	setTimeout(function() {
		$('body').height(window.innerHeight);
		//$('#appContent').height($('body').height() - ($('#appHeader').height() + $('#appFooter').height()));
		//unlock top white gap
		$('body').trigger('touchmove');
		//NO < 0
		var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height());
		//force scrolling ios
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css('height','auto');
		$('#entryListWrapper').css('min-height',wrapperMinH + 'px');
		$('#appHelper').height($('#appContent').height());
		$('#appSubHelper').height($('#appContent').height());
		$('#newWindowWrapper').height($('#appContent').height());
		if($('#skipIntro').length) {
			$('#langSelect').height($('body').height());
		} else {
			$('#langSelect').height($('#appContent').height());
		}
		$('#advancedMenuWrapper').height($('#appContent').height());
		//FAST RESIZE
		$('#pageSlideFood').hide();
		$('#pageSlideFood').height($('body').height() - ($('#appHeader').height()));
		//$('#pageSlideFood').css('min-height',($('body').height() - ($('#appHeader').height())) + 'px');
		$('#pageSlideFood').show();
		//$('#tabMyItemsBlock').css('min-height', ($('#foodList').height() - 128) + 'px');
		//SCROLLBAR UPDATE	
		niceResizer();
		//chrome v32 input width
		if(app.device.desktop || app.device.windows8) {
			$('#entryBody').width(window.innerWidth -58);
			$('#foodSearch').width(window.innerWidth -55);
			$('ul#addNewList input').width(window.innerWidth - 180);
		}
	 },time);
}
//////////////
// SANITIZE //
//////////////
function sanitize(str) {
	if(str != '') {
		var result = str.split(" ").join("").split("’").join("").split("”").join("").split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split(":").join("").split("/").join("").split("\\").join("").split("&").join("").split("â").join("a").split("ê").join("e").split("ô").join("o").split("ã").join("a").split("ç").join("c").split("á").join("a").split("é").join("e").split("í").join("i").split("ó").join("o").split("ú").join("u").split("à").join("a").split("õ").join("o").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").split(' ').join("").toLowerCase();
		return result;
	}
}
//////////////////
// SANITIZE SQL //
//////////////////
function sanitizeSql(str) {
	if(str != "") {
		var result = str.split("'").join(" ").split('"').join(" ").split(";").join(" ").split("&").join(" ").split("\\").join(" ").split("/").join(" ").split("  ").join(" ").split("  ").join(" ");
		return result;
	}
}
/////////////////////
// GET RATE DIALOG //
/////////////////////
// store url //
///////////////
var rateTimer;
function getRateDialog() {
	//appstore enabled
	if(!app.device.ios && !app.device.android && !app.device.wp8 && !app.device.windows8 && !app.device.firefoxos && !app.device.osxapp && !app.device.chromeapp) { return; }
	if(app.get.platform() == 'web')	{ return; }
	//first use
	app.define('getRate',app.now());
	//return
	if(app.read('getRate','locked')) { return; }
	///////////////
	// IF 1 WEEK //
	//////////////
	var timeRate = 3 * 24 * 60 * 60 * 1000;
	if((app.now() - app.read('getRate')) > (timeRate)) {
		clearTimeout(rateTimer);
		rateTimer = setTimeout(function() {
			if(app.read('getRate','locked')) { return; }
			//SHOW DIALOG
			appConfirm(LANG.RATE_TITLE[lang], LANG.RATE_MSG[lang], function(button) {
				app.save('getRate','locked');
				app.analytics('rate');
				if(button == 1) {
					app.analytics('vote');
					app.url();
				}
			}, LANG.RATE_TITLE[lang], LANG.NO_THANKS[lang]);
		},3500);
	}
}
///////////////////
// GET ANALYTICS //
///////////////////
app.analytics = function(target) {
	if(typeof ga_storage === 'undefined')				{ return; }
	//not dev
	if(app.read('config_debug','active'))				{ return; }
	if(app.read('facebook_userid',1051211303))			{ return; }
	if((/192.168|home|www.cancian/).test(document.URL))	{ return; }
	//////////
	// INIT //
	//////////
	if(target == 'init') {
		ga_storage._setAccount('UA-46450510-2');
	} else {
		////////////////
		// TRACK VARS //
		////////////////
		var deviceType = 'web';
		var appOS      = vendorClass;
		     if(app.device.ios)		   { appOS = 'ios';        if(app.device.cordova) { deviceType = 'app'; } }
		else if(app.device.android)	   { appOS = 'android';    if(app.device.cordova) { deviceType = 'app'; } }
		else if(app.device.wp8)		   { appOS = 'wp8';        if(app.device.cordova) { deviceType = 'app'; } }
		else if(app.device.windows8)   { appOS = 'windows8';   if(app.device.cordova) { deviceType = 'app'; } }
		else if(app.device.firefoxos)  { appOS = 'firefoxos';  deviceType = 'app'; }
		else if(app.device.osxapp)     { appOS = 'osxapp';     deviceType = 'app'; }
		else if(app.device.chromeapp)  { appOS = 'chromeapp';  deviceType = 'app'; }
		else if(app.device.blackberry) { appOS = 'blackberry'; if(app.device.cordova) { deviceType = 'app'; } }
		//string
		var trackString = appOS + '.' + deviceType  + '/#' + target + '(' + appBuild + ')' + '(' + lang + ')';
		//track page/event
		ga_storage._trackPageview(trackString, appOS + ' (' + lang + ')');
		ga_storage._trackEvent(appOS, target, lang, appBuild);
	}
};
//BACKWARDS C.
function getAnalytics(action) {
	app.analytics(action);
}
//#//////////////////////#//
//# FACEBOOK INTEGRATION #//
//#//////////////////////#//
///////////////////
// GET LOGOUT FB //
///////////////////
function getLogoutFB(button) {
	NProgress.done();
	if(button == 1) {
		app.remove('facebook_logged');
		app.remove('facebook_userid');
		app.remove('facebook_username');
		$('body').removeClass('appFacebook');
		$('#appFooter').removeClass('appFacebook');
		$('#optionFacebook span').html(LANG.SETTINGS_BACKUP_INFO[lang]);
	}
}
/////////////////////////
// UPDATE LOGIN STATUS //
/////////////////////////
function updateLoginStatus(sync) {
	if(app.read('facebook_logged') && app.read('facebook_userid') && app.read('facebook_username')) {
		$('body').addClass('appFacebook');
		$('#appFooter').addClass('appFacebook');
		$('#optionFacebook span').html(LANG.LOGGED_IN_AS[lang] + ' ' + app.read('facebook_username'));
		if(sync == 1) { syncEntries(app.read('facebook_userid')); }
	} else {
		getLogoutFB(1);
	}
}
//////////////////
// GET TOKEN FB //
//////////////////
function getTokenFB(result) {
	try {
		var access_token;
		var expires_in;
		//msapp
		if(result.responseData) {
			var fullUrl      = (result.responseData).split('#');
			var responseData = fullUrl[1];
			var keyValPairs  = responseData.split('&');
			for(var i = 0; i < keyValPairs.length; i++) {
				var splits = keyValPairs[i].split('=');
				switch (splits[0]) {
					case 'access_token':
						access_token = splits[1];
						break;
					case 'expires_in':
						expires_in = splits[1];
						break;
				}
			}
		} else {
			access_token = result;
		}
		///////////////////
		// GET USER INFO //
		///////////////////
		$.get('https://graph.facebook.com/me?access_token=' + access_token,function(me) {
			if(me.id && me.name) {
				app.save('facebook_logged',true);
				app.save('facebook_userid',me.id);
				app.save('facebook_username',me.name);
				updateLoginStatus(1);
			}
		});
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}
//////////////////
// GET LOGIN FB //
//////////////////
function getLoginFB() {
	try {
		/////////////////
		// IOS/ANDROID //
		/////////////////
		if(app.device.cordova && (app.device.android || app.device.ios)) {
			if(typeof FB !== 'undefined' && typeof CDV !== 'undefined') {
				FB.init({ appId : '577673025616946', nativeInterface : CDV.FB, useCachedDialogs : false });
				FB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				}, { scope : 'email' });
			}
		/////////
		// WP8 //
		/////////
		} else if (app.device.wp8) {
			if(typeof openFB !== 'undefined') {
				openFB.init('577673025616946');
				openFB.login('email',
					function() {
						getTokenFB(window.sessionStorage['fbtoken']);
					},
					function (error) {
						errorHandler(error);
				});
			}
		///////////
		// MSAPP //
		///////////
		} else if(app.device.windows8) {
			if(Windows.Foundation) {
				var callbackURL = 'https://www.facebook.com/connect/login_success.html';
				var facebookURL = 'https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=' + encodeURIComponent(callbackURL);
				var startURI    = new Windows.Foundation.Uri(facebookURL);
				var endURI      = new Windows.Foundation.Uri(callbackURL);
				Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync('', startURI, endURI).then(getTokenFB, errorHandler);
			}
		////////////
		// OSXAPP //
		////////////			
		} else if(app.device.osxapp) {
			if(typeof FB !== 'undefined' && typeof macgap !== 'undefined') {
				var pops;
				//callback listener
				$(document).off('userDefaultsChanged').on('userDefaultsChanged', function () {
					var macToken = macgap.userDefaults.getString('macgap_token');
					if(macToken != '') {
						getTokenFB(macToken);
						$(document).off('userDefaultsChanged');
						macgap.userDefaults.removeObjectForKey('macgap_token');
						pops.close();
					}
				});
				//window
				pops = window.open('https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=http://kcals.net/redirect.php','pops','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no, width=480,height=320');
			}
		////////////
		// JS SDK //
		////////////
		} else {
			if(typeof FB !== 'undefined') {
				FB.init({ appId : '577673025616946', status : true, cookie : true, xfbml : true });
				FB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				}, { scope : 'email' });
				//redirect_uri:'where_to_go_when_login_ends'}
			}
		}
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}

