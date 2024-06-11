'use strict';

module.exports = function(settings, trigger) {
	window.triggerStart = function(){
		trigger();
	}
};

