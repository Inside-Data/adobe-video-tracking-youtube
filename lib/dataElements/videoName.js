'use strict';

module.exports = function(settings) {
	if(YT.Player.YTEvideoTitle){
		return YT.Player.YTEvideoTitle;
	} else {
		return "YouTube Video Name not set";
	}
};
