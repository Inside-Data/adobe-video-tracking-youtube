'use strict';

module.exports = function(settings, trigger) {
	window.triggerReady = function(){
		trigger();
	}
};

