/*
StaticMarkerクラス

　Googleマップに、マーカーの定義情報に基づいてマーカーを生成するクラス。
　情報ウィンドウは同時には一つしか表示されない（同時に複数表示されない）。
　ex.
　  var SMarker = new StaticMarker(map, closeInfoWinFunc);	// コンストラクタ
　  SMarker.createMarkers(markerInfos);	// マーカーの生成
　  SMarker.closeStaticInfoWindow();	// マーカーの情報ウィンドウを閉じる
　  SMarker.visible(false);		// 全マーカーの非表示
　  SMarker.visible(true);		// 全マーカーの表示
*/

// コンストラクタ
function StaticMarker(map, closeInfoWinFunc) {
	this.map = map;
	this.closeInfoWinFunc = closeInfoWinFunc;	// 情報ウィンドウを閉じる関数
	this.markerAr = [];		// 生成したマーカーを格納する配列。
	this.currentInfoWindow = null;	// 現在開いている情報ウィンドウ
}



// Publicメソッド
// マーカーの生成を行なう。
StaticMarker.prototype.createMarkers = function(markerInfo) {
//	this.markerInfoAr = markerInfo;
	if (markerInfo instanceof Array) {
		for (var i=0; i<markerInfo.length; i++) {
			this.create1Marker(markerInfo[i]);
		}
	}
	else {
		this.create1Marker(markerInfo);
	}
};



// Privateメソッド
// １つのマーカーの生成を行なう。
StaticMarker.prototype.create1Marker = function(markerInfo) {
	// マーカーの生成
	if (typeof markerInfo.shadow == 'string') {
		var shadow = markerInfo.shadow;
	}
	else if (typeof markerInfo.shadow == 'object') {
		var shadow = new google.maps.MarkerImage(markerInfo.shadow.url, undefined, undefined,
			new google.maps.Point(markerInfo.shadow.anchorX, markerInfo.shadow.anchorY)
		);
	}
	var markerOpts = {
		map: this.map,
		title: markerInfo.title,
		position: new google.maps.LatLng(markerInfo.position.lat, markerInfo.position.lng),
		icon: markerInfo.icon,
		shadow: shadow,
		zIndex: markerInfo.zIndex
	};
	var marker = new google.maps.Marker(markerOpts);
	this.markerAr.push(marker);
	
	// 情報ウィンドウの生成
	if (markerInfo.infoWindow) {
		with(markerInfo.position) {
			var infoWindowOpts = {
				content: markerInfo.infoWindow.content.replace('%lat', lat).replace('%lng', lng),
				maxWidth: 200
			};
		}
		var infoWindow = new google.maps.InfoWindow(infoWindowOpts);
		
		// イベントハンドラーの設定
		var myThis = this;
		google.maps.event.addListener(marker, 'click', function() {
		/*	if (myThis.currentInfoWindow) {
				myThis.currentInfoWindow.close();
			}*/
			if (myThis.closeInfoWinFunc) {
				myThis.closeInfoWinFunc();
			}
			else {
				myThis.closeStaticInfoWindow();
			}
			infoWindow.open(myThis.map, marker);
			myThis.currentInfoWindow = infoWindow;
		});
	}
};



// Publicメソッド
// 全マーカーの表示／非表示を制御する。
StaticMarker.prototype.visibile = function(visibility) {
	for (var i=0; i<this.markerAr.length; i++) {
		this.markerAr[i].setVisible(visibility);
	}
	
	if (this.currentInfoWindow) {
		if (! visibility) {
			// マーカーを非表示にした時は情報ウィンドウを閉じる
			// this.currentInfoWindow.close();
			// このクラスを使っているプログラムの情報ウィンドウを閉じる処理を呼び出すことで情報ウィンドウを閉じる。
			if (this.closeInfoWinFunc) {
				this.closeInfoWinFunc();
			}
			else {
				this.closeStaticInfoWindow();
			}
		}
	}
};



// Publicメソッド
// 開いている固定マーカーの情報ウィンドウを閉じる。
StaticMarker.prototype.closeStaticInfoWindow = function() {
	if (this.currentInfoWindow) {
		this.currentInfoWindow.close();
	}
};
