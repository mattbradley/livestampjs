/* Copyright (c) 2012 Matt Bradley | Released under the MIT License */
(function($) {
  var updateInterval = 1e3,
      ls = 'livestamp',
      lsData = 'livestampdata',
      paused = false,
      $livestamps = $([]),

  init = function() {
    livestampGlobal.resume();
  },

  prep = function($jq, timestamp) {
    if (!moment.isMoment(timestamp))
      timestamp = parseFloat(timestamp) * 1000;

    if (!isNaN(timestamp) || moment.isMoment(timestamp)) {
      var newData = $.extend({ }, { 'original': $jq.contents() }, $jq.data(lsData));
      newData.moment = moment(timestamp);

      $jq.data(lsData, newData)
        .empty()
        .removeAttr('data-livestamp')
        .removeData(ls);

      $livestamps = $livestamps.add($jq);
    }
  },

  run = function() {
    if (paused) return;
    livestampGlobal.update();
    setTimeout(run, updateInterval);
  },

  livestampGlobal = {
    update: function() {
      $('[data-' + ls + ']').each(function() {
        var $this = $(this);
        prep($this, $this.data(ls));
      });

      var toRemove = [ ];

      $livestamps.each(function() {
        var $this = $(this),
            data = $this.data(lsData);

        if (data === undefined)
          toRemove.push(this);
        else if (moment.isMoment(data.moment)) {
          var from = $this.html(),
              to = data.moment.fromNow();

          if (from != to) {
            var e = $.Event('change.livestamp');
            $this.trigger(e, [from, to]);
            if (!e.isDefaultPrevented())
              $this.html(to);
          }
        }
      });

      $livestamps = $livestamps.not(toRemove);
    },

    pause: function() {
      paused = true;
    },

    resume: function() {
      paused = false;
      run();
    },

    interval: function(interval) {
      if (interval === undefined)
        return updateInterval;
      updateInterval = interval;
    }
  },

  livestampLocal = {
    add: function($jq, timestamp) {
      if (timestamp === undefined || timestamp instanceof Date)
        timestamp = moment(timestamp);

      if (typeof timestamp != 'number' && !moment.isMoment(timestamp))
        return $jq;

      $jq.each(function() {
        prep($(this), timestamp);
      });

      livestampGlobal.update();
      return $jq;
    },

    destroy: function($jq) {
      $livestamps = $livestamps.not($jq);
      $jq.each(function() {
        var $this = $(this),
            data = $this.data(lsData);

        if (data === undefined)
          return $jq;

        $this
          .empty()
          .append(data.original !== undefined ? data.original : '')
          .removeData(lsData);
      });

      return $jq;
    },

    isLivestamp: function($jq) {
      return $jq.data(lsData) !== undefined;
    }
  };

  $.livestamp = livestampGlobal;
  $(init);
  $.fn.livestamp = function(method, options) {
    if (typeof method !== 'string') {
      options = method;
      method = 'add';
    }

    if ($.isFunction(livestampLocal[method]))
      return livestampLocal[method](this, options);

    return this;
  };
})(jQuery);
