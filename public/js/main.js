(function () {
  'use strict';

  function showToast(message, type) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.className = 'toast';
    }, 2600);
  }

  function updateCartCount(count) {
    var el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  }

  // ---- Add to cart (AJAX) ----
  document.querySelectorAll('.add-cart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = this.dataset.id;
      var qty = 1;
      var qtyInput = document.getElementById('qty');
      if (qtyInput) qty = parseInt(qtyInput.value, 10) || 1;

      fetch('/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, qty: qty })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          updateCartCount(data.count);
          btn.classList.add('added');
          btn.textContent = 'Added ✓';
          showToast('Added to cart', 'success');
          setTimeout(function () {
            btn.classList.remove('added');
            btn.textContent = 'Add to Cart';
          }, 1400);
        })
        .catch(function () { showToast('Could not add to cart', 'failure'); });
    });
  });

  // ---- Quantity stepper (product page) ----
  var qtyInput = document.getElementById('qty');
  document.querySelectorAll('.qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!qtyInput) return;
      var val = parseInt(qtyInput.value, 10) || 1;
      var dir = this.dataset.dir === '+' ? 1 : -1;
      val = Math.min(99, Math.max(1, val + dir));
      qtyInput.value = val;
    });
  });
})();