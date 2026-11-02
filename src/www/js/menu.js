(function () {
  'use strict';

  var menu = document.getElementById('site-menu');
  if (menu && typeof menu.hidePopover === 'function') {
    menu.addEventListener('click', function (event) {
      var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!link || !menu.contains(link)) { return; }
      try { menu.hidePopover(); } catch (e) { return; }
    });
  }

  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') { return; }

  var boxes = document.querySelectorAll('.rg pre');
  Array.prototype.forEach.call(boxes, function (pre) {
    if (!pre.parentNode) { return; }

    var wrap = document.createElement('div');
    wrap.className = 'codebox';
    var bar = document.createElement('div');
    bar.className = 'codebar';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copybtn';
    button.textContent = 'Copy';
    var status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    bar.appendChild(button);
    bar.appendChild(status);
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(bar);
    wrap.appendChild(pre);

    var timer = null;
    button.addEventListener('click', function () {
      var text = pre.textContent.replace(/\n+$/, '');
      var done;
      var pick = function () {
        try {
          var target = pre.querySelector('code') || pre;
          var range = document.createRange();
          range.selectNodeContents(target);
          var sel = window.getSelection();
          if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        } catch (e) { return; }
      };
      try { done = navigator.clipboard.writeText(text); } catch (e) { pick(); return; }
      if (!done || typeof done.then !== 'function') { pick(); return; }
      done.then(function () {
        button.textContent = 'Copied';
        status.textContent = 'Copied';
        if (timer) { clearTimeout(timer); }
        timer = setTimeout(function () {
          button.textContent = 'Copy';
          status.textContent = '';
        }, 2000);
      }, pick);
    });
  });
}());
