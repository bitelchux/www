﻿/*jshint multistr: true */
////////////////
// SHOW INTRO //
////////////////
var myScroll;
function showIntro(isNew) {
	$("#gettingStarted").remove();
	$("body").append('\
	<div id="gettingStarted">\
		<div id="viewport">\
			<div id="wrapper">\
				<div id="scroller">\
					<div class="slide" id="slide1"><p>' + LANG.INTRO_SLIDE_1[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide2"><p>' + LANG.INTRO_SLIDE_2[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide3"><p>' + LANG.INTRO_SLIDE_3[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide4"><p>' + LANG.INTRO_SLIDE_4[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide5"><p>' + LANG.INTRO_SLIDE_5[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide6"><p>' + LANG.INTRO_SLIDE_6[lang].split(".").join(". ") + '</p><div id="closeDiv">' + LANG.CLOSE_INTRO[lang] + '</div></div>\
				</div>\
			</div>\
		</div>\
		<div id="indicator">\
			<div id="dotty"></div>\
		</div>\
		<div id="appLang">'   + LANG.LANGUAGE_NAME[lang] + '</div>\
		<div id="skipIntro">' + LANG.SKIP[lang]          + '</div>\
	</div>');
	//////////////
	// HANDLERS //
	//////////////
	$("#skipIntro, #closeDiv").on(touchend,function(evt) {
		evt.stopPropagation();
			$("#gettingStarted").fadeOut(200,function() {
			$("#gettingStarted").remove();
			if(isNew == true) {
				getAnalytics('newInstall');
			}
		});
		if(myScroll) {
			myScroll.destroy();
		}
		evt.preventDefault();
	});
	$("#gettingStarted").on(touchstart,function(evt) {
		evt.stopPropagation();
	});
	$("#appLang").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		buildLangMenu('intro');
	});
	///////////////
	// INDICATOR //
	///////////////
	$(window).on("resize",function() {
		$("#indicator").css("left",( ($("body").width() - $("#indicator").width()) / 2) + 'px');
	});
	$(window).trigger("resize");
	/////////////
	// ISCROLL //
	/////////////
	setTimeout(function() {
		if($("#gettingStarted").html()) {
			try {
				myScroll = new IScroll('#wrapper', {
					scrollX : true,
					scrollY : false,
					momentum : false,
					snap : 'div',
					snapSpeed : 600,
					snapThreshold : 1 / ($("body").width() * 0.01),
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
/////////////
// INIT DB //
/////////////
function initDB(t) {
	////////////////////
	// IF NEW INSTALL //
	////////////////////
	if(!window.localStorage.getItem("config_kcals_day_0") || window.localStorage.getItem("config_debug") == "active") {
		if(!window.localStorage.getItem("config_install_time")) {
			showIntro(1);
		} else {
			showIntro(0);
		}
	}
	//config
	if(!window.localStorage.getItem("config_start_time")) {
		window.localStorage.setItem("config_start_time",Number(new Date().getTime()));
	}
	if(!window.localStorage.getItem("config_kcals_day_0")) {
		window.localStorage.setItem("config_kcals_day_0",2000);
	}
	if(!window.localStorage.getItem("config_kcals_day_1")) {
		window.localStorage.setItem("config_kcals_day_1",1600);
	}
	if(!window.localStorage.getItem("config_kcals_day_2")) {
		window.localStorage.setItem("config_kcals_day_2",2000);
	}
	if(!window.localStorage.getItem("lastSync")) {
		window.localStorage.setItem("lastSync","never");
	}
	if(!window.localStorage.getItem("searchType")) {
		window.localStorage.setItem("searchType","food");
	}
	if(!window.localStorage.getItem("lastInfoTab")) {
		window.localStorage.setItem("lastInfoTab","topBarItem-1");
	}
	if(!window.localStorage.getItem("totalEntries")) {
		window.localStorage.setItem("totalEntries",0);
	}	
	if(!window.localStorage.getItem("totalRecentEntries")) {
		window.localStorage.setItem("totalRecentEntries",0);
	}
	if(!window.localStorage.getItem("appNutrients")) {
		window.localStorage.setItem("appNutrients",'25|50|25');
	}
	if(!window.localStorage.getItem("config_ttf")) {
		window.localStorage.setItem("config_ttf",0);
	}	
	if(!window.localStorage.getItem("config_tte")) {
		window.localStorage.setItem("config_tte",0);
	}		
	if(!window.localStorage.getItem("config_limit_1")) {
		window.localStorage.setItem("config_limit_1",-600);
	}	
	if(!window.localStorage.getItem("config_limit_2")) {
		window.localStorage.setItem("config_limit_2",600);
	}
	//////////////////////////////////////////
	// if not sql already, use localstorage //
	//////////////////////////////////////////
	/*
	//TABLE EXISTS
	if(hasSql) {
		t.executeSql('select * from diary_entry order by published desc',[],
			function(t,results) {
				if(fixResults(results).length == 0) { hasSql = false; }
				alert(fixResults(results).length);
		},function(t) {});
	}
	*/
	///////////////////
	// CREATE TABLES //
	///////////////////
	if(hasSql) {
		t.executeSql('CREATE TABLE if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, title TEXT, body TEXT, published VARCHAR UNIQUE,info TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
		t.executeSql('CREATE TABLE if not exists diary_food(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code VARCHAR UNIQUE,name TEXT,term TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
	} else {
		if(!lib.tableExists("diary_entry")) {
			lib.createTable("diary_entry", ["id", "title", "body", "published", "info", "kcal", "pro", "car", "fat", "fib"]);
			lib.commit();
		}
		if(!lib2.tableExists("diary_food")) {
			lib2.createTable("diary_food", ["id", "type", "code", "name", "term", "kcal", "pro", "car", "fat", "fib"]);
			lib2.commit();
		}
		//add id column
		if(!lib.columnExists("diary_entry", "id")) {
			lib.alterTable("diary_entry","id");
			lib.commit();
		}
		if(!lib2.columnExists("diary_food", "id")) {
			lib2.alterTable("diary_food","id");
			lib2.commit();
		}
		startApp();
	}
}
/////////////////
// FIX RESULTS //
/////////////////
function fixResults(res) {
	if(!res) { return; }
	var result = [];
	if(res.rows) {
		for (var i=0; i<res.rows.length; i++) { 
			result.push(res.rows.item(i));
		}
	}
	return result;
}
////////////////////
// RESET DATA+SQL //
////////////////////
function deSetup(callback) {
	if(hasSql) {
		db.transaction(function(t) { t.executeSql('DROP TABLE IF EXISTS "diary_entry";'); }, errorHandler, function() { afterHide("clear"); });
	} else {
		afterHide("clear");
	}
}
///////////////////
// CLEAR ENTRIES //
///////////////////
function clearEntries(callback) {
	//db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	if(hasSql) {
		db.transaction(function(t) { t.executeSql('update "diary_entry" set info="deleted";'); return false; }, errorHandler, function() { setPush(); return false; });
	} else {
		lib.deleteRows("diary_entry");
		lib.commit();
		setPush();
	}
}
//////////////////////////////
// SQL-ENCODE LOCAL STORAGE //
//////////////////////////////
function localStorageSql() {
	var keyList = "";
	//start
	if(window.localStorage.getItem("config_start_time") && window.localStorage.getItem("appStatus") == "running") {
		keyList = keyList + "#@@@#" + "config_start_time" + "#@@#" + window.localStorage.getItem("config_start_time");
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + window.localStorage.getItem("appStatus");
	} else {
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + "stopped";
	}
	//daily
	if(window.localStorage.getItem("config_kcals_type"))  { keyList = keyList + "#@@@#" + "config_kcals_type"  + "#@@#" + window.localStorage.getItem("config_kcals_type");  }
	if(window.localStorage.getItem("config_kcals_day_0")) { keyList = keyList + "#@@@#" + "config_kcals_day_0" + "#@@#" + window.localStorage.getItem("config_kcals_day_0"); }
	if(window.localStorage.getItem("config_kcals_day_1")) { keyList = keyList + "#@@@#" + "config_kcals_day_1" + "#@@#" + window.localStorage.getItem("config_kcals_day_1"); }
	if(window.localStorage.getItem("config_kcals_day_2")) { keyList = keyList + "#@@@#" + "config_kcals_day_2" + "#@@#" + window.localStorage.getItem("config_kcals_day_2"); }
	if(window.localStorage.getItem("config_measurement")) { keyList = keyList + "#@@@#" + "config_measurement" + "#@@#" + window.localStorage.getItem("config_measurement"); }
	if(window.localStorage.getItem("config_limit_1"))     { keyList = keyList + "#@@@#" + "config_limit_1"     + "#@@#" + window.localStorage.getItem("config_limit_1");     }
	if(window.localStorage.getItem("config_limit_2"))     { keyList = keyList + "#@@@#" + "config_limit_2"     + "#@@#" + window.localStorage.getItem("config_limit_2");     }	
	//nutrients
	if(window.localStorage.getItem("appNutrients"))		  { keyList = keyList + "#@@@#" + "appNutrients" + "#@@#" + window.localStorage.getItem("appNutrients"); }
	//mode
	if(window.localStorage.getItem("config_mode"))	      { keyList = keyList + "#@@@#" + "config_mode"  + "#@@#" + window.localStorage.getItem("config_mode"); }
	//notes
	if(window.localStorage.getItem("appNotes")) { 
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + window.localStorage.getItem("appNotes").replace(/(\n|\r\n)/g, "#@#").split("/*").join("/ *");
	} else {
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + "";
	}
	//form
	if(window.localStorage.getItem("calcForm#feet"))	{ keyList = keyList + "#@@@#" + "calcForm#feet" + "#@@#" + window.localStorage.getItem("calcForm#feet"); }
	if(window.localStorage.getItem("calcForm#inches"))	{ keyList = keyList + "#@@@#" + "calcForm#inches" + "#@@#" + window.localStorage.getItem("calcForm#inches"); }
	if(window.localStorage.getItem("calcForm#pA1B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA1B" + "#@@#" + window.localStorage.getItem("calcForm#pA1B"); }
	if(window.localStorage.getItem("calcForm#pA2B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA2B" + "#@@#" + window.localStorage.getItem("calcForm#pA2B"); }
	if(window.localStorage.getItem("calcForm#pA2C"))	{ keyList = keyList + "#@@@#" + "calcForm#pA2C" + "#@@#" + window.localStorage.getItem("calcForm#pA2C"); }
	if(window.localStorage.getItem("calcForm#pA3B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA3B" + "#@@#" + window.localStorage.getItem("calcForm#pA3B"); }
	if(window.localStorage.getItem("calcForm#pA3C"))	{ keyList = keyList + "#@@@#" + "calcForm#pA3C" + "#@@#" + window.localStorage.getItem("calcForm#pA3C"); }
	if(window.localStorage.getItem("calcForm#pA4B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA4B" + "#@@#" + window.localStorage.getItem("calcForm#pA4B"); }
	if(window.localStorage.getItem("calcForm#pA5B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA5B" + "#@@#" + window.localStorage.getItem("calcForm#pA5B"); }
	if(window.localStorage.getItem("calcForm#pA6G"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6G" + "#@@#" + window.localStorage.getItem("calcForm#pA6G"); }
	if(window.localStorage.getItem("calcForm#pA6H"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6H" + "#@@#" + window.localStorage.getItem("calcForm#pA6H"); }
	if(window.localStorage.getItem("calcForm#pA6M"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6M" + "#@@#" + window.localStorage.getItem("calcForm#pA6M"); }
	if(window.localStorage.getItem("calcForm#pA6N"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6N" + "#@@#" + window.localStorage.getItem("calcForm#pA6N"); }
	//return
	if(keyList != "") { keyList = "/*" + keyList + "*/"; }
	return keyList;
}
///////////////////////////
// REBUILD LOCAL STORAGE //
///////////////////////////
function rebuildLocalStorage(lsp) {
	if(!lsp.match("#@@@#")) { return; }
	//comments
	lsp = lsp.split("/*").join("").split("*/").join("");
	lsp = lsp.split("#@@@#");
	var lsPart;
	for(i=0; i<lsp.length; i++) {
		lsPart = lsp[i].split("#@@#");
		if(lsPart[0]) {
			if(lsPart[0] == "appNotes") {
				window.localStorage.setItem(lsPart[0],lsPart[1].split("#@#").join("\n"));
			} else if(lsPart[0] == "config_mode") {
				if(window.localStorage.getItem("config_mode") != "full") {
					window.localStorage.setItem(lsPart[0],lsPart[1]);
				}
			} else {
				window.localStorage.setItem(lsPart[0],lsPart[1]);
			}
			//update underlying value
			if(lsPart[0] == "config_kcals_day_0") {
				$("#editableDiv").html(lsPart[1]);
			}
		}
	}
}
///////////////////
// FETCH ENTRIES //
///////////////////
function fetchEntries(start,callback) {
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('SELECT * FROM diary_entry ORDER BY published DESC',[],
			function(t,results) {
				callback(fixResults(results));
			},errorHandler);
		});
	} else {
		//callback(lib.query("diary_entry"));
		callback(lib.queryAll("diary_entry", { sort: [["name", "DESC"]]}));
	}
}
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries(userId) {
	if(isNaN(userId))                              { return; }
	if(window.localStorage.getItem("pendingSync")) { return; }
	fetchEntries(function(data) {
		//NProgress.done();
		//NProgress.start();
		//$("#nprogress .bar").css("background-color","rgba(0, 0, 0, .15)");
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
		for(var i=0, len=data.length; i<len; i++) {
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
		//insert custom diary_food
		if(window.localStorage.getItem("customItemsSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customItemsSql")) + "\n";
		}
		//if(window.localStorage.getItem("customExerciseSql")) {
		//	fetchEntries = fetchEntries + trim(window.localStorage.getItem("customExerciseSql")) + "\n";
		//}
		if(window.localStorage.getItem("customFavSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customFavSql"));
		}
		if(localStorageSql()) {
			fetchEntries = fetchEntries + "\n" + trim(localStorageSql());
		}	
		fetchEntries = fetchEntries.split("undefined").join("");
		fetchEntries = fetchEntries.split("NaN").join("");
		/////////////////
		// POST RESULT //
		/////////////////
		if(fetchEntries == " " || !fetchEntries) { fetchEntries = " "; }
		if(fetchEntries) {
			window.localStorage.setItem("lastEntryPush",Number(window.localStorage.getItem("lastEntryPush")) + 30000);
			$.post("http://kcals.net/sync.php", { "sql":fetchEntries,"uid":userId }, function(data) {
				//clear marker
				window.localStorage.removeItem("lastEntryPush");
				NProgress.done();
			}, "text");
		}
	});
}
function setPush() {
	if(window.localStorage.getItem("facebook_logged")) { updateFoodDb(); }
	window.localStorage.setItem("lastEntryPush",new Date().getTime());
}
//#///////////////////#//
//# AUX: SYNC ENTRIES #//
//#///////////////////#//
function setComplete() {
	//nprogress
	NProgress.done();
	//set complete
	window.localStorage.removeItem("pendingSync");
	if(window.localStorage.getItem("foodDbLoaded") != "done") {
		updateFoodDb();
	} else {
		setPush();
	}
	//update entrylist sum
	updateEntriesSum();
	//update nutri pseudos
	updateNutriRatio();
	//refresh tabs
	appFooter(window.localStorage.getItem("app_last_tab"),1);
	//dump diary_food data
	if(typeof updateCustomList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
		updateCustomList('fav');
		updateCustomList('items');
		getCatList();
		//updateFavList();
		//updateFoodList();
		//updateExerciseList();
	}
	//update last sync date
	window.localStorage.setItem("lastSync",new Date().getTime());
	$("#optionLastSync span").html(dateDiff(window.localStorage.getItem("lastSync"),(new Date().getTime())));
}
//##//////////////##//
//## SYNC ENTRIES ##//
//##//////////////##//
function syncEntries(userId) {
	if(window.localStorage.getItem("facebook_logged")) { updateFoodDb(); }
	window.localStorage.setItem("pendingSync",new Date().getTime());
	if(isNaN(userId))                                   { return; }
	if(!window.localStorage.getItem("facebook_logged")) { return; }
	if(!window.localStorage.getItem("facebook_userid")) { return; }
	if($("#nprogress").html()) 							{ return; }
	var demoRunning = false;
	if(!demoRunning) {
		demoRunning = true;
		NProgress.start();
		//get remote sql
		$.get("http://kcals.net/sync.php?uid=" + userId,function(sql) {
			sql = sql.split("undefined").join("");
			//local storage slice
			if(sql.match('#@@@#')) {
				rebuildLocalStorage(sql.split("\n").pop());
				sql = sql.replace(/\r?\n?[^\r\n]*$/, "");
			}
			///////////////////////
			// FAKE VALID RESULT //
			///////////////////////empty but valid result ~ trigger success
			if(trim(sql) == "") {
				demoRunning = false;
				setComplete();
				/*
				window.localStorage.removeItem("pendingSync");
				//update last sync date
				window.localStorage.setItem("lastSync",parseInt(new Date().getTime()));
				$("#optionLastSync span").html(dateDiff(parseInt(window.localStorage.getItem("lastSync")),(new Date().getTime()))); 
				demoRunning = false;
				NProgress.done();
				setPush();
				*/
			} else if(hasSql) {
				//SQL
				html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
				//html5sql.process("DELETE FROM diary_entry;" + sql,function() {
				html5sql.process(sql,function() {
					//success
					demoRunning = false;
					setComplete();
				});
			} else {
				//LOCALSTORAGE 
				//lib.deleteRows("diary_entry");
				//lib.commit();
				//sqlToJson
				lsql  = sql.split('\n');
				lasql = [];
				for(var s=0, sen=lsql.length; s<sen; s++) {
					lasql.push(lsql[s].replace(",'","','").split("');").join("").split('INSERT OR REPLACE INTO "').join('').split('" VALUES(').join("','"));
				}
				for(var a=0, aen=lasql.length; a<aen; a++) {
					var keyName = lasql[a].split("','");
					//WRITE
					if(keyName[0] == "diary_entry" && parseInt(keyName[4]) != '') {
						lib.insertOrUpdate("diary_entry", {published: parseInt(keyName[4])},{"id":keyName[1],"title":keyName[2],"body":keyName[3],"published": parseInt(keyName[4]),"info":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
						//lib.insert("diary_entry",{"id":keyName[1],"title":keyName[2],"body":keyName[3],"published":keyName[4],"info":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
					}
					if(keyName[0] == "diary_food" && parseInt(keyName[3]) != '') {
						lib2.insertOrUpdate("diary_food", {code: keyName[3]},{"id":keyName[1],"type":keyName[2],"code":keyName[3],"name":keyName[4],"term":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
					}
				}
				//success
				lib.commit();
				lib2.commit();
				demoRunning = false;
				setComplete();
			}
		});
	}
}
/////////////////
// GET ENTRIES //
/////////////////
function getEntries(start,callback) {
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(
			function(t) {
				t.executeSql('SELECT id, title, body, published, pro, car, fat FROM "diary_entry" WHERE info IS NOT "deleted" ORDER BY published desc',[],
				function(t,results) {
					callback(fixResults(results));
				},errorHandler);
		}, errorHandler);
	} else {
		//callback(lib.query("diary_entry"));
		//callback(lib.queryAll("diary_entry", { sort: [["published", "DESC"]]}));
		//callback(lib.queryAll("diary_entry", function(data){ if(data.info != "deleted") { return true; }},{ sort: [["published", "DESC"]]}));
		callback(lib.query("diary_entry", function(data){ if(data.info != "deleted") { return true; } else { return false; }}));
	}
}
///////////////
// GET ENTRY //
///////////////
function getEntry(eid,callback) {
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('select * from diary_entry where ID=?', [eid], function(t,results) { callback(fixResults(results)); });
		});
	} else {
		callback(lib.query("diary_entry", {id: eid}));
	}
}
//#//////////////////#//
//# DB: UPDATE ENTRY #//
//#//////////////////#//
function updateEntry(data) {
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('insert or replace into diary_entry(id,title,body,published,pro,car,fat) values(?,?,?,?,?,?,?)', [data.id,parseInt(data.title) + '',data.body,parseInt(data.published) + '',data.pro,data.car,data.fat]);
			setPush();
		});
	} else {
		lib.insertOrUpdate("diary_entry", { id: parseInt(data.id) }, {
			"id":data.id,
			"title":parseInt(data.title),
			"body":data.body,
			"published": parseInt(data.published),
			"info":'',
			"kcal":'',
			"pro":data.pro,
			"car":data.car,
			"fat":data.fat,
			"fib":''
		});
		lib.commit();
		setPush();
	}
}
//#//////////////////#//
//# DB: DELETE ENTRY #//
//#//////////////////#//
function deleteEntry(rid, callback) {
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('update "diary_entry" set info="deleted" where id = ?', [rid.id]);
			setPush();
		});
	} else {
		//lib.deleteRows("diary_entry",{id: rid.id});
		lib.update("diary_entry", {"id": rid.id}, function(row) {
			row.info = 'deleted';
			return row;
		});
		lib.commit();
		setPush();
	}
}
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data) {
	//if(!data.published) { data.published = 'quicksave'; }
	if(hasSql) {
		db.transaction(function(t) {
			//UPDATE BODY
			if(data.id && !data.title) {
				t.executeSql('update diary_entry set body=? where id=' + data.id, [data.body]);
				setPush();
			//UPDATE TITLE
			} else if(data.id && data.title) {
				t.executeSql('update diary_entry set title=? where id=' + data.id, [data.title]);
				setPush();
			//INSERT FULL
			} else if(data.pro || data.car || data.fat) {
				getRateDialog();
				t.executeSql('insert into diary_entry(id,title,body,published,pro,car,fat) values(?,?,?,?,?,?,?)', [parseInt(data.published),data.title,data.body,parseInt(data.published) + '',data.pro,data.car,data.fat]); 
				setPush();
			//INSERT QUICK
			} else {
				getRateDialog();
				t.executeSql('insert into diary_entry(id,title,body,published) values(?,?,?,?)', [parseInt(data.published),data.title,data.body,parseInt(data.published) + '']); 
				setPush();
			} 
		});
	} else {
		//UPDATE BODY
		if(data.id && !data.title) {
			lib.update("diary_entry", {"id": data.id}, function(row) {
				row.body = data.body;
				return row;
			});
			lib.commit();
			setPush();
		//UPDATE TITLE
		} else if(data.id && data.title) {
			lib.update("diary_entry", {"id": data.id}, function(row) {
				row.title = data.title;
				return row;
			});
			lib.commit();
			setPush();
		//INSERT FULL
		} else if(data.pro || data.car || data.fat) {
			getRateDialog();
			lib.insert("diary_entry", {"id": parseInt(data.published), "title": data.title, "body": data.body, "published": parseInt(data.published), "pro":data.pro, "car":data.car, "fat":data.fat});
			lib.commit();
			setPush();
		//INSERT QUICK
		} else {
			getRateDialog();
			lib.insert("diary_entry", {"id": parseInt(data.published),"title": data.title, "body": data.body, "published": parseInt(data.published)});
			lib.commit();
			setPush();
		}
	}
}
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	if(hasSql) {
		db.transaction(function(t) {
			if(data.act == "update") {
				t.executeSql('delete from diary_food where CODE = ?', [data.code]);
				t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib],function() {
				callback();	
				});
			} else {
				t.executeSql('insert into diary_food(id,type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?,?)', [new Date().getTime(),data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib],
				function() {
					callback();
				});
			}
		});
	} else {
		if(data.act == "update") {
			lib2.update("diary_food",{code: data.code}, function(row) {
				return {"id":data.id,"type":data.type,"code":data.code,"name":data.name,"term":sanitize(data.name),"kcal":data.kcal,"pro":data.pro,"car":data.car,"fat":data.fat,"fib":data.fib};
			});
			lib2.commit();
			callback();
		} else {
			lib2.insert("diary_food", {"id": new Date().getTime(),"type":data.type,"code":data.code,"name":data.name,"term":sanitize(data.name),"kcal":data.kcal,"pro":data.pro,"car":data.car,"fat":data.fat,"fib":data.fib});
			lib2.commit();
			callback();
		}
	}
}
//////////////
// GET FOOD //
//////////////
function getFood(fCode,callback) {
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('select * from diary_food where CODE=?', [fCode], function(t,results) { callback(fixResults(results)); });
		});
	} else {
		callback(lib2.query("diary_food", {code: fCode}));
	}
}
/////////////////
// DELETE FOOD //
/////////////////
function delFood(fCode, callback) {
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [fCode]); 
		});
	} else {
		lib2.deleteRows("diary_food",{code: fCode});
		lib2.commit();
	}
}
/*
function delFood(fCode, callback) {
	if(hasSql) {
		db.transaction(function(t) {
			//t.executeSql('delete from diary_food where CODE = ?', [fCode]);
			t.executeSql('update "diary_food" set fib="deleted" where CODE = ?', [fCode]);
		});
	} else {
		//lib2.deleteRows("diary_food",{code: fCode});
		lib2.update("diary_food", {"code": fCode}, function(row) {
			row.fib = 'deleted';
			return row;
		});
		lib2.commit();
	}
};
*/
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function callbackOpen() {
	if(!$('#pageSlideFood').is(":animated")) {
		$('#pageSlideFood').addClass("open"); 
		if(!$('#appHeader').hasClass("open")) {
			$('#appHeader').removeClass("closer");
			$('body').removeClass("closer");
		}
	}
}
function getCustomList(rType,callback) {
	if(arguments.length == 1) { callback = arguments[0]; }
	
	if(hasSql) {
		db.transaction(function(t) {
			//////////////
			// FAV LIST //
			//////////////
			if(rType == "fav") {
				t.executeSql('select * from diary_food where FIB=? order by TERM COLLATE NOCASE ASC',[rType],function(t,results) {
					callback(fixResults(results));
					//if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") { callbackOpen(); }
				});
			////////////////////////
			// FOOD~EXERCISE LIST //
			////////////////////////
			} else {
				t.executeSql('select * from diary_food where length(CODE)=14 order by TERM COLLATE NOCASE ASC',[],function(t,results) {
					callback(fixResults(results));
					//if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
					//if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
				});
			}
		});
	} else {
		//////////////
		// FAV LIST //
		//////////////
		if(rType == "fav") {
			//////////
			// SORT //
			//////////
			var favArray = lib2.query("diary_food",{fib: "fav"});
			favArray = favArray.sort(function(a, b) {
				return (a.term > b.term) ? 1 : ((a.term < b.term) ? -1 : 0);
			});
			callback(favArray);
		////////////////////////
		// FOOD~EXERCISE LIST //
		////////////////////////			
		} else {
			//////////
			// SORT //
			//////////
			var CustomsArray = lib2.query("diary_food",function(row) { if(row.code.slice(0, 1) == "c") { return true; }});
			CustomsArray = CustomsArray.sort(function(a, b) {
				return (a.term > b.term) ? 1 : ((a.term < b.term) ? -1 : 0);
			});
			callback(CustomsArray);			
		}
		//if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1")							{ callbackOpen(); }
		//else if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
		//else if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
	}
}
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [data.code]);
			t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
		});
	} else {
		lib2.deleteRows('diary_food', {code: data.code});
		lib2.insert('diary_food', {type:data.type,code:data.code,name:data.name,term:sanitize(data.name),kcal:data.kcal,pro:data.pro,car:data.car,fat:data.fat,fib:data.fib});
		lib2.commit();
	}
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	noTimer = 'active';
	opaLock = 2;
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		$("*").off();
		$('*').css('pointer-events','none');
		blockAlerts = 1; 
		//preserve data
		if(window.localStorage.getItem("config_mode")) {
			var configMode = window.localStorage.getItem("config_mode");
		}
		if(window.localStorage.getItem("config_install_time")) {
			var installTime = window.localStorage.getItem("config_install_time");
		}
		//SET CSS TRANSITION
		$('body').css(prefix + "transition-timing-function","ease");
		$('body').css(prefix + "transition-duration",".25s");
		$("body").css("opacity","0");
		$('body').on(transitionend,function(e) { 
			if(isMobile.iOS && hasTouch() && navigator.splashscreen) {
				navigator.splashscreen.show();
			}		
			//
			if(window.localStorage.getItem("facebook_logged") && cmd == "clear") {
				$.post("http://kcals.net/sync.php", { "sql":" ","uid":window.localStorage.getItem("facebook_userid") }, function(data) {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
						}
					},250);
					///////////
					// CLEAR //
					///////////
					if(cmd == "clear") {
						window.localStorage.clear();
						if(configMode) {
							window.localStorage.setItem('config_mode',configMode);
						}
						if(installTime) {
							window.localStorage.setItem('config_install_time',installTime);
						}
					}
				}, "text");
			} else {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
						}
					},250);
					///////////
					// CLEAR //
					///////////
					if(cmd == "clear") { 
						window.localStorage.clear();
						if(configMode) {
							window.localStorage.setItem('config_mode',configMode);
						}
						if(installTime) {
							window.localStorage.setItem('config_install_time',installTime);
						}
					}
			}
		});
	},250);
}
/////////////
// SPINNER //
/////////////
function spinner(size) {
	//////////
	// STOP //
	//////////
	if(size == 'stop') {
		$("#tempHolder").remove();
		$(window).trigger("resize");
		setTimeout(function() { $("#tempHolder").remove(); },150);
		setTimeout(function() { $("#tempHolder").remove(); },250);
		setTimeout(function() { $("#tempHolder").remove(); },500);
		setTimeout(function() { $("#tempHolder").remove(); },999);
		return;
	}
	//////////
	// HTML //
	//////////
	if(!$("#tempHolder").html()) { 
		$("body").prepend('<div id="tempHolder"></div');
		$("#tempHolder").html('<div id="modalOverlay"></div><span id="spinnerMsg">' + LANG.PREPARING_DB[lang] + '</span><div id="spinnerWrapper"><div id="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div>');
		$("#modalOverlay").css("opacity",0.5);
		//prevent tapping
		$("#modalOverlay").css("z-index",99999);
		$("#modalOverlay").css("background-color","#fff");
		$("#modalOverlay").css("background-image",prefix + "linear-gradient(#fff,#fefefe)");	
		$("#modalOverlay,#spinner,#tempHolder").on(touchstart, function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		/////////////////
		// FIND CENTER //
		/////////////////
		$("#spinner").width(size);
		$("#spinner").height(size);
		var xcenter = ((window.innerWidth) / 2) - ($("#spinner").width() / 2);
		var ycenter = Math.round(((window.innerHeight) / 1.75));
		/* - ($("#spinner").height() / 2);*/
		$("#spinnerWrapper").css("left",xcenter + "px");
		$("#spinnerWrapper").css("top",ycenter  + "px");
	}
	//spin.js plugin
	$("#spinner").spin({ lines: 12, length: 9, width: 4, radius: 10,color: "#000" });
	/////////////////
	// SELF ADJUST //
	/////////////////
	if($("#tempHolder").html() != "") { 
		$(window).on("resize", function(evt) {
			var xcenter = ((window.innerWidth) / 2) - ($("#spinner").width() / 2);
			var ycenter = Math.round(((window.innerHeight) / 1.75));
			$("#spinnerWrapper").css("left",xcenter + "px");
			$("#spinnerWrapper").css("top",ycenter  + "px");
		});
	}
}
////////////////////
// FOOD DB IMPORT //
////////////////////
var demoRunning = false;
var foodDbTimer;
function updateFoodDb() {
	if(window.localStorage.getItem("foodDbLoaded") == "done" && !window.localStorage.getItem("foodDbVersion")) { window.localStorage.removeItem("foodDbLoaded"); }
	if(window.localStorage.getItem("foodDbLoaded") == "done") { return; }
	if(window.localStorage.getItem("foodDbLoaded") != "done" && window.localStorage.getItem("startLock") != "running") {
		//reset blocks
		$("#tabMyCatsBlock,#tabMyFavsBlock,#tabMyItemsBlock").html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		//var dbName = "mylivediet.app";
		if(demoRunning == false) {
			//start
			demoRunning = true;
			window.localStorage.setItem("startLock","running");
			clearTimeout(foodDbTimer);
			foodDbTimer = setTimeout(function() {
				spinner(45);
				//WEBSQL
				if(hasSql) {
					html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
					//import sql
					//var dbLang = (LANG.LANGUAGE[lang] == "pt") ? "pt" : "en";
					var langDB = (lang == "en" && window.localStorage.getItem("config_measurement") == "metric") ? 'em' : lang;
					$.get(hostLocal + "sql/searchdb_" + langDB + ".sql",function(sql) {
						//drop-recreate 
						sql = 'DROP TABLE IF EXISTS "diary_food"; CREATE TABLE "diary_food"(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code VARCHAR UNIQUE,name TEXT,term TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);' + sql;
						//http://regex101.com
						var postCustom = '';
						if(trim(window.localStorage.getItem("customItemsSql"))     != '') { postCustom += trim(window.localStorage.getItem("customItemsSql"));     }
						//if(trim(window.localStorage.getItem("customExerciseSql")) != '') { postCustom += trim(window.localStorage.getItem("customExerciseSql")); }						
						if(trim(window.localStorage.getItem("customFavSql"))      != '') { postCustom += trim(window.localStorage.getItem("customFavSql"));      }
						sql = sql.replace(/lib2(.*)\{"id"\:"/g, 'INSERT OR REPLACE INTO "diary_food" VALUES(');
						sql = sql.split('", "type":').join(',').split('"code":').join('').split('"name":').join('').split('"kcal":').join('').split('"term":').join('').split('"kcal":').join('').split('"pro":').join('').split('"car":').join('').split('"fat":').join('').split('"fib":').join('').split('});').join(');');
						sql = sql + postCustom;
						//
						html5sql.process(sql,function() {
							//success
							demoRunning = false;
							window.localStorage.setItem("foodDbLoaded","done");
							window.localStorage.setItem("foodDbVersion","2");
							window.localStorage.removeItem("startLock");
							setTimeout(function() { niceResizer(); },300);
							spinner('stop');
							if(window.localStorage.getItem("facebook_userid")) {
								syncEntries(window.localStorage.getItem("facebook_userid"));
							} else {
								updateCustomList('fav');
								updateCustomList('items');
								getCatList();
								//updateFavList();
								//updateFoodList();
								//updateExerciseList();
							}
						},
						function(error, failingQuery) {
							//failure
							demoRunning = false;
							window.localStorage.removeItem("foodDbLoaded");
							window.localStorage.removeItem("startLock");
							spinner('stop');
						});
					});
				//LOCALSTORAGE
				} else {
					var langDB = (lang == "en" && window.localStorage.getItem("config_measurement") == "metric") ? 'em' : lang;
					$.get(hostLocal + "sql/searchdb_" + langDB + ".sql",function(ls) {
						//delete non-fav/custom
						lib2.deleteRows("diary_food", function(row) {
							if(row.code.length < 11 && row.fib != "fav") {
								return true;
							} else {
								return false;
							}
						});
						lib2.commit();
						//
						eval(ls);
						lib2.commit();
						//success
						demoRunning = false;
						window.localStorage.setItem("foodDbLoaded","done");
						window.localStorage.setItem("foodDbVersion","2");
						window.localStorage.removeItem("startLock");
						setTimeout(function() { niceResizer(); },300);
						spinner('stop');
						if(window.localStorage.getItem("facebook_userid")) {
							syncEntries(window.localStorage.getItem("facebook_userid"));
						} else {
							updateCustomList('fav');
							updateCustomList('items');	
							getCatList();					
							//updateFavList();
							//updateFoodList();
							//updateExerciseList();
						}
					});			
				}
		},50);
		}
	}
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	//if partial
	if(published) {
		//set row time array
		//var arr = new Array;
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
		// INSERT PARTIAL //
		//overwrite 'no entries'
		if(i == 1) {

			$("#entryList").html($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
		//match div before
		} else if($("#entryList>div:eq(" + entryPos + ")").html()) {
			$("#entryList>div:eq(" + entryPos + ")").before($(content).animate({ backgroundColor: "#ffffcc" }, 1 ).animate({ backgroundColor: "#fff" },1000));
		} else {
		//append if none
			$("#entryList").append($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
		}
		//target [div#partial] ~time's parent div id as target
		var page = $('#entryList div' + '#' + $("#t" + published).parent('div').attr('id'));
	// FULL DIV REPLACE //
	} else {
		//check existence
		if($(target).html(content)) {
			$(target).html(content);
			//document.getElementById(target.replace("#","")).innerHTML = content;
		}
		//$(target).html(content);
		//target [div#entrylist]
		var page = $('#entryList');
	}
	// RELOAD HANDLERS //
	//var evt = document.createEvent('CustomEvent');
	//evt.initCustomEvent("pageload",true,true,content);
	//var page = $('#entryList div');
	if(page[0]) {
		$(page).trigger("pageload");
	//	page[0].dispatchEvent(evt);
	}
	//$('#entryList div:gt(50)').hide();
	return;
}
///////////////
// FILL DATE //
///////////////
function fillDate(timestamp,element) {
	//time [ datetime-local / 2013-01-01T00:00 ]
	var d = (timestamp != "") ? new Date(Number(timestamp)) : new Date();
	//fill
	if(element != "") {
		//document.getElementById(element).value = d.toISOString();
		document.getElementById(element).value = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + "T" + ("0" + (d.getHours() + 0)).slice(-2) + ":" + ("0" + (d.getMinutes() + 0)).slice(-2);
	}
	return;
}
//////////////////////
// UPDATE ENTRYLIST //
//////////////////////
var partial = "";
function updateEntries(partial,range,callback) {
	var totalEntryS       = parseInt(window.localStorage.getItem('totalEntries'));
	var totalRecentEntryS = parseInt(window.localStorage.getItem('totalRecentEntries'));
	//////////////
	// GET LOOP //
	//////////////
	getEntries(function(data) {
		var s = "";
		var p = "";
		var rowClass;
		var lastRow = "";
		var lastId  = "";
		var lastPub = 0;
		var totalArray = [];
		var langFood = LANG.FOOD[lang];
		var langExer = LANG.EXERCISE[lang];
		var langDel  = LANG.DELETE[lang];
		var langKcal = LANG.KCAL[lang];
		var totalEntries       = 0;
		var totalRecentEntries = 0;
		var totalEntried       = parseInt(window.localStorage.getItem('totalEntries'));
		var totalRecentEntried = parseInt(window.localStorage.getItem('totalRecentEntries'));
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = parseInt(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = parseInt(data[i].published);
			// 0 : 1
			if(data[i].body == "") {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
				} else {
					dataBody = "";
				}
			}
			// row colors
			var rowDate = new Date(dataPublished);
			var rowHour = rowDate.getHours();
                 if(rowHour <  6) { rowClass = "rowAfterhours"; }
			else if(rowHour < 12) { rowClass = "rowMorning";    }
			else if(rowHour < 18) { rowClass = "rowAfternoon";  }
			else if(rowHour < 24) { rowClass = "rowNight";      }

			if(dataTitle < 0)	{ rowClass = "e-" + rowClass; }
			// EXPIRED
			if(window.localStorage.getItem("config_start_time") > dataPublished || window.localStorage.getItem("appStatus") != "running") { rowClass = rowClass + " expired"; }
			// CORE OUTPUT
			//<p class='entriesId'>#" + Number(i+1) + "</p>
			var dataHandler = "\
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='entryListRow " + rowClass + " day" + dayFormat(dataPublished).split("/").join("x") + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>" + langKcal + "</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='t" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
			// ROW++ (sqlish sort)
			// ROW++ (sqlish sort)
			totalEntries++;
			if((new Date().getTime() - dataPublished) < 60*60*24*5*1000) {
				totalRecentEntries++;
			}
			if(((new Date().getTime() - dataPublished) < 60*60*24*5*1000) || totalEntried < 50 || totalRecentEntried < 20 || range == "full") {
				//if(lastPub > parseInt(data[i].published)) {
				//	s = s + dataHandler;
				//} else {
			//s += dataHandler;
			totalArray.push({dati:dataPublished , dato: dataHandler});
				//}
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
		var prop = 'dati';
		totalArray = totalArray.sort(function(a, b) {
			//if(asc)
			//return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
			// else 
			return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
		});
		$.each(totalArray,function(k,v) {
			s += v.dato;
		});
		//////////////
		// CALLBACK //
		//////////////
		if(callback) { 
			if(s != "") {
				openDiary(s);
			} else {
				openDiary('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
			}
		} else {
		////////////////////
		// RETURN CONTENT //
		////////////////////
		if(s != "") {
			if(partial) {
				//IF PARTIAL + nonRepeat
				if($("#" + lastId).html()) {
					$("#" + lastId).remove();
				}
				if(!$("#" + lastId).html()) {
					pageLoad("#entryList",lastRow,partial);
				} else { return false; }
			} else {
				//FULL
				pageLoad("#entryList",s);
				if(range == "full") { niceResizer(200); }
			}
		///////////
		// EMPTY //
		///////////
		} else {
			//PRE-FILL
			//pageLoad('#entryList','<div id="noEntries"><span>no entries</span></div>');
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
		}}
		//N# OF ENTRIES
		window.localStorage.setItem('totalEntries',totalEntries);
		window.localStorage.setItem('totalRecentEntries',totalRecentEntries);
	});
}
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = parseInt(data[i].published);
			$("#t" + dataPublished).html(dateDiff(dataPublished,(new Date()).getTime()));
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
			pushTitle.push({ date: dayFormat(parseInt(data[m].published)).split("/").join("x"),val: data[m].title});
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
			if(eachDay[d] == dayFormat(new Date().getTime()).split("/").join("x")) {
				thisDay = lToday;
			} else {
				thisDay = eachDay[d];
			}

			reStyle = reStyle + '\
			#entryList div.day' + eachDay[d] + ' { border-top: 21px solid #eee;	}\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ' { margin-top: 0px; border-top: 0px solid #eee; }\
			#entryList div.day' + eachDay[d] + ':before { content: "' + lFood + ': ' + totalDayF + '  /  ' + lExe + ': ' + totalDayE + '"; color: #bbb; position: absolute; top: -22px; right: 0px; font-size: 12px; line-height: 16px; background-color: #eee; width: 100%; text-align: right; padding-top: 4px; padding-bottom: 2px; padding-right: 9px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':before { content: ""; padding-top: 0; padding-bottom: 0; }\
			#entryList div.day' + eachDay[d] + ':after { content: "' + thisDay.split("x").join("/") +'"; color: #999; position: absolute; top: -18px; left: 15px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':after { content: "";  }\
			'; 
		}
		//OUTPUT
		safeExec(function() {
			$("#daySum").html(reStyle);
		});
	});
}
//#////////////////////////////#//
//# UPDATE NUTRI RATIO PSEUDOS #//
//#////////////////////////////#//
function updateNutriRatio() {
	var appNutrients = window.localStorage.getItem('appNutrients').split('|');
	var proRatio = parseInt(appNutrients[0]);
	var carRatio = parseInt(appNutrients[1]);
	var fatRatio = parseInt(appNutrients[2]);

	var nutrientsStyle = "\
		#appStatusBarsPro span:after	{ content: ' (" + proRatio + "%)' !important; }\
		#appStatusBarsCar span:after	{ content: ' (" + carRatio + "%)' !important; }\
		#appStatusBarsFat span:after	{ content: ' (" + fatRatio + "%)' !important; }\
	";
	//////////
	// EXEC //
	//////////
	safeExec(function() {
		if(!$("#appNutrients").html()) {
			$("head").append("<style type='text/css' id='appNutrients'></style>");
		}
		if($("#appNutrients").html() != nutrientsStyle) {
			$("#appNutrients").html(nutrientsStyle);
		}
	});
}
//##/////////////////##//
//## BUILD HELP MENU ##//
//##/////////////////##//
var subHelperTimer;
function buildHelpMenu() {
	//insert menu
	$("#optionHelp").addClass("activeRow");
	$("body").append("<div id='appHelper'></div>");
	
	$("#appHelper").hide();
	$("#appHelper").css("top",($("#appHeader").height()) + "px");
	$("#appHelper").height($("#appContent").height());
	$("#appHelper").css("bottom",($("#appFooter").height()) + "px");
	$("#appHelper").show();
	
	//STARTLOCK
	var startLock = 1;
	//BUILD CONTENT ARRAY
	var helpTopics = LANG.HELP_TOPICS_ARRAY[lang];
	var helpHtml   = "";
	var topicId    = 0;
	$.each(helpTopics, function(key, value) {
		if(key && value) {
			topicId++;
			helpHtml = helpHtml + "<li id='topic" + topicId + "'>" + key + "<div class='topicTitle'>" + key + "</div><div class='topicContent'>" + value + "</div></li>";
		}
	});
	/////////////////////
	// RE-INSERT INTRO //
	/////////////////////
	var introValue = '<p>' + LANG.INTRO_SLIDE_1[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_2[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_3[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_4[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_5[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_6[lang].split(".").join(". ") + '</p>';
	helpHtml = "<li id='topic" + (topicId+1) + "'>" + LANG.INTRO[lang] + "<div class='topicTitle'>" + LANG.INTRO[lang] + "</div><div class='topicContent'>" + introValue + "</div></li>" + helpHtml;
	///////////////////////
	// INSERT TOPIC LIST //
	///////////////////////
	$("#appHelper").html('<h2><span id="backButton"></span><div id="helpTitle">' + LANG.SETTINGS_HELP[lang] + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$("#appHelper").css("opacity","1");
		//$("#appHelper").height($("#appContent").height());
	},0);
	//SCROLLER
	setTimeout(function() {
		if(!isMobile.iOS() && !isMobile.Windows() && !isMobile.MSApp() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
			$("#appHelper").css('overflow','hidden');
			$("#appHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		} else {
			$("#appHelper").css('overflow','auto');
		}
		//UNLOCK TAP
		setTimeout(function() {
			startLock = 0;
		},50);
	},250);
	//LIST CLOSER HANDLER
	$("#backButton").on(touchend,function() {
		$("#appHelper").css("opacity",0);
		$('#appHelper').on(transitionend,function() {
			$('#appHelper').remove();
		});
	});
	var touchHelper = 0;
	//TOPIC HANDLERS
	$("#appHelper li").on(touchstart,function(evt) {
		touchHelper = 0;
		//evt.preventDefault();
		$(this).addClass("activeRow");
	});
	$("#appHelper, #appHelper li").on("mouseout mouseleave",function(evt) {
		$(".activeRow").removeClass("activeRow");
		//evt.preventDefault();
	});
	
	$("#appHelper, #appHelper li").on("scroll " + touchmove,function(evt) {
		touchHelper++;
		
		if(touchHelper > 5 || (touchHelper > 1 && isMobile.Android())) {
			$(".activeRow").removeClass("activeRow");
			touchHelper = 0;
		}
		//evt.preventDefault();
		//evt.stopPropagation();
	});
	//////////////////////////////////
	// content-builder self-handler //
	//////////////////////////////////
	$("#appHelper ul li").on(tap,function(evt) {
		if(startLock != 0) { return; }
		if(!$(this).hasClass("activeRow")) { return; }
		//reapply style
		$(this).addClass("activeRow");
		//PASS CONTENT
		var subTitle   = $("#" + $(this).attr("id") + " .topicTitle").html();
		var subContent = $("#" + $(this).attr("id") + " .topicContent").html();
		//BUILD SUB-CONTENT
		$("body").append('<div id="appSubHelper"><h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2><div id="subHelpContent">' + subContent + '</div></div>');
		$("#appSubHelper").hide();
		$("#appSubHelper").css("top",($("#appHeader").height()) + "px");
		$("#appSubHelper").height($("#appContent").height());
		$("#appSubHelper").css("bottom",($("#appFooter").height()) + "px");		
		$("#appSubHelper").show();
		/////////////
		// SUBHIDE //
		/////////////
		$("#appSubHelper").on("scroll",function(evt) {
			$("#appContent").hide();
			clearTimeout(subHelperTimer);
			subHelperTimer = setTimeout(function() {
				$("#appContent").show();
			},100);
		});
		///////////////////////////////
		// SUB-CONTENT ANIMATION END //
		///////////////////////////////
		setTimeout(function() {
			//ios horiz-scrolling crazy bug
			$("#appSubHelper").height($("#appContent").height());
		},0);
		$('#appSubHelper').on(transitionend,function(e) { 
			niceResizer();
			//IF CLOSED
			if(!$('#appSubHelper').hasClass("open")) {
				$('#appSubHelper').remove();
				setTimeout(function() {
					$('#appHelper').css("width","100%");
					//restore visibility
					$(".nicescroll-rails").css("display","block");
				},100);
			//IF OPENED
			} else {
				$(".activeRow").removeClass("activeRow");
				//SCROLLER
				if(!isMobile.iOS() && !isMobile.Windows() && !isMobile.MSApp() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
					setTimeout(function() {
						$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
					},100);
				} else {
					//wp8 transision
					$("#appSubHelper").css("overflow","auto");
				}
			}
			setTimeout(function() {
				$('#appSubHelper').css("width","100%");
			},100);
		});
		//SUB-CONTENT HANDLERS
		$("#subBackButton").on(touchend,function() {
			//remove
			$("#appSubHelper").removeClass("open");
			$("#appHelper").removeClass("out");
			//hide on transision
			$(".nicescroll-rails").css("display","none");
		});
		//////////////////////
		// OPEN SUB-CONTENT //
		//////////////////////
		setTimeout(function() {
			//smooth transition (wp8)
			$("#appSubHelper").css("overflow","hidden");
			$("#appSubHelper").addClass("open");
			$("#appHelper").addClass("out");
			//$("#appContent").getNiceScroll().remove();
		},50);
	});
}
//##//////////////##//
//## GETNEWwINDOW ##//
//##//////////////##//
function getNewWindow(title,content,handlers,save,closer,direction,bottom,top) {
	if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return; }
	//FLOOD
	if($("#newWindowWrapper").html()) { return; }
	//////////
	// HTML //
	//////////
	$("#newWindowWrapper").remove();
	var newContent = "\
	<div id='newWindowWrapper'>\
		<div id='newWindowHeader'>\
			<div id='backButton'></div>\
			<div id='saveButton'>" + LANG.OK[lang] + "</div>\
			<div id='newWindowTitle'>" + title + "</div>\
			</div>\
		<div id='newWindow'>" + content + "</div>\
	</div>";
	safeExec(function() {
		$("#appContent").after(newContent);
	});
	$("#newWindowWrapper").hide();
	$("#newWindow").hide();
	//configure ui
	if(direction == "sideload") {
		$("#newWindowWrapper").addClass('sideload');
	}
	if(!save) { $("#saveButton").remove(); }

	//$("#newWindowWrapper").css("top",($("#appHeader").height()) + "px");
	//$("#newWindowWrapper").css("bottom",($("#appFooter").height()) + "px");
	
	$("#newWindowWrapper").css("top",($("#appHeader").height()) + "px");
	if(bottom != 'flush') {
		$("#newWindowWrapper").height($("#appContent").height());
		$("#newWindowWrapper").css("bottom",($("#appFooter").height()) + "px");
	} else {
		$("#newWindowWrapper").height($("#appContent").height() + $("#appFooter").height());
		$("#newWindowWrapper").css("bottom",'0px');		
	}
	
	$("#newWindowWrapper").show();
	$("#newWindow").show();
	//
	$("#newWindow").css("top",($("#newWindowHeader").height()+1) + "px");
	$('body').addClass('newwindow');
	$("#newWindowWrapper").addClass('open');
	$("#newWindowWrapper").addClass('busy');
	///////////////////
	// EXEC HANDLERS //
	///////////////////
	if(handlers) {
		safeExec(function() {
			handlers();
		});
	}
	////////////////////
	// TRANSISION END //
	////////////////////
	$("#newWindowWrapper").off().on(transitionend,function() {
		//scroller
		setTimeout(function() {
			if(!isMobile.iOS() && androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS()) {
				var horizScroll = $('#appHistory').html() ? true : false;
				var touchBeh = true;
				if(isMobile.Android()) { touchBeh = false; }
				$("#newWindow").css("overflow","hidden");
				$("#newWindow").niceScroll({touchbehavior:touchBeh,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:horizScroll,hwacceleration:true});
			} else if((isMobile.Windows() || isMobile.MSApp()) && $('#appHistory').html()) {
				$("#newWindow").css("overflow","hidden");
				$("#newWindow").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:true,hwacceleration:false});
			} else {
				$("#newWindow").css("overflow","auto");
			}
			//busy
			$("#newWindowWrapper").removeClass('busy');
		},250);
		///////////////////
		// GLOBAL CLOSER //
		///////////////////
		var timerCloser;
		function windowCloser() {
			if(closer) {
				safeExec(function() {
					closer();
				});
			}
			$('#appContent, #foodSearch, #newWindowWrapper').css('pointer-events','none');
			$("#newWindow").getNiceScroll().remove();
			setTimeout(function() {
				$("#newWindowWrapper").removeClass('open');
				$("#newWindowWrapper").css('opacity',0);
			},50);
			$("#newWindowWrapper").off().on(transitionend,function() {
				$('#newWindowWrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass('newwindow');
				clearTimeout(timerCloser);
				setPush();	
			});	
			timerCloser = setTimeout(function() {
				$('#newWindowWrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass('newwindow');
				setPush();				
			},500);
		}
		///////////////////////////////////
		// TRANSITION-PROTECTED HANDLERS //
		///////////////////////////////////
		// SAVE HANDLER //
		//////////////////
		$("#saveButton").off().on(touchend,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			//VALIDATION
			if(save() == true) {
				windowCloser();
			}
		});
		////////////////////
		// CLOSER HANDLER //
		////////////////////
		$("#backButton").off().on(touchend,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
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
window.localStorage.setItem("langDump",JSON.stringify(langListString));
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
	$("#langSelect").remove();
	//intro
	if(opt == "intro") {
		$("body").append("<div id='langSelect'></div>");
	} else {
		//$("#appContent").append("<div id='langSelect'></div>");
		$("body").append("<div id='langSelect'></div>");
		$("#langSelect").css("top",($("#appHeader").height()) + "px");
		$("#langSelect").height($("#appContent").height());
		$("#langSelect").css("bottom",($("#appFooter").height()) + "px");
	}
	//add auto detect
	langListAutoCore = "<li id='setAuto'>" + LANG.AUTO_DETECT[lang] + " (" + LANG.LANGUAGE_NAME[defaultLang] + ")</li>" + langListCore;
	$("#langSelect").html("<ul id='langSelectList'>" + langListAutoCore + "</ul>");
	//intro
	if(opt == "intro") { 
		$("#langSelect").css("z-index",100);
		//pad
		if($("body").hasClass("ios7")) {
			$("#langSelect").css("padding-top","24px");
		}
	}
	//mark current
	//window.localStorage.setItem("devSetLang",lang);
	if(window.localStorage.getItem("devSetLang")) {
		$("#set" + lang).addClass("set");
	} else {
		$("#setAuto").addClass("set");
	}
	//show content
	$("#langSelect").hide();
	$("#langSelect").stop().fadeIn(200,function() {
		//scroller
		if(!isMobile.iOS() && androidVersion() < 4.4 && !isMobile.MSApp() && !isMobile.Windows() && !isMobile.FirefoxOS()) {
			$("#langSelect").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		} else {
			$("#langSelect").css("overflow","auto");	
		}
	});
	/////////////
	// handler //
	/////////////
	var blockTap = false;
	var blockTimer;
	$("#langSelect").scroll(function() {
		blockTap = true;
		clearTimeout(blockTimer);
		blockTimer = setTimeout(function() { blockTap = false; },150);
	});
	//FLOOD PROTECTION
	clearTimeout(langSelectTap);	
	langSelectTap = setTimeout(function() {
		$("#langSelect li").on(tap,function(evt) {
			if(blockTap == true) { return; }
			if($(this).attr("id") == "setAuto") {
				window.localStorage.removeItem("devSetLang");
			} else {
				window.localStorage.setItem("devSetLang",$(this).attr("id").replace("set",""));
			}
			//remark
			$(".set").removeClass("set");
			$(this).addClass("set");
			//////////////
			// fade out //
			//////////////
			$("#langSelect").stop().fadeOut(200,function() {
				setTimeout(function() {
				$("body").removeClass("appLang-" + lang);
				if(window.localStorage.getItem("devSetLang")) {
					lang = window.localStorage.getItem("devSetLang");
				} else {
					lang = defaultLang;	
				}
				$("body").addClass("appLang-" + lang);
				if(lang != "en" && lang != "pt") { 
					LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
				}
				$("#tab1").html(LANG.MENU_STATUS[lang]);
				$("#tab2").html(LANG.MENU_DIARY[lang]);
				$("#tab3").html(LANG.MENU_PROFILE[lang]);
				$("#tab4").html(LANG.MENU_SETTINGS[lang]);
				appFooter(window.localStorage.getItem("app_last_tab"),0);
				//start date
				$("#cssStartDate").html("#startDateSpan:before { content: '" + LANG.START_DATE[lang] + "'; }");
				//page title
				$("title").html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
				//heading sum
				updateEntriesSum();
				//remove
				//$("#langSelect").remove();
				//refresh intro
				if(opt == "intro") {
					$("#slide1 p").html(LANG.INTRO_SLIDE_1[lang].split(".").join(". "));
					$("#slide2 p").html(LANG.INTRO_SLIDE_2[lang].split(".").join(". "));
					$("#slide3 p").html(LANG.INTRO_SLIDE_3[lang].split(".").join(". "));
					$("#slide4 p").html(LANG.INTRO_SLIDE_4[lang].split(".").join(". "));
					$("#slide5 p").html(LANG.INTRO_SLIDE_5[lang].split(".").join(". "));
					$("#slide6 p").html(LANG.INTRO_SLIDE_6[lang].split(".").join(". "));
					$("#closeDiv").html(LANG.CLOSE_INTRO[lang]);
					$("#appLang").html(LANG.LANGUAGE_NAME[lang]);
					$("#skipIntro").html(LANG.SKIP[lang]);
					//showIntro();
				}
				},80);
			});
			//enforce
			setTimeout(function() { $("#langSelect").remove(); },600);
		});
	},450);
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer() {
	if(!isMobile.iOS() && !isMobile.Windows() && !isMobile.MSApp() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
		$("#appContent").getNiceScroll().resize();
		$("#foodList").getNiceScroll().resize();
		$("#appHelper").getNiceScroll().resize();
		$("#appSubHelper").getNiceScroll().resize();
		$("#newWindow").getNiceScroll().resize();
	}
}
//#/////////////#//
//# APP RESIZER #//
//#/////////////#//
function appResizer(time) {
	setTimeout(function() {
		$('body').height(window.innerHeight);
		//unlock top white gap
		$('body').trigger("touchmove");
		//NO < 0
		var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height());
		//force scrolling ios
		if(isMobile.iOS()) { wrapperMinH = wrapperMinH + 1; }
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",wrapperMinH + "px");
		$("#appHelper").height($("#appContent").height());
		$("#appSubHelper").height($("#appContent").height());
		//$('#foodList').css("min-height",$('#foodList').height() + "px");
		//$('#foodList').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#advancedMenuWrapper').height($('#appContent').height());
		$('#foodList,#pageSlideFood').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#tabMyItemsBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		//SCROLLBAR UPDATE	
		clearTimeout(niceTimer);
		niceTimer = setTimeout(niceResizer,20);
		//chrome v32 input width
		if(isDesktop() || isMobile.MSApp()) {
			$('#entryBody').width(window.innerWidth -58);
			$('#foodSearch').width(window.innerWidth -55);
			$("ul#addNewList input").width(window.innerWidth - 180);
		}
	 },time);
}
//////////////
// SANITIZE //
//////////////
function sanitize(str) {
	if(str != "") {
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
function getStoreUrl(button) {
	getAnalytics("rate");
	if(button == 1) {
             if(isMobile.iOS())       { window.open('https://itunes.apple.com/app/id732382802', '_system', 'location=yes');														}
		else if(isMobile.Android())   { window.open('market://details?id=com.cancian.mylivediet', '_system', 'location=yes');													}
		else if(isMobile.Windows())   { ref = window.open('http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e', '_blank', 'location=no');					}
		else if(isMobile.MSApp())     { Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri('ms-windows-store:REVIEW?PFN=27631189-ce9d-444e-a46b-31b8f294f14e'));	}
		else if(isMobile.FirefoxOS()) { ref = window.open('https://marketplace.firefox.com/app/kcals', '_system', 'location=yes');												}
		else if(isMobile.OSXApp())    { macgap.app.open("itunes://itunes.apple.com/app/id898749118");																			}
	}
}
var rateTimer;
function getRateDialog() {
	//appstore enabled
	if(!isMobile.iOS() && !isMobile.Android() && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS() && !isMobile.OSXApp()) { return; }
	//first use
	if(!window.localStorage.getItem("getRate")) {
		window.localStorage.setItem("getRate", new Date().getTime());
	}
	//return
	if(window.localStorage.getItem("getRate") == 'locked') { return; }
	///////////////
	// IF 1 WEEK //
	///////////////
	var timeRate = 3 * 24 * 60 * 60 * 1000;
	if((new Date().getTime()) - parseInt(window.localStorage.getItem("getRate")) > (timeRate)) {
		clearTimeout(rateTimer);
		rateTimer = setTimeout(function() {
			if(window.localStorage.getItem("getRate") == 'locked') { return; }
			//SHOW DIALOG
			if(isMobile.MSApp()) {
				var md = new Windows.UI.Popups.MessageDialog(LANG.RATE_MSG[lang], LANG.RATE_TITLE[lang]);
				md.commands.append(new Windows.UI.Popups.UICommand(LANG.RATE_IT[lang]));
				md.commands.append(new Windows.UI.Popups.UICommand(LANG.NO_THANKS[lang]));
				md.showAsync().then(function (command) { if(command.label == LANG.RATE_IT[lang]) { getStoreUrl(1); } if(command.label == LANG.NO_THANKS[lang]) { getStoreUrl(0); } });	
			} else if(isMobile.Cordova()) {
				navigator.notification.confirm(LANG.RATE_MSG[lang], getStoreUrl, LANG.RATE_TITLE[lang], [LANG.RATE_IT[lang],LANG.NO_THANKS[lang]]);
			} else {
				if(confirm(LANG.RATE_MSG[lang])) { getStoreUrl(1); } else { getStoreUrl(0); }
			}
			window.localStorage.setItem("getRate","locked");
		},3000);
	}
}
///////////////////
// GET ANALYTICS //
///////////////////
var trackString;
function getAnalytics(target) {
	if(typeof ga_storage === 'undefined')								{ return; }
	//not dev
	if(window.localStorage.getItem("config_debug")    == "active")		{ return; }
	if(window.localStorage.getItem("facebook_userid") == 1051211303)	{ return; }
	if((/192.168.1.5/).test(document.URL))								{ return; }
	if((/home/).test(document.URL))										{ return; }
	if((/www.cancian/).test(document.URL))								{ return; }
	//////////
	// INIT //
	//////////
	if(target == "init") {
		ga_storage._setAccount('UA-46450510-2');
	} else {
		////////////////
		// TRACK VARS //
		////////////////
		var deviceType = isDesktop() ? 'desktop' : 'mobile';
		var appOS      = vendorClass;
		if(isMobile.iOS())		{ appOS = "ios";       deviceType = 'mobile';  }
		if(isMobile.Android())	{ appOS = "android";   deviceType = 'mobile';  }
		if(isMobile.Windows())	{ appOS = "windows";   deviceType = 'mobile';  }
		if(isMobile.MSApp())	{ appOS = "msapp";     deviceType = 'desktop'; }
		if(isMobile.FirefoxOS()){ appOS = "firefoxos"; deviceType = 'mobile';  }
		if(isMobile.OSXApp())   { appOS = "osxapp";    deviceType = 'desktop'; }
		//string
		trackString = appOS + "." + deviceType + "/#" + target + "(" + appBuild + ")" + "(" + lang + ")";
		//track page/event
		ga_storage._trackPageview(trackString,appOS + " (" + lang + ")");
		ga_storage._trackEvent(appOS, target, lang, appBuild);
	}
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
		window.localStorage.removeItem("facebook_logged");
		window.localStorage.removeItem("facebook_userid");
		window.localStorage.removeItem("facebook_username");	
		$("body").removeClass("appFacebook");
		$("#appFooter").removeClass("appFacebook");
		$("#optionFacebook span").html(LANG.SETTINGS_BACKUP_INFO[lang]);
	}
}
/////////////////////////
// UPDATE LOGIN STATUS //
/////////////////////////
function updateLoginStatus(sync) {
	if(window.localStorage.getItem("facebook_logged") && window.localStorage.getItem("facebook_userid") && window.localStorage.getItem("facebook_username")) {
		$("body").addClass("appFacebook");
		$("#appFooter").addClass("appFacebook");
		$("#optionFacebook span").html(LANG.LOGGED_IN_AS[lang] + ' ' + window.localStorage.getItem("facebook_username"));
		if(sync == 1) { syncEntries(window.localStorage.getItem("facebook_userid")); }
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
			var keyValPairs  = responseData.split("&");
			for(var i = 0; i < keyValPairs.length; i++) {
				var splits = keyValPairs[i].split("=");
				switch (splits[0]) {
					case "access_token":
						access_token = splits[1];
						break;
					case "expires_in":
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
		$.get("https://graph.facebook.com/me?access_token=" + access_token,function(me) {
			if(me.id && me.name) {
				window.localStorage.setItem("facebook_logged",true);
				window.localStorage.setItem("facebook_userid",me.id);
				window.localStorage.setItem("facebook_username",me.name);
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
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
			if(typeof FB !== 'undefined' && typeof CDV !== 'undefined') {
				FB.init({ appId : '577673025616946', nativeInterface : CDV.FB, useCachedDialogs : false });
				FB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				}, { scope : "email" });
			}
		/////////
		// WP8 //
		/////////
		} else if (navigator.userAgent.match(/IEMobile/i)) {
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
		} else if(navigator.userAgent.match(/MSApp/i)) {
			if(Windows.Foundation) {
				var callbackURL = "https://www.facebook.com/connect/login_success.html";
				var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=" + encodeURIComponent(callbackURL);
				var startURI    = new Windows.Foundation.Uri(facebookURL);
				var endURI      = new Windows.Foundation.Uri(callbackURL);
				Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync('', startURI, endURI).then(getTokenFB, errorHandler);
			}
		////////////
		// OSXAPP //
		////////////			
		} else if(navigator.userAgent.match(/MacGap/i)) {
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
				pops=window.open('https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=http://kcals.net/redirect.php','pops','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no, width=480,height=320');
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
				}, { scope : "email" });
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

