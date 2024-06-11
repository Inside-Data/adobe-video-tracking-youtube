'use strict';

module.exports = function(settings) {
	if(YT.Player.YTEvideoId) {
		return YT.Player.YTEvideoId;
	} else {
		return "YouTube Video ID not set"
	}
};
