$(document).ready(function() {
  var nowMs = +new Date(),
      now = Math.floor(nowMs / 1000),
      oneminago = now - 1 * 60,
      fiveminago = now - 5 * 60,
      fiveminagotext = moment.unix(fiveminago).format('h:mma'),
      twentyminfromnow = now + 20 * 60,
      pad = function(s, n) { s += ''; while (s.length < n) s = '0' + s; return s; },
      warpFactor = 1;

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

  $('#warp').popover({
    trigger: 'manual',
    placement: 'in bottom',
    title: 'Warping',
    content: [
      '<p>Warping will speed up time, so you don\'t have to wait to see the livestamps update.</p>',
      '<br />',
      '<div>',
        '<a href="#" id="warp-down" class="btn"><i class="icon-chevron-left"></i></a> <span id="warp-factor">1x</span> <a href="#" id="warp-up" class="btn"><i class="icon-chevron-right"></i></a>',
      '</div>',
      '<br />',
      '<p style="color: #999;">',
        'Warping provided by <a href="https://github.com/mattbradley/warpjs" target="_blank">Warp.js</a>.',
      '</p>'
    ].join(''),
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content" style="text-align: center; color: #333; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;"><div></div></div></div></div>'
  }).click(function() {
    $(this).popover('toggle');
    $('#warp-factor').text(addCommas(warpFactor) + 'x');
    return false;
  });

  $('#warp').on('mouseenter', '#warp-factor', function() {
    $('#warp-factor').text('Reset');
  });

  $('#warp').on('mouseleave', '#warp-factor', function() {
    $('#warp-factor').text(addCommas(warpFactor) + 'x');
  });

  $('#warp').on('click', '#warp-factor', function() {
    warpFactor = 1;
    Date.warp.reset();
    $('#warp-factor').text('1x');
  });

  $('#warp').on('click', '#warp-up, #warp-down', function() {
    var change = $(this).is('#warp-up') ? 10 : 0.1;
    warpFactor = Math.min(1e9, Math.max(1, warpFactor * change));
    Date.warp.speed(warpFactor);
    $('#warp-factor').text(addCommas(warpFactor) + 'x');
    return false;
  });

  $('#warp').on('click', '.popover', false);

  $(document).click(function() {
    $('#warp').popover('hide');
  });

  window.go = function(factor) {
    var speed = 1;
    setInterval(function() {
      speed *= factor;
      console.log(Math.log(speed) / Math.log(10));
      Date.warp.speed(speed);
    }, 50);
  };

  function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
});
