// HikiyamaTrackingDataクラス
// 2010/09/04 S.taguchi

function HikiyamaTrackingData(omatsuriId, hikiyamaId) {
    var My = this;
    this.omatsuriId = omatsuriId;
    this.hikiyamaId = hikiyamaId;
    this.trackingData = null;
    this.current = {
        index:0,        // サーバから得たlocation data配列のindex
        dateObj:null    // indexの示すレコードのtimestampをDateオブジェクトに変換したもの
    };
    this.marker = false;
    this.bounds = {};
    
    
    // public method
    this.loadTrackingData = function(dataURL, callback) {
        this.callback = callback;
        $.getJSON(dataURL, {}, function(data){
            My.onTrackingDataLoaded(data);
        });
    };
    
    
    
    // private method *callback from $.getJSON()
    this.onTrackingDataLoaded = function(data) {
        //alert("load [" + data.length + "] record.");
        
        if (data.length > 0) {
            this.trackingData = data;
            this.current.dateObj = this.timestamp2date(data[0].location.timestamp);
            this.creMarkerImages();
            this.makeMarker(data[0].location.latitude,
                    data[0].location.longitude,
                    data[0].location.heading
            );
            this.bounds = this.findBounds();
        }
        this.callback(this.hikiyamaId, data.length);
    };
    
    
    
    // public method
    this.redraw = function(newTime, graph) {    // newTime:Dateオブジェクト, graph:円と、線を描画するか否か
        var newIndex = this.getTrackingDataIndexByTime(newTime);
        
        if (newIndex != this.current.index) {
            this.makeMarker(this.trackingData[newIndex].location.latitude,
                        this.trackingData[newIndex].location.longitude,
                        this.trackingData[newIndex].location.heading
            );
            if (graph) {
                this.drawCircle(this.trackingData[newIndex].location.latitude,
                            this.trackingData[newIndex].location.longitude,
                            this.trackingData[newIndex].location.horizontal_accuracy,
                            newTime
                );
                this.drawLine(this.trackingData[newIndex].location.latitude,
                            this.trackingData[newIndex].location.longitude
                );
            }
        }
        /*
        if (newIndex < this.trackingData.length - 1) {      // データの最後まで達していない
        //  this.tid = setTimeout(this.redraw, 1000 / Fps);
        }
        else {
            //document.frm0.start.value = "START";
        }
        */
        this.current.dateObj = newTime;
        this.current.index = newIndex;
    };
    
    
    
    // private method
    // 与えられた時刻から、その直前のデータ(のIndex)を返す。
    this.getTrackingDataIndexByTime = function(dt) {    // dt:Dateオブジェクト
        if (dt == this.current.dateObj) {
            return(this.current.index);
        }
        else if (dt > this.current.dateObj) {
            for (var i=this.current.index+1; i < this.trackingData.length; i++) {
                if (dt < this.timestamp2date(this.trackingData[i].location.timestamp)) {
                    return(i-1);
                }
            }
            return(this.trackingData.length-1);
        }
        else {
            for (var i=this.current.index-1; i >= 0; i--) {
                if (dt >= this.timestamp2date(this.trackingData[i].location.timestamp)) {
                    return(i);
                }
            }
            return(0);
        }
    };
    
    
    
    this.accCircleOpts = {
        clickable:true,
        fillColor:null,
        fillOpacity:0.0,
        strokeColor:"#00AAFF",
    //  strokeOpacity:0.3,
        strokeOpacity:1,
        strokeWeight:1
    };
    
    this.centeraccCircleOpts = {
        clickable:false,
        fillColor:"#CC0000",
    //  fillOpacity:0.4,
        fillOpacity:1,
        strokeColor:"#CC0000",
        strokeOpacity:0.0,
        strokeWeight:0,
        radius:1
    };
    
    this.drawCircle = function(lat, lng, radius, date) {
        var zIndex = 10;
        // circle of accuracy
        this.accCircleOpts.center = new google.maps.LatLng(lat, lng);
        this.accCircleOpts.radius = radius;
        this.accCircleOpts.zIndex = zIndex;
        var accCircle = new google.maps.Circle(this.accCircleOpts);
        accCircle.setMap(Gmap);
        
        // circle of center (small circle)
        this.centeraccCircleOpts.center = new google.maps.LatLng(lat, lng);
        this.centeraccCircleOpts.zIndex = zIndex + 1;
        var centerCircle = new google.maps.Circle(this.centeraccCircleOpts);
        centerCircle.setMap(Gmap);
        
        google.maps.event.addListener(accCircle, 'mouseover', function() {
                var str = "時刻:" + date.toLocaleString() + "<br/>";
                str += "精度:" + Math.round(radius * 100) / 100 + "m<br/>";
                My.openInfoWindow(lat, lng, str);
            }
        );
        google.maps.event.addListener(accCircle, 'mouseout', function() {
                My.infoWin.close();
            }
        );
    };
    
    
    
    this.polyLine = null;
    
    this.drawLine = function(lat, lng) {
        if (this.polyLine == null) {
            this.polyLine = new google.maps.Polyline(
                {
                    clickable:false,
                    strokeColor:"#ff5500",
//                  strokeOpacity:0.3,
                    strokeOpacity:1,
                    strokeWeight:1,
                    map:Gmap
                }
            );
            //this.polyLine.setMap(Gmap);
        }
        var path = this.polyLine.getPath();
        path.push(new google.maps.LatLng(lat, lng));
    };
    
    
    
    this.infoWin = null;
    
    this.openInfoWindow = function(lat, lng, str) {
        if (this.infoWin == null) {
            this.infoWin = new google.maps.InfoWindow();
        }
        this.infoWin.setContent(str);
        this.infoWin.setPosition(new google.maps.LatLng(lat, lng));
        this.infoWin.open(Gmap);
    };
    
    
    
    // private method
    // @@@ 1970/01/01からの秒数に変換してしまうと速いかもしれない。
    // "2010-09-01T14:52:44+09:00"形式をDateオブジェクトにして返す。
    this.timestamp2date = function(timestamp) {
        var dt = timestamp.substr(0, timestamp.indexOf("+"));
        
        var yyyymmdd = dt.substr(0, dt.indexOf("T"));
        var hhmmss = dt.substr(dt.indexOf("T") + 1);
        
        var ymd = yyyymmdd.split("-");
        var hms = hhmmss.split(":");
        
        return(new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]));
    };
    
    
    
    // public method
    this.getRecordCount = function() {
        return(this.trackingData.length);
    };
    
    
    // public method
    this.getCurrentIndex = function() {
        return(this.current.index);
    };
    
    
    // public method
    this.getFirstDate = function() {
        return(this.timestamp2date(this.trackingData[0].location.timestamp));
    };
    
    
    // public method
    this.getLastDate = function() {
        return(this.timestamp2date(this.trackingData[this.trackingData.length-1].location.timestamp));
    };


    // public method
    this.getBounds = function() {
        return(this.bounds);
    };
    
    
    // private method
    this.findBounds = function() {
        var north, south, east, west;
        north = south = this.trackingData[0].location.latitude;
        east = west = this.trackingData[0].location.longitude;
        for (var i=1; i<this.trackingData.length; i++) {
            if (this.trackingData[i].location.latitude > north) {
                north = this.trackingData[i].location.latitude;
            }
            if (this.trackingData[i].location.latitude < south) {
                south = this.trackingData[i].location.latitude;
            }
            if (this.trackingData[i].location.longitude > east) {
                east = this.trackingData[i].location.longitude;
            }
            if (this.trackingData[i].location.longitude < west) {
                west = this.trackingData[i].location.longitude;
            }
        }
        return({north:north, south:south, east:east, west:west});
    };
    
    
    
    
    ////////////////////////////////////////////////////////////////////////
    // 統計用メソッド
    ////////////////////////////////////////////////////////////////////////

    // 平均を求める
    this.calAve = function(name) {
        var sum = 0;
        for (var i=0; i<this.trackingData.length; i++) {
            sum += this.trackingData[i].location[name];
        }
        return(Math.round((sum / this.trackingData.length) * 100) / 100);
    };


    // 分散を求める
    this.calVariance = function(name, ave) {
        var dec = 0;
        for(i=0; i<this.trackingData.length; i++) {
            dec += Math.pow(ave - this.trackingData[i].location[name], 2);
        }
        return(Math.round((dec / this.trackingData.length) * 100) / 100);
    };


    // 平均、分散、標準偏差を返す
    this.calStats = function(name) {
        var ave = this.calAve(name);
        var variance = this.calVariance(name, ave);
        var sd = Math.round(Math.sqrt(variance) * 100) / 100;
        return({average:ave, variance:variance, sd:sd});
    };
    
    
    
    
    ////////////////////////////////////////////////////////////////////////
    // ここからICON関係の処理
    ////////////////////////////////////////////////////////////////////////

    this.makeMarker = function(lat, lng, heading) {
        var mIcon = this.markerImages[this.angle2no(heading)];
        
        if (! this.marker) {
            this.marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                icon: mIcon,
                map: Gmap,
                title: this.hikiyamaId
            });
        }
        else {
            this.marker.setIcon(mIcon);
            this.marker.setPosition(new google.maps.LatLng(lat, lng));
        }
    };



    // マーカーイメージをあらかじめ生成し、markerImagesに格納しておく
    this.iconCnt = 16;  // 角度毎の曳山アイコン画像の数
    this.markerImages = [];
    // private method
    this.creMarkerImages = function() {
        var mSize = new google.maps.Size(40, 40);
        var mOrigin = new google.maps.Point(0, 0);
        var mAnchor = new google.maps.Point(20, 20);
        var mScaleSize = new google.maps.Size(40, 40);
        
        for (var i=0; i<this.iconCnt; i++) {
            var heading = (360 / this.iconCnt) * i;
            var mUrl = this.makeIconURL(heading);
            this.markerImages.push(new google.maps.MarkerImage(mUrl, mSize, mOrigin, mAnchor, mScaleSize));
        }
    };



    // private method
    // 0<= 角度 <360 を 0<= 数字 <iconCntに変換する
    this.angle2no = function(heading) {
        var r = (heading + (360 / this.iconCnt / 2)) % 360; // 11.25度ずらす
        var r2 = Math.floor(r / (360 / this.iconCnt));      // 0<= r < 360 を 0～iconCntの数字に変換する。
        return(r2);
    };



    // private method
    this.makeIconURL = function(heading){
        url = "/omatsuri/" + this.omatsuriId + "/" + this.hikiyamaId + "/icon/" + this.hikiyamaId + "/" +  Math.floor(heading);
        return(url);
    };

}