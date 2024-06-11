'use strict';

module.exports = function(settings) {
	if(YT.Player.YTEmediaLength) {
		return YT.Player.YTEmediaLength;
	} else {
		return "YouTube Duration not set"
	}
};
