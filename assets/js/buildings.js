/* VocaTower — çoklu gökdelen ilerlemesi (10 bina, toplam 1000 kat).
   floors sayacı hiçbir zaman sıfırlanmaz/dönüştürülmez — sadece artık
   163 yerine 1000 kat üzerinden, tek kule yerine 10 binaya bölünerek
   yorumlanır. Mevcut oyuncuların floors değeri aynen korunur. */
(function(window){

  var BUILDING_TOTAL_FLOORS = 1000;

  /* Kat sayıları gerçek binaların kat sayılarından, toplam tam 1000
     olacak şekilde orantılı olarak ölçeklendirilmiştir (oynanış değeri). */
  var BUILDINGS = [
    {id:'flatiron',   name:'Flatiron Building',          city:'New York',   floors:21,  icon:'🏢'},
    {id:'chrysler',   name:'Chrysler Building',          city:'New York',   floors:77,  icon:'🏙️'},
    {id:'empire',     name:'Empire State Building',      city:'New York',   floors:103, icon:'🏢'},
    {id:'bankofchina',name:'Bank of China Tower',        city:'Hong Kong',  floors:72,  icon:'🏦'},
    {id:'taipei101',  name:'Taipei 101',                 city:'Taipei',     floors:102, icon:'🏯'},
    {id:'petronas',   name:'Petronas Towers',            city:'Kuala Lumpur', floors:88, icon:'🕌'},
    {id:'shanghai',   name:'Shanghai Tower',              city:'Shanghai',   floors:129, icon:'🌆'},
    {id:'lotte',      name:'Lotte World Tower',           city:'Seul',       floors:124, icon:'🏯'},
    {id:'makkah',     name:'Makkah Royal Clock Tower',    city:'Mekke',      floors:121, icon:'🕋'},
    {id:'burjkhalifa',name:'Burj Khalifa',                city:'Dubai',      floors:163, icon:'🏙️'}
  ];

  /* Her binanın küme içindeki başlangıç/bitiş eşiklerini önceden hesapla */
  (function computeThresholds(){
    var cum = 0;
    BUILDINGS.forEach(function(b){
      b.startFloor = cum;
      cum += b.floors;
      b.endFloor = cum;
    });
  })();

  function getBuildingProgress(totalFloors){
    var clamped = Math.max(0, totalFloors);
    var overall = Math.min(1, clamped / BUILDING_TOTAL_FLOORS);
    var current = BUILDINGS[BUILDINGS.length - 1];
    var currentIndex = BUILDINGS.length - 1;
    for(var i=0;i<BUILDINGS.length;i++){
      if(clamped < BUILDINGS[i].endFloor || i === BUILDINGS.length-1){
        current = BUILDINGS[i];
        currentIndex = i;
        break;
      }
    }
    var floorsIntoCurrent = Math.min(current.floors, Math.max(0, clamped - current.startFloor));
    var currentPct = current.floors > 0 ? floorsIntoCurrent / current.floors : 1;
    var completed = clamped >= BUILDING_TOTAL_FLOORS;
    var next = completed ? null : BUILDINGS[currentIndex + 1] || null;
    return {
      totalFloors: clamped,
      overallPct: overall,
      current: current,
      currentIndex: currentIndex,
      floorsIntoCurrent: floorsIntoCurrent,
      currentPct: currentPct,
      next: next,
      completed: completed
    };
  }

  window.BUILDING_TOTAL_FLOORS = BUILDING_TOTAL_FLOORS;
  window.BUILDINGS = BUILDINGS;
  window.getBuildingProgress = getBuildingProgress;
})(window);
