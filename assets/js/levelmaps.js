/* VocaTower — her oyun modu için bağımsız seviye haritası (Candy Crush tarzı).
   Her mod kendi ilerlemesini saklar: {[mode]: {level, completed:[]}}.
   level = oyuncunun ulaştığı (kilidi açık) en yüksek seviye numarası (1 tabanlı).
   completed = tamamlanmış seviye numaraları (tekrar oynanabilir, ilerlemeyi düşürmez). */
(function(window){

  var LEVEL_CAP = 30;
  var PASS_RATIO = 0.6;

  function getAllMaps(){
    var m = window.safeGet(window.STORAGE_KEYS.levelmaps, null);
    if(!m || typeof m !== 'object' || Array.isArray(m)) m = {};
    return m;
  }
  function saveAllMaps(m){ window.safeSet(window.STORAGE_KEYS.levelmaps, m); }

  function getModeMap(mode){
    var all = getAllMaps();
    var mm = all[mode];
    if(!mm || typeof mm !== 'object'){ mm = {level:1, completed:[]}; }
    if(typeof mm.level !== 'number' || mm.level < 1) mm.level = 1;
    if(!Array.isArray(mm.completed)) mm.completed = [];
    if(!mm.stars || typeof mm.stars !== 'object' || Array.isArray(mm.stars)) mm.stars = {};
    return mm;
  }

  /* Doğruluk oranından 1-3 yıldız hesaplar (sadece geçilen denemeler için
     çağrılır; başarısız denemeler zaten completeLevelIfPassed içinde
     erken dönüyor). */
  function starsForAccuracy(accuracy){
    if(accuracy >= 0.90) return 3;
    if(accuracy >= 0.75) return 2;
    if(accuracy >= 0.60) return 1;
    return 0;
  }

  function getModeLevel(mode){
    return Math.min(LEVEL_CAP, getModeMap(mode).level);
  }

  /* Level Map düğümüne tıklanan anda hangi seviyenin oynandığını tutar
     (mm.level'dan ÇIKARILAMAZ — replay sırasında mm.level zaten ileride
     olabilir). Oyun bittiğinde bir kez okunup temizlenir, böylece sonraki
     bir tamamlama (level map dışından) yanlışlıkla eski değeri kullanmaz. */
  var activePlayedLevel = {};
  function setPlayedLevel(mode, level){
    if(typeof level === 'number' && level >= 1) activePlayedLevel[mode] = level;
  }
  function takePlayedLevel(mode){
    var lvl = activePlayedLevel[mode];
    delete activePlayedLevel[mode];
    return typeof lvl === 'number' && lvl >= 1 ? lvl : null;
  }

  function getModePercent(mode){
    var mm = getModeMap(mode);
    var doneCount = Math.min(LEVEL_CAP, mm.completed.length);
    return Math.round(doneCount / LEVEL_CAP * 100);
  }

  /* Bir tur/oyun oturumu bittiğinde çağrılır. Oyuncu geçme eşiğini
     (correct/total >= 0.6) tuttuysa mevcut seviyeyi tamamlanmış işaretler
     ve bir sonraki seviyenin kilidini açar. Zaten tamamlanmış bir seviyeyi
     tekrar oynamak (replay) ilerlemeyi asla geri almaz. */
  function completeLevelIfPassed(mode, correct, total, playedLevel){
    var passed = total > 0 ? (correct/total) >= PASS_RATIO : !!correct;
    if(!passed) return {passed:false, leveledUp:false, level:getModeLevel(mode)};

    var all = getAllMaps();
    var mm = all[mode] || {level:1, completed:[]};
    if(typeof mm.level !== 'number' || mm.level < 1) mm.level = 1;
    if(!Array.isArray(mm.completed)) mm.completed = [];
    if(!mm.stars || typeof mm.stars !== 'object' || Array.isArray(mm.stars)) mm.stars = {};

    /* Oynanan seviye açıkça geçilmemişse (eski çağrı yeri) tek güvenli
       varsayım mevcut sınır seviyedir — geriye dönük uyumluluk. */
    var lvl = (typeof playedLevel === 'number' && playedLevel >= 1) ? playedLevel : mm.level;

    var wasAlreadyCompleted = mm.completed.indexOf(lvl) >= 0;
    if(!wasAlreadyCompleted) mm.completed.push(lvl);

    var accuracy = total > 0 ? (correct/total) : (correct ? 1 : 0);
    var earnedStars = starsForAccuracy(accuracy);
    var prevStars = mm.stars[lvl] || 0;
    mm.stars[lvl] = Math.max(prevStars, earnedStars);

    /* Sadece mevcut sınır seviye ilk kez geçildiğinde ilerleme açılır;
       daha önce tamamlanmış bir seviyenin tekrar oynanması (lvl < mm.level)
       asla mm.level'ı ilerletmez. */
    var leveledUp = false;
    if(lvl === mm.level && mm.level < LEVEL_CAP && !wasAlreadyCompleted){
      mm.level += 1;
      leveledUp = true;
    }
    all[mode] = mm;
    saveAllMaps(all);
    return {passed:true, leveledUp:leveledUp, level:Math.min(LEVEL_CAP, mm.level)};
  }

  window.LEVEL_CAP = LEVEL_CAP;
  window.getModeMap = getModeMap;
  window.getModeLevel = getModeLevel;
  window.getModePercent = getModePercent;
  window.completeLevelIfPassed = completeLevelIfPassed;
  window.setLevelMapPlayedLevel = setPlayedLevel;
  window.takeLevelMapPlayedLevel = takePlayedLevel;
})(window);
