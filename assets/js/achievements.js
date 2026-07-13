/* VocaTower — rozet/başarım sistemi */
(function(window){

  var BADGES = [
    {id:'first-step', title:'İlk Adım', description:'İlk oyununu tamamla', icon:'🥇', goldReward:10,
      requirement:function(s){ return s.gamesCompleted>=1; }, progress:function(s){ return [Math.min(s.gamesCompleted,1),1]; }},
    {id:'word-explorer', title:'Kelime Kaşifi', description:'25 doğru cevap ver', icon:'🔎', goldReward:10,
      requirement:function(s){ return s.correctAnswers>=25; }, progress:function(s){ return [Math.min(s.correctAnswers,25),25]; }},
    {id:'word-collector', title:'Kelime Koleksiyoncusu', description:'100 doğru cevap ver', icon:'📚', goldReward:25,
      requirement:function(s){ return s.correctAnswers>=100; }, progress:function(s){ return [Math.min(s.correctAnswers,100),100]; }},
    {id:'word-master', title:'Kelime Ustası', description:'500 doğru cevap ver', icon:'👑', goldReward:50,
      requirement:function(s){ return s.correctAnswers>=500; }, progress:function(s){ return [Math.min(s.correctAnswers,500),500]; }},
    {id:'perfect-round', title:'Mükemmel Tur', description:'Bir oyunu hatasız tamamla', icon:'🌟', goldReward:10,
      requirement:function(s){ return s.perfectGames>=1; }, progress:function(s){ return [Math.min(s.perfectGames,1),1]; }},
    {id:'perfect-five', title:'Beşte Beş', description:'5 oyunu hatasız tamamla', icon:'✨', goldReward:25,
      requirement:function(s){ return s.perfectGames>=5; }, progress:function(s){ return [Math.min(s.perfectGames,5),5]; }},
    {id:'tower-starter', title:'Kule Başlangıcı', description:'Kulende 10 kat yap', icon:'🧱', goldReward:10,
      requirement:function(s){ return s.towerFloors>=10; }, progress:function(s){ return [Math.min(s.towerFloors,10),10]; }},
    {id:'tower-builder', title:'Kule Ustası', description:'Kulende 50 kat yap', icon:'🏗️', goldReward:25,
      requirement:function(s){ return s.towerFloors>=50; }, progress:function(s){ return [Math.min(s.towerFloors,50),50]; }},
    {id:'tower-architect', title:'Kule Mimarı', description:'Kulende 100 kat yap', icon:'🏛️', goldReward:50,
      requirement:function(s){ return s.towerFloors>=100; }, progress:function(s){ return [Math.min(s.towerFloors,100),100]; }},
    {id:'tower-legend', title:'Kule Efsanesi', description:'Kuleni tamamla (163 kat)', icon:'🏙️', goldReward:100,
      requirement:function(s){ return s.towerFloors>=163; }, progress:function(s){ return [Math.min(s.towerFloors,163),163]; }},
    {id:'memory-rookie', title:'Hafıza Çaylağı', description:'Hafıza Kartları oyununu tamamla', icon:'🃏', goldReward:10,
      requirement:function(s){ return s.memoryGamesCompleted>=1; }, progress:function(s){ return [Math.min(s.memoryGamesCompleted,1),1]; }},
    {id:'listening-star', title:'Dinleme Yıldızı', description:'Dinleme oyununu tamamla', icon:'🎧', goldReward:10,
      requirement:function(s){ return s.listeningGamesCompleted>=1; }, progress:function(s){ return [Math.min(s.listeningGamesCompleted,1),1]; }},
    {id:'spelling-bee', title:'Yazım Arısı', description:'Yazım Arısı oyununu tamamla', icon:'✍️', goldReward:10,
      requirement:function(s){ return s.spellingGamesCompleted>=1; }, progress:function(s){ return [Math.min(s.spellingGamesCompleted,1),1]; }},
    {id:'story-reader', title:'Hikaye Okuru', description:'Bir hikayeyi tamamla', icon:'📖', goldReward:10,
      requirement:function(s){ return s.storiesCompleted>=1; }, progress:function(s){ return [Math.min(s.storiesCompleted,1),1]; }},
    {id:'puzzle-solver', title:'Bulmaca Ustası', description:'Bir çapraz bulmaca ya da kelime bulmacası çöz', icon:'🧩', goldReward:10,
      requirement:function(s){ return s.puzzlesCompleted>=1; }, progress:function(s){ return [Math.min(s.puzzlesCompleted,1),1]; }},
    {id:'rocket-pilot', title:'Roket Pilotu', description:'Bir roket yarışı kazan', icon:'🚀', goldReward:10,
      requirement:function(s){ return s.rocketWins>=1; }, progress:function(s){ return [Math.min(s.rocketWins,1),1]; }},
    {id:'daily-learner', title:'Günlük Öğrenci', description:'3 farklı günde oyna', icon:'📅', goldReward:25,
      requirement:function(s){ return s.playDates.length>=3; }, progress:function(s){ return [Math.min(s.playDates.length,3),3]; }},
    {id:'weekly-hero', title:'Haftalık Kahraman', description:'7 farklı günde oyna', icon:'🗓️', goldReward:50,
      requirement:function(s){ return s.playDates.length>=7; }, progress:function(s){ return [Math.min(s.playDates.length,7),7]; }},
    {id:'gold-saver', title:'Altın Biriktiren', description:'250 altın topla', icon:'🪙', goldReward:25,
      requirement:function(s){ return s.totalGoldEarned>=250; }, progress:function(s){ return [Math.min(s.totalGoldEarned,250),250]; }},
    {id:'treasure-master', title:'Hazine Ustası', description:'1000 altın topla', icon:'💰', goldReward:50,
      requirement:function(s){ return s.totalGoldEarned>=1000; }, progress:function(s){ return [Math.min(s.totalGoldEarned,1000),1000]; }}
  ];

  function getUnlockMap(){
    return window.safeGet(window.STORAGE_KEYS.badges, {});
  }
  function saveUnlockMap(map){
    window.safeSet(window.STORAGE_KEYS.badges, map);
  }

  function getBadges(){
    var unlocked = getUnlockMap();
    var stats = window.getStats ? window.getStats() : null;
    return BADGES.map(function(b){
      var u = unlocked[b.id];
      var prog = (stats && b.progress) ? b.progress(stats) : null;
      return {
        id:b.id, title:b.title, description:b.description, icon:b.icon, goldReward:b.goldReward,
        unlocked: !!u, unlockedAt: u ? u.unlockedAt : null,
        progressCurrent: prog ? prog[0] : null, progressMax: prog ? prog[1] : null
      };
    });
  }

  /* Halihazırda yeterli olan (stats) her rozeti kilit açar, yalnızca bir kez ödüllendirir */
  function checkAchievements(stats){
    stats = stats || window.getStats();
    var unlocked = getUnlockMap();
    var newlyUnlocked = [];
    BADGES.forEach(function(b){
      if(unlocked[b.id]) return;
      if(b.requirement(stats)){
        unlocked[b.id] = {unlockedAt: new Date().toISOString()};
        newlyUnlocked.push(b);
      }
    });
    if(newlyUnlocked.length){
      saveUnlockMap(unlocked);
      newlyUnlocked.forEach(function(b){
        if(window.addGold) window.addGold(b.goldReward);
      });
      window._badgePopupQueue = (window._badgePopupQueue||[]).concat(newlyUnlocked);
      processBadgeQueue();
    }
    return newlyUnlocked;
  }

  var badgePopupBusy = false;
  function processBadgeQueue(){
    if(badgePopupBusy) return;
    var queue = window._badgePopupQueue || [];
    if(!queue.length) return;
    badgePopupBusy = true;
    var badge = queue.shift();
    window._badgePopupQueue = queue;
    showBadgeUnlockPopup(badge, function(){
      badgePopupBusy = false;
      processBadgeQueue();
    });
  }

  function showBadgeUnlockPopup(badge, onClose){
    var overlay = document.createElement('div');
    overlay.className = 'motiv-overlay badge-unlock-overlay';
    overlay.innerHTML =
      '<div class="motiv-card badge-unlock-card">' +
        '<div class="badge-unlock-icon">'+badge.icon+'</div>' +
        '<div class="motiv-msg">Yeni Rozet! 🎉</div>' +
        '<div class="badge-unlock-title">'+badge.title+'</div>' +
        '<div class="motiv-sub">'+badge.description+'</div>' +
        '<div class="badge-unlock-reward">🪙 +'+badge.goldReward+' altın</div>' +
        '<div class="motiv-close">devam etmek için dokun</div>' +
      '</div>';
    var closed = false;
    function close(){
      if(closed) return; closed = true;
      if(overlay.parentNode) overlay.remove();
      if(onClose) onClose();
    }
    overlay.onclick = close;
    document.body.appendChild(overlay);
    setTimeout(close, 4500);
  }

  window.getBadges = getBadges;
  window.checkAchievements = checkAchievements;
  window.showBadgeUnlockPopup = showBadgeUnlockPopup;
})(window);
