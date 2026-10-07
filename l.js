// Siden for "Ask for location by SMS": henter hendelsen for lenken og sender posisjonen én gang.
(function () {
  var SUPABASE_URL = 'https://zctcywypglrueklbztbn.supabase.co';
  // Den offentlige nøkkelen (publishable/anon) er laget for å ligge i apper og nettsider.
  var SUPABASE_KEY = 'sb_publishable_84WyMQ1HAmmXfA_1uKNaZQ_msKbuM2j';

  var token = new URLSearchParams(location.search).get('t') || '';
  var button = document.getElementById('share');
  var statusBox = document.getElementById('status');
  var incident = document.getElementById('incident');

  function rpc(name, body) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error((data && data.message) || 'Something went wrong');
        return data;
      });
    });
  }

  function show(kind, html) {
    statusBox.hidden = false;
    statusBox.className = 'box ' + kind;
    statusBox.innerHTML = html;
  }

  function done(html) {
    button.hidden = true;
    document.getElementById('small').hidden = true;
    document.getElementById('how').hidden = true;
    document.getElementById('fallback').hidden = true;
    show('ok', html);
  }

  function unusable(text) {
    button.hidden = true;
    document.getElementById('small').hidden = true;
    document.getElementById('how').hidden = true;
    show('err', text);
  }

  if (!token) {
    unusable('This link is not complete. Check that you opened the whole link from the text message.');
    return;
  }

  rpc('get_location_request', { p_token: token })
    .then(function (r) {
      if (r.number) incident.textContent = 'incident ' + r.number + (r.title ? ' (' + r.title + ')' : '');
      if (r.status === 'valid') button.disabled = false;
      else if (r.status === 'used') done('<strong>Your location has already been shared.</strong> Thank you!');
      else if (r.status === 'expired') unusable('This link has expired. Links work for 3 hours.');
      else if (r.status === 'closed') unusable('This incident has been closed, so no location is needed any more.');
      else unusable('This link is not valid. Check that you opened the whole link from the text message.');
    })
    .catch(function () {
      button.disabled = false;
    });

  button.addEventListener('click', function () {
    if (!navigator.geolocation) {
      show('err', "Your browser can't share your location.");
      return;
    }
    button.disabled = true;
    button.textContent = 'Finding your location…';
    statusBox.hidden = true;
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        button.textContent = 'Sending…';
        rpc('submit_location_request', {
          p_token: token,
          p_lat: pos.coords.latitude,
          p_lng: pos.coords.longitude,
          p_accuracy: pos.coords.accuracy,
        })
          .then(function () {
            done(
              '<strong>Thank you! Your location has been sent.</strong><br>Accuracy about ' +
                Math.round(pos.coords.accuracy) +
                ' m. You can close this page.'
            );
          })
          .catch(function (e) {
            button.disabled = false;
            button.textContent = 'Try again';
            show('err', '<strong>Not sent.</strong> ' + escapeHtml(e.message));
          });
      },
      function (err) {
        button.disabled = false;
        button.textContent = 'Try again';
        if (err.code === 1) {
          show(
            'err',
            '<strong>Location access was blocked.</strong> Allow location for this page in your browser settings ' +
              '(and check that location is turned on in your phone), then tap Try again.'
          );
        } else {
          show('err', "<strong>We couldn't find your location.</strong> Go outside or near a window and try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
