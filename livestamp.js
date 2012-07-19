(function($) {
  var intervalTime = 1e3,
      ls = 'livestamp',
      lsData = 'livestampdata',
      intervalId,
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
        else if (moment.isMoment(data.moment))
          $this.html(data.moment.fromNow());
      });

      $livestamps = $livestamps.not(toRemove);
    },

    pause: function() {
      clearInterval(intervalId);
    },

    resume: function() {
      clearInterval(intervalId);
      intervalId = setInterval(livestampGlobal.update, intervalTime);
      livestampGlobal.update();
    }
  },

  livestampLocal = {
    add: function($jq, timestamp) {
      if (timestamp === undefined || timestamp instanceof Date)
        timestamp = moment(timestamp);

      if (typeof timestamp != 'number' && !moment.isMoment(timestamp))
        return $jq;

      prep($jq, timestamp);
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
