/*
マーカー（と、情報ウィンドウ）の定義

・データの定義
　一つのマーカー（と、情報ウィンドウ）の定義は以下のようになっています。これを配列にしてStaticMarkerクラスのコンストラクタに引き渡します。
　position以外は省略可です。
　
	{
		title:ロールオーバーテキスト(string),
		position:{
			lat:緯度(number),
			lng:経度(number)
		},
		icon:アイコン画像のURL(string),
		shadow:{
			url: 影画像のURL(string),
			anchorX: 影画像のanchorのX座標(number),
			anchorY: 影画像のanchorのY座標(number)
		},	（※anchorの指定が必要ない場合、shaowは影画像のURL(string)だけでもよい。）
		infoWindow:{
			contet:情報ウィンドウに表示されるHTML(string)
			（※content中の%lat, %lngはposition.lat, position.lngで置き換えられます。）
		}
	}
*/


// 固定マーカーの情報
var MarkerInfos = [
	{
		title: "桟敷席82-J24",
		position: {
			lat: 39.718703,
			lng: 140.111703
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/seat.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/seatShadow.png',
			anchorX: 8,
			anchorY: 14
		},
		zIndex:200,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">桟敷席82-J24</div>\
						<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
				  	  </div>',
		}
	},
	{
		title: "仮設トイレ",
		position: {
			lat: 39.718576,
			lng: 140.111239
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toilet0.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toiletShadow.png',
			anchorX: 10,
			anchorY: 20
		},
		zIndex:10,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">仮設トイレ</div>\
						<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
				  	  </div>',
		}
	},
	{
		title: "仮設トイレ",
		position: {
			lat: 39.718303,
			lng: 140.114878
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toilet0.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toiletShadow.png',
			anchorX: 10,
			anchorY: 20
		},
		zIndex:11,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">仮設トイレ</div>\
						<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
				  	  </div>',
		}
	},
	{
		title: "駐車場",
		position: {
			lat: 39.719595,
			lng: 140.112106
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/parking.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toiletShadow.png',
			anchorX: 10,
			anchorY: 20
		},
		zIndex:50,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">○○駐車場</div>\
					  	<div class="infoWinDescription">\
							<table style="margin-left:10px; background-color:#e0e0e0;">\
								<colgroup class="leftCol">\
								<colgroup class="rightCol">\
								<tr><td>台数</td><td>130台</td></tr>\
								<tr><td>料金</td><td>最初の60分400円。以降30分ごとに100円。</td></tr>\
								<tr><td>営業時間</td><td>24時間</td></tr>\
							</table>\
						</div>\
						<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
				  	  </div>',
		}
	},
	{
		title: "駐車場",
		position: {
			lat: 39.718264,
			lng: 140.116296
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/parking.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/toiletShadow.png',
			anchorX: 10,
			anchorY: 20
		},
		zIndex:51,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">○○駐車場</div>\
					  	<div class="infoWinDescription">\
							<table style="margin-left:10px; background-color:#e0e0e0;">\
								<colgroup class="leftCol">\
								<colgroup class="rightCol">\
								<tr><td>台数</td><td>130台</td></tr>\
								<tr><td>料金</td><td>最初の60分400円。以降30分ごとに100円。</td></tr>\
								<tr><td>営業時間</td><td>24時間</td></tr>\
							</table>\
						</div>\
						<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
				  	  </div>',
		}
	},

	{
		title: "鐵砲町",
		position: {
			lat: 39.719322,
			lng: 140.10878
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/tepoucho.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/chochinShadow.png',
			anchorX: 15,
			anchorY: 31
		},
		zIndex:100,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">鐵砲町竿燈会</div>\
					  	<div class="infoWinIntro"><a href="http://www.hikiyama-map.com/taguchi/viewer/kanto/kanto.html#page1">\
							<img src="http://www.hikiyama-map.com/taguchi/staticMarker/images/tepouchoLarge.png" alt="鐵砲町竿燈会"><br/>町内紹介\
						</div>\
					  	<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
					  </div>',
		}
	},
	{
		title: "南通",
		position: {
			lat: 39.718926,
			lng: 140.110102
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/minamidori.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/chochinShadow.png',
			anchorX: 15,
			anchorY: 31
		},
		zIndex:101,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">南通竿燈会</div>\
					  	<div class="infoWinIntro"><a href="http://www.hikiyama-map.com/taguchi/viewer/kanto/kanto.html#page2">\
							<img src="http://www.hikiyama-map.com/taguchi/staticMarker/images/minamidoriLarge.png" alt="南通竿燈会"><br/>町内紹介\
						</a></div>\
					  	<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
					  </div>',
		}
	},
	{
		title: "毘沙門町",
		position: {
			lat: 39.718558,
			lng: 140.112312
		},
		icon: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/bisyamoncho.png',
		shadow: {
			url: 'http://www.hikiyama-map.com/taguchi/staticMarker/images/chochinShadow.png',
			anchorX: 15,
			anchorY: 31
		},
		zIndex:102,
		infoWindow: {
			content: '<div class="infoWinContainer">\
						<div class="infoWinTitle">毘沙門町竿燈会</div>\
					  	<div class="infoWinIntro"><a href="http://www.hikiyama-map.com/taguchi/viewer/kanto/kanto.html#page3">\
							<img src="http://www.hikiyama-map.com/taguchi/staticMarker/images/bisyamonchoLarge.png" alt="毘沙門町竿燈会"><br/>町内紹介\
						</a></div>\
					  	<div class="infoWinRoute"><a href="javascript:routeDisplay(%lat, %lng)">ルート表示</a></div>\
					  </div>',
		}
	}
];

