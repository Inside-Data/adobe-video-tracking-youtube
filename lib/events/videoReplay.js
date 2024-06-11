'use strict';

module.exports = function(settings, trigger) {
	window.triggerReplay = function(){
		trigger();
	}
};

