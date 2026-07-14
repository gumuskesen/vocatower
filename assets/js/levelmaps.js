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
    return mm;
  }

  function getModeLevel(mode){
    return Math.min(LEVEL_CAP, getModeMap(mode).level);
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
  function completeLevelIfPassed(mode, correct, total){
    var passed = total > 0 ? (correct/total) >= PASS_RATIO : !!correct;
    if(!passed) return {passed:false, leveledUp:false, level:getModeLevel(mode)};

    var all = getAllMaps();
    var mm = all[mode] || {level:1, completed:[]};
    if(typeof mm.level !== 'number' || mm.level < 1) mm.level = 1;
    if(!Array.isArray(mm.completed)) mm.completed = [];

    var wasAlreadyCompleted = mm.completed.indexOf(mm.level) >= 0;
    if(!wasAlreadyCompleted) mm.completed.push(mm.level);

    var leveledUp = false;
    if(mm.level < LEVEL_CAP && !wasAlreadyCompleted){
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
})(window);
