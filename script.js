var array;
var w;
var h;
var interval;
var buf;
var video;
var frame = 0;
var lastFrame;
var p;
var black;
var white;
var startDate;

function play(){
	p = document.getElementById('prog');
	array = new BigUint64Array(buf);
	w = $('#width').val();
	h = $('#height').val();
	black = $('#black').val();
	white = $('#white').val();
	lastFrame = $('#frame').val();
	// 読み込み
	video = new Array(lastFrame);
	let str;
	for(let i = 0; i < lastFrame; i++){
		str = "";
		for(let j = 0; j < h; j++){
			for(let k = 0; k < w; k++){
				str += (array[i * h + j] >> BigInt(w - k - 1)) % 2n == 1 ? white : black;
			}
			str += "\n";
		}
		video[i] = str;
	}
	startDate = Date.now();
	tick();
}

function tick(){
	if(frame > lastFrame) stop();
	else{
		frame++;
		let interval = frame * 100 / 3 + startDate - Date.now();
		setTimeout(tick, interval);
		$('#playarea').val(video[frame]);
	}
}

function stop(){
	clearInterval(interval);
	$('#playarea').val('END');
}

$(function() {
	var html = new XMLHttpRequest();
	html.open('GET', './BadApple.dat');
	html.responseType = 'arraybuffer';
	html.onload = function(e){
		buf = this.response;
	}
	html.send();
});
