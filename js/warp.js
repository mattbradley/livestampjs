(function() {
  var y = 'years',
      mo = 'months',
      w = 'weeks',
      d = 'days',
      h = 'hours',
      m = 'minutes',
      s = 'seconds',
      ms = 'milliseconds',

      units = {
        y: y,
        yr: y,
        yrs: y,
        year: y,
        mo: mo,
        mos: mo,
        month: mo,
        w: w,
        wk: w,
        wks: w,
        week: w,
        d: d,
        day: d,
        h: h,
        hr: h,
        hrs: h,
        hour: h,
        m: m,
        min: m,
        mins: m,
        minute: m,
        s: s,
        sec: s,
        secs: s,
        second: s,
        ms: ms,
        milli: ms,
        millis: ms,
        millisecond: ms
      },

      tickSpeed = 1,
      date = Date,
      now = Date.now || function() { return +new date; },
      then = now(),
      when = then,

      warpTimestamp = function() {
        var rightNow = now();
        then += (rightNow - when) * tickSpeed;
        when = rightNow;
        return then;
      },

      warped = function() {
        if (this !== warped.warp && !(this instanceof Date))
          return '' + new date(warpTimestamp());

        var args = arguments;
        if (args[0] === true)
          return new date;

        switch (args.length) {
          case 0: return new date(warpTimestamp());
          case 1: return new date(args[0]);
          case 2: return new date(args[0], args[1]);
          case 3: return new date(args[0], args[1], args[2]);
          case 4: return new date(args[0], args[1], args[2], args[3]);
          case 5: return new date(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new date(args[0], args[1], args[2], args[3], args[4], args[5]);
          default: return new date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
      };

  // Make warped Date objects spoof real Date objects,
  // so that instanceof works correctly
  warped.prototype = Date.prototype;

  warped.now = function(unwarped) {
    return unwarped? now() : warpTimestamp();
  };

  warped.UTC = Date.UTC;
  warped.parse = Date.parse;

  warped.warp = Date.warp = {
    jump: function(amount) {
      var newDate = new date(then),
          addMs = function(ms) { newDate.setMilliseconds(newDate.getMilliseconds() + ms); };

      if (typeof amount == 'number') {
        addMs(amount);
        return then = +newDate;
      }

      if (typeof amount == 'string') {
        var tokens = amount.toLowerCase().match(/(-?(\d+\.?\d*|\d*\.?\d+)\s*[a-z]+)/g);
        amount = { };
        for (var t = 0; t < tokens.length; t++)
          amount[tokens[t].replace(/[^a-z]/g, '')] = parseFloat(tokens[t]);
      }

      for (var unit in amount) {
        var num = amount[unit];
        if (unit in units)
          unit = units[unit];

        switch (unit) {
          case y:
            newDate.setFullYear(newDate.getFullYear() + num); break;
          case mo:
            newDate.setMonth(newDate.getMonth() + num); break;
          case w:
            addMs(6048e5 * num); break;
          case d:
            addMs(864e5 * num); break;
          case h:
            addMs(36e5 * num); break;
          case m:
            addMs(6e4 * num); break;
          case s:
            addMs(1e3 * num); break;
          case ms:
            addMs(num); break;
        }
      }

      return then = +newDate;
    },
    speed: function(speed) {
      if (speed === undefined)
        return tickSpeed;

      tickSpeed = speed;
      warpTimestamp();
    },
    clock: function(arg) {
      if (arg === undefined)
        return new date(then);

      var newDate = warped.apply(this, arguments);
      then = +newDate;
      return newDate;
    },
    on: function() {
      Date = warped;
      warpTimestamp();
    },
    off: function() {
      Date = date;
    },
    reset: function() {
      tickSpeed = 1;
      when = then = now();
    },
    date: Date
  };

  Date = warped;
})();
