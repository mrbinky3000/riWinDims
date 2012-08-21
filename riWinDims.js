/*jslint nomen: true, browser: true */
/*global jQuery */
/*properties
    URL, addClass, ajax, animateResize, append, attr, bottom, breakPointUL,
    clearInterval, css, data, 'data-windims-height', 'data-windims-width',
    dataType, destroy, document, each, end, error, extend, find, firstInit,
    floor, fn, getByUnique, getDims, height, hideResizer, html, htmlTemplate,
    init, is, length, live, menu, name, on, open, opener, outerHeight,
    outerWidth, prepend, preventDefault, qrCode, remove, removeClass, resizeTo,
    riWinDims, setInterval, settings, showResizer, sizeMap, slideDown, slideUp,
    start, stop, success, target, top, unbind, unique, updateWinDims, url, width
*/
/*!
 * riWinDims
 *
 * This jQuery plugin helps developers debug and present responsive website
 * prototypes to peers and clients.  It displays the current window dimensions, a
 * scan-able QR code, and options to resize the browser window.
 *
 * When this was first created, there were very few browser plugins for responsive
 * web design. Now, there are plenty of plugins and scriptlets. However, your
 * client may not have them installed and you may not want to complicate things by
 * requiring your client to install them before viewing your work.
 *
 *
 * @version 0.1.0
 * @date 8/20/2012
 * @author Matthew Toledo, John Keber
 * @require jQuery v1.5+
 */
(function ($) {
    "use strict";

    $.riWinDims = function (element, options) {

        var defaults = {
                sizeMap: [
                    {unique: 'fueg', menu: 0, start: 0, end: 319, name: 'small / text'},
                    {unique: 'fumv', menu: 1, start: 320, end: 320, name: 'iPhone Portrait', height: 480},
                    {unique: 'lknj', menu: 0, start: 321, end: 479, name: '&lt; iPhone Landscape'},
                    {unique: 'n4js', menu: 1, start: 480, end: 480, name: 'iPone Landscape', height: 320},
                    {unique: 'n0ep', menu: 0, start: 481, end: 599, name: '&lt; Kindle Nook'},
                    {unique: '4p3z', menu: 1, start: 600, end: 600, name: 'Kindle Nook Portrait', height: 800},
                    {unique: 'm1bs', menu: 0, start: 601, end: 767, name: '&lt; iPad Portrait'},
                    {unique: '2ouh', menu: 1, start: 768, end: 768, name: 'iPad Portrait', height: 1024},
                    {unique: 'cmth', menu: 0, start: 769, end: 799, name: '&lt; Kindle Nook Landscape'},
                    {unique: '39pc', menu: 1, start: 800, end: 800, name: 'Kindle Nook Landscape', height: 600},
                    {unique: 'ndue', menu: 0, start: 801, end: 959, name: '&lt; iPad Landscape'},
                    {unique: '3p7d', menu: 1, start: 960, end: 960, name: '960px', height: 680},
                    {unique: 'lmup', menu: 0, start: 961, end: 1023, name: '&lt; iPad Landscape'},
                    {unique: 'izho', menu: 1, start: 1024, end: 1024, name: 'iPad Landscape', height: 768},
                    {unique: 'tb1d', menu: 0, start: 1025, end: 9999, name: 'Generic Desktop'}
                ],
                qrCode: 'https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl=' + encodeURI(document.URL) + '&chld=L',
                breakPointUL: '#ri-breakpoint-menu',
                htmlTemplate: 'ri-windims-menu.html'
            },
            plugin = this,
            $el = $(element),
            winW,
            winH;

        plugin.showResizer = function () {
            $('#ri-sizer').html('-');
            $('#ri-winDims').addClass('ri-full-opacity');
            $('#ri-sizes').stop(true, true).slideDown();
        };

        plugin.hideResizer = function () {
            $('#ri-sizer').html('+');
            $('#ri-winDims').removeClass('ri-full-opacity');
            $('#ri-sizes').stop(true, true).slideUp();
        };

        plugin.getDims = function () {
            winW = parseInt($(window).width(), 10);
            winH = parseInt($(window).height(), 10);
        };

        /**
         * Updates the readout with the latest window dimensions.  Highlight the current dimensions.
         */
        plugin.updateWinDims = function () {

            var menu,
                $ul = $(plugin.settings.breakPointUL),
                i = plugin.settings.sizeMap.length - 1,
                o,
                screen,
                numMatch = 0;

            $ul.find('li a').removeClass('ri-bold');


            while (i > 0) {
                o = plugin.settings.sizeMap[i];
                menu = o.menu;


                if (winW >= o.start && winW <= o.end) {
                    $ul.find('a[data-unique=' + o.unique + ']').addClass('ri-bold');
                    screen = o.name;
                    numMatch = numMatch + 1;
                }

                i = i - 1;
            }

            $('#ri-winH').html(winH);
            $('#ri-winW').html(winW);
            $('#ri-screen').html(screen);

        };

        plugin.getByUnique = function (unique) {
            var j = plugin.settings.sizeMap.length - 1;
            while (j >= 0) {
                if (plugin.settings.sizeMap[j].unique === unique) {
                    return plugin.settings.sizeMap[j];
                }
                j -= 1;
            }
            throw new Error("No such sizeMap item with given unique id of " + unique);
        };

        plugin.animateResize = function (startInnerWidth, startInnerHeight, targetInnerWidth, targetInnerHeight, steps, delay) {
            var interval, widthSteps, heightSteps, i = 1,

                _animateResize = function () {
                    var w, h, widthOffset, heightOffset;

                    // window.resize() resizes the browser's outer width, not the width of the viewport.
                    // we need to compensate each iteration to account for appearing/disappearing scroll bars, etc.
                    if (window.outerWidth) {
                        widthOffset = window.outerWidth - $(window).width();
                        heightOffset = window.outerHeight - $(window).height();
                    }

                    if (i === steps) {
                        window.clearInterval(interval);
                        window.resizeTo(targetInnerWidth + widthOffset, targetInnerHeight + heightOffset);
                        plugin.getDims();
                        plugin.updateWinDims();
                        return;
                    }

                    w = widthOffset + startInnerWidth + (widthSteps * i);
                    h = heightOffset + startInnerHeight + (heightSteps * i);
                    i += 1;
                    window.resizeTo(w, h);

                };

            widthSteps = Math.floor((targetInnerWidth - startInnerWidth) / steps);
            heightSteps = Math.floor((targetInnerHeight - startInnerHeight) / steps);
            //console.log('winW',winW,'winH',winH,'startInnerWidth',startInnerWidth,'startInnerHeight',startInnerHeight,'targetInnerWidth',targetInnerWidth,'targetInnerHeight',targetInnerHeight,'widthSteps',widthSteps,'heightSteps',heightSteps);
            interval = window.setInterval(function () {
                _animateResize();
            }, delay);

        };


        /**
         * Only called the first ever time this plugin is used.  This sets up global events and dom elements.
         * @private
         */
        plugin.firstInit = function () {

            var $li,
                $ul,
                i = plugin.settings.sizeMap.length - 1,
                o,
                newWidth,
                newHeight;

            // get initial dims potentially before the page is done loading to that we give them something
            plugin.getDims();

            // Create the HTML container.
            $.ajax({
                url: plugin.settings.htmlTemplate,
                dataType: 'html',
                success: function (data) {


                    $('body').data('riWinDims', true).prepend(data);
                    $ul = $(plugin.settings.breakPointUL);
                    while (i > 0) {

                        o = plugin.settings.sizeMap[i];

                        if (1 === o.menu) {
                            $li = $('<li><a class="ri-resizer" data-unique="' + o.unique + '" href="#">(' + o.start + 'px) ' + o.name + '</a></li>');
                            $ul.append($li);
                        }

                        i = i - 1;
                    }

                    // set up the qr code
                    if ('string' === typeof plugin.settings.qrCode) {
                        $('#ri-QR img').attr('src', plugin.settings.qrCode);
                    } else {
                        $('#ri-QR').remove();
                    }

                    // now that our tool is loaded, show them the current windims (the page may not be done loading, and these may be innacurate at this stage)
                    plugin.updateWinDims();

                    // listen to window resize events and update our tool with the latest dims
                    $(window).on('resize.riWinDims', function () {
                        plugin.getDims();
                        plugin.updateWinDims();
                    });

                    // Now, make double sure we have the correct dims, perhaps a scroll bar popped up or an image forced the page wider?
                    $(window).on('load.riWinDims', function () {
                        plugin.getDims();
                        plugin.updateWinDims();
                    });

                },
                error: function () {
                    throw new Error("riWinDims was unable to load the html template.");
                }

            });


            // did we create this popup? Time to resize
            if (window.opener) {
                newWidth = $("body", window.opener.document).data('windims-width');
                newHeight = $("body", window.opener.document).data('windims-height');
                plugin.animateResize(winW, winH, newWidth, newHeight, 10, 100);
            }


            // handle requests to resize the current window to specific dimensions
            // only works if the current window was created via javascript.
            $('.ri-resizer').live('click', function (evnt) {
                var startInnerWidth = winW,
                    startInnerHeight = winH,
                    sizeObj = plugin.getByUnique($(this).data('unique')),
                    targetInnerWidth = sizeObj.start,
                    targetInnerHeight = sizeObj.height,
                    iSteps = 30,
                    time = Math.floor(900 / iSteps);


                evnt.preventDefault();

                // Is this window a popup?  If so, resize it.  If not, open the current page in a popup.
                if (!window.opener) {
                    $('body').attr({
                        'data-windims-width': targetInnerWidth,
                        'data-windims-height': targetInnerHeight
                    });
                    window.open(document.URL, '__blank__', 'width=200,height=300,location=yes,menubar=no,links=no,scrollbars=yes,toolbar=no,status=no');
                } else {
                    plugin.getDims();
                    plugin.animateResize(startInnerWidth, startInnerHeight, targetInnerWidth, targetInnerHeight, iSteps, time);
                    plugin.hideResizer();
                }
                return false;

            });

            // show or hide the resize options
            $('#ri-sizer').live('click', function (ev) {
                ev.preventDefault();
                if ($('#ri-sizes').is(':hidden')) {
                    plugin.showResizer();
                } else {
                    plugin.hideResizer();
                }
                return false;
            });

            // move the bar from top to bottom and back again
            $('#ri-locate').live('click', function (ev) {
                ev.preventDefault();
                var $this = $(this);
                $this = $(ev.target);

                if ($this.attr('data-arrow') === 'd') {
                    $('#ri-winDims').css({
                        'top': 'auto',
                        'bottom': '0'
                    });
                    $this.attr('data-arrow', 'u');
                    $this.html('&#9650;');
                } else {
                    $('#ri-winDims').css({
                        'top': '0',
                        'bottom': 'auto'
                    });
                    $this.attr('data-arrow', 'd');
                    $this.html('&#9660;');

                }
                return false;
            });

        };

        plugin.settings = {};

        plugin.init = function () {

            plugin.settings = $.extend({}, defaults, options);

            // only set up global DOM elements and global event handlers ONCE
            if (!$('body').data('riWinDims')) {
                plugin.firstInit();
            } else {
                throw new Error("You can only use this plugin once per page.");
            }

        };


        plugin.destroy = function () {
            $(window).unbind('.riWinDims');
            $(document).unbind('.riWinDims');
            $el.remove();
        };


        plugin.init();


    };

    $.fn.riWinDims = function (options) {

        return this.each(function () {
            if (undefined === $(this).data('riWinDims')) {
                var plugin = new $.riWinDims(this, options);
                $(this).data('riWinDims', plugin);
            }
        });

    };

}(jQuery));
