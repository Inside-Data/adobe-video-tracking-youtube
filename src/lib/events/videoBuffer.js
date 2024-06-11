'use strict';

module.exports = function(settings, trigger) {
	window.triggerBuffer = function(){
		trigger();
	}
};

