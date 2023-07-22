//ベースマップ
let gsi_awai = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
/*
let gsi = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});

let gsi_eisei = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

let area = [
    [35.582913855357226, 139.6599040062763],
    [35.577992529653805, 139.66467833846545]
];*/

//ベースマップ
let baseLayers = {
    //"地理院地図 標準": gsi,
    "地理院地図 淡色": gsi_awai,
    //"地理院地図 衛星画像": gsi_eisei,
    //"OpenStreetMap 標準": osm
};

//図書館位置
let librarys = L.geoJSON(library,{
    onEachFeature: function(feature, layer){
        layer.bindPopup('<a href="'+ feature.properties.url + '">' + feature.properties.図書館名 +'</a>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {icon:
            L.AwesomeMarkers.icon({
                icon: 'fa-book',
                markerColor: 'cadetblue',
                prefix: 'fa',
            })
        })
    },
    attribution: "<a href='https://catalog.data.metro.tokyo.lg.jp/dataset/t000021d2000000019'>東京都教育庁</a>のデータを編集"
});

//駐輪場位置
let cycle_icon =L.icon({
    iconUrl: 'https://zisyuu.com/wp-content/uploads/map/assets/cycle.png',
    iconSize: [21, 21],
    iconAnchor: [10.5, 10.5]
})

let cycles = L.geoJSON(cycle,{
    onEachFeature: function(feature, layer){
        layer.bindPopup(feature.properties.名称 + '<br/>収容台数：'+feature.properties.収容台数+'<br/>利用：<b>'+feature.properties.料金+'</b>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {
            icon:cycle_icon
        })
    },
    attribution: "<a href='｜<a href='https://www.seikatubunka.metro.tokyo.lg.jp/tomin_anzen/kotsu/jitensha/seisaku-jyourei/churinjou/'>東京都生活文化スポーツ局</a>のデータを編集"
});

//オーバレイ
let overLayers = {
    "図書館": librarys,
    "駐輪場": cycles
};

//マップのオプションたち
let mymap = L.map('map',{
    center:[35.68559087530657, 139.76015645053045],
    zoom:15,
    maxZoom:19,
    //minZoom:15,
    //maxBounds: area,
    preferCanvas:true,
    zoomControl:true,
    layers:[gsi_awai,librarys,cycles],
    condensedAttributionControl: false
});

//レイヤコントール追加
L.control.layers(baseLayers,overLayers).addTo(mymap);

//attributionのまとめプラグインーーーーーーーーーーーーーーーーーーーーーーー
L.control.condensedAttribution({
    emblem: '<div class="emblem-wrap"><i class="far fa-copyright"></i></div>',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="https://github.com/jomon111/kagoshima-hazard">Github</a>'
  }).addTo(mymap);

// 現在地表示プラグインーーーーーーーーーーーーーーーーーーーーーーーーーーーー
let lc = L.control.locate({
    flyTo:true,
    strings: {
        title: "現在地を表示する",
    },
    showPopup:false,
    onLocationError(){
        alert('現在地が見つかりません');
    },
    markerStyle:{
        iconURL:'/assets/test.gif'
    }
    /*onLocationOutsideMapBounds(){
        alert('あなたは新丸子にいないよ！');
        lc.stop();
    },*/
}).addTo(mymap);

//ダイアログプラグインーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var options = {
        title:'としょかんマップ',
        content:'<h3><u>はじめに</u></h3><p>このサイトは個人が作った<b>としょかんMAP</b>です。図書館と付近の駐輪場（※図書館に付随するものがあるかは図書館にお問い合わせください）の情報を載せてみました。<br>ご意見やお問い合わせは<a href="https://forms.gle/r18wQ3vw3DVHAHyh9">こちら</a>からお願いします。</p><h3><u>使い方</u></h3><p>①このダイアログを読み終えたら右下の<b>OKボタンを押してください</b>。<br>②位置情報許可のポップアップが表示されるので、許可すると現在地まで飛んでいきます。<br><h3><u>各ボタンの説明</u></h3><p><img src="https://zisyuu.com/wp-content/uploads/map/assets/layers.png">　表示情報を選ぶ<br><img src="https://zisyuu.com/wp-content/uploads/map/assets/location-arrow.png">　現在地を表示',
        modal: true,
        position:'center',
        closeButton:false
    };
    var win =  L.control.window(mymap, options)
    .prompt({callback:function(){
        //OKボタンを押したら初期から現在地を探す
        }}).show()

		