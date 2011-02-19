var OmatsuriId = "demo";
//var HikiyamaNames = ["shimoiwase"];
var TrackingData = [];
var LoadedCount = 0;
var TotalRecCount = 0;
var PlaySpeed = 50; // 倍速指定(実際のn秒を1秒で再生）
var Fps = 16;   // frame per seconds
var Interval = PlaySpeed / Fps; // frame間の実時間
var Gmap = null;    // Google Maps
var MapElm = null;
var DatetimeElm = null;
var Current = {
    index:0,        // サーバから得たlocation data配列のindex
    dateObj:null    // indexの示すレコードのtimestampをDateオブジェクトに変換したもの
};
var Tid = null;
var FirstDate = null;   // 全曳山のtrackingデータ中一番古い日時
var LastDate = null;    // 全曳山のtrackingデータ中一番新しい日時
var Bounds = {north:null, south:null, east:null, west:null};
var GBounds = null;
var InitMapOpts = {
    lat:39.595669,
    lng:140.562462,
    zoom:16,
    mapType:google.maps.MapTypeId.ROADMAP
};
var QueryStrs = "";
var HikiyamaList = [];

google.maps.event.addDomListener(window, 'load', function() {
    init();
});



function init() {
    QueryStrs = getUrlVars();
    if (! QueryStrs.sd) {
        alert("QueryString sdが指定されていません");
    }
    if (! QueryStrs.ed) {
        alert("QueryString edが指定されていません");
    }
    if (! QueryStrs.yama) {
        alert("QueryString yamaが指定されていません");
    }
    else {
        HikiyamaList = QueryStrs.yama.split(",");
    }
    MapElm = $("#map")[0];
    DatetimeElm = $("#datetime");
    
    windowLayout();
    mapInit();
    loadTrackingData();
}




function windowLayout() {
    MapElm.style.height = $(document).height() - $("#control").height() + "px";
}



function mapInit() {
    var myOptions = {
        center: new google.maps.LatLng(InitMapOpts.lat, InitMapOpts.lng),
        zoom: InitMapOpts.zoom,
        mapTypeId:InitMapOpts.mapType
    };
    Gmap = new google.maps.Map(MapElm, myOptions);
}



function loadTrackingData() {
    for (var i=0; i<HikiyamaList.length; i++) {
        TrackingData[HikiyamaList[i]] = new HikiyamaTrackingData(OmatsuriId, HikiyamaList[i]);
    }
    
    for (var i=0; i<HikiyamaList.length; i++) {
        var dataURL = "/omatsuri/" + OmatsuriId + "/" + HikiyamaList[i] + "/locations/" + QueryStrs.sd + "/" + QueryStrs.ed + ".json";  // @@@
        TrackingData[HikiyamaList[i]].loadTrackingData(dataURL, onDataLoaded);
    }
}



function onDataLoaded(hikiyamaName, len) {
    TotalRecCount += len;
    if (len != 0) {
        var bounds = TrackingData[hikiyamaName].getBounds();
        if (FirstDate == null) {
            FirstDate = TrackingData[hikiyamaName].getFirstDate();
            LastDate = TrackingData[hikiyamaName].getLastDate();
            Bounds.north = bounds.north;
            Bounds.south = bounds.south;
            Bounds.east = bounds.east;
            Bounds.west = bounds.west;
        }
        else {
            if (TrackingData[hikiyamaName].getFirstDate() < FirstDate) {
                FirstDate = TrackingData[hikiyamaName].getFirstDate();
            }
            if (TrackingData[hikiyamaName].getLastDate() > LastDate) {
                LastDate = TrackingData[hikiyamaName].getLastDate();
            }
            if (bounds.north > Bounds.north) {
                Bounds.north = bounds.north;
            }
            if (bounds.south < Bounds.south) {
                Bounds.south = bounds.south;
            }
            if (bounds.west > Bounds.west) {
                Bounds.west = bounds.west;
            }
            if (bounds.east < Bounds.east) {
                Bounds.east = bounds.east;
            }
        }
    }
    
    if (++LoadedCount >= HikiyamaList.length) { // 全ファイルload完了？
        GBounds = new google.maps.LatLngBounds(new google.maps.LatLng(Bounds.south, Bounds.west),
                                                new google.maps.LatLng(Bounds.north, Bounds.east));
        Gmap.fitBounds(GBounds);
        Current.dateObj = FirstDate;
        //alert(LoadedCount + " files, " + TotalRecCount + " records. " + FirstDate.toLocaleString() + "～" + LastDate.toLocaleString());

    //  DatetimeElm.innerHTML = FirstDate.toLocaleString();
        $("#nowloading").css({display:"none"});
        $("#components").css({display:"inline"});
        document.frm0.start.disabled = false;
    //  $("#time").css({display:"inline"});
    //  $("#frm1").css({display:"inline"});
        setSliderControl(FirstDate, LastDate);
    }
}



var Slider = {
    elm:null,
    container:null
//  value:null
};

function setSliderControl(FirstDate, LastDate) {
    var duration = (LastDate - FirstDate);  // ms
    Slider.elm = $('#slider');
    Slider.container = $('#slider_container');
//  Slider.value = $('#slider_value');
    var newDate = null;
    DatetimeElm.text(FirstDate.toLocaleString());
//    Slider.value.text(0);
    Slider.elm.slider({
        animate:true,
        min: 0,
        max: duration,
        value:0,
        slide: function (event, ui) {
            newDate = new Date(FirstDate.getTime() + ui.value);
            redraw(newDate);
            //Slider.value.text(newDate.toLocaleString());
            DatetimeElm.text(newDate.toLocaleString());
        }
    });
    //Slider.value.text(FirstDate.toLocaleString());
}



function moveCursor(newTime) {
    var sec = (newTime - FirstDate);
    Slider.elm.slider({value:sec});
}

function startStop() {
    if (document.frm0.start.value == "START") {
        startAnime();
        document.frm0.start.value = "STOP";
    }
    else {
        stopAnime();
        document.frm0.start.value = "START";
    }
}




function startAnime() {
    if (Current.dateObj >= LastDate) {
        Current.dateObj = FirstDate;
    }
    Tid = setTimeout(redrawAnime, 1000 / Fps);
}



function stopAnime() {
    clearTimeout(Tid);
}



function speedChange(speed) {
    PlaySpeed = speed;
    Interval = PlaySpeed / Fps; // frame間の実時間
}



function fpsChange(fps) {
    Fps = fps;
    Interval = PlaySpeed / Fps; // frame間の実時間
}



function redrawAnime() {
    var newTime = new Date(Current.dateObj.getTime() + Interval * 1000);
    DatetimeElm.text(newTime.toLocaleString());
    
//  for (var i=0; i<HikiyamaList.length; i++) {
//      TrackingData[HikiyamaList[i]].redraw(newTime);
//  }
    redraw(newTime);
    
    moveCursor(newTime);
    
    if (newTime < LastDate) {       // データの最後まで達していない
        Tid = setTimeout(redrawAnime, 1000 / Fps);
    }
    else {
        document.frm0.start.value = "START";
    }
//  Current.dateObj = newTime;
}



function redraw(newTime) {
    for (var i=0; i<HikiyamaList.length; i++) {
        TrackingData[HikiyamaList[i]].redraw(newTime);
    }
    Current.dateObj = newTime;
}



function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}



function stats2() {
    for (var i=0; i<HikiyamaList.length; i++) {
        var hikiyama = TrackingData[HikiyamaList[i]];
        var str = hikiyama.hikiyamaId + "\n";
        str += "開始時刻:" + hikiyama.getFirstDate().toLocaleString() + "\n";
        str += "終了時刻:" + hikiyama.getLastDate().toLocaleString() + "\n";
        var time = hikiyama.getLastDate() - hikiyama.getFirstDate();
        var totalSec = Math.round(time / 1000);
        var sec = totalSec % 60;
        var min = ((totalSec - sec) % 3600) / 60;
        var hour = (totalSec - sec - min * 60) / 3600;
        str += "計測時間:" + hour + "時間" + min + "分" + sec + "秒\n";
        str += "レコード数:" + hikiyama.getRecordCount() + "\n";
        str += "平均インターバル:" + Math.round(totalSec / hikiyama.getRecordCount()) + "秒\n";
        var posStats = hikiyama.calStats("horizontal_accuracy");
        str += "位置の平均精度:" + posStats.average + "m\n";
        str += "精度の標準偏差:" + posStats.sd + "\n";
        var headingStats = hikiyama.calStats("heading_accuracy");
        str += "向きの平均精度:" + headingStats.average + "\n";
        str += "精度の標準偏差:" + headingStats.sd + "\n";
        alert(str);
    }
}