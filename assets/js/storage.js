/* VocaTower — güvenli localStorage yardımcıları */
(function(window){
  var STORAGE_KEYS = {
    profile: 'vocatower_profile',
    stats: 'vocatower_stats',
    badges: 'vocatower_badges'
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

  window.STORAGE_KEYS = STORAGE_KEYS;
  window.safeGet = safeGet;
  window.safeSet = safeSet;
})(window);
