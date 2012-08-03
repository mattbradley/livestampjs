$(document).ready(function() {
  var nowMs = +new Date(),
      now = Math.floor(nowMs / 1000),
      oneminago = now - 1 * 60,
      fiveminago = now - 5 * 60,
      fiveminagotext = moment.unix(fiveminago).format('h:mma'),
      twentyminfromnow = now + 20 * 60,
      pad = function(s, n) { s += ''; while (s.length < n) s = '0' + s; return s; };

  $.livestamp.interval(30);

  $('#nowMs').text(now + '.' + pad(nowMs % 1000, 3));
  $('.now').livestamp(now);
  $('.now-display').text(now);
  $('#fiveminago').attr('title', fiveminagotext).livestamp(fiveminago);
  $('#fiveminago-display').text(fiveminago);
  $('#fiveminago-title').text(fiveminagotext);
  $('#twentyminfromnow').livestamp(twentyminfromnow);
  $('#twentyminfromnow-display').text(twentyminfromnow);

    $('#it-does-this').delay(1000).slideDown(function() {
      $(this).find('.now').delay(500).fadeIn();
    });

  $('#livestamp-birthday').click(function() {
    $('#birth').livestamp(new Date('June 18, 1987'));
  });

  $('#destroy-birth').click(function() {
    $('#birth').livestamp('destroy');
  });

  $('#animation').on('change.livestamp', function(e, from, to) {
    e.preventDefault();
    Date.warp.off();
    $(this).fadeOut(400, function() {
      $(this).html(to).fadeIn(400, function() {
        Date.warp.on();
      });
    });
  }).livestamp();
});
