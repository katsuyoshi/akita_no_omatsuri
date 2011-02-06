// JavaScript Document
var mapInstance;
var jsonFile = "/omatsuri/kakunodate/locations.json";
var jsondata;
var clat = 39.59929722;
var clong = 140.56142532;
var mapZoom = 15;

var swLat = 0;
var swLng = 0;
var neLat = 0;
var neLng = 0;

var mylat = 0;
var mylng = 0;

var intMode = 0;// 1 : auto
var ini = 0;    //初期化

var defOld = "/omatsuri/kakunodate/sugazawa/icon/sugazawa/";
var defIcon = "/omatsuri/kakunodate/";

var marker_list;
var nowPosMarker;
var centerMode = 0;//1：現在地が動いたら中心も移動

var posData = new Array();

function getMarkerLocation(){
    getFile = getLocationFile();
    if(getFile != ""){
        jsonFile = getFile; 
//      alert(getFile);
    }
    
    $.getJSON(jsonFile,{},function(data){
//      alert(data);
        setMarker(data);
//      jsondata = data;
    });
}

function setMarker(json){
    iniFlg = 0;
    strOption = "";
    
    for (i=0;i<json.length;i++){
        if(json[i].hikiyama){
        if(json[i].hikiyama.location){
        lat = json[i].hikiyama.location.latitude;
        lng = json[i].hikiyama.location.longitude;
        ho_a =  json[i].hikiyama.location.horizontal_accuracy;
        hid = json[i].hikiyama.code;
        h_name = json[i].hikiyama.name;
        head_a = json[i].hikiyama.location.heading_accuracy;
        ts =  json[i].hikiyama.location.timestamp;
        id =  json[i].hikiyama.location.id;
        heading =  json[i].hikiyama.location.heading;
// S.Taguchi
//      icons = json[i].hikiyama.icons;
        icons = json[i].hikiyama.icons[0];
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
        strOption += '<option value="' + lat + ',' + lng + '">' + h_name + '</option>'
        }
        }else if(json[i].location){
            lat = json[i].location.latitude;
            lng = json[i].location.longitude;
            ho_a =  json[i].location.horizontal_accuracy;
// S.Taguchi
//          hid = json[i].location.hikiyama_id;
            hid = json[i].code;
// S.Taguchi
//          h_name = json[i].location.hikiyama_name;
            h_name = json[i].name;
            head_a = json[i].location.heading_accuracy;
            ts =  json[i].location.timestamp;
            id =  json[i].location.id;
            heading =  json[i].location.heading;
// S.Taguchi
            icons = json[i].icons[0];
            
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
// S.Taguchi
//      addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,""); 
        addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons);  
        strOption += '<option value="' + lat + ',' + lng + '">' + h_name + '</option>'

        }
        
    }
    if (ini==0){
        fitMap();
        ini = 1;
    }

    $("#lastTime").html("最終更新:" + nowTime());
//  alert(strOption);

    $("#slIt").html('<select id="fllist"><option value="">◆中心に移動</option>' + strOption + '</select>');

//  alert(swLat + "," + swLng + "," + neLat + "," + neLng);
//  alert("a");

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
//alert(url);
    return(url);
}


function addMarker(lat,lng,heading,hid,ts,id,ho_a,head_a,h_name,icons){

    var mUrl = makeIconURL(defIcon,hid,heading,icons);
    var mSize = new google.maps.Size(32, 32);
    var mOrigin = new google.maps.Point(0,0);
    var mAnchor = new google.maps.Point(16,16);
    var mScaleSize = new google.maps.Size(32, 32);

    var mIcon = new google.maps.MarkerImage(mUrl,mSize,mOrigin,mAnchor,mScaleSize);     

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        icon: mIcon,
        map: mapInstance, 
        title:  h_name
    });

    marker_list.push(marker);
/*
//以下デバッグ用
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        map: mapInstance, 
        title: 'id:' + id
    });

    marker_list.push(marker);
//ここまで
*/
    var infoOpts = {
        content :   
                    h_name + "<br />" +
                    '<a href="http://www.kakudate.com/omatsuri/">http://www.kakudate.com/omatsuri/</a>' + "<br />" +
                    ts + "<br />" +     //hh:mm
                    ""
/*
                    '<img src="http://www.kakudate.com/omatsuri/ningyou/img/2009/P1040072.jpg" alt="人形画像サンプル" width="200" height="140" /><br />テスト用サンプル<br />' +
                    "丁内名 : " + h_name + "<br />" +
                    "囃子方 : " + "○○○○○○○○○○" + "<br />" +
                    "人形外題 : " + "○○○○○○○○○○○○○○○○○○○○<br />○○○○○○○○○○○○○○○○○○○○" + "<br />" +
                    "URL : " + '<a href="http://www.kakudate.com/omatsuri/">http://www.kakudate.com/omatsuri/</a>' + "<br />" +


                    "<br />以下デバッグ用情報<br />" +
                    "id : " + id + "<br />" +
                    "hikiyama_id : " + hid + "<br />" +
                    "hikiyama_name : " + h_name + "<br />" +
                    "latitude : " + lat + "<br />" +
                    "longitude : " + lng + "<br />" +
                    "horizontal_accuracy : " + ho_a + "<br />" +
                    "heading : " + heading + "<br />" +
                    "heading_accuracy : " + head_a + "<br />" +
                    "timestamp : " + ts + "<br />" +
                    "IconURL : " + mUrl + "<br />"// +
*/
    };
    
    var info = new google.maps.InfoWindow(infoOpts);
    google.maps.event.addListener(marker,"click",function(){
        info.open(mapInstance,marker);
    });

}
function getLocationFile(){
    var n = "";
    if(window.location.search){
        n=window.location.search.substring(1,window.location.search.length);
    }
    return(n);
}

function fitMap(){
  var southWest = new google.maps.LatLng(swLat,swLng);
  var northEast = new google.maps.LatLng(neLat,neLng);
  var bounds = new google.maps.LatLngBounds(southWest,northEast);

  mapInstance.fitBounds(bounds);
//  alert("SouthWest:" +swLat + "," + swLng + "\nNorthEast:" + neLat + "," + neLng);
}

function deleteAllMarker(){
    mlLength = marker_list.getLength();

    marker_list.forEach(function(marker, idx) {
        marker.setMap(null);
    });


    for(i=0;i<mlLength;i++){
        marker_list.pop();
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
//    marker_list.push(marker);

    $("#nowPos").html("現在位置:" + acc + "," + nowTime());

    if(centerMode==1){
        setCenter(mylat,mylng);
    }

}

function setCenter(lat,lng){
    var posNow = new google.maps.LatLng(lat, lng);
    mapInstance.setCenter(posNow);
}

google.maps.event.addDomListener(window, 'load', function() {

    var mapdiv = document.getElementById('mymap');
    var myOptions = {
        zoom: mapZoom,
        center: new google.maps.LatLng(clat, clong),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true,
    };
    mapInstance = new google.maps.Map(mapdiv, myOptions);

    marker_list = new google.maps.MVCArray();

    $("#bt_autoRenew").css({color : "#999"});

    $("#bt_renew").click(function(e){
        $("#bt_renew").css({color : "#000"});
        $("#bt_autoRenew").css({color : "#999"});
        if(intMode!=0){
            clearInterval(reloadInterval);
        }
        deleteAllMarker();
        getMarkerLocation();
    });

    $("#bt_autoRenew").click(function(e){
        $("#bt_renew").css({color : "#999"});
        $("#bt_autoRenew").css({color : "#000"});
        intMode = 1;
        reloadInterval = setInterval(function(){
                deleteAllMarker();
                getMarkerLocation();
            },60*1000);
    });
    
    $("#bt_movePos").click(function(e){
        centerMode=0;
        setCenter(mylat,mylng);
    });
    $("#bt_movePos2").click(function(e){
        centerMode=1;
        setCenter(mylat,mylng);
    });

    $("#bt_moveEvent").click(function(e){
        ini = 0;
        getMarkerLocation();
    });
    $("#slIt").change(function(e){
        
        str = $("#fllist").val();
        if (str != ""){
            var resArray = str.split(","); 
            setCenter(resArray[0],resArray[1]);
        }
    });
/* S.Taguchi
    // インスタンスの生成
    var myPosition = new myPos(makeMyPos, 10, 20, 120, 10);
    
    // 現在地の取得（callback関数が呼び出される）
    myPosition.getPosition();
*/
    var myPosition = new myPos();
    var opts = {
        callback:makeMyPos
    };
    myPosition.getPosition(opts);
    
    getMarkerLocation();
    
});
