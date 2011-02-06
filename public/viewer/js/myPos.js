/*
W3C Geolocation APIもしくはGoogle gearsのGeolocation APIをサポートしているブラウザにおいて、
自分の現在地（緯度経度）を取得するためのJavaScriptのクラス。


myPosクラスのコンストラクタ
【説明】
　以下の様にgetPosition(opts)を呼び出すと、引数で指定したcallback関数が繰り返し呼び出される。
　呼び出しは、測位のデータが指定の条件を満たした場合に行われ、callback関数には緯度、経度、精度が返される。

    var myP = new myPos();  // コンストラクタ関数の実行
    var opts = {    // オプションの設定。callbackのみ必須。
        .....（詳細はgetPosition()メソッド参照) ....
    };
    myP.getPosition(opts);  // 測位開始のメソッドを実行

　callback関数の呼び出しを停止したいときは、stopGetPosition()メソッドを呼び出す。

*/
function myPos() {
    var my = this;  // watchPosition()や、setTimeout()から呼び出されるcallback関数内ではthisがここでのthisと異なるのでmyに代入しておく。
    this.inited = false;
    this.watchId = null;        // watchPosition()が返すID格納
    this.setTimeoutId = null;   // setTimeout()が返すID格納
    this.prev = {lat:null, lng:null, acc:null, time:null};  // 前回測位した際の緯度、経度、精度、時刻が入る
    this.map  = {lat:null, lng:null, acc:null, time:null};  // 前回地図を再描画した(callbackした)際の緯度、経度、精度、時刻が入る



    // Publicメソッド
    /*
　 【引数optsの各項目】
    callback:移動を検出した際に呼び出すコールバック関数（必須）
    errCallback:watchPosition()内でエラーが発生した際に呼び出すcallback関数。引数はPositionError型。
                geolocation APIのエラーをそのまま返すが、geolocation API以外のエラーの場合はcodeをnullにして独自のmessageを返す。指定しなければエラーは無視される。
    minDistance:この距離未満の移動であれば、移動とみなさない距離(m)。default:5m。
    minInterval:この時間よりもインターバル（前回callback呼び出し時からの時間）が短ければ再描画しない(s)。default:1s。
    minGPSAcc:この精度よりもGPS精度が悪ければ無視する距離(m)。default:200m。
    maxSpeed:これ以上速い速度で移動した場合は異常とみなして無視する速度(km/h)。default:100km/h。
    enoughGPSAcc:測位の精度が十分なレベルに達したとみなしてGPSの測位を一時止める精度(m)。default:10m。0ならGPSの測位を止めない。
    timerInterval:精度が十分なレベルに達した時、バッテリーを節約するため一定時間GPSの測位を止めるが、その時間(s)。default:20s。
                　enoughGPSAccが0ならGPSの測位を止めない。
    rawCallback:フィルターに関係なく、watchPosition()がcallback関数を呼び出す度に呼び出される。デバック用。デバック時以外は指定しなくてよい。
    */
    this.getPosition = function(opts) { // setTimeout()から呼び出されるときはoptsはundefined
        if (! my.inited) {  // 最初の呼び出し？
            this.inited = true;
            if (navigator.geolocation) {    // W3C Geolocation API
                ;
            }
            else if (window.google && google.gears) {   // Google Gears Geolocation API
                navigator.geolocation = google.gears.factory.create('beta.geolocation');
            }
            else {
                this.errCallback = opts.errCallback;
                var e = {
                    code:null,
                    message:"Error:お使いのブラウザはgeolocationAPIに対応していません"
                };
                this.errorCallback(e);
                return;
            }
        }
        
        if (my.setTimeoutId != null) {  // setTimeout()からの呼び出し
            my.setTimeoutId = null;
        }
        else {  // 通常の呼び出し
            if (this.watchId != null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
            this.userCallBack = opts.callback;
            this.errCallback = opts.errCallback;
            this.minDistance = opts.minDistance ? opts.minDistance : 5;
            this.minInterval = opts.minInterval ? opts.minInterval * 1000 : 1000;
            this.minGPSAcc = opts.minGPSAcc ? opts.minGPSAcc : 200;
            this.maxSpeed = opts.maxSpeed ? opts.maxSpeed * 1000 / 3600 : 100 * 1000 / 3600;
            this.enoughGPSAcc = opts.enoughGPSAcc ? opts.enoughGPSAcc : 5;
            this.timerInterval = opts.timerInterval ? opts.timerInterval * 1000 : 20 * 1000;
            this.rawCallback = opts.rawCallback;
        }
        
        var MAXAGE = 0;
        var TIMEOUT = 30000;    // この時間GPSの測位が得られなければタイムアウトしてエラーになる時間(ms)
        my.watchId = navigator.geolocation.watchPosition(my.successCallback, my.errorCallback,
                                        {enableHighAccuracy:true, maximumAge:MAXAGE, timeout:TIMEOUT});
    };





    // Privateメソッド
    // watchPosition()で位置が検出された時呼び出されるcallback関数
    this.successCallback = function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var acc = position.coords.accuracy;
        var currentTime = new Date();
        var result = true;
        var resultStr = "";
        
        if (! my.prev.lat) {    // 1回目の測位
            /* OK */
            resultStr = "OK １回目の測位";
        }
        else {  // 2回目以降の測位時
            var rawInterval = currentTime - my.prev.time;   // 前回測位してからの時間
            var interval = currentTime - my.map.time;       // 前回userCallBack()をcallしてからの時間
            var deltaL = my.calLength(lat, lng, my.map.lat, my.map.lng);    // 移動距離(m)
            var speed = deltaL / (interval / 1000);     // 移動スピード(m/s)


            if (interval < my.minInterval) {    // 前回の再描画から指定された時間が経っていなければ無視する
                result = false;
                resultStr = "NG インターバルが短すぎる";
            }
            if (result && deltaL < my.minDistance) {        // 移動距離が指定した距離よりも小さければ無視する
                result = false;
                resultStr = "NG 移動距離が小さすぎる";
            }
            if (result && acc > my.minGPSAcc) {     // 絶対的精度不足
                if (acc < my.map.acc) {     // 現在の地図表示時の測位よりも精度が上がった
                    /* OK */
                    resultStr = "OK 絶対的精度不足だが精度が改善した";
                }
                else {
                    result = false;
                    resultStr = "NG 絶対的精度不足";
                }
            }
            if (result && speed > my.maxSpeed) {    // 指定した速度よりも速い（異常に速い）速度であれば無視する
                if (acc < my.map.acc) {     // 現在の地図表示時の測位よりも精度が上がった
                    /* OK */
                    resultStr = "OK 移動速度が速すぎるが精度が改善した";
                }
                else {
                    result = false;
                    resultStr = "NG 移動速度が速すぎる";
                }
            }
        }
        
        
        /* デバック用のcallback関数を測位の度に呼び出す。 */
        if (my.rawCallback) {
            if (!resultStr) {
                resultStr = "フィルターを全て通過した";
            }
            my.rawCallback(lat, lng, acc, rawInterval, interval, deltaL, resultStr);
        }
        
        
        if (result) {
            my.userCallBack(lat, lng, acc);
            
            my.map.lat = lat;       // 地図描画時(callback関数呼び出し時)の緯度経度、精度、時刻を更新。
            my.map.lng = lng;
            my.map.acc = acc;
            my.map.time = currentTime;
        }
        
        
        // 生の測位時の緯度、経度、精度、時刻の保存
        my.prev.lat = lat;
        my.prev.lng = lng;
        my.prev.acc = acc;
        my.prev.time = currentTime;
        
        
        
        // 精度が十分なレベルに達したらwatchPosition()を止めて、setTimeoutタイマーに切り替える。
        if (acc <= my.enoughGPSAcc &&  my.enoughGPSAcc != 0) {
            navigator.geolocation.clearWatch(my.watchId);
            my.watchId = null;
            
            my.setTimeoutId = setTimeout(my.getPosition, my.timerInterval);
        }
    };





    // Privateメソッド
    // watchPosition()でエラーが発生したときのcallback関数
    this.errorCallback = function(err) {
        // my.stopGetPosition();    // エラーが発生したらGPSの測位を止める
        
        if (my.errCallback) {
            my.errCallback(err);
        }
    };





    // Publicメソッド
    // GPSの測位を停止するメソッド
    this.stopGetPosition = function() {
        if (my.setTimeoutId != null) {  // もしsetTimeout()のタイマー待ちだったら
            clearTimeout(my.setTimeoutId);
            my.setTimeoutId = null;
        }
        else {
            if (my.watchId != null) {
                navigator.geolocation.clearWatch(my.watchId);
                my.watchId = null;
            }
        }
    };





    // Privateメソッド
    // 2点の緯度経度から距離を求めるメソッド
    this.calLength = function(lat0, lng0, lat1, lng1) {
        var r = 6378137; // 地球の赤道半径(6378137m)
        var lat0rad = lat0 * Math.PI / 180;
        var lng0rad = lng0 * Math.PI / 180;
        var lat1rad = lat1 * Math.PI / 180;
        var lng1rad = lng1 * Math.PI / 180;
        var deltaLat = lat0rad - lat1rad;
        var deltaLng = lng0rad - lng1rad;
        
        var deltaX = r * deltaLng * Math.cos(lat0rad);
        var deltaY = r * deltaLat;

        return(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)));   // メートル単位の距離

        //c = Math.atan(y / x) *180.0/ Math.PI; // 方角　東：0(0度)，北：1/2π(90度)，西：π(180度)，南：3/2π(270度)
    };

}