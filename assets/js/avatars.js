/* VocaTower — official Frei Games avatar roster.
   Source: new_avatar_grid_5.png (master asset), sliced into
   assets/images/avatars/avatar_01.png..avatar_61.png (137x137, native
   crop, no resize/enhancement — see crop plan).
   Public API: AVATAR_CONFIGS, getAvatarConfig/getAvatarById,
   getAvatarSrc, getAvatarList, renderAvatarImage. Every screen renders
   avatars through renderAvatarImage() so there is one place that builds
   the <img> markup and one place that owns the asset path. */
(function(window){

  var AVATAR_BASE_PATH = '../assets/images/avatars/';
  var AVATAR_COUNT = 61;
  var FALLBACK_ID = 'avatar-01';

  var AVATAR_CONFIGS = [];
  for(var i=0;i<AVATAR_COUNT;i++){
    var n = i+1;
    var num = n<10 ? '0'+n : ''+n;
    var id = 'avatar-' + num;
    var file = 'avatar_' + num + '.png';
    var alt = 'VocaTower avatar ' + n;
    AVATAR_CONFIGS.push({
      id: id,
      file: file,
      src: AVATAR_BASE_PATH + file,
      alt: alt,
      label: alt /* kept for existing aria-label call sites */
    });
  }

  function getAvatarConfig(avatarId){
    for(var i=0;i<AVATAR_CONFIGS.length;i++){
      if(AVATAR_CONFIGS[i].id === avatarId) return AVATAR_CONFIGS[i];
    }
    /* unknown/old/invalid id (e.g. from a retired avatar set) — fall back
       safely without touching the rest of the caller's profile data */
    return AVATAR_CONFIGS[0];
  }

  function getAvatarSrc(avatarId){
    return getAvatarConfig(avatarId).src;
  }

  function getAvatarList(){ return AVATAR_CONFIGS.slice(); }

  /* Central image renderer — every screen that shows a selected avatar
     (profile bar, onboarding grid, profile-edit grid) goes through this,
     so there is exactly one place that builds an avatar <img>. Falls
     back to avatar-01's file automatically if the image fails to load,
     with no technical error surfaced to the player. */
  function renderAvatarImage(avatarId, size){
    var c = getAvatarConfig(avatarId);
    size = size || 64;
    var fallbackSrc = getAvatarSrc(FALLBACK_ID);
    return '<img src="'+c.src+'" width="'+size+'" height="'+size+'" alt="'+c.alt+'" ' +
      'style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;" ' +
      'loading="lazy" ' +
      'onerror="this.onerror=null;this.src=\''+fallbackSrc+'\';">';
  }

  window.AVATAR_CONFIGS = AVATAR_CONFIGS;
  window.getAvatarConfig = getAvatarConfig;
  window.getAvatarById = getAvatarConfig;
  window.getAvatarSrc = getAvatarSrc;
  window.getAvatarList = getAvatarList;
  window.renderAvatarImage = renderAvatarImage;
})(window);
