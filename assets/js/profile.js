/* VocaTower — oyuncu profili (kullanıcı adı + avatar), kişisel veri toplanmaz */
(function(window){

  function defaultAvatarId(){
    var list = window.getAvatarList ? window.getAvatarList() : [];
    return list.length ? list[0].id : 'avatar-01';
  }

  function getProfile(){
    return window.safeGet(window.STORAGE_KEYS.profile, null);
  }

  function isOnboarded(){
    var p = getProfile();
    return !!(p && p.username && p.avatarId);
  }

  /* Çocuk dostu doğrulama: 2-16 karakter, boş/whitespace reddedilir */
  function validateUsername(raw){
    var name = String(raw || '').trim();
    if(name.length === 0){
      return {ok:false, message:'Lütfen bir isim yaz! 😊'};
    }
    if(name.length < 2){
      return {ok:false, message:'İsmin en az 2 harf olmalı 🙂'};
    }
    if(name.length > 16){
      return {ok:false, message:'İsmin en fazla 16 harf olabilir ✂️'};
    }
    return {ok:true, message:'', value:name};
  }

  /* Profili kaydeder/günceller. xp, altın, kule ve rozet ilerlemesine dokunmaz. */
  function saveProfile(data){
    var existing = getProfile();
    var v = validateUsername(data.username);
    if(!v.ok) return {ok:false, message:v.message};
    var avatarId = data.avatarId || (existing && existing.avatarId) || defaultAvatarId();
    var profile = {
      username: v.value,
      avatarId: avatarId,
      createdAt: (existing && existing.createdAt) || new Date().toISOString()
    };
    window.safeSet(window.STORAGE_KEYS.profile, profile);
    return {ok:true, profile:profile};
  }

  window.getProfile = getProfile;
  window.saveProfile = saveProfile;
  window.isOnboarded = isOnboarded;
  window.validateUsername = validateUsername;
})(window);
