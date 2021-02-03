var array;
var w;
var h;
var interval;
var buf;
var video;
var frame = 0;
var lastFrame;

function play(){
	array = new BigUint64Array(buf);
	w = $('#width').val();
	h = $('#height').val();
	var sec = 1000 / $('#fps').val();
	lastFrame = $('#frame').val();
	// 読み込み
	video = new Array(lastFrame);
	let str;
	for(let i = 0; i < lastFrame; i++){
		str = "";
		for(let j = 0; j < h; j++){
			for(let k = 0; k < w; k++){
				str += (array[i * h + j] >> BigInt(w - k - 1)) % 2n == 1 ? "□" : "■";
			}
			str += "\n";
		}
		video[i] = str;
	}
	
	interval = setInterval(tick, sec);
}


function tick(){
	$('#playarea').val(video[frame]);
	frame++;
	if(frame >= lastFrame) stop();
}

function stop(){
	clearInterval(interval);
	$('#playarea').val('END');
}

$(function() {
	var html = new XMLHttpRequest();
	html.open('GET', './badapple.dat');
	html.responseType = 'arraybuffer';
	html.onload = function(e){
		buf = this.response;
	}
	html.send();
});
