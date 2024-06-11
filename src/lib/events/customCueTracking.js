'use strict';

module.exports = function(settings, trigger) {
	window.customCuePoint[window.customCuePoint.length] = settings.cue;
	window.triggerCuePoint[window.triggerCuePoint.length] = function(){
		trigger();
	}
};


// Do not ifre cue if video has seeked passed milestone