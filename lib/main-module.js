'use strict';

var timeupdater = new Map(),  //2.1.0 UPDATE:
    playerInfoList = [],      //2.1.0 UPDATE:
    customCueTriggered = [];  //2.1.0 UPDATE:

window.customCuePoint = [];   //2.1.0 UPDATE:
window.triggerCuePoint = [];  //2.1.0 UPDATE:

function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

function setGlobalVariables(event) {
	YT.Player.YTEvideoTitle = event.target.getVideoData().title;
	YT.Player.YTEvideoId = event.target.getVideoData().video_id;
	YT.Player.YTEmediaLength = Math.floor(event.target.getDuration());
	YT.Player.YTEmediaOffset = Math.floor(event.target.getCurrentTime());
	YT.Player.YTEvideoURL = event.target.getVideoUrl();
}

function onPlayerStateChange(event) {
	function onProgress() {
		var current = Math.floor(event.target.getCurrentTime());
		for (var j = 0; j < window.customCuePoint.length; j++) {
			if ((event.target.isVideoPlaying) &&
				(event.target.lastPlay <= (Math.floor(event.target.getDuration()) * window.customCuePoint[j] * 0.01)) && //2.1.0 UPDATE:
				(current >= (Math.floor(event.target.getDuration()) * window.customCuePoint[j] * 0.01)) &&               //2.1.0 UPDATE:
				(!customCueTriggered.includes(event.target.getVideoData().video_id + "|" + window.customCuePoint[j]))) {
				YT.Player.YTEvideoTitle = event.target.getVideoData().title;
				YT.Player.YTEvideoId = event.target.getVideoData().video_id;
				YT.Player.YTEmediaLength = Math.floor(event.target.getDuration());
				YT.Player.YTEvideoURL = event.target.getVideoUrl();
				YT.Player.YTEmediaOffset = current;
				customCueTriggered.push(YT.Player.YTEvideoId + "|" + window.customCuePoint[j]);
				window.triggerCuePoint[j]();
			}
		}
	}

	setGlobalVariables(event);

	if (event.data == YT.PlayerState.PLAYING) {
		if (YT.Player.YTEmediaOffset === 0) {
			event.target.lastPlay = Math.floor(YT.Player.YTEmediaOffset);
			event.target.isVideoPlaying = true;
			for (var i = 0; i < customCueTriggered.length; i++) {
				if (customCueTriggered[i].includes(YT.Player.YTEvideoId)) {
					customCueTriggered.splice(i, 1);
					i--;
				}
			}
			if (window.triggerStart !== undefined && !event.target.started) {
				event.target.started = true;
				window.triggerStart();
			} else if (window.triggerReplay !== undefined && event.target.started && !event.target.replay) {
				event.target.replay = true;
				window.triggerReplay();
			}
		}
		if (YT.Player.YTEmediaOffset > 0 && window.triggerPlay !== undefined) {
			event.target.lastPlay = Math.floor(YT.Player.YTEmediaOffset);
			event.target.isVideoPlaying = true;
			window.triggerPlay();
		}
		if (window.triggerCuePoint.length > 0 && !timeupdater.has(YT.Player.YTEvideoId)) {
			timeupdater.set(YT.Player.YTEvideoId, setInterval(onProgress, 1000));
		}
	}
	if (event.data == YT.PlayerState.PAUSED && window.triggerPause !== undefined) {
		event.target.isVideoPlaying = false;
		window.triggerPause();
	}
	if (event.data == YT.PlayerState.BUFFERING && window.triggerBuffer !== undefined) {
		window.triggerBuffer();
	}
	if (event.data == YT.PlayerState.ENDED) {
		event.target.replay = false;
		if (window.triggerEnded !== undefined) {
			window.triggerEnded();
		}
	}
}

function onPlayerReady(event) {
	if (window.triggerReady !== undefined) {
		setGlobalVariables(event);
		window.triggerReady();
	}
}

function addQSParm(curURL, name, value) {
	var re = new RegExp("([?&]" + name + "=)[^&]+", "");

	function add(sep) {
		curURL += sep + name + "=" + encodeURIComponent(value);
	}

	function change() {
		curURL = curURL.replace(re, "$1" + encodeURIComponent(value));
	}
	if (curURL.indexOf("?") === -1) {
		add("?");
	} else {
		if (re.test(curURL)) {
			change();
		} else {
			add("&");
		}
	}
	return curURL;
}

document.onreadystatechange = function() {
	if (document.readyState === 'complete') {

		/*YouTube Player updates required by Adobe Video Tracking module */
		var n = 0;
		var playerId = "player";

		var iFrames = document.querySelectorAll('iframe[src*="://www.youtube"]'); //2.1.0 UPDATE: this only returns youtube iFrames instead of all iFrames on the page

		for (var i = 0; i < iFrames.length; i++) {
			var src = iFrames[i].src;
			iFrames[i].setAttribute('id', playerId + (n + 1)); //2.1.0 UPDATE:	
			playerInfoList.push(playerId + (n + 1));
			iFrames[i].setAttribute('src', addQSParm(src, 'enablejsapi', '1')); //2.1.0 UPDATE:	
			src = addQSParm(src, "enablejsapi", "1");
			iFrames[i].setAttribute('src', addQSParm(src, 'rel', '0')); //2.1.0 UPDATE:
			n++;
		}

		var players = []; //2.1.0 UPDATE:

		window.onYouTubeIframeAPIReady = function() {
			var x;
			for (x = 0; x < playerInfoList.length; x++) {
				players[x] = new YT.Player(playerInfoList[x], {
					events: {
						started: false,
						replay: false,
						lastPlay: 0,
						isVideoPlaying: false,
						'onStateChange': onPlayerStateChange,
						'onReady': onPlayerReady
					}
				});
			}
		};

		if (playerInfoList.length > 0) { //2.1.0 UPDATE:
			/* Loads IFrame Player API Code asynchronously */
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}                                //2.1.0 UPDATE:
	}
};