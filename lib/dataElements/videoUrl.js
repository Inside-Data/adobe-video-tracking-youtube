'use strict';

module.exports = function(settings) {
	if(YT.Player.YTEvideoURL){
		return YT.Player.YTEvideoURL;
	} else {
		return "YouTube Video URL not set";
	}
};