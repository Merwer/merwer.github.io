/*global jQuery*/
(function PersonalResume($) {
    "use strict";
    var stageSelectJumpTarget;
    var stageFlashTimer;
    var flashTimeDuration = 150;
    // Experimental values based on trial & error
    var timeInWhite = flashTimeDuration / 7;
    var timeInLines = flashTimeDuration * (2 / 3);

    function jump(element, callback) {
        var start = element.offset();
        var bezier_params = {
            start: {
                x: start.left,
                y: start.top
            },
            end: {
                x: window.stageSelectJumpTarget.left,
                y: window.stageSelectJumpTarget.top
            }
        };
        element.animate({
            path: new $.path.bezier(bezier_params)
        }, 1000, 'linear', callback);
    }

    function resetSelectScreen(callback) {
        // Return to original screen
        $('div.lightblue .text').html(''); // Clear the text for next time
        $('.flashscreen').hide();
        $('.main').show();
        if (callback && typeof callback === 'function') {
            callback();
        }
    }

    function writeText(text, callback) {
        // Update the text
        var p = text.clone();
        p.css('margin', '0').css('display', 'none');
        $('div.lightblue .text').append(p);
        p.fadeIn(1000); // TODO: Typewriter effect

        // Set up next click to return to previous page
        $('.flashscreen').one('click', function () {
            resetSelectScreen(callback);
        });
    }

    function makeCopy(ele) {
        var pos = ele.offset();
        var copy = ele.clone();
        // Update the element to have an absolute top/left coordinates
        // in CSS so that the animations will work properly.
        copy.css('top', pos.top);
        copy.css('left', pos.left);
        copy.css('margin', 0);
        copy.css('position', 'absolute');
        copy.appendTo('.flashscreen');
        return copy;
    }

    function toggleFlashView() {
        $('.flashscreen').toggleClass('flashed');
    }

    function stageFlash(toggle) {
        if (toggle) {
            $('.main').hide();
            $('.flashscreen').show();
            toggleFlashView();
            window.stageFlashTimer = window.setInterval(toggleFlashView, flashTimeDuration);
        } else {
            $('.flashscreen').removeClass('flashed'); // Make sure we end on the lines
            window.clearInterval(window.stageFlashTimer);
        }
    }

    function stageSelected(source) {
        var divTarget = source.currentTarget;
        var img = $('.selectbox img', divTarget);
        var text = $('p.descriptivetext', divTarget);
        if (img === null || img === undefined || img.length === 0) {
            return; //TODO This is an error - handle it better
        }
        var copy = makeCopy(img);
        stageFlash(true); // Start the flashing
        $('.selectbox', divTarget).addClass('completed'); // Mark the element as being seen
        jump(copy, function () {
            stageFlash(false);
            writeText(text, function () {
                copy.remove();
            });
        });
    }

    $(document).ready(function () {
        var targetImage = $('.main .row:nth-child(2) .selectbox img');
        $('.stage').on('click', stageSelected);
        window.stageSelectJumpTarget = {};
        window.stageSelectJumpTarget.left = targetImage.offset().left * 1.03;
        window.stageSelectJumpTarget.top = targetImage.offset().top + 10;
        $('.flashscreen').width($('.main').width());
        $('.flashscreen').height($('.main').height());
    });
}(jQuery));