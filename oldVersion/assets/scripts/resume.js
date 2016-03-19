var StageSelectJumpTarget;
$(document).ready(function () {
    $('div.stage').on('mouseenter', function () {
        $('.selectbox', this).addClass('selected');
    });
    $('div.stage').on('mouseleave', function () {
        $('.selectbox', this).removeClass('selected');
    });
    $('div.stage').on('click', StageSelected);
	window.StageSelectJumpTarget = {};
	window.StageSelectJumpTarget.left = $('#stage5 .selectbox img').offset().left - 20;
	window.StageSelectJumpTarget.top = $('#stage3 .selectbox img').offset().top + 20;
});

function StageSelected() {
	var img = $('.selectbox img', this);
	var text = $('p.descriptivetext', this);
	if(img == null || img == undefined || img.length == 0) {
		return; //TODO This is an error - handle it better
	}
	var copy = MakeCopy(img);
	StageFlash(true); // Start the flashing
	$('.selectbox', this).addClass('completed'); // Mark the element as being seen
	Jump(copy, function() {
		StageFlash(false);
		WriteText(text, function() {
			copy.remove();
		});
	});
}

function Jump(element, callback) {
	var start = element.offset();
	var bezier_params = {
        start: {
            x: start.left,
            y: start.top
        },
        end: {
            x: window.StageSelectJumpTarget.left,
            y: window.StageSelectJumpTarget.top
        }
    };
	element.animate({path : new $.path.bezier(bezier_params)}, 1000, 'linear', callback);
}

function WriteText(text, callback) {
	// Update the text
	var p = text.clone();
	p.css('margin', '0').css('display', 'none');
	$('div.lightblue .text').append(p);
	p.fadeIn(1000); // TODO: Typewriter effect
	
	// Set up next click to return to previous page
	$('#flashscreen').one('click', function() { ResetSelectScreen(callback); });
}

function ResetSelectScreen(callback) {
	// Return to original screen
	$('div.lightblue .text').html(''); // Clear the text for next time
	$('#flashscreen').hide();
	$('#main').show();
	if(callback && typeof callback == 'function')
		callback();
}
function MakeCopy(ele) {
	var pos = ele.offset();
	var copy = ele.clone();
	// Update the element to have an absolute top/left coordinates
	// in CSS so that the animations will work properly.
	copy.css('top', pos.top);
	copy.css('left', pos.left);
	copy.css('margin', 0);
	copy.css('position', 'absolute');
	copy.appendTo('#flashscreen');
	return copy;
}

var StageFlashTimer;
var FlashWhiteScreen;
var FlashTimeDuration = 150;
// Experimental values based on trial & error
var TimeInWhite = FlashTimeDuration / 7;
var TimeInLines = FlashTimeDuration * (2 / 3);
function StageFlash(toggle) {
	if(toggle) {
		$('#main').hide();
		$('#flashscreen').show();
		window.FlashWhiteScreen = true; // Start out with the lines
		ToggleFlashView();
		window.StageFlashTimer = window.setInterval(ToggleFlashView, FlashTimeDuration);
	}
	else {
		if(window.FlashWhiteScreen === true) { // Make sure we end on the lines
			ToggleFlashView();
		}
		window.clearInterval(window.StageFlashTimer);
	}
}
function ToggleFlashView() {
	if(window.FlashWhiteScreen) {
		// Set to line view
		$('#flashscreen div.white').fadeOut(TimeInWhite, function() {
			$('#flashscreen div.lines').fadeIn(TimeInLines);
		});
	}
	else {
		// Set to white view
		$('#flashscreen div.lines').fadeOut(TimeInLines, function() {
			$('#flashscreen div.white').fadeIn(TimeInWhite);
		});
	}
	window.FlashWhiteScreen = ! window.FlashWhiteScreen;
}