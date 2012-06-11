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
        testHtml += assertions.passes() + ' passed,';
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
    done : function (assertions) {
      var duration = moment().diff(start);
      var failures = assertions.failures();

      var toStr = "Date.prototype.toString = " + (new Date()).toString();
      toStr += "<br/><br/>";
      toStr += "Date.prototype.toLocaleString = " + (new Date()).toLocaleString();
      toStr += "<br/><br/>";
      toStr += "Date.prototype.getTimezoneOffset = " + (new Date(1000)).getTimezoneOffset();
      toStr += "<br/><br/>";
      toStr += "navigator.userAgent = " + navigator.userAgent;

      if (failures) {
        headerRow.after("<div class='row'>" + "<div class='span4'>" +
          "<p class='alert alert-error'>Hmm, looks like some of the unit tests are failing.<br/><br/>" +
          "It's hard to catch all the bugs across all timezones, so if you have a minute, " + 
          "please submit an issue with the failing test and the info to the right.<br/><br/>" + 
          "<a class='btn' href='https://github.com/timrwood/moment/issues'>github.com/timrwood/moment/issues</a>" + 
          "<br/><br/>Thanks!</p>" + 
          "</div>" + 
          "<div class='span8'>" +
          "<p class='alert alert-info'>Please include this when you submit the issue.<br/><br/>" + toStr + "</p>" +
          "</div></div>")
      } else {
        banner.after("<p class='alert alert-success'>Looks like Livestamp.js is all good on your end!</p>");
      }

      updateTotals(assertions.passes(), failures);
    }
  });

  tests.on('click', 'li.test', {}, function(){
    $(this).toggleClass('open');
  });
});

var suite = {
  'Unobtrusive livestamping': function(test) {
    test.expect(4);

    var now = +new Date, tester;

    tester = $('<div data-livestamp="' + now + '">this should change</div>').appendTo('#test-area');
    $.livestamp.update();
    test.notEqual(tester.text(), 'this should change', 'The data-livestamp attribute triggers livestamping');
    test.equal(tester.text(), 'a few seconds ago', 'Current timestamp is "a few seconds ago"');

    tester = $('<div data-livestamp="' + (now - 1000 * 60 * 60 * 24 * 365) + '"></div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'a year ago', '365 days before current timestamp is "a year ago"');

    tester = $('<div data-livestamp="' + (now + 1000 * 60 * 180) + '"></div>').appendTo('#test-area');
    $.livestamp.update();
    test.equal(tester.text(), 'in 3 hours', '180 minutes after current timestamp is "in 3 hours"');

    $('#test-area').empty();
    test.done();
  },

  'Livestamping stores some data internally': function(test) {
    
    var now = +new Date, tester;

    tester = $('<div data-livestamp="' + now + '">the time is now</div>');
    $.livestamp.update();
    
    $('#test-area').empty();
    test.done();
  },

  'Reality check': function(test) {
    test.expect(2);

    var nothing = true, everything = false;
    test.equal(nothing, true, 'Nothing is true.');
    test.ok(everything || !everything, 'Everything is permitted.');

    test.done();
  }
};

