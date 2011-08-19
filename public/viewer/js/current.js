// JavaScript Document

var mapInstance;
//var jsonFile = "/omatsuri/kakunodate/locations.json";
var jsonFile = "http://hikiyama-map.heroku.com/omatsuri/id:14/locations.json?jsoncallback=?";

var clat = 39.59929722;//初期表示緯度
var clong = 140.56142532;//初期表示経度
var mapZoom = 15;//初期表示縮尺
var rntime = 60;//自動更新間隔（秒）

var swLat = 0;
var swLng = 0;
var neLat = 0;
var neLng = 0;

var mylat = 0;
var mylng = 0;

var ini = 0;	//初期化

/**/
var defOld = "/omatsuri/kakunodate/sugazawa/icon/sugazawa/";

var defIcon = "/omatsuri/kakunodate/";

var marker_list;
var old_marker_list;
var nowPosMarker;
var centerMode = 0;//1：現在地が動いたら中心も移動

var posData = new Array();



function getMarkerLocation(){
/*	$.getJSON(jsonFile, {}, function(data) {
		setMarker(data);
	});*/
	
//	var dataURL = "http://hikiyama-map.heroku.com/omatsuri/" +
//				OmatsuriId + "/" + YamaNameAr[i] + "/locations/" + 
//				QueryStrs.sd + "/" + QueryStrs.ed + ".json" + "?jsoncallback=?";
	$.getJSON(jsonFile, {}, function(data){
		//My.onTrackingDataLoaded(data);	// ※直接onTrackingDataLoaded()をイベントハンドラーにするとthisがインスタンスを参照しないので不都合。
		setMarker(data);
	});
}




function setMarker(json){
	iniFlg = 0;
	strOption = "";
	
	for (i=0;i<json.length;i++){
		if(json[i].location){
			lat = json[i].location.latitude;
			lng = json[i].location.longitude;
			ho_a =  json[i].location.horizontal_accuracy;
// S.Taguchi
//			hid = json[i].location.hikiyama_id;
			hid = json[i].code;
// S.Taguchi
//			h_name = json[i].location.hikiyama_name;
			h_name = json[i].name;
			head_a = json[i].location.heading_accuracy;
// S.Taguchi
			var tswk =  json[i].location.timestamp;
			tswk.match(/.*T(.*)\+.*/);
			ts = RegExp.$1;
			id =  json[i].location.id;
			heading =  json[i].location.heading;
// S.Taguchi
			icons = json[i].icons[0];
// S.taguchi 2011Feb16
			summary = json[i].summary;
			
			if(iniFlg==0){
                var delta = 0.004
				swLat = lat - delta;
				swLng = lng - delta;
				neLat = lat + delta;
				neLng = lng + delta;
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
			strOption += '<option value="' + lat + ',' + lng + '">' + h_name + '</option>'
		}
	}
	
	if (ini==0){
		fitMap();
		ini = 1;
	}
	
	$("#slIt").html('<select id="fllist"><option value="">◆中心に移動</option>' + strOption + '</select>');
}



function nowTime(){
	var now = new Date();

	var hour = now.getHours(); // 時
	var minu = now.getMinutes(); // 分
	var sec = now.getSeconds(); // 秒

	if(hour < 10) { hour = "0" + hour; }
	if(minu < 10) { minu = "0" + minu; }
	if(sec < 10) { sec = "0" + sec; }


	var w1 = hour + ':' + minu + ':' + sec; 
	return w1;
}
function makeIconURL(def,hid,heading,icons){
	if(icons == ""){
		url = defOld +  Math.floor(heading); 
	}else{
		url = def + hid + "/icon/" + icons + "/" +  Math.floor(heading); 
	}
	return(url);
}



function addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons){

//	var mUrl = makeIconURL(defIcon,hid,heading,icons);
//	var mUrl = "http://www.hikiyama-map.com/taguchi/image/sakura.png";
	var mUrl = "http://s3.amazonaws.com/hikiyama/app/public/system/icons/370/original/mikosi.png?1313769717";
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

    marker_list.push(marker);

	var infoOpts = {
		content :
					"<b>" + h_name + "</b><br />" +
					"<div style='text-align:center;'>" + summary + "</div>" +
		 			"位置計測時刻：" + ts + "<br />" +		//hh:mm
					""
	};
	
	var info = new google.maps.InfoWindow(infoOpts);
	google.maps.event.addListener(marker,"click",function(){
		info.open(mapInstance,marker);
	});
}


function fitMap(){
  var southWest = new google.maps.LatLng(swLat,swLng);
  var northEast = new google.maps.LatLng(neLat,neLng);
  var bounds = new google.maps.LatLngBounds(southWest,northEast);

  mapInstance.fitBounds(bounds);
}

function deleteAllMarker(mList){
	mlLength = mList.getLength();

	mList.forEach(function(marker, idx) {
		marker.setMap(null);
	});
}

function popMVCList(mList){
	mlLength = mList.getLength();
 	for(i=0;i<mlLength;i++){
		mList.pop();
	}
}

function makeMyPos(lat,lng,acc){
	mylat = lat;
	mylng = lng;
	
	var mUrl = "./images/man.png";
	var mSize = new google.maps.Size(32, 32);
	var mOrigin = new google.maps.Point(0,0);
	var mAnchor = new google.maps.Point(16,32);
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

	if(centerMode==1){
		setCenter(mylat,mylng);
	}
}



function setCenter(lat,lng){
	var posNow = new google.maps.LatLng(lat, lng);
	mapInstance.setCenter(posNow);
}

function reloadMarkers() {
    old_marker_list = marker_list;
    marker_list = new google.maps.MVCArray();
    getMarkerLocation();
    deleteAllMarker(old_marker_list);
}

google.maps.event.addDomListener(window, 'load', function() {
	$("#ctlBox").hide();
	var mapdiv = document.getElementById('mymap');

//初期Map表示
	var myOptions = {
		zoom: mapZoom,
		center: new google.maps.LatLng(clat, clong),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true,
	};
	mapInstance = new google.maps.Map(mapdiv, myOptions);

//MVC配列の生成
    marker_list = new google.maps.MVCArray();

//イベントリスナ
	
	$("#ctlForm").submit(function(e){
		//alert("submit");
		return false;
	});
	$("#img_close").click(function(e){
		$("#ctlBox").hide();
		$("#menuBox").show();
	});
	$("#img_menu").click(function(e){
		$("#ctlBox").show();
		$("#menuBox").hide();
	});

	$("#bt_renew").click(function(e){
        reloadMarkers();
		$("#ctlBox").hide();
		$("#menuBox").show();
	});

	$(".navi").click(function(e){
		naviVal = $("input[name=navi]:checked").val();
		if(naviVal == 1){
			centerMode=1;
//			setCenter(mylat,mylng);
		}else{
			centerMode=0;
		}
		// 2011Feb16 S.Taguchi Added.
		$("#ctlBox").hide();
		$("#menuBox").show();
	});

	$("#bt_moveEvent").click(function(e){
		// 2011Feb18 S.Taguchi Added.
		ini = 0;
//		getMarkerLocation();
		fitMap();
		// 2011Feb16 S.Taguchi Added.
		$("#ctlBox").hide();
		$("#menuBox").show();
	});

	$("#slIt").change(function(e){
		
		str = $("#fllist").val();
		if (str != ""){
			var resArray = str.split(","); 
			setCenter(resArray[0],resArray[1]);
		}
		// 2011Feb16 S.Taguchi Added.
		$("#ctlBox").hide();
		$("#menuBox").show();
	});

	$("#help_navi").click(function(e){
	//	str = "ナビモードがONにすれば、常に現在位置を中心にして地図を表示します。\nただし現在位置が正常に取得できないときは変化しません。";
		str = "ナビモードをONにすると、常に自分を中心に地図を表示します。\nただし自分の現在地が正常に取得できないときは変化しません。";
		alert(str);
	});

	$("#help_renew").click(function(e){
	//	str = "新しい曳山の位置を取得して、地図を更新することができます。\n通常は" + rntime + "秒ごとに地図を更新します。";
		str = "曳山の現在地を最新に更新します。\n通常は" + rntime + "秒ごとに自動更新します。";
		alert(str);
	});

	var myPosition = new myPos();
	var opts = {
		callback:makeMyPos
	};
	myPosition.getPosition(opts);

	//曳山マーカーの生成
	getMarkerLocation();

	//60秒ごとに再読み込み
	reloadInterval = setInterval(function(){
        reloadMarkers();
	},rntime*1000);

});
