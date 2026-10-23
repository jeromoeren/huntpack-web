// Siden for "Ask for location by SMS": henter oppdraget for lenken og sender posisjonen én gang.
// Språket velges øverst (huskes), ellers telefonens språk.
(function () {
  var SUPABASE_URL = 'https://zctcywypglrueklbztbn.supabase.co';
  // Den offentlige nøkkelen (publishable/anon) er laget for å ligge i apper og nettsider.
  var SUPABASE_KEY = 'sb_publishable_84WyMQ1HAmmXfA_1uKNaZQ_msKbuM2j';

  var TEXTS = {
    en: {
      pageTitle: 'HuntPack – Share your location',
      title: 'Share your location',
      intro:
        'You got this link by text message from someone in a wildlife team using the HuntPack app. They are ' +
        'following up on {incident} (for example a collision with an animal) and need to know exactly where it happened.',
      someIncident: 'a wildlife incident',
      incident: 'incident {number}',
      how:
        'Stand at the place, or as close as you can, and tap the button. Your phone will ask if it may share your ' +
        'location – choose <strong>Allow</strong>.',
      share: 'Share my location',
      finding: 'Finding your location…',
      sending: 'Sending…',
      retry: 'Try again',
      small: 'Your location is sent once, only when you tap the button. Nothing else is shared.',
      fallback: "If you can't share your location, call back the person who sent you the link and describe the place.",
      privacy: 'Privacy',
      incomplete: 'This link is not complete. Check that you opened the whole link from the text message.',
      invalid: 'This link is not valid. Check that you opened the whole link from the text message.',
      used: '<strong>Your location has already been shared.</strong> Thank you!',
      expired: 'This link has expired. Links work for 3 hours.',
      closed: 'This incident has been closed, so no location is needed any more.',
      noGeo: "Your browser can't share your location.",
      sent: '<strong>Thank you! Your location has been sent.</strong><br>Accuracy about {accuracy} m. You can close this page.',
      notSent: '<strong>Not sent.</strong> {message}',
      blocked:
        '<strong>Location access was blocked.</strong> Allow location for this page in your browser settings ' +
        '(and check that location is turned on in your phone), then tap Try again.',
      notFound: "<strong>We couldn't find your location.</strong> Go outside or near a window and try again.",
      failed: 'Something went wrong',
    },
    nb: {
      pageTitle: 'HuntPack – Del posisjonen din',
      title: 'Del posisjonen din',
      intro:
        'Du har fått denne lenken på SMS fra noen i et fallviltlag som bruker appen HuntPack. De følger opp ' +
        '{incident} (for eksempel en påkjørsel av et dyr) og trenger å vite nøyaktig hvor det skjedde.',
      someIncident: 'et fallviltoppdrag',
      incident: 'oppdrag {number}',
      how:
        'Gå til stedet, eller så nær du kan, og trykk på knappen. Telefonen spør om den får dele posisjonen din – ' +
        'velg <strong>Tillat</strong>.',
      share: 'Del posisjonen min',
      finding: 'Finner posisjonen din…',
      sending: 'Sender…',
      retry: 'Prøv igjen',
      small: 'Posisjonen sendes én gang, bare når du trykker på knappen. Ingenting annet deles.',
      fallback: 'Hvis du ikke får delt posisjonen, ring tilbake til den som sendte deg lenken og beskriv stedet.',
      privacy: 'Personvern',
      incomplete: 'Lenken er ikke hel. Sjekk at du åpnet hele lenken fra SMS-en.',
      invalid: 'Lenken er ikke gyldig. Sjekk at du åpnet hele lenken fra SMS-en.',
      used: '<strong>Posisjonen din er allerede delt.</strong> Takk!',
      expired: 'Lenken har gått ut. Lenkene virker i 3 timer.',
      closed: 'Oppdraget er avsluttet, så det trengs ingen posisjon lenger.',
      noGeo: 'Nettleseren din kan ikke dele posisjonen.',
      sent: '<strong>Takk! Posisjonen din er sendt.</strong><br>Nøyaktighet ca. {accuracy} m. Du kan lukke denne siden.',
      notSent: '<strong>Ikke sendt.</strong> {message}',
      blocked:
        '<strong>Tilgang til posisjon ble blokkert.</strong> Tillat posisjon for denne siden i innstillingene til ' +
        'nettleseren (og sjekk at posisjon er slått på i telefonen), og trykk på Prøv igjen.',
      notFound: '<strong>Vi fant ikke posisjonen din.</strong> Gå ut eller nær et vindu og prøv igjen.',
      failed: 'Noe gikk galt',
    },
    sv: {
      pageTitle: 'HuntPack – Dela din position',
      title: 'Dela din position',
      intro:
        'Du har fått den här länken via sms från någon i ett viltolyckslag som använder appen HuntPack. De följer upp ' +
        '{incident} (till exempel en kollision med ett djur) och behöver veta exakt var det hände.',
      someIncident: 'en viltolycka',
      incident: 'uppdrag {number}',
      how:
        'Ställ dig på platsen, eller så nära du kan, och tryck på knappen. Telefonen frågar om den får dela din ' +
        'position – välj <strong>Tillåt</strong>.',
      share: 'Dela min position',
      finding: 'Hämtar din position…',
      sending: 'Skickar…',
      retry: 'Försök igen',
      small: 'Din position skickas en gång, bara när du trycker på knappen. Inget annat delas.',
      fallback: 'Om du inte kan dela din position, ring tillbaka till den som skickade länken och beskriv platsen.',
      privacy: 'Integritet',
      incomplete: 'Länken är inte komplett. Kontrollera att du öppnade hela länken från sms:et.',
      invalid: 'Länken är inte giltig. Kontrollera att du öppnade hela länken från sms:et.',
      used: '<strong>Din position har redan delats.</strong> Tack!',
      expired: 'Länken har gått ut. Länkarna fungerar i 3 timmar.',
      closed: 'Uppdraget är avslutat, så ingen position behövs längre.',
      noGeo: 'Din webbläsare kan inte dela position.',
      sent: '<strong>Tack! Din position har skickats.</strong><br>Noggrannhet cirka {accuracy} m. Du kan stänga sidan.',
      notSent: '<strong>Inte skickad.</strong> {message}',
      blocked:
        '<strong>Åtkomst till position blockerades.</strong> Tillåt position för den här sidan i webbläsarens ' +
        'inställningar (och kontrollera att platstjänster är på i telefonen), och tryck sedan på Försök igen.',
      notFound: '<strong>Vi hittade inte din position.</strong> Gå ut eller nära ett fönster och försök igen.',
      failed: 'Något gick fel',
    },
    fi: {
      pageTitle: 'HuntPack – Jaa sijaintisi',
      title: 'Jaa sijaintisi',
      intro:
        'Sait tämän linkin tekstiviestinä henkilöltä, joka hoitaa riistaonnettomuuksia HuntPack-sovelluksella. He ' +
        'selvittävät {incident} (esimerkiksi eläinkolaria) ja tarvitsevat tiedon, missä se tarkalleen tapahtui.',
      someIncident: 'riistaonnettomuutta',
      incident: 'tehtävää {number}',
      how:
        'Mene paikalle tai niin lähelle kuin voit ja paina painiketta. Puhelin kysyy, saako se jakaa sijaintisi – ' +
        'valitse <strong>Salli</strong>.',
      share: 'Jaa sijaintini',
      finding: 'Haetaan sijaintia…',
      sending: 'Lähetetään…',
      retry: 'Yritä uudelleen',
      small: 'Sijaintisi lähetetään kerran ja vain, kun painat painiketta. Mitään muuta ei jaeta.',
      fallback: 'Jos et voi jakaa sijaintiasi, soita linkin lähettäjälle ja kuvaile paikka.',
      privacy: 'Tietosuoja',
      incomplete: 'Linkki on puutteellinen. Tarkista, että avasit koko linkin tekstiviestistä.',
      invalid: 'Linkki ei ole kelvollinen. Tarkista, että avasit koko linkin tekstiviestistä.',
      used: '<strong>Sijaintisi on jo jaettu.</strong> Kiitos!',
      expired: 'Linkki on vanhentunut. Linkit toimivat 3 tuntia.',
      closed: 'Tehtävä on päättynyt, joten sijaintia ei enää tarvita.',
      noGeo: 'Selaimesi ei voi jakaa sijaintia.',
      sent: '<strong>Kiitos! Sijaintisi on lähetetty.</strong><br>Tarkkuus noin {accuracy} m. Voit sulkea tämän sivun.',
      notSent: '<strong>Ei lähetetty.</strong> {message}',
      blocked:
        '<strong>Sijainnin käyttö estettiin.</strong> Salli sijainti tälle sivulle selaimen asetuksista (ja ' +
        'tarkista, että sijainti on päällä puhelimessa) ja paina sitten Yritä uudelleen.',
      notFound: '<strong>Sijaintiasi ei löytynyt.</strong> Mene ulos tai ikkunan lähelle ja yritä uudelleen.',
      failed: 'Jokin meni pieleen',
    },
  };

  var params = new URLSearchParams(location.search);
  var token = params.get('t') || '';
  var button = document.getElementById('share');
  var statusBox = document.getElementById('status');

  // Det som vises nå. Alt tegnes på nytt fra dette når språket byttes.
  var state = {
    lang: pickLang(),
    // ready: kan sendes, busy: finner eller sender (knappen viser hva), done: sendt eller allerede sendt,
    // unusable: lenken virker ikke.
    phase: 'loading',
    busy: null,
    tried: false,
    incident: null,
    status: null,
  };

  function pickLang() {
    var wanted = [params.get('lang')];
    try {
      wanted.push(localStorage.getItem('lang'));
    } catch (e) {}
    wanted = wanted.concat(navigator.languages || [navigator.language]);
    for (var i = 0; i < wanted.length; i++) {
      var code = String(wanted[i] || '').toLowerCase().slice(0, 2);
      if (code === 'no' || code === 'nn' || code === 'da') code = 'nb';
      if (TEXTS[code]) return code;
    }
    return 'en';
  }

  function text(key, args) {
    return TEXTS[state.lang][key].replace(/\{(\w+)\}/g, function (_, name) {
      return args[name];
    });
  }

  function render() {
    var t = TEXTS[state.lang];
    document.documentElement.lang = state.lang;
    document.title = t.pageTitle;
    document.querySelectorAll('[data-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === state.lang));
    });

    var incident = state.incident
      ? escapeHtml(
          text('incident', { number: state.incident.number }) + (state.incident.title ? ' (' + state.incident.title + ')' : '')
        )
      : t.someIncident;
    document.getElementById('title').textContent = t.title;
    document.getElementById('intro').innerHTML = text('intro', { incident: '<span class="incident">' + incident + '</span>' });
    document.getElementById('how').innerHTML = t.how;
    document.getElementById('small').textContent = t.small;
    document.getElementById('fallback').textContent = t.fallback;
    document.getElementById('privacy').textContent = t.privacy;

    var finished = state.phase === 'done' || state.phase === 'unusable';
    button.hidden = finished;
    button.disabled = state.phase !== 'ready';
    button.textContent = state.busy ? t[state.busy] : state.tried ? t.retry : t.share;
    document.getElementById('small').hidden = finished;
    document.getElementById('how').hidden = finished;
    document.getElementById('fallback').hidden = state.phase === 'done';

    statusBox.hidden = !state.status;
    if (state.status) {
      statusBox.className = 'box ' + state.status.kind;
      statusBox.innerHTML = text(state.status.key, state.status.args || {});
    }
  }

  function update(changes) {
    for (var k in changes) state[k] = changes[k];
    render();
  }

  function rpc(name, body) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error((data && data.message) || '');
        return data;
      });
    });
  }

  document.querySelectorAll('[data-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      try {
        localStorage.setItem('lang', b.dataset.set);
      } catch (e) {}
      update({ lang: b.dataset.set });
    });
  });

  render();

  if (!token) {
    update({ phase: 'unusable', status: { kind: 'err', key: 'incomplete' } });
    return;
  }

  rpc('get_location_request', { p_token: token })
    .then(function (r) {
      var incident = r.number ? { number: r.number, title: r.title } : null;
      if (r.status === 'valid') update({ incident: incident, phase: 'ready' });
      else if (r.status === 'used') update({ incident: incident, phase: 'done', status: { kind: 'ok', key: 'used' } });
      else {
        var key = r.status === 'expired' || r.status === 'closed' ? r.status : 'invalid';
        update({ incident: incident, phase: 'unusable', status: { kind: 'err', key: key } });
      }
    })
    .catch(function () {
      update({ phase: 'ready' });
    });

  button.addEventListener('click', function () {
    if (!navigator.geolocation) {
      update({ status: { kind: 'err', key: 'noGeo' } });
      return;
    }
    update({ phase: 'busy', busy: 'finding', status: null });
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        update({ busy: 'sending' });
        rpc('submit_location_request', {
          p_token: token,
          p_lat: pos.coords.latitude,
          p_lng: pos.coords.longitude,
          p_accuracy: pos.coords.accuracy,
        })
          .then(function () {
            var accuracy = Math.round(pos.coords.accuracy);
            update({ phase: 'done', busy: null, status: { kind: 'ok', key: 'sent', args: { accuracy: accuracy } } });
          })
          .catch(function (e) {
            var message = escapeHtml(e.message || TEXTS[state.lang].failed);
            failed({ kind: 'err', key: 'notSent', args: { message: message } });
          });
      },
      function (err) {
        failed({ kind: 'err', key: err.code === 1 ? 'blocked' : 'notFound' });
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  });

  function failed(status) {
    update({ phase: 'ready', busy: null, tried: true, status: status });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
