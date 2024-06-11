'use strict';

module.exports = function(settings, trigger) {
	window.triggerPause = function(){
		trigger();
	}
};

