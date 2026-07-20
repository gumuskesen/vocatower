/* VocaTower — istatistikler, altın ödülleri ve oturum tamamlama */
(function(window){

  function defaultStats(){
    return {
      gamesCompleted: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      perfectGames: 0,
      currentGold: 0,
      totalGoldEarned: 0,
      towerFloors: 0,
      storiesCompleted: 0,
      memoryGamesCompleted: 0,
      listeningGamesCompleted: 0,
      spellingGamesCompleted: 0,
      puzzlesCompleted: 0,
      rocketWins: 0,
      reviewGamesCompleted: 0,
      playDates: []
    };
  }

  function getStats(){
    var stored = window.safeGet(window.STORAGE_KEYS.stats, null);
    var stats = defaultStats();
    if(stored && typeof stored === 'object'){
      Object.keys(stats).forEach(function(k){
        if(stored[k] !== undefined && stored[k] !== null) stats[k] = stored[k];
      });
      if(!Array.isArray(stats.playDates)) stats.playDates = [];
    }
    return stats;
  }

  function saveStats(stats){
    window.safeSet(window.STORAGE_KEYS.stats, stats);
  }

  function addGold(stats, n){
    var amount = Math.round(n) || 0;
    stats.currentGold = Math.max(0, stats.currentGold + amount);
    if(amount > 0) stats.totalGoldEarned = Math.max(0, stats.totalGoldEarned + amount);
    return stats;
  }

  var MODE_COUNTER = {
    memory: 'memoryGamesCompleted',
    listen: 'listeningGamesCompleted',
    spelling: 'spellingGamesCompleted',
    story: 'storiesCompleted',
    crossword: 'puzzlesCompleted',
    scramble: 'puzzlesCompleted',
    review: 'reviewGamesCompleted'
  };

  function recordSession(stats, mode, data){
    stats.gamesCompleted += 1;
    var correct = data.correct || 0;
    var total = data.total || 0;
    stats.correctAnswers += correct;
    stats.wrongAnswers += Math.max(0, total - correct);
    if(data.perfect) stats.perfectGames += 1;
    if(mode === 'rocket' && data.won) stats.rocketWins += 1;
    var counterKey = MODE_COUNTER[mode];
    if(counterKey) stats[counterKey] += 1;
    if(typeof window.floors === 'number') stats.towerFloors = window.floors;
    return stats;
  }

  function todayStr(){
    return new Date().toISOString().slice(0,10);
  }

  /* Aynı oturum için birden fazla ödül verilmesini engeller (sayfa yenileme, çift tıklama vb.) */
  function completeGameSession(mode, data){
    data = data || {};
    if(window._activeSession && window._activeSession.mode === mode && window._activeSession.done){
      var dupKey = data.levelKey || mode;
      return {goldEarned:0, breakdown:[], newBadges:[], duplicate:true, levelResult:{passed:false, leveledUp:false, level:window.getModeLevel?window.getModeLevel(dupKey):1}};
    }
    if(window._activeSession) window._activeSession.done = true;

    var stats = getStats();
    recordSession(stats, mode, data);

    var breakdown = [];
    breakdown.push({label:'Tamamlama', amount:10});
    if(data.perfect){
      breakdown.push({label:'Mükemmel Skor', amount:10});
      breakdown.push({label:'Hatasız Bonus', amount:5});
    }
    var today = todayStr();
    if(stats.playDates.indexOf(today) === -1){
      stats.playDates.push(today);
      breakdown.push({label:'Günün İlk Oyunu', amount:10});
    }

    var goldEarned = breakdown.reduce(function(sum,b){return sum+b.amount;}, 0);
    addGold(stats, goldEarned);
    saveStats(stats);

    var newBadges = window.checkAchievements ? window.checkAchievements(stats) : [];

    var levelKey = data.levelKey || mode;
    var playedLevel = typeof data.playedLevel === 'number'
      ? data.playedLevel
      : (window.takeLevelMapPlayedLevel ? window.takeLevelMapPlayedLevel(levelKey) : null);
    var levelResult = data.levelPassEligible === false
      ? {passed:false, leveledUp:false, level:window.getModeLevel?window.getModeLevel(levelKey):1}
      : window.completeLevelIfPassed
        ? window.completeLevelIfPassed(levelKey, data.correct||0, data.total||0, playedLevel)
        : {passed:false, leveledUp:false, level:1};

    return {goldEarned:goldEarned, breakdown:breakdown, newBadges:newBadges, stats:stats, levelResult:levelResult};
  }

  window.getStats = getStats;
  window.saveStats = saveStats;
  window.addGold = function(n){ var s = getStats(); addGold(s, n); saveStats(s); return s; };
  window.completeGameSession = completeGameSession;
})(window);
