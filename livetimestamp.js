(function($) {

  var intervalTime = 1e3,
      livetimestampClass = '.livetimestamp',
      intervalId,
      $timestamps = $([]);

  var livetimestamp = {
    init: function() {
      livetimestamp.resume();
    },
    update: function() {
      $(livetimestampClass).add($timestamps).each(function() {
        var $this = $(this),
            now = moment($this.data('timestamp'));
        $this.text(now.fromNow());
        //$this.text(moment().diff(now, 'seconds'));
      });
    },
    pause: function() {
      clearInterval(intervalId);
    },
    resume: function() {
      clearInterval(intervalId);
      intervalId = setInterval(livetimestamp.update, intervalTime);
      livetimestamp.update();
    }
  };

  $(livetimestamp.init);
  $.fn.livetimestamp = function() {
    $timestamps = $timestamps.add(this);
    return this;
  };

  $.livetimestamp = livetimestamp;

})(jQuery);
