/* VocaTower — soru geçmişi (tekrar önleme) + kelime ustalığı (adaptif tekrar) */
(function(window){

  /* ---------------- Never-repeat history ---------------- */

  function getHistory(){
    var h = window.safeGet(window.STORAGE_KEYS.history, null);
    if(!h || typeof h !== 'object') h = {};
    return h;
  }
  function saveHistory(h){ window.safeSet(window.STORAGE_KEYS.history, h); }

  function modeSeen(history, mode){
    if(!history[mode] || !Array.isArray(history[mode].seen)) history[mode] = {seen:[]};
    return history[mode].seen;
  }

  function markSeen(mode, id){
    if(!id) return;
    var h = getHistory();
    var seen = modeSeen(h, mode);
    if(seen.indexOf(id) < 0) seen.push(id);
    saveHistory(h);
  }

  /* Draws n items from pool that haven't been seen yet for this mode.
     idFn(item) -> stable string id. Once the pool is exhausted (not
     enough unseen items left), that mode's seen-list resets and the
     draw continues from a fresh pool — so repeats only happen after
     everything has been shown at least once. */
  function pickUnseen(mode, pool, n, idFn){
    if(!pool || pool.length === 0) return [];
    var h = getHistory();
    var seen = modeSeen(h, mode);
    var seenSet = {};
    for(var i=0;i<seen.length;i++) seenSet[seen[i]] = true;

    var unseen = pool.filter(function(item){ return !seenSet[idFn(item)]; });
    if(unseen.length < n){
      /* pool exhausted (or nearly) — reset history for this mode and
         redraw from the full pool so the player keeps getting fresh
         rounds instead of stalling on a shrinking tail */
      seen.length = 0;
      seenSet = {};
      unseen = pool.slice();
    }

    var chosen = window.shuffle ? window.shuffle(unseen).slice(0, n) : unseen.slice(0, n);
    chosen.forEach(function(item){
      var id = idFn(item);
      if(seen.indexOf(id) < 0) seen.push(id);
    });
    saveHistory(h);
    return chosen;
  }

  /* ---------------- Word mastery / adaptive review ---------------- */

  function getMastery(){
    var m = window.safeGet(window.STORAGE_KEYS.mastery, null);
    if(!m || typeof m !== 'object') m = {};
    return m;
  }
  function saveMastery(m){ window.safeSet(window.STORAGE_KEYS.mastery, m); }

  var MAX_BOX = 5;

  /* Call alongside addLearned() on every correct/incorrect answer.
     Correct answers raise the SRS "box" (mastered words get shown less
     often); a wrong answer drops the box back to 0, marking the word as
     due for review in a different question format next time. */
  function recordWordResult(en, correct){
    if(!en) return;
    var key = String(en).toLowerCase();
    var m = getMastery();
    var rec = m[key] || {correct:0, wrong:0, box:0, lastSeen:null};
    if(correct){
      rec.correct++;
      rec.box = Math.min(MAX_BOX, rec.box + 1);
    } else {
      rec.wrong++;
      rec.box = 0;
    }
    rec.lastSeen = new Date().toISOString();
    m[key] = rec;
    saveMastery(m);
  }

  function getWordMastery(en){
    var m = getMastery();
    return m[String(en).toLowerCase()] || {correct:0, wrong:0, box:0, lastSeen:null};
  }

  /* Words most in need of review: lowest box first, then most wrong
     answers, then least-recently-seen. vocabByEn maps lowercase english
     word -> vocab entry ({en,tr,exEn,exTr,difficulty,category}) so the
     Review Words screen can show real translations/examples. */
  /* Sadece oyuncunun DAHA ÖNCE EN AZ BİR KEZ yanlış cevapladığı kelimeleri
     döndürür — hiç yanlış yapılmamış kelimeler (görülmemiş veya her zaman
     doğru bilinen "ustalaşılmış" kelimeler) asla tekrar listesine girmez.
     Her doğru tekrar box'ı yükseltir; box MAX_BOX'a ulaşınca kelime listeden
     doğal olarak düşer (ustalaşıldı sayılır). */
  function getReviewWords(vocabByEn, n){
    var m = getMastery();
    var entries = Object.keys(m).map(function(k){ return {key:k, rec:m[k]}; });
    entries = entries.filter(function(e){ return e.rec.wrong > 0 && e.rec.box < MAX_BOX && vocabByEn[e.key]; });
    entries.sort(function(a,b){
      if(a.rec.box !== b.rec.box) return a.rec.box - b.rec.box;
      if(b.rec.wrong !== a.rec.wrong) return b.rec.wrong - a.rec.wrong;
      return (a.rec.lastSeen||'').localeCompare(b.rec.lastSeen||'');
    });
    return entries.slice(0, n).map(function(e){
      return Object.assign({}, vocabByEn[e.key], {mastery: e.rec});
    });
  }

  /* Weighted pick favoring words the player hasn't mastered yet and
     words matching their current difficulty tier — used to bias normal
     gameplay pools toward useful review without being a dedicated mode. */
  function pickByDifficulty(pool, n, playerLevel){
    if(!pool || pool.length === 0) return [];
    var m = getMastery();
    var weighted = pool.map(function(item){
      var diff = typeof item.difficulty === 'number' ? item.difficulty : 2;
      var levelGap = Math.abs(diff - playerLevel);
      var weight = levelGap === 0 ? 5 : levelGap === 1 ? 2 : 1;
      var rec = m[String(item.en||item[0]||'').toLowerCase()];
      if(rec && rec.box < 2) weight += 3; /* nudge weak words back in */
      if(rec && rec.box >= MAX_BOX) weight = Math.max(1, Math.round(weight/2)); /* mastered words show up less */
      return {item:item, weight:weight};
    });
    var bag = [];
    weighted.forEach(function(w){ for(var i=0;i<w.weight;i++) bag.push(w.item); });
    var chosen = [], usedIdx = {};
    var tries = 0;
    while(chosen.length < n && chosen.length < pool.length && tries < n*50){
      tries++;
      var pickIdx = Math.floor(Math.random()*bag.length);
      var candidate = bag[pickIdx];
      var cid = candidate.en || candidate[0];
      if(!usedIdx[cid]){ usedIdx[cid] = true; chosen.push(candidate); }
    }
    return chosen;
  }

  window.getHistory = getHistory;
  window.saveHistory = saveHistory;
  window.markSeen = markSeen;
  window.pickUnseen = pickUnseen;
  window.getMastery = getMastery;
  window.saveMastery = saveMastery;
  window.recordWordResult = recordWordResult;
  window.getWordMastery = getWordMastery;
  window.getReviewWords = getReviewWords;
  window.pickByDifficulty = pickByDifficulty;
})(window);
