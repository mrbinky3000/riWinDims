#winDims

This jQuery plugin helps developers present website prototypes to peers and clients while providing width and height
information useful for debugging.  In addition to the current window dimensions, there is a scan-able QR code, and
options to resize the current browser window (See "Behavior" below).

When I first created this script, there were very few browser plugins for responsive web design.  Now, there are plenty
of plugins and scriptlets.  However, your client may not have them installed and you may not want to complicate things
by requiring your client to install them before viewing your work, because once you cross that line, you're on the hook
whenever their browser needs tech support.

__The only benefit to this plugin over the various browser scriptlets and plugins that currently exist, is that this
script allows clients and colleagues to self-explore your prototypes without requiring them to install anything on
their computers.__ That's actually a pretty big plus over the competition :-)

The drawback is that this code needs to be disabled and removed before final delivery.  If you place
this code in the site-wide JavaScript for your project, you only have to disable one instance.

##Supported Browsers
- IE7 and up.
- Pretty much every web browser.
- Mobile devices can't do popups.

##Overhead
- 32kb : jQuery

##Directions
1 Copy the riWinDims.js file to your project and Include the plugin in your JavaScript.
2 Copy the ri-windims-menu.css file to your project and include it in your HTML.
3 Copy the ri-windims-menu.html file to your project.
4 Attach the plugin to the $(body) inside a script tag at the bottom of your page or inside a jQuery dom-ready block.
5 Configure the jQuery plugin.

##Behavior
Once up and running, this plugin provides the current dimensions.

The "+" button displays a configurable list of target sizes in a dropdown.   If the window was created by the plugin
(a popup, see "Why Popups?" section below), then clicking on the options in the dropdown menu resizes the current
window.  Otherwise, a new window is created and immediately resized.

The arrow button moves the readout display from the top to the bottom and back again.


##Why Popups?
JavaScript security prevents JavaScript from resizing the current browser window unless the browser window was initially
created via JavaScript.  In simple terms, Javascript can only resize the windows created it creates.  Note: there are
ways you can disable this security feature in your browser's configuration options, but you really don't want to do
that.  You definitely don't want to require your clients to do that either.

##Configuration Options

```javascript
var defaults = {
    sizeMap: [
        {unique: 'fueg', menu: 0, start: 0,    end: 319,  name: 'small / text'},
        {unique: 'fumv', menu: 1, start: 320,  end: 320,  name: 'iPhone Portrait', height: 480},
        {unique: 'lknj', menu: 0, start: 321,  end: 479,  name: '&lt; iPhone Landscape'},
        {unique: 'n4js', menu: 1, start: 480,  end: 480,  name: 'iPone Landscape', height: 320},
        {unique: 'n0ep', menu: 0, start: 481,  end: 599,  name: '&lt; Kindle Nook'},
        {unique: '4p3z', menu: 1, start: 600,  end: 600,  name: 'Kindle Nook Portrait', height: 800},
        {unique: 'm1bs', menu: 0, start: 601,  end: 767,  name: '&lt; iPad Portrait'},
        {unique: '2ouh', menu: 1, start: 768,  end: 768,  name: 'iPad Portrait', height: 1024},
        {unique: 'cmth', menu: 0, start: 769,  end: 799,  name: '&lt; Kindle Nook Landscape'},
        {unique: '39pc', menu: 1, start: 800,  end: 800,  name: 'Kindle Nook Landscape', height: 600},
        {unique: 'ndue', menu: 0, start: 801,  end: 959,  name: '&lt; iPad Landscape'},
        {unique: '3p7d', menu: 1, start: 960,  end: 960,  name: '960px', height: 680},
        {unique: 'lmup', menu: 0, start: 961,  end: 1023, name: '&lt; iPad Landscape'},
        {unique: 'izho', menu: 1, start: 1024, end: 1024, name: 'iPad Landscape', height: 768},
        {unique: 'tb1d', menu: 0, start: 1025, end: 9999, name: 'Generic Desktop'}
    ],
    qrCode: 'https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl=' + encodeURI(document.URL) + '&chld=L',
    breakPointUL: '#ri-breakpoint-menu',
    htmlTemplate: 'ri-windims-menu.html'
}
```

<dl>
<dt>sizeMap (array of objects)</dt>
<dd>An array of objects that contain information about the target devices (breakpoints) and the spaces between the target devices (ranges).
It looks scary but it's not, and hardly anyone would ever need to mess with it.
<ul>
<li><b>unique (string)</b>:  a unique id. Acts just like a unique id in a database.</li>
<li><b>menu (integer)</b>: 1 means show this as a clickable option in the dropdown menu.  If set to 1, the start and end must be the same value.  0 means this does not show up in the dropdown menu, but will be displayed in the main readout.  Rule of thumb: Breakpoints (start and end are the same) should have 1's.  Ranges (start is less than end) should have 0's.</li>
<li><b>start (integer)</b>: Pixels for the start of a range or breakpoint.  Both start and end are inclusive, meaning a start of 30 includes 30.</li>
<li><b>end (integer)</b>: Pixels for the end of a range or breakpoint.  Both start and end are inclusive, meaning an end of 60 includes 60.</li>
<li><b>name (string)</b>: A description of this range or breakpoint.</li>
<li><b>height (integer)</b>: A target height for a particular breakpoint.  Only items with menu set to 1 and a start and end set to the same value should have a height defined.</li>
</dd>
<dt>qrCode (string)</dt>
<dd>A URL to Google's QR code API with the current url.  You'll most likely never need to change this.</dd>
<dt>breakPointUL (string)</dt>
<dd>A css selector representing the UL that holds the list of breakpoints.  You'll most likely never need to change this.</dd>
<dt>htmlTemplate (string)</dt>
<dd>An absolute or relative path to an HTML file on the same domain as the current server.</dd>
</dl>


