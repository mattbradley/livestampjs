$(document).ready(function() {
  $('#user-agent').text(navigator.userAgent);

  var banner = $('#results'),
      tests = $('#unit-tests'),
      headerRow = $('#header'),
      start = moment(),
      passed = 0,
      failed = 0,
      total = 0;

  function updateTest(_passed, _failed) {
    passed += _passed;
    failed += _failed;
    updateTotals(passed, failed);
  }

  function updateTotals(_passed, _failed) {
    var duration = moment().diff(start);
    if (_failed) {
      banner.removeClass('alert-success');
      banner.addClass('alert-error');
    }
    banner.html('<h3>' + _passed + ' passed.</h3><h3>' + _failed + ' failed.</h3><h3>' + duration + ' milliseconds.</h3>');
  }

  nodeunit.runModule('Unit Tests', suite, {
    testDone: function (name, assertions) {
      var testEl = $('<li class="alert alert-success">'),
          testHtml = '',
          assertUl = $('<ul>'),
          assertLi,
          assertHtml = '';
          assert;

      total++;
      
      // each test
      testHtml += '<div><strong>' + name + '</strong> &bull; ';
      if (assertions.failures()) {
        testEl.addClass('alert-error open');
        testEl.removeClass('alert-success');
        testHtml += assertions.passes() + ' passed, ';
        testHtml += assertions.failures() + ' failed.</div>';
      } else {
        testHtml += 'All ' + assertions.passes() + ' passed.</div>';
      }
      testEl.addClass('test');
      testEl.html(testHtml);

      // each assert
      for (var i = 0; i < assertions.length; i++) {
        assert = assertions[i];
        assertLi = $('<li>');
        assertHtml = '<strong>' + total + '.' + (i + 1) + '</strong>: ';
        assertHtml += (assert.message || assert.method || 'no message');
        if (assert.failed()) {
          assertHtml += ' (' + assert.error.expected + ' ' + assert.error.operator + ' ' + assert.error.actual + ')';
          assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
          assertLi.addClass('fail');
        } else {
          assertLi.addClass('pass');
        }
        assertLi.html(assertHtml);
        assertUl.append(assertLi);
      }

      testEl.append(assertUl);
      tests.append(testEl);
      updateTest(assertions.passes(), assertions.failures());
    },
    moduleDone : function (name, assertions) {
      var duration = moment().diff(start);
      var failures = assertions.failures();

      if (failures) {
        banner.after([
          '<div class="alert alert-error">',
            '<h3>Uh oh! Some of the unit tests have failed.</h3>',
            '<p></p>',
            '<p>',
              'If you would be so kind, could you please',
              '<a href="https://github.com/mattbradley/livestampjs/issues" target="_blank">',
                'submit an issue',
              '</a>',
              'to the Livestamp.js GitHub repo? Don\'t forget the failing',
              'test, the stack trace, and your user agent.',
            '</p>',
            '<p>',
              'If you think you know what the problem is, then, by all means,',
              '<a href="https://github.com/mattbradley/livestampjs" target="_blank">',
                'fork the repo',
              '</a>',
              'and fix it for me!',
            '</p>',
            '<p>',
              'Thanks!',
            '</p>',
          '</div>'].join(' '));
      } else {
        banner.after('<h3 class="alert alert-success">It\'s all good! Livestamp.js is working as expected.</h3>');
      }

      $('#test-area').remove();
      updateTotals(assertions.passes(), failures);
    }
  }, function() { });

  tests.on('click', 'li.test', {}, function(){
    $(this).toggleClass('open');
  });
});

var suite = {
  'Unobtrusive livestamping': function(test) {
    test.expect(7);

    var now = +new Date / 1000,
        tester;

    tester = $('<div data-livestamp="' + now + '">this should change</div>').appendTo('#test-area');
    $.livestamp.update();
    test.notEqual(tester.text(), 'this should change', 'The data-livestamp attribute triggers livestamping');
    test.equal(tester.text(), 'a few seconds ago', 'Current timestamp is "a few seconds ago"');

    tester = $('<div data-livestamp="' + (now - 60 * 60 * 24 * 365) + '"></div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'a year ago', '365 days before current timestamp is "a year ago"');

    tester = $('<div data-livestamp="' + (now + 60 * 180) + '"></div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'in 3 hours', '180 minutes after current timestamp is "in 3 hours"');

    tester = $('<div data-livestamp="' + now + '">this should change</div>').appendTo('#test-area');
    $.livestamp.update();
    Date.warp.jump('1 hour');
    $.livestamp.update();
    test.equal(tester.text(), 'an hour ago', 'After an hour, livestamp displays "an hour ago"');
    Date.warp.reset();

    tester = $('<div data-livestamp="">should not change</div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'should not change', 'Empty data-livestamp doesn\'t change the text');

    tester = $('<div data-livestamp="foo">should not change</div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'should not change', 'Invalid data-livestamp doesn\'t change the text');

    $('#test-area').empty();
    test.done();
  },

  'Manual livestamping': function(test) {
    test.expect(7);

    var dateObject = new Date(+new Date - 1000 * 60),
        momentObject = moment(dateObject),
        timestamp = +dateObject / 1000,
        tester;

    tester = $('<div></div>').appendTo('#test-area').livestamp();
    test.equal(tester.text(), 'a few seconds ago', '$.fn.livestamp() with no arguments uses the current datetime');

    tester = $('<div></div>').appendTo('#test-area').livestamp(dateObject);
    test.equal(tester.text(), 'a minute ago', '$.fn.livestamp() function accepts a Date object');

    tester = $('<div></div>').appendTo('#test-area').livestamp(momentObject);
    test.equal(tester.text(), 'a minute ago', '$.fn.livestamp() function accepts a Moment object');

    tester = $('<div></div>').appendTo('#test-area').livestamp(timestamp);
    test.equal(tester.text(), 'a minute ago', '$.fn.livestamp() function accepts a Number');

    tester = $('<div>this should change</div>').appendTo('#test-area').livestamp(dateObject);
    $.livestamp.update();
    Date.warp.jump('1 hour');
    $.livestamp.update();
    test.equal(tester.text(), 'an hour ago', 'After an hour, livestamp displays "an hour ago"');
    Date.warp.reset();

    tester = $('<div>should not change</div>').appendTo('#test-area');
    tester.livestamp().livestamp(timestamp);
    test.equal(tester.data('livestampdata').original.clone().wrap('<div>').parent().html(), 'should not change', 'Livestamping an element again does not replace the original HTML');

    tester = $('<div>should not change</div>').appendTo('#test-area').livestamp(null);
    test.equal(tester.text(), 'should not change', 'Invalid timestamp does not change text');

    $('#test-area').empty();
    test.done();
  },

  'Internal data': function(test) {
    test.expect(11);
    
    var now = +new Date / 1000,
        tester,
        data;

    var originalHTML = '<h1>the time is now</h1>';
    tester = $('<div data-livestamp="' + now + '">' + originalHTML + '</div>').appendTo('#test-area');
    $.livestamp.update();
    data = tester.data('livestampdata');
    test.notEqual(data, undefined, 'The internal data is stored in "livestampdata"');
    test.ok(data.original instanceof jQuery, 'A jQuery object is stored in the "original" property');
    test.equal(data.original.clone().wrap('<div>').parent().html(), originalHTML, 'The original HTML is stored in the jQuery object');
    test.ok(moment.isMoment(data.moment), 'A Moment object is stored in the "moment" property');
    test.equal(data.moment.valueOf(), now * 1000, 'The timestamp is stored in the Moment object');
    test.equal(tester.attr('data-livestamp'), undefined, 'The data-livestamp attribute is removed');
    test.equal(tester.data('livestamp'), undefined, 'The jQuery "livestamp" data property is removed');

    tester = $('<div data-livestamp=""></div>').appendTo('#test-area');
    $.livestamp.update();
    data = tester.data('livestampdata');
    test.equal(data, undefined, 'Empty data-livestamp doesn\'t store data');
    test.notEqual(tester.attr('data-livestamp'), undefined, 'Empty data-livestamp doesn\'t remove data-livestamp');

    tester = $('<div data-livestamp="foo"></div>').appendTo('#test-area');
    $.livestamp.update();
    data = tester.data('livestampdata');
    test.equal(data, undefined, 'Invalid data-livestamp doesn\'t store data');
    test.notEqual(tester.attr('data-livestamp'), undefined, 'Invalid data-livestamp doesn\'t remove data-livestamp');
    
    $('#test-area').empty();
    test.done();
  },

  '$.livestamp functions': function(test) {
    test.expect(4);

    var now = +new Date / 1000,
        tester,
        tester2,
        privateArea;

    privateArea = $('<div />').hide().insertAfter('#test-area');

    tester = $('<div data-livestamp="' + now + '"></div>').appendTo(privateArea);
    tester2 = $('<div data-livestamp="' + (now - 60 * 60) + '"></div>').appendTo(privateArea);
    $.livestamp.update();
    test.ok(tester.text() == 'a few seconds ago' && tester2.text() == 'an hour ago', '$.livestamp.update() updates the text of all livestamps');

    $.livestamp.interval(2000);
    test.equal($.livestamp.interval(), 2000, '$.livestamp.interval() correctly changes the update interval');
    $.livestamp.interval(1000);

    tester = $('<div data-livestamp="' + now + '"></div>').appendTo('#test-area');
    $.livestamp.update();
    $.livestamp.pause();
    Date.warp.jump('1 hour');

    setTimeout( function() {
      test.equal(tester.text(), 'a few seconds ago', '$.livestamp.pause() causes no livestamps to be updated');
      $.livestamp.resume();
      test.equal(tester.text(), 'an hour ago', '$.livestamp.resume() resumes the updating of livestamps');
      
      Date.warp.reset();
      privateArea.remove();
      test.done();
    }, 1000);
  },

  '$.fn.livestamp functions': function(test) {

    var hourAgo = +new Date / 1000 - 60 * 60,
        tester;

    tester = $('<div data-livestamp="' + hourAgo + '"></div>').appendTo('#test-area');
    tester.livestamp('add');
    test.equal(tester.text(), 'a few seconds ago', "$.fn.livestamp('add') with no argument uses current datetime");
    test.notEqual(tester.text(), 'an hour ago', "$.fn.livestamp('add') ignores data-livestamp attribute");
    test.equal(tester.attr('data-livestamp'), undefined, "$.fn.livestamp('add') removes data-livestamp attribute");
    tester.livestamp('add', hourAgo);
    test.equal(tester.text(), 'an hour ago', "$.fn.livestamp('add', [number]) accepts a Number");
    tester.livestamp('add', new Date(hourAgo * 1000));
    test.equal(tester.text(), 'an hour ago', "$.fn.livestamp('add', [Date]) accepts a Date object");
    tester.livestamp('add', moment.unix(hourAgo));
    test.equal(tester.text(), 'an hour ago', "$.fn.livestamp('add', [Moment]) accepts a Moment object");

    tester = $('<div><span>original content</span></div>').appendTo('#test-area');
    tester.livestamp('add');
    tester.livestamp('destroy');
    $.livestamp.update();
    test.equal(tester.html(), '<span>original content</span>', "$.fn.livestamp('destroy') restores original content");
    test.equal(tester.data('livestampdata'), undefined, "$.fn.livestamp('destroy') removes internal data");
    
    test.done();
  },

  'Reality check': function(test) {
    test.expect(2);

    var nothing = true, everything = 'permitted';
    test.equal(nothing, true, 'Nothing is true.');
    test.ok(everything || !everything, 'Everything is permitted.');

    test.done();
  }
};
