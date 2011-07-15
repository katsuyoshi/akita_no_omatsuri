// JavaScript Document
// Created by K.Musaka
// 2011/5/3 Updated by S.Taguchi
// 2011/7/10 固定マーカー表示クラスStaticMarkerに対応。　by S.Taguchi

var mapInstance;
var directionsDisplay = null;	// Jun17 S.taguchi ルート表示用オブジェクト
var directionsService = null;	// Jun17 S.taguchi ルート表示用オブジェクト

//var jsonFile = "/omatsuri/kakunodate/locations.json";

/* 伊藤さんがサーバの開発をheroku.comで行なっており、データ取得がクロスドメインになるため
一時JSONPを使いました。2011/5/3 S.Taguchi
*/
// 2011/7/13 S.Taguchi
var baseURL = "http://hikiyama-map.heroku.com";
var eventId = 13;	// 竿燈サンプル用イベント

//6/30デモ用
//var jsonFile = "http://hikiyama-map.heroku.com/omatsuri/id:13/locations.json?jsoncallback=?";
var jsonFile = "http://hikiyama-map.heroku.com/omatsuri/id:" + eventId + "/locations.json?jsoncallback=?";

//6/30デモ用　秋田市役所
var clat = 39.720008;	//初期表示緯度
var clong = 140.102564;	//初期表示経度
var mapZoom = 15;	//初期表示縮尺

//var clat = 39.59929722;	//初期表示緯度
//var clong = 140.56142532;	//初期表示経度
//var mapZoom = 15;	//初期表示縮尺

var rntime = 20;	//自動更新間隔（秒）
var swLat = 0;
var swLng = 0;
var neLat = 0;
var neLng = 0;
var mylat = 0;
var mylng = 0;

var ini = 0;	//初期化

/**/
//var defOld = "/omatsuri/kakunodate/sugazawa/icon/sugazawa/";
//var defIcon = "/omatsuri/kakunodate/";
//6/30デモ用
//var defIcon = "http://hikiyama-map.heroku.com/events/12/roles/33/icon/0/";
var defIcon = baseURL + "/events/" + eventId + "/roles/";	// 2011/7/13 S.Taguchi
var code2idTbl = {};	// 役割のcodeからidへの変換テーブル　2011/7/14 S.Taguchi
//var code2idTbl = {tepoucho:38, minamidori:39, bishamoncho:40};	// 役割のcodeからidへの変換テーブル　2011/7/14 S.Taguchi


// 2011/6/22 K.Musaka　修正
/*
var marker_list;
var old_marker_list;
*/
//追加 2011/6/23
var hArray = new Array();		//曳山全ての情報（2次元配列）
var markerArray = new Array();	//markerオブジェクト配列
//var infoArray = new Array();
var currentInfoWindow;
//
var nowPosMarker;
var centerMode = false;	// true：現在地が動いたら中心も移動。2011/5/3 S.Taguchi 値を true/falseに変更。

var posData = new Array();

//追加
var LatArray = new Array();
var LngArray = new Array();
//




/*
jsonファイルを取得して、二次元配列にして戻り値に返す

*/
function getMarkerLocation2(){
	iniFlg = 0;
	strOption = "";

	$.getJSON(jsonFile, {}, function(json, status) {
		//alert("location status[" + status + "]");
		var lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons,summary,tswk;
		var hlArray = new Array();	//曳山1台分の情報
		hArray = [];

		for (i=0;i<json.length;i++){
			if(json[i].location){
				lat = json[i].location.latitude;
				lng = json[i].location.longitude;
				ho_a =  json[i].location.horizontal_accuracy;
				hid = json[i].code;
				h_name = json[i].name;
				head_a = json[i].location.heading_accuracy;
				tswk =  json[i].location.timestamp;
				tswk.match(/.*T(.*)\+.*/);
				ts = RegExp.$1;
				id =  json[i].location.id;
				heading =  json[i].location.heading;
				icons = json[i].icons[0];
				summary = json[i].summary;

				hlArray = [lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons,summary];
				hArray.push(hlArray);
			}
		}
		//debug from	
/*
		str = "";
		for (i=0;i<hArray.length;i++){
			str += i + ":" + hArray[i][3] + "\n"; 
		}
		alert("hArrayの個数=" + hArray.length + "\n" + str );	
*/
		//debug to	
//		初期処理
		// マーカーを作成 
		$.each(hArray, function(i){
			var latlng = new google.maps.LatLng(this[0], this[1]); 
			var mUrl = makeIconURL(defIcon,this[3],this[2],this[9]);
			var mSize = new google.maps.Size(40, 40);
			var mOrigin = new google.maps.Point(0,0);
			var mAnchor = new google.maps.Point(20,20);
			var mScaleSize = new google.maps.Size(40, 40);

			// var mIcon = new google.maps.MarkerImage(mUrl,mSize,mOrigin,mAnchor,mScaleSize);
			var mIcon = new google.maps.MarkerImage(mUrl);	// 2011/7/14 S.Taguchi

			if(markerArray.length != 0){
				idx = getMarkerArray(this[3]);
			}else{
				idx = -2;
			}
//			infoIdx = idx;
			if(idx >= 0){
/*
				markerArray[idx] = new google.maps.Marker({ 
					position: latlng, 
					icon: mIcon,
					map: mapInstance, 
					title: this[3] 
				});
*/
				markerArray[idx].setOptions({
					position: latlng, 
					icon: mIcon,
					title: this[3] 
				});
			}else{
				markerArray.push(new google.maps.Marker({ 
					position: latlng, 
					icon: mIcon,
					map: mapInstance, 
					title: this[3] 
				}));
				idx = markerArray.length - 1;
			}

			//情報ウインドウの表示
			con =	"<b>" + this[8] + "</b><br />" +
				//	Jun17 S.Taguchi ルート表示メニュー追加に伴い修正。
					"<div style='text-align:center;'>" + this[10] +
					"<a href='javascript:routeDisplay(" + this[0] + ", " + this[1] + ")'>ルート表示</a>" + "</div>" +
				//	"位置計測時刻：" + ts + "<br />" +		//hh:mm
//					"現在時刻：" + nowTime() + "<br />" +		//hh:mm
					"";

			setInfoWindow(markerArray[idx],con);

			if(iniFlg==0){
				swLat = this[0];
				swLng = this[1];
				neLat = this[0];
				neLng = this[1];
				iniFlg = 1;
			}else{
				if(this[0] < swLat){
					swLat = this[0];
				}
				if(this[1] < swLng){
					swLng = this[1];
				}
				if(this[0] > neLat){
					neLat = this[0];
				}
				if(this[1] > neLng){
					neLng = this[1];
				}
			}
			strOption += '<option value="' + this[0] + ',' + this[1] + '">' + this[8] + '</option>';
		});

		if (ini==0){
			fitMap();
			ini = 1;
		}
		
		$("#slIt").html('<select id="fllist">' + strOption + '</select>');

		//使われていないMarkerArrayを削除
		var MaLen = 0; 
		$.each(markerArray,function(i){
			hLen = hArray.length;
			exFlg = false;
			mTitle = this.getTitle();
			for(j=0;j<hLen;j++){
				if(hArray[j][3] == mTitle){
					exFlg = true;
				}
			}
			if(!exFlg){
//				infoArray[i].close();
				this.setMap(null);
				markerArray[i].splice(i,1);
//				infoArray[i].splice(i,1);
			}
		});
		
		
//			$.each(markerArray, function(){
//				this.setMap(mapInstance);
//			});

//		alert(markerArray.length);
	});
}

//曳山ID（code）から、配列の位置を返す
function getMarkerArray(hid){
	var v = -1;
	$.each(markerArray, function(i){
		mTitle = this.getTitle();
		if(mTitle == hid){
			v = i;
		}
	});
	return v;
}

function setInfoWindow(marker,con){
	var infoWndOpts = {
		content : con
	};

	//以前のイベントリスナを削除
	google.maps.event.clearListeners(marker, "click", function(){});

	var infoWnd = new google.maps.InfoWindow(infoWndOpts);
	google.maps.event.addListener(marker, "click", function(){

	//先に開いた情報ウィンドウがあれば、closeする
/* 2011/7/10 S.Taguchi 固定マーカーを含めてcloseするように変更。
	if (currentInfoWindow) {
		currentInfoWindow.close();
	}*/
	closeInfoWindow();

	//情報ウィンドウを開く
		infoWnd.open(mapInstance, marker);
	//開いた情報ウィンドウを記録しておく
		currentInfoWindow = infoWnd;
	});



/*

	if(idx >= 0){
//		alert(info.getContent());
//		infoArray[idx].setOptions({
//			content: con
//		});
	}else{
		infoArray.push(
			new google.maps.InfoWindow({
				content: con
			})
		);

		google.maps.event.addListener(marker, 'click', function(event) {
			infoArray[infoArray.length-1].open(mapInstance, marker);
		});
	}
	
*/	
}

//2011.06.24廃止　K.Musaka
//function getMarkerLocation(){
//	$.getJSON(jsonFile, {}, function(data) {
//		setMarker(data);
//	});
/* heroku.comのサーバからデータをJSONPで取得する場合の記述 2011/5/3 S.Taguchi
	var dataURL = "http://hikiyama-map.heroku.com/omatsuri/" +
				OmatsuriId + "/" + YamaNameAr[i] + "/locations/" + 
				QueryStrs.sd + "/" + QueryStrs.ed + ".json" + "?jsoncallback=?";
*/
//}


//2011.06.24廃止　K.Musaka
/*
function setMarker(json){
	iniFlg = 0;
	strOption = "";
	
	for (i=0;i<json.length;i++){
		if(json[i].location){
			lat = json[i].location.latitude;
			lng = json[i].location.longitude;
			ho_a =  json[i].location.horizontal_accuracy;
//			hid = json[i].location.hikiyama_id;
			hid = json[i].code;
//			h_name = json[i].location.hikiyama_name;
			h_name = json[i].name;
			head_a = json[i].location.heading_accuracy;
			var tswk =  json[i].location.timestamp;

*/

//この行だけ別にコメントアウト			tswk.match(/.*T(.*)\+.*/);

/*
			ts = RegExp.$1;
			id =  json[i].location.id;
			heading =  json[i].location.heading;
			icons = json[i].icons[0];
			summary = json[i].summary;
			
			if(iniFlg==0){
				swLat = lat;
				swLng = lng;
				neLat = lat;
				neLng = lng;
				iniFlg = 1;
			}else{
				if(lat < swLat){
					swLat = lat;
				}
				if(lng < swLng){
					swLng = lng;
				}
				if(lat > neLat){
					neLat = lat;
				}
				if(lng > neLng){
					neLng = lng;
				}
			}
			addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons);	
			strOption += '<option value="' + lat + ',' + lng + '">' + h_name + '</option>';
		}
	}
	
	if (ini==0){
		fitMap();
		ini = 1;
	}
	
//	$("#slIt").html('<select id="fllist"><option value="">◆中心に移動</option>' + strOption + '</select>');
	$("#slIt").html('<select id="fllist">' + strOption + '</select>');

}
*/


function nowTime(){
	var now = new Date();
	var hour = now.getHours(); 		// 時
	var minu = now.getMinutes();	// 分
	var sec = now.getSeconds();		// 秒
	
	if(hour < 10) { hour = "0" + hour; }
	if(minu < 10) { minu = "0" + minu; }
	if(sec < 10) { sec = "0" + sec; }
	
	var w1 = hour + ':' + minu + ':' + sec; 
	return w1;
}



function makeIconURL(def,hid,heading,icons){
//		url = def + hid + "/icon/" + icons + "/" +  Math.floor(heading); 

//heroku 6/30デモ用仮　headingしか反映しない
//		url = def + Math.floor(heading); 

		//url = def + hid + "/icon/0/"; 	// 竿燈用
		url = def + code2idTbl[hid] + "/icon/0/"; 	// 竿燈用 codeからidに変換をする。 2011/7/14 S.Taguchi

/*
/events/:event_id/roles/:role_id/icon/:icon_idx_or_name/:deg
:event_id イベントのid
:role_id 役割のid
:icon_idx_or_name アイコンのインデックスまたはファイル名
:deg 画像の回転角度(degree) 

*/
	return(url);
}

//2011.06.24廃止　K.Musaka
/*
function addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons){
	var mUrl = makeIconURL(defIcon,hid,heading,icons);
	var mSize = new google.maps.Size(40, 40);
	var mOrigin = new google.maps.Point(0,0);
	var mAnchor = new google.maps.Point(20,20);
	var mScaleSize = new google.maps.Size(40, 40);
	
	var mIcon = new google.maps.MarkerImage(mUrl,mSize,mOrigin,mAnchor,mScaleSize); 	
	
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat,lng),
		icon: mIcon,
		map: mapInstance, 
		title:  h_name
	});

// 2011/6/22 K.Musaka　修正
	
//    marker_list.push(marker);

	
	var infoOpts = {
		content :
					"<b>" + h_name + "</b><br />" +
		 		//	Jun17 S.Taguchi ルート表示メニュー追加に伴い修正。
					"<div style='text-align:center;'>" + summary +
		 			"<a href='javascript:routeDisplay(" + lat + ", " + lng + ")'>ルート表示</a>" + "</div>" +
		 		//	"位置計測時刻：" + ts + "<br />" +		//hh:mm
					""
	};
	
	var info = new google.maps.InfoWindow(infoOpts);
	google.maps.event.addListener(marker,"click",function(){
		info.open(mapInstance,marker);
	});

}
*/
//全ての曳山を含む範囲を表示
function fitMap(){
	var southWest = new google.maps.LatLng(swLat,swLng);
	var northEast = new google.maps.LatLng(neLat,neLng);
	var bounds = new google.maps.LatLngBounds(southWest,northEast);
	
	mapInstance.fitBounds(bounds);
}

//任意の座標を全て含む範囲を表示
// 2011/5/10 K.Musaka　追加
function fitAllCoordinates(LatA,LngA){

	var swLatA = LatA[0];
	var swLngA = LngA[0];
	var neLatA = LatA[0];
	var neLngA = LngA[0];

	
	for (i=1;i<LatA.length;i++){
		if(LatA[i] < swLatA){
			swLatA = LatA[i];
		}
		if(LngA[i] < swLngA){
			swLngA = LngA[i];
		}
		if(LatA[i] > neLatA){
			neLatA = LatA[i];
		}
		if(LngA[i] > neLngA){
			neLngA = LngA[i];
		}
	}
/*debug from*/
/*
	$("#debug").html("現在地：" + mylat + "," + mylng + "<br />" +
					 "目的地：" + LatA[1] + "," + LngA[1] + "<br />" +
					 "南西：" + swLatA + "," + swLngA + "<br />" +
					 "北東：" + neLatA + "," + neLngA
					 );
*/
/*debug to*/

	var southWest = new google.maps.LatLng(swLatA,swLngA);
	var northEast = new google.maps.LatLng(neLatA,neLngA);
	var bounds = new google.maps.LatLngBounds(southWest,northEast);
	
	mapInstance.fitBounds(bounds);

}

//2011.06.24廃止　K.Musaka
/*
function deleteAllMarker(mList){
	mlLength = mList.getLength();
	
	mList.forEach(function(marker, idx) {
		marker.setMap(null);
	});
}
*/

//2011.6.23新規作成　K.Musaka
function deleteAllMarker2(){
//マーカーオブジェクトの削除
	$.each(markerArray, function(){
		this.setMap(null);
	});
//マーカーオブジェクト配列の初期化
	markerArray = [];
}

//2011.6.23廃止
/*
function popMVCList(mList){
	mlLength = mList.getLength();
 	for(i=0;i<mlLength;i++){
		mList.pop();
	}
}
*/


function makeMyPos(lat,lng,acc){
	mylat = lat;
	mylng = lng;
/*debug from*/
//	$("#debug").html(mylat + "," + mylng);
	
/*debug to*/

//
// 2011/5/10 K.Musaka 修正
	if((mylat==0)&&(mylng==0)){
		return;
	}
//ここまで
	
	var mUrl = "./images/man.png";
	var mSize = new google.maps.Size(32, 32);
	var mOrigin = new google.maps.Point(0, 0);
	var mAnchor = new google.maps.Point(16, 32);
	var mScaleSize = new google.maps.Size(32, 32);
	var mIcon = new google.maps.MarkerImage(mUrl,mSize,mOrigin,mAnchor,mScaleSize);
	if(nowPosMarker){
		nowPosMarker.setMap(null);
	}
	
	var posNow = new google.maps.LatLng(lat, lng);
	
	nowPosMarker = new google.maps.Marker({
		position: posNow,
		icon: mIcon,
		map: mapInstance,
		title: '現在位置'
	});
	
	if(centerMode==true){
		setCenter(mylat,mylng);
	}
}



function setCenter(lat,lng){
/* 追加　K.Musaka　*/
	if((mylat==0)&&(mylng==0)){
		return false;
	}
/*　ここまで　*/
	var posNow = new google.maps.LatLng(lat, lng);
	mapInstance.setCenter(posNow);
	
}




google.maps.event.addDomListener(window, 'load', getRoles);



// サーバから「役割一覧」を得、役割のcodeからidへの変換テーブル(code2idTbl)に設定する。
// ※非同期処理なので他の処理とのタイミングに注意※
// 2011/7/13 S.Taguchi
function getRoles() {
	var rolesFile = baseURL + "/events/" + eventId + "/roles.json?jsoncallback=?";
	
	$.getJSON(rolesFile, {}, function(rolesData, status) {
		//alert("roles status[" + status + "]");
		for (var i=0; i<rolesData.length; i++) {
			with(rolesData[i].role) {
				code2idTbl[code] = id;
			}
		}
		onLoadProc();
	});
}



//google.maps.event.addDomListener(window, 'load', function() {
function onLoadProc() {
	$("#ctlBox").hide();
	var mapdiv = document.getElementById('mymap');
	var hMa = new Array();

	
	//初期Map表示
	var myOptions = {
		zoom: mapZoom,
		center: new google.maps.LatLng(clat, clong),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true
	};
	mapInstance = new google.maps.Map(mapdiv, myOptions);

	directionsDisplay = new google.maps.DirectionsRenderer();	// Jun17 S.taguchi
	directionsDisplay.setMap(mapInstance);						// Jun17 S.taguchi
	directionsService = new google.maps.DirectionsService();	// Jun17 S.taguchi

	// 2011/7/10 S.Taguchi 固定マーカーの情報を追加。
	SMap = new StaticMarker(mapInstance, closeInfoWindow);
	SMap.createMarkers(MarkerInfos);	// MakerInfosは、固定マーカーの情報を定義したファイル中の変数名。



// 2011/6/22 K.Musaka　修正
/*	
	//MVC配列の生成
    marker_list = new google.maps.MVCArray();
*/
	//イベントリスナ
	$("#ctlForm").submit(function(e){
		return false;
	});
	$("#img_menu").click(function(e){
		openCtlBox();
	});
	
	// Refresh
	$("#bt_renew").click(function(e){
// 2011/6/22 K.Musaka　修正
/*
		old_marker_list = marker_list;
		popMVCList(marker_list);
		getMarkerLocation();
		deleteAllMarker(old_marker_list);
*/
//		deleteAllMarker2();
		getMarkerLocation2();

		closeCtlBox();
	});
	
	
	// NaviMode
	// NaviモードのOn/Offでボタンの表示を切り替える。2011/5/3 S.Taguchi
	$("#bt_navi").click(function(e){
		if (centerMode) {	// On -> Off
			$("#bt_navi").css("background-image", "url(images/navimodeoff.png)");
		}
		else {				// Off -> On
			setCenter(mylat,mylng);
			$("#bt_navi").css("background-image", "url(images/navimode.png)");
		}
		closeCtlBox();
		centerMode = !centerMode;
	});
	
	
	$("#img_navimode").hover(
		function(){
			if (centerMode) {
				$("#bt_navi").css("background-image", "url(images/hovernavimode.png)");
			}
			else {
				$("#bt_navi").css("background-image", "url(images/hovernavimodeoff.png)");
			}
		},
		function(){
			if (centerMode) {
				$("#bt_navi").css("background-image", "url(images/navimode.png)");
			}
			else {
				$("#bt_navi").css("background-image", "url(images/navimodeoff.png)");
			}
		}
	);
	
	
	$("#slIt").change(function(e){
		str = $("#fllist").val();
		if (str != ""){
			var resArray = str.split(","); 

//
// 2011/5/10 K.Musaka　修正
//			setCenter(resArray[0],resArray[1]);

			if((mylat==0)&&(mylng==0)){
				setCenter(resArray[0],resArray[1]);
			}else{
				LatArray.length = 1;
				LngArray.length = 1;
				
				LatArray[0] = mylat;
				LngArray[0] = mylng;
				LatArray[1] = resArray[0];
				LngArray[1] = resArray[1];
				fitAllCoordinates(LatArray,LngArray);
			}
//ここまで			
		}
		closeCtlBox();
	});
	
	
	// View All
	$("#bt_moveEvent").click(function(e){
		// 2011/2/18 S.Taguchi Added.
		ini = 0;
	//2011.6.27 K.Musaka
	//	getMarkerLocation();
		getMarkerLocation2();
//		fitMap();
		closeCtlBox();
	});
	
	
	// Help
/*	$("#help_navi").click(function(e){
		str = "ナビモードがONにすれば、常に現在位置を中心にして地図を表示します。\nただし現在位置が正常に取得できないときは変化しません。";
		alert(str);
	});
	
	
	$("#help_renew").click(function(e){
		str = "新しい曳山の位置を取得して、地図を更新することができます。\n通常は" + rntime + "秒ごとに地図を更新します。";
		alert(str);
	});
*/
	
	var myPosition = new myPos();
	var opts = {
		callback:makeMyPos
	};
	myPosition.getPosition(opts);
	
	//曳山マーカーの生成
//	getMarkerLocation();

//追加
	getMarkerLocation2();



	//60秒ごとに再読み込み
	reloadInterval = setInterval(function(){
// 2011/6/22 K.Musaka　修正
/*
//			old_marker_list = marker_list;
//			popMVCList(marker_list);
//			getMarkerLocation();
//			deleteAllMarker(old_marker_list);
*/
//追加
//			deleteAllMarker2();
			getMarkerLocation2();
//
	},rntime*1000);


	google.maps.event.addDomListener(
		mapInstance,
		'click',
		function() {
			closeCtlBox();
		}
	);
}



// コントロールパネルのopen
function openCtlBox() {
	$("#ctlBox").show();
	$("#ctlBox").css("bottom", 0);
	$("#menuBox").hide();
}


// コントロールパネルのclose
function closeCtlBox() {
	$("#ctlBox").hide();
	$("#menuBox").show();
	$("#ctlBox").css("bottom", -100);
}






// Jun17 S.Taguchi
// 現在の自分の位置から引数で指定された座標までのルートを表示する関数。
function routeDisplay(lat, lng) {
	// 自分の位置がわからない場合 nowPosMarkerは生成されていない。@@@
	//alert("nowPosMarker[" + nowPosMarker + "]");
	var myPosition = nowPosMarker.getPosition();	// nowPosMarkerは自分を示す人型のMarker
//	var myPosition = new google.maps.LatLng(39.593572, 140.563136);
//6/30デモ用
//秋田駅
//	var myPosition = new google.maps.LatLng(39.716845, 140.129743);



    var request = {
    	origin:myPosition,	// 現在の自分の位置
    	destination:new google.maps.LatLng(lat, lng),			// 選択された曳山や、トイレなどの位置
		travelMode: google.maps.DirectionsTravelMode.WALKING
    };
	directionsService.route(request, directionsCallback);

//2011.6.25 K.Musaka 追加
	//先に開いた情報ウィンドウがあれば、closeする
/* 2011/7/10 S.Taguchi 固定マーカーを含めてcloseするように変更。
	if (currentInfoWindow) {
		currentInfoWindow.close();
	}*/
	closeInfoWindow();
//
}



// 2011/7/10 S.taguchi
// 曳山など移動するマーカーと、トイレなど固定マーカーの両方の情報ウィンドウをcloseする。
function closeInfoWindow() {
	// 曳山など移動するマーカーの情報ウィンドウのclose
	if (currentInfoWindow) {
		currentInfoWindow.close();
	}
	// 固定マーカーの情報ウィンドウのclose
	SMap.closeStaticInfoWindow();
}



// Jun17 S.Taguchi
function directionsCallback(result, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(result);
	}
}

