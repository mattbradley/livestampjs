(function($) {

  var intervalTime = 1e3,
      ls = 'livestamp',
      intervalId,
      $timestamps = $([]),

  init = function() {
    livestamp.resume();
  },

  prep = function($jq) {
    var timestamp = parseInt($jq.data('livestamp'));
    if (!isNaN(timestamp)) {
      var newData = $.extend({ }, $jq.data('livestampData'), { 'original': $jq.contents().clone(), 'moment': moment(timestamp) });
      $jq.data('livestampData', newData)
         .removeData('livestamp')
         .removeAttr('livestamp');
      return newData;
    }
  };

  var livestamp = {
    update: function() {
      $('[data-' + ls + ']').add($timestamps).each(function() {
        var $this = $(this),
            data = $this.data('livestampData');

        if (typeof data != 'object')
          data = prep($this);

        if (data !== undefined && moment.isMoment(data.moment))
          $this.html(data.moment.fromNow());
      });
    },

    pause: function() {
      clearInterval(intervalId);
    },

    resume: function() {
      clearInterval(intervalId);
      intervalId = setInterval(livestamp.update, intervalTime);
      livestamp.update();
    },

    add: function($jq, then) {
      if (typeof then == 'number' || then instanceof Date)
        then = moment(then);

      if (moment.isMoment(then))
        $jq.data('timestamp', then);

      $jq.each(function() { prep($(this)); });
      $timestamps = $timestamps.add($jq);
      livestamp.resume();
    },

    remove: function($jq) {
      $timestamps = $timestamps.not($jq);
      $jq.removeClass(ls);
    },

    // FIXME: timestamp should be saved in ls object and removed here instead of removing data-timestamp
    // other libraries may depend on the timestamp data
    destroy: function($jq) {
      livestamp.remove($jq);
      $jq.each(function() {
        var $this = $(this),
            data = $this.data(ls);

        if (data === undefined) return;

        $this.html(data.original !== undefined ? data.original : '');
        $this.removeData(ls);
      });
    }
  };

  $.livestamp = livestamp;
  $(init);
  $.fn.livestamp = function(method, options) {
    if (typeof method !== 'string') {
      options = method;
      method = 'add';
    }

    if ($.isFunction($.livestamp[method]))
      $.livestamp[method](this, options);

    return this;
  };
})(jQuery);
