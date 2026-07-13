/* VocaTower — 20 özgün, çizgi tarzı SVG avatar (harici görsel/telif karakter kullanılmaz) */
(function(window){

  /* ---------- Parça kütüphanesi (arka plan / yüz / saç / aksesuar) ---------- */

  function bgShape(shape, color){
    switch(shape){
      case 'circle': return '<circle cx="50" cy="50" r="48" fill="'+color+'"/>';
      case 'rounded-square': return '<rect x="3" y="3" width="94" height="94" rx="26" fill="'+color+'"/>';
      case 'hexagon': return '<polygon points="50,3 92,26 92,74 50,97 8,74 8,26" fill="'+color+'"/>';
      case 'blob1': return '<path d="M50,4 C82,4 97,28 93,56 C89,86 65,97 41,95 C15,93 3,67 7,40 C11,14 27,4 50,4 Z" fill="'+color+'"/>';
      case 'blob2': return '<path d="M50,5 C22,3 5,24 6,48 C7,74 24,96 52,94 C78,92 96,70 92,44 C89,20 74,7 50,5 Z" fill="'+color+'"/>';
      case 'diamond': return '<rect x="13" y="13" width="74" height="74" rx="20" fill="'+color+'" transform="rotate(45 50 50)"/>';
      default: return '<circle cx="50" cy="50" r="48" fill="'+color+'"/>';
    }
  }

  function faceShape(shape, skin){
    switch(shape){
      case 'round': return '<circle cx="50" cy="58" r="29" fill="'+skin+'"/>';
      case 'oval': return '<ellipse cx="50" cy="58" rx="25" ry="32" fill="'+skin+'"/>';
      case 'square': return '<rect x="23" y="31" width="54" height="54" rx="17" fill="'+skin+'"/>';
      case 'heart': return '<path d="M50,30 C65,30 77,41 77,55 C77,73 61,85 50,90 C39,85 23,73 23,55 C23,41 35,30 50,30 Z" fill="'+skin+'"/>';
      default: return '<circle cx="50" cy="58" r="29" fill="'+skin+'"/>';
    }
  }

  function faceFeatures(){
    return '' +
      '<circle cx="39" cy="54" r="3.6" fill="#33415C"/>' +
      '<circle cx="61" cy="54" r="3.6" fill="#33415C"/>' +
      '<circle cx="32" cy="64" r="5" fill="#E08E8E" opacity=".45"/>' +
      '<circle cx="68" cy="64" r="5" fill="#E08E8E" opacity=".45"/>' +
      '<path d="M40,67 Q50,75 60,67" stroke="#33415C" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }

  function hairShape(style, color){
    var cap = '<path d="M17,47 C17,19 32,7 50,7 C68,7 83,19 83,47 L83,33 C83,33 69,20 50,20 C31,20 17,33 17,33 Z" fill="'+color+'"/>';
    switch(style){
      case 'short':
        return cap;
      case 'curly':
        return cap +
          '<circle cx="24" cy="26" r="8" fill="'+color+'"/>' +
          '<circle cx="40" cy="15" r="8" fill="'+color+'"/>' +
          '<circle cx="60" cy="15" r="8" fill="'+color+'"/>' +
          '<circle cx="76" cy="26" r="8" fill="'+color+'"/>';
      case 'ponytail':
        return cap + '<ellipse cx="83" cy="50" rx="7.5" ry="15" fill="'+color+'"/>';
      case 'cap':
        return '<path d="M15,44 C15,20 30,10 50,10 C70,10 85,20 85,44 Z" fill="'+color+'"/>' +
               '<rect x="12" y="40" width="76" height="10" rx="5" fill="'+color+'"/>' +
               '<rect x="66" y="34" width="20" height="10" rx="5" fill="'+color+'" opacity=".85"/>';
      case 'spiky':
        return cap +
          '<polygon points="22,28 28,10 34,28" fill="'+color+'"/>' +
          '<polygon points="38,18 44,2 50,18" fill="'+color+'"/>' +
          '<polygon points="52,18 58,2 64,18" fill="'+color+'"/>' +
          '<polygon points="66,28 72,10 78,28" fill="'+color+'"/>';
      case 'bandana':
        return '<path d="M16,38 C16,18 31,8 50,8 C69,8 84,18 84,38 C84,38 66,28 50,28 C34,28 16,38 16,38 Z" fill="'+color+'"/>' +
               '<polygon points="82,30 94,24 90,38" fill="'+color+'"/>';
      default:
        return cap;
    }
  }

  function accessoryShape(type, color){
    switch(type){
      case 'glasses':
        return '<circle cx="39" cy="54" r="9" fill="none" stroke="'+color+'" stroke-width="3"/>' +
               '<circle cx="61" cy="54" r="9" fill="none" stroke="'+color+'" stroke-width="3"/>' +
               '<line x1="48" y1="54" x2="52" y2="54" stroke="'+color+'" stroke-width="3"/>' +
               '<line x1="30" y1="52" x2="24" y2="48" stroke="'+color+'" stroke-width="3" stroke-linecap="round"/>' +
               '<line x1="70" y1="52" x2="76" y2="48" stroke="'+color+'" stroke-width="3" stroke-linecap="round"/>';
      case 'headphones':
        return '<path d="M20,42 C20,22 33,12 50,12 C67,12 80,22 80,42" fill="none" stroke="'+color+'" stroke-width="5" stroke-linecap="round"/>' +
               '<rect x="13" y="38" width="12" height="20" rx="6" fill="'+color+'"/>' +
               '<rect x="75" y="38" width="12" height="20" rx="6" fill="'+color+'"/>';
      case 'bowtie':
        return '<polygon points="38,90 50,84 38,78" fill="'+color+'"/>' +
               '<polygon points="62,90 50,84 62,78" fill="'+color+'"/>' +
               '<circle cx="50" cy="84" r="3.5" fill="'+color+'"/>';
      case 'flower':
        return '<g transform="translate(76,22)">' +
          '<circle cx="0" cy="-8" r="5" fill="'+color+'"/>' +
          '<circle cx="0" cy="8" r="5" fill="'+color+'"/>' +
          '<circle cx="-8" cy="0" r="5" fill="'+color+'"/>' +
          '<circle cx="8" cy="0" r="5" fill="'+color+'"/>' +
          '<circle cx="0" cy="0" r="5" fill="#FFF3D9"/>' +
        '</g>';
      case 'none':
      default:
        return '';
    }
  }

  /* ---------- 20 sabit, birbirinden görsel olarak farklı kombinasyon ---------- */
  var FACES = ['round','oval','square','heart'];
  var HAIRS = ['short','curly','ponytail','cap','spiky','bandana'];
  var ACCS = ['glasses','headphones','bowtie','flower','none'];
  var BGS = ['circle','rounded-square','hexagon','blob1','blob2','diamond'];
  var SKINS = ['#F6D2B0','#EFC29A','#E3A876','#C98753','#8D5A3B'];
  var HAIR_COLORS = ['#33415C','#4A3B2A','#7C4A2D','#111111','#8A5A2B','#B08D57','#5FBFB5','#9384C9'];
  var BG_COLORS = ['#6C97C4','#72B396','#9384C9','#E0A458','#E08E8E','#33415C'];
  var ACC_COLORS = {glasses:'#33415C', headphones:'#33415C', bowtie:'#E0A458', flower:'#E08E8E', none:'#000'};

  var HAIR_LABELS = {short:'kısa saç', curly:'kıvırcık saç', ponytail:'atkuyruğu', cap:'şapka', spiky:'sivri saç', bandana:'bandana'};
  var ACC_LABELS = {glasses:'gözlüklü', headphones:'kulaklıklı', bowtie:'papyonlu', flower:'çiçekli', none:'sade'};

  var AVATAR_CONFIGS = [];
  for(var i=0;i<20;i++){
    var n = i+1;
    var face = FACES[i % FACES.length];
    var hair = HAIRS[i % HAIRS.length];
    var acc = ACCS[i % ACCS.length];
    var bg = BGS[i % BGS.length];
    var skin = SKINS[i % SKINS.length];
    var hairColor = HAIR_COLORS[i % HAIR_COLORS.length];
    var bgColor = BG_COLORS[i % BG_COLORS.length];
    var id = 'avatar-' + (n<10?'0'+n:n);
    AVATAR_CONFIGS.push({
      id:id, face:face, hair:hair, accessory:acc, bg:bg,
      skin:skin, hairColor:hairColor, bgColor:bgColor,
      accColor:ACC_COLORS[acc],
      label:'Avatar '+n+' — '+HAIR_LABELS[hair]+', '+ACC_LABELS[acc]
    });
  }

  function getAvatarConfig(avatarId){
    for(var i=0;i<AVATAR_CONFIGS.length;i++){
      if(AVATAR_CONFIGS[i].id === avatarId) return AVATAR_CONFIGS[i];
    }
    return AVATAR_CONFIGS[0];
  }

  function renderAvatarSVG(avatarId, size){
    var c = getAvatarConfig(avatarId);
    size = size || 64;
    return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+c.label+'">' +
      bgShape(c.bg, c.bgColor) +
      faceShape(c.face, c.skin) +
      faceFeatures() +
      hairShape(c.hair, c.hairColor) +
      accessoryShape(c.accessory, c.accColor) +
      '</svg>';
  }

  function getAvatarList(){ return AVATAR_CONFIGS.slice(); }

  window.AVATAR_CONFIGS = AVATAR_CONFIGS;
  window.getAvatarConfig = getAvatarConfig;
  window.renderAvatarSVG = renderAvatarSVG;
  window.getAvatarList = getAvatarList;
})(window);
