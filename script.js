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
	$('#start_btn').prop('disabled', true);
	$('#playarea').css('font-family', 'monospace');
	array = new BigUint64Array(buf);
	w = 64;
	h = 48;
	black = $('#black').val();
	white = $('#white').val();
	lastFrame = 6570;
	lookahead = $('#lookahead').prop('checked');
	fps = 30;
	// 読み込み
	video = new Array(lastFrame);
	let str;
	let i = 0;
	setTimeout(function tmp(){
		loadFrame(i);
		i++;
		if(i < lastFrame){
			if(lookahead){
				let prog = Math.floor(i / lastFrame * 1000) / 10 + '%';
				$('#playarea').val(prog);
			}
			setTimeout(tmp, 0);
		}else if(lookahead){
			startDate = Date.now();
			tick();
		}else{
			console.log("finish load");
		}
	}, 0);
	if(!lookahead){
		startDate = Date.now();
		tick();
	}
}

function loadFrame(i){
	str = "";
	for(let j = 0; j < h; j++){
		for(let k = 0; k < w; k++){
			str += (array[i * h + j] >> BigInt(w - k - 1)) % 2n == 1 ? white : black;
		}
		str += "\n";
	}
	video[i] = str;
}

function tick(){
	if(frame > lastFrame) stop();
	else{
		frame++;
		let interval = frame / fps * 1000 + startDate - Date.now();
		if(interval < 0){
			frame = Math.floor((Date.now() - startDate) / 1000 * 30);
		}
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
	
	$(document).keydown(e => {
		if(e.keyCode == 65){
			play();
		}
	});
});
