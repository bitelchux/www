<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript">





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



function stripQuotes(str) {
str = str.substring(1);
var len = str.length;
str = str.substring(0,len-1);
return str;
}
  
  
  

function sanitize(str) {

//	var result = str.split("~").join("").split(" ").join(",").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split('_').join("").split('+').join("").split('$').join("").toLowerCase();
//	var searchQuery = str.split("~").join("").split(" ").join(",").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split('_').join("").split('+').join("").split('$').join("").toLowerCase();
if(str) {
	var result = str.split(" ").join("").split("’").join("").split("”").join("").split(">").join("").split("<").join("").split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("\\").join("").split("&").join("").split("â").join("a").split("ê").join("e").split("ô").join("o").split("ã").join("a").split("ç").join("c").split("á").join("a").split("é").join("e").split("í").join("i").split("ó").join("o").split("ú").join("u").split("à").join("a").split("õ").join("o").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").split(' ').join("").toLowerCase();
	return result
}
return '';
}


////////////////////////////
////////////////////////////
var dataLang;
$.get("sql/src/ibge-" + (window.location.hash).replace('#','') + ".txt", function(lata2) {
$.get("sql/src/list-" + (window.location.hash).replace('#','') + ".txt", function(lata) {
lata = lata;	
////////////////////////////
////////////////////////////
////////////////////////////


dataLang = lata.split("\n");

/////////////
$.get("sql/src/ibge_src.sql", function(data2) {
$.get("sql/src/list_src.sql", function(data) {
/////////////
data = data + "\n" + data2;

data = data.split('INSERT INTO "diary_food" VALUES(').join("").split(",'").join("','").split(",'").join("','").split("');").join("");

//data = data.split('~').join('');

	var foodDatabase = data.split("\n");
	var foodListArray = [];
	for(i = 0; i < foodDatabase.length; i++) {
		foodListArray.push(foodDatabase[i].split("','"));
		

	}
	
	



	var foodListBasic = "";
	var searchString  = "";
	var mix           = "";
	var tpl           = "";


	for(f = 0; f < foodListArray.length; f++) {

/*
if(foodListArray[f][3].match("Não se aplica")) {
	var preparo = "";
	
	} else {
	var preparo = ", " + trim(foodListArray[f][3]).toLowerCase();
	}
*/
		var ID   = "";
		var TYPE = "";
		var CODE = "";
		var NAME = "";
		var TERM = "";		
		var KCAL = ""; 
		var PRO  = "";
		var CAR  = "";
		var FAT  = "";
		var FIB  = "";
		var cName = "";

if(dataLang[f])  {
		cName = dataLang[f];

/*
		cName = cName.replace('15-lb','7kg');
		cName = cName.replace('10-20 lb','5-10kg');
		cName = cName.replace('10 lb','5kg');

		if((cName).indexOf('mph') !== -1) {
			

			
		var endPos = (cName).indexOf('mph');
		if(cName.indexOf('mile') !== -1) {
		var cName = cName.slice(0,endPos+3);
		}
		
		console.log(cName);

		var commaPos = cName.split(',');
		


		$.each(commaPos,function(i,cp) {
			if((cp).indexOf('mph') !== -1) {
			var theVal = trim(cp.split('mph').join('').split('>').join('').split('<').join(''));

			var valArray = theVal.split('-');
			
var totup = '';
var totuz = '';
var it = '';
		$.each(valArray,function(i,ca) {
			if(i > 0) { it = '-'; } else { it = ''; }
			
			var co  = (Math.round((parseFloat(ca)*1.6)*10))/10;

//			cName = cName.replace(ca,co);
			cName = cName.replace('mph','km/h');			
			
			totup = totup + it + ca;
			totuz = totuz + it + co;
			
		});
			cName = cName.replace(totup,totuz);
			console.log(totuz);

		//	var startPos = cp;
	//}
	//	});
		
		//		if((cName).indexOf(/,|<|>/i)
		//	var startPos = (cName).indexOf(/,|<|>/i);
		
		//var appReceipt      = Base64.decode(receipts.appStoreReceipt);
//		var originalDate    = appReceipt.slice((originalDatePos-32),(originalDatePos-13));
		//if(Date.parse(originalDate) > Date.UTC(2014,6,22)) {
	//console.log(startPos + ' - ' +endPos)		
			
		}});			
			
		}
	*/	
	cName = cName.split(' <').join(' < ');
	cName = cName.split('  <').join(' <');
	cName = cName.split('<  ').join('< ');
		ID   = foodListArray[f][1];
		TYPE = foodListArray[f][1];
		CODE = foodListArray[f][2];
		NAME = trim(cName);
		TERM = trim(sanitize(NAME));	
		KCAL = foodListArray[f][5]; 
		PRO  = foodListArray[f][6];
		CAR  = foodListArray[f][7];
		FAT  = foodListArray[f][8];
		FIB  = foodListArray[f][9];

//ESCAPE
if(NAME) { 
if(CODE) {
CODE = CODE.replace('x','00000'); 
}
NAME = NAME.split(' / ').join(''); 
NAME = NAME.split('\\').join(''); 
NAME = NAME.split(' \\').join(''); 
NAME = NAME.split('""').join('”'); 
NAME = NAME.split('  "').join('” ');
NAME = NAME.split(' "').join('” ');
NAME = NAME.split('""').join('”'); 
NAME = NAME.split('"').join('”');
NAME = NAME.split("''").join("'"); 
NAME = NAME.split("' ").join('’');
NAME = NAME.split("'").join('’');
}
//EOL
if(FIB)	 { FIB = trim(FIB); }	
	
/*
		var ID   = f;//foodListArray[f][0];
		var CODE = trim(foodListArray[f][0] + foodListArray[f][2]);
		var NAME = trim(foodListArray[f][1]).split("'").join("''") + preparo;
		var KCAL = trim(foodListArray[f][4]).split("-").join("0.00");
		var PRO  = trim(foodListArray[f][5]).split("-").join("0.00");
		var CAR  = trim(foodListArray[f][7]).split("-").join("0.00");
		var FAT  = trim(foodListArray[f][6]).split("-").join("0.00");
		var FIB  = trim(foodListArray[f][8]).split("-").join("0.00");
*/
	
		//6300706^Canjiquinha de milho em grão^14^Mingau^62.95^1.24^0.31^13.50^0.67
		
		//var SEARCH = sanitize(NAME);

		
//		CREATE TABLE "diary_food"(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code TEXT,name TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);


//ID = ID.substring(1);
//ID = ID.substring(0,ID.length-1);

//DESC = DESC.substring(1);
//DESC = DESC.substring(0,DESC.length-1);
		//tpl = "<div>INSERT INTO \"diary_food\" VALUES(" + ID + ",'" + TYPE + "','" + CODE + "','" + NAME + "','" + TERM + "','" + KCAL + "','" + PRO + "','" + CAR + "','" + FAT + "','" + FIB + "');</div>";

		//tpl = "<div>" + NAME + "</div>";
		//tpl = '<div>INSERT INTO "diary_food" VALUES(' + ID + ',"' + TYPE + '","' + CODE + '","' + NAME + '","' + TERM + '","' + KCAL + '","' + PRO + '","' + CAR + '","' + FAT + '","' + FIB + '");</div>';
		tpl = '<div>lib2.insert("diary_food", {"id":"' + CODE + '", "type":"' + TYPE + '","code":"' + CODE + '","name":"' + NAME + '","term":"' + TERM + '","kcal":"' + KCAL + '","pro":"' + PRO + '","car":"' + CAR + '","fat":"' + FAT + '","fib":"' + FIB + '"});</div>';
if(NAME) {
		mix += tpl;
}


	}}

//DROP TABLE IF EXISTS 'diary_food';
//CREATE TABLE 'diary_food'(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code TEXT,name TEXT,term TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);
//INSERT INTO "diary_food" VALUES(0,'food','01001','Manteiga, salgada','manteigasalgada','717','0.85','0.06','81.11','0.00');


//alert('mi');

/*
mix = mix.split('<div>lib2.insert("diary_food", {"id":"').join('<div>INSERT INTO \"diary_food\" VALUES("');
mix = mix.split('"type":').join(' ');
mix = mix.split('"code":').join(' ');
mix = mix.split('"name":').join(' ');
mix = mix.split('"term":').join(' ');
//mix = mix.split('"kcal":').join(' ');
//mix = mix.split('"pro":').join(' ');
//mix = mix.split('"car":').join(' ');
//mix = mix.split('"fat":').join(' ');
//mix = mix.split('"fib":').join(' ');
mix = mix.split('});').join(');');
//INSERT INTO "diary_food" VALUES("268", "type":"food","code":"02044","name":"الريحان الطازجة","term":"الريحانالطازجة","kcal":"23","pro":"3.15","car":"2.65","fat":"0.64","fib":"1.60"});
*/

$('#list').html(mix);

});
});
});
});
/*
## SR26 ##
0 full description
1 NDB_No
2 Shrt_Desc
3 Water_(g)
4 Energ_Kcal
5 Protein_(g)
6 Lipid_Tot_(g)
7 Ash_(g)
8 Carbohydrt_(g)
9 Fiber_TD_(g)
10 Sugar_Tot_(g)
Calcium_(mg)
Iron_(mg)
Magnesium_(mg)
Phosphorus_(mg)
Potassium_(mg)
Sodium_(mg)
Zinc_(mg)
Copper_mg)
Manganese_(mg)
Selenium_(µg)
Vit_C_(mg)
Thiamin_(mg)
Riboflavin_(mg)
Niacin_(mg)
Panto_Acid_mg)
Vit_B6_(mg)
Folate_Tot_(µg)
Folic_Acid_(µg)
Food_Folate_(µg)
Folate_DFE_(µg)
Choline_Tot_ (mg)
Vit_B12_(µg)
Vit_A_IU
Vit_A_RAE
Retinol_(µg)
Alpha_Carot_(µg)
Beta_Carot_(µg)
Beta_Crypt_(µg)
Lycopene_(µg)
Lut+Zea_ (µg)
Vit_E_(mg)
Vit_D_µg
ViVit_D_IU
Vit_K_*(µg)
FA_Sat_(g)
FA_Mono_(g)
FA_Poly_(g)
Cholestrl_(mg)
GmWt_1
GmWt_Desc1
GmWt_2
GmWt_Desc2
Refuse_Pct
*/




/*
				
		foodListBasic += "<div>\
		<span class='foodName'>" + name + "</span>\
		<span class='foodKcal'>" + kcal + "</span>\
		<span class='foodPro'>" + pro + "</span>\
		<span class='foodFat'>" + fat + "</span>\
		<span class='foodCar'>" + car + "</span>\
		<span class='foodFib'>" + fib + "</span>\
		</div>";
		*/
	

//
//}


/*
/////////////
// ARRAY 2 //
/////////////
$.get("list2.txt", function(data2) {
	var foodDatabase2 = data2.split("\n");
	var foodListArray2 = [];

	for(i = 0; i < foodDatabase2.length; i++) {
		foodListArray2.push(foodDatabase2[i].split("|"));
	}
	
	var foodListBasic2 = "";
	var searchString2  = "";

	for(f = 0; f < foodListArray2.length; f++) {


		var ZZ_PK                 = foodListArray2[f][0];
		var ZZ_ENT                = foodListArray2[f][1];
		var ZZ_OPT                = foodListArray2[f][2];
		var ZZCARBOHYDRATE        = foodListArray2[f][3];
		var ZZDIETARYFIBER        = foodListArray2[f][4];
		var ZZFAT                 = foodListArray2[f][5];
		var ZZKJ                  = foodListArray2[f][6];
		var ZZKCAL                = foodListArray2[f][7];
		var ZZPROTEIN             = foodListArray2[f][8];
		var ZZSALT                = foodListArray2[f][9];
		var ZZSATURATEDFAT        = foodListArray2[f][10];
		var ZZSUGAR               = foodListArray2[f][11];
		var ZZCARBOHYDRATEMEASURE = foodListArray2[f][12];
		var ZZDIETARYFIBERMEASURE = foodListArray2[f][13];
		var ZZFATMEASURE          = foodListArray2[f][14];
		var ZZKJMEASURE           = foodListArray2[f][15];
		var ZZKCALMEASURE         = foodListArray2[f][16];
		var ZZPROTEINMEASURE      = foodListArray2[f][17];
		var ZZSALTMEASURE         = foodListArray2[f][18];
		var ZZSATURATEDFATMEASURE = foodListArray2[f][19];
		var ZZSUGARMEASURE        = foodListArray2[f][20];

	}
	
var mix = "";
var tpl = "";


for(c = 0; c < foodListArray.length; c++) {

// ZPRODUCTNAME ZMANUFACTURERNAME ZZKCAL ZSERVING ZZPROTEIN ZZCARBOHYDRATE ZZFAT ZZSUGAR ZZSATURATEDFAT

tpl  = "<div>" + foodListArray[c][15] + "^" + foodListArray[c][13] + "^" + foodListArray2[c][7]  + "^" + foodListArray[c][5] + "^" + foodListArray2[c][8] + "^" + foodListArray2[c][3] + "^" + foodListArray2[c][5] + "^" + foodListArray2[c][11] + "^" + foodListArray2[c][10] + "</div>";

mix += tpl;

// + " > " + foodListArray[f][15];  + " < " + foodListArray2[0][c];

}




});
*/

</script>

<div id="list">....</div>



<script>

$('#list').on('dblclick',function() {
	window.location.reload(true);	
});
</script>