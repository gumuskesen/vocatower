/* VocaTower — güvenli localStorage yardımcıları */
(function(window){
  var STORAGE_KEYS = {
    profile: 'vocatower_profile',
    stats: 'vocatower_stats',
    badges: 'vocatower_badges',
    progress: 'vocatower_progress',
    history: 'vocatower_history',
    mastery: 'vocatower_mastery',
    levelmaps: 'vocatower_levelmaps',
    favorites: 'vocatower_favorites'
  };

  function safeGet(key, fallback){
    try{
      var raw = window.localStorage.getItem(key);
      if(raw === null || raw === undefined) return fallback;
      var parsed = JSON.parse(raw);
      if(parsed === null || parsed === undefined) return fallback;
      return parsed;
    }catch(e){
      return fallback;
    }
  }

  function safeSet(key, value){
    try{
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch(e){
      return false;
    }
  }

  var SCHEMA_VERSION_KEY = 'vocatower_schema_version';
  var CURRENT_SCHEMA_VERSION = 3;

  /* Oyuncu ilerlemesini asla silmeyen, yalnızca eksik alanları tamamlayan
     tek seferlik açılış geçişi. Var olan geçerli veriye asla dokunmaz —
     yalnızca eksik/bozuk alanları güvenli varsayılanlarla tamamlar. */
  function migrateSaveData(){
    try{
      var version = safeGet(SCHEMA_VERSION_KEY, 0);

      var progress = safeGet(STORAGE_KEYS.progress, null);
      if(progress && typeof progress === 'object'){
        var fixed = false;
        if(typeof progress.xp !== 'number'){ progress.xp = 0; fixed = true; }
        if(typeof progress.floors !== 'number'){ progress.floors = 0; fixed = true; }
        if(!Array.isArray(progress.learnedWords)){ progress.learnedWords = []; fixed = true; }
        if(fixed) safeSet(STORAGE_KEYS.progress, progress);
      }

      var badges = safeGet(STORAGE_KEYS.badges, null);
      if(badges !== null && (typeof badges !== 'object' || Array.isArray(badges))){
        safeSet(STORAGE_KEYS.badges, {});
      }

      var stats = safeGet(STORAGE_KEYS.stats, null);
      if(stats && typeof stats === 'object' && !Array.isArray(stats.playDates)){
        stats.playDates = [];
        safeSet(STORAGE_KEYS.stats, stats);
      }

      var levelmaps = safeGet(STORAGE_KEYS.levelmaps, null);
      if(levelmaps !== null && (typeof levelmaps !== 'object' || Array.isArray(levelmaps))){
        safeSet(STORAGE_KEYS.levelmaps, {});
      }

      var favorites = safeGet(STORAGE_KEYS.favorites, null);
      if(favorites !== null && (typeof favorites !== 'object' || Array.isArray(favorites))){
        safeSet(STORAGE_KEYS.favorites, {});
      }

      if(version < CURRENT_SCHEMA_VERSION){
        safeSet(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      }
    }catch(e){
      /* Geçiş sırasında bir hata olsa bile mevcut veriye asla dokunulmadı —
         sessizce vazgeç, oyun normal varsayılanlarla açılmaya devam eder. */
    }
  }

  window.STORAGE_KEYS = STORAGE_KEYS;
  window.safeGet = safeGet;
  window.safeSet = safeSet;
  window.migrateSaveData = migrateSaveData;
})(window);
