'use strict';

module.exports = function(settings) {
	if(YT.Player.YTEmediaOffset){
		return YT.Player.YTEmediaOffset;
	} else {
		return 0;
	}
};
