'use strict';

module.exports = function(settings, trigger) {
	window.triggerEnded = function(){
		trigger();
	}
};

