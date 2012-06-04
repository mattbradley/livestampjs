livetimestamp
=============

A simple, unobstrusive jQuery plugin that provides live "time ago" text to
your timestamped HTML elements using Moment.js. 

Dependencies
------------

* [jQuery](http://jquery.com): you already know what this is
* [Moment.js](http://momentjs.com): a great JavaScript library for parsing
  and displaying dates and times

Usage
-----

It's very simple: just add the `.livetimestamp` and the `data-timestamp`
attribute to the HTML element that you want to display the time ago text. The
value of `data-timestamp` should be the millisecond Unix time (the number of
milliseconds since January 1, 1970 12:00am UTC). This is the number accepted by
the JavaScript `Date()` constructor.

For instance:

    <span class="livetimestamp" data-timestamp="1338789242000"></span>

will display something like `5 minutes ago` on your page. As time passes, it
will automatically update to `6 minutes ago` then `7 minutes ago` and so on.

License
-------

Copyright (c) 2012 Matt Bradley

This software is freely distributable under the terms of the
[MIT license](http://www.opensource.org/licenses/MIT).
