/* VocaTower — Sentence Builder production level dataset.
   Schema: {id, english, turkish, difficulty, category, orderedWords}.
   Punctuation stays attached to its word so the existing whitespace-token
   model can render and validate every sentence without special handling. */
window.SB_LEVEL_SENTENCES = {
  1: [
    {id:'sb-l01-01', english:'I read my book.', turkish:'Kitabımı okurum.', difficulty:1, category:'school', orderedWords:['I','read','my','book.']},
    {id:'sb-l01-02', english:'We eat red apples.', turkish:'Kırmızı elmalar yeriz.', difficulty:1, category:'food', orderedWords:['We','eat','red','apples.']},
    {id:'sb-l01-03', english:'Cats drink fresh water.', turkish:'Kediler taze su içer.', difficulty:1, category:'animals', orderedWords:['Cats','drink','fresh','water.']}
  ],
  2: [
    {id:'sb-l02-01', english:'She packs her bag.', turkish:'Çantasını hazırlar.', difficulty:1, category:'school', orderedWords:['She','packs','her','bag.']},
    {id:'sb-l02-02', english:'They play with blocks.', turkish:'Bloklarla oynarlar.', difficulty:1, category:'play', orderedWords:['They','play','with','blocks.']},
    {id:'sb-l02-03', english:'Birds sing every morning.', turkish:'Kuşlar her sabah öter.', difficulty:1, category:'animals', orderedWords:['Birds','sing','every','morning.']}
  ],
  3: [
    {id:'sb-l03-01', english:'He opens the window.', turkish:'Pencereyi açar.', difficulty:1, category:'home', orderedWords:['He','opens','the','window.']},
    {id:'sb-l03-02', english:'We clean our room.', turkish:'Odamızı temizleriz.', difficulty:1, category:'home', orderedWords:['We','clean','our','room.']},
    {id:'sb-l03-03', english:'The dog likes balls.', turkish:'Köpek topları sever.', difficulty:1, category:'animals', orderedWords:['The','dog','likes','balls.']}
  ],
  4: [
    {id:'sb-l04-01', english:'I draw a house.', turkish:'Bir ev çizerim.', difficulty:1, category:'school', orderedWords:['I','draw','a','house.']},
    {id:'sb-l04-02', english:'She shares her pencils.', turkish:'Kalemlerini paylaşır.', difficulty:1, category:'school', orderedWords:['She','shares','her','pencils.']},
    {id:'sb-l04-03', english:'Rabbits eat green leaves.', turkish:'Tavşanlar yeşil yapraklar yer.', difficulty:1, category:'animals', orderedWords:['Rabbits','eat','green','leaves.']}
  ],
  5: [
    {id:'sb-l05-01', english:'They kick the ball.', turkish:'Topa vururlar.', difficulty:1, category:'play', orderedWords:['They','kick','the','ball.']},
    {id:'sb-l05-02', english:'My lunch tastes good.', turkish:'Öğle yemeğimin tadı güzel.', difficulty:1, category:'food', orderedWords:['My','lunch','tastes','good.']},
    {id:'sb-l05-03', english:'We help our teacher.', turkish:'Öğretmenimize yardım ederiz.', difficulty:1, category:'school', orderedWords:['We','help','our','teacher.']}
  ],
  6: [
    {id:'sb-l06-01', english:'The small kite flies high.', turkish:'Küçük uçurtma yüksekte uçar.', difficulty:1, category:'play', orderedWords:['The','small','kite','flies','high.']},
    {id:'sb-l06-02', english:'Our shoes are very clean.', turkish:'Ayakkabılarımız çok temiz.', difficulty:1, category:'daily', orderedWords:['Our','shoes','are','very','clean.']},
    {id:'sb-l06-03', english:'Three ducks swim in ponds.', turkish:'Üç ördek göletlerde yüzer.', difficulty:1, category:'animals', orderedWords:['Three','ducks','swim','in','ponds.']}
  ],
  7: [
    {id:'sb-l07-01', english:'I brush my teeth daily.', turkish:'Dişlerimi her gün fırçalarım.', difficulty:1, category:'daily', orderedWords:['I','brush','my','teeth','daily.']},
    {id:'sb-l07-02', english:'She walks to school.', turkish:'Okula yürüyerek gider.', difficulty:1, category:'school', orderedWords:['She','walks','to','school.']},
    {id:'sb-l07-03', english:'We wash our hands often.', turkish:'Ellerimizi sık sık yıkarız.', difficulty:1, category:'daily', orderedWords:['We','wash','our','hands','often.']}
  ],
  8: [
    {id:'sb-l08-01', english:'The yellow bus stops here.', turkish:'Sarı otobüs burada durur.', difficulty:1, category:'places', orderedWords:['The','yellow','bus','stops','here.']},
    {id:'sb-l08-02', english:'My friends live nearby.', turkish:'Arkadaşlarım yakında oturur.', difficulty:1, category:'daily', orderedWords:['My','friends','live','nearby.']},
    {id:'sb-l08-03', english:'Those flowers smell sweet.', turkish:'Şu çiçekler güzel kokar.', difficulty:1, category:'nature', orderedWords:['Those','flowers','smell','sweet.']}
  ],
  9: [
    {id:'sb-l09-01', english:'The children wear warm coats.', turkish:'Çocuklar sıcak tutan montlar giyer.', difficulty:1, category:'daily', orderedWords:['The','children','wear','warm','coats.']},
    {id:'sb-l09-02', english:'A wooden box holds toys.', turkish:'Ahşap bir kutu oyuncakları tutar.', difficulty:1, category:'home', orderedWords:['A','wooden','box','holds','toys.']},
    {id:'sb-l09-03', english:'Our classroom has two doors.', turkish:'Sınıfımızın iki kapısı var.', difficulty:1, category:'school', orderedWords:['Our','classroom','has','two','doors.']}
  ],
  10: [
    {id:'sb-l10-01', english:'I feed the fish daily.', turkish:'Balıkları her gün beslerim.', difficulty:1, category:'animals', orderedWords:['I','feed','the','fish','daily.']},
    {id:'sb-l10-02', english:'My sister makes breakfast.', turkish:'Kız kardeşim kahvaltı hazırlar.', difficulty:1, category:'family', orderedWords:['My','sister','makes','breakfast.']},
    {id:'sb-l10-03', english:'The moon looks bright tonight.', turkish:'Ay bu gece parlak görünüyor.', difficulty:1, category:'nature', orderedWords:['The','moon','looks','bright','tonight.']}
  ],
  11: [
    {id:'sb-l11-01', english:'The baby is sleeping upstairs.', turkish:'Bebek üst katta uyuyor.', difficulty:2, category:'family', orderedWords:['The','baby','is','sleeping','upstairs.']},
    {id:'sb-l11-02', english:'We are painting a blue boat.', turkish:'Mavi bir tekne boyuyoruz.', difficulty:2, category:'activities', orderedWords:['We','are','painting','a','blue','boat.']},
    {id:'sb-l11-03', english:'Two squirrels are climbing the tree.', turkish:'İki sincap ağaca tırmanıyor.', difficulty:2, category:'animals', orderedWords:['Two','squirrels','are','climbing','the','tree.']}
  ],
  12: [
    {id:'sb-l12-01', english:'I can carry this basket.', turkish:'Bu sepeti taşıyabilirim.', difficulty:2, category:'abilities', orderedWords:['I','can','carry','this','basket.']},
    {id:'sb-l12-02', english:'Penguins cannot fly in the sky.', turkish:'Penguenler gökyüzünde uçamaz.', difficulty:2, category:'animals', orderedWords:['Penguins','cannot','fly','in','the','sky.']},
    {id:'sb-l12-03', english:'She can solve this puzzle.', turkish:'Bu bulmacayı çözebilir.', difficulty:2, category:'abilities', orderedWords:['She','can','solve','this','puzzle.']}
  ],
  13: [
    {id:'sb-l13-01', english:'We are waiting for the train.', turkish:'Treni bekliyoruz.', difficulty:2, category:'places', orderedWords:['We','are','waiting','for','the','train.']},
    {id:'sb-l13-02', english:'A farmer is watering the plants.', turkish:'Bir çiftçi bitkileri suluyor.', difficulty:2, category:'nature', orderedWords:['A','farmer','is','watering','the','plants.']},
    {id:'sb-l13-03', english:'I am wearing my green sweater.', turkish:'Yeşil kazağımı giyiyorum.', difficulty:2, category:'daily', orderedWords:['I','am','wearing','my','green','sweater.']}
  ],
  14: [
    {id:'sb-l14-01', english:'Our lesson starts at nine.', turkish:'Dersimiz saat dokuzda başlar.', difficulty:2, category:'time', orderedWords:['Our','lesson','starts','at','nine.']},
    {id:'sb-l14-02', english:'We eat dinner at six.', turkish:'Akşam yemeğini saat altıda yeriz.', difficulty:2, category:'time', orderedWords:['We','eat','dinner','at','six.']},
    {id:'sb-l14-03', english:'The library closes after school.', turkish:'Kütüphane okuldan sonra kapanır.', difficulty:2, category:'time', orderedWords:['The','library','closes','after','school.']}
  ],
  15: [
    {id:'sb-l15-01', english:'They can build a tall tower.', turkish:'Uzun bir kule yapabilirler.', difficulty:2, category:'abilities', orderedWords:['They','can','build','a','tall','tower.']},
    {id:'sb-l15-02', english:'My brother is learning to swim.', turkish:'Erkek kardeşim yüzmeyi öğreniyor.', difficulty:2, category:'family', orderedWords:['My','brother','is','learning','to','swim.']},
    {id:'sb-l15-03', english:'The horse can jump over fences.', turkish:'At çitlerin üzerinden atlayabilir.', difficulty:2, category:'animals', orderedWords:['The','horse','can','jump','over','fences.']}
  ],
  16: [
    {id:'sb-l16-01', english:'I usually pack fruit for school.', turkish:'Okul için genellikle meyve hazırlarım.', difficulty:2, category:'daily', orderedWords:['I','usually','pack','fruit','for','school.']},
    {id:'sb-l16-02', english:'We sometimes watch clouds after lunch.', turkish:'Bazen öğle yemeğinden sonra bulutları izleriz.', difficulty:2, category:'nature', orderedWords:['We','sometimes','watch','clouds','after','lunch.']},
    {id:'sb-l16-03', english:'My grandparents often visit on Sundays.', turkish:'Büyükannem ve büyükbabam pazar günleri sık sık ziyarete gelir.', difficulty:2, category:'family', orderedWords:['My','grandparents','often','visit','on','Sundays.']}
  ],
  17: [
    {id:'sb-l17-01', english:'Our keys are inside the drawer.', turkish:'Anahtarlarımız çekmecenin içinde.', difficulty:2, category:'places', orderedWords:['Our','keys','are','inside','the','drawer.']},
    {id:'sb-l17-02', english:'A soft rug lies under the table.', turkish:'Yumuşak bir halı masanın altında durur.', difficulty:2, category:'home', orderedWords:['A','soft','rug','lies','under','the','table.']},
    {id:'sb-l17-03', english:'A bicycle stands beside the gate.', turkish:'Bir bisiklet kapının yanında durur.', difficulty:2, category:'places', orderedWords:['A','bicycle','stands','beside','the','gate.']}
  ],
  18: [
    {id:'sb-l18-01', english:'My aunt teaches us funny songs.', turkish:'Teyzem bize eğlenceli şarkılar öğretir.', difficulty:2, category:'family', orderedWords:['My','aunt','teaches','us','funny','songs.']},
    {id:'sb-l18-02', english:'Our family cooks together on Fridays.', turkish:'Ailemiz cuma günleri birlikte yemek yapar.', difficulty:2, category:'family', orderedWords:['Our','family','cooks','together','on','Fridays.']},
    {id:'sb-l18-03', english:'The twins share a quiet bedroom.', turkish:'İkizler sessiz bir yatak odasını paylaşır.', difficulty:2, category:'family', orderedWords:['The','twins','share','a','quiet','bedroom.']}
  ],
  19: [
    {id:'sb-l19-01', english:'Dark clouds bring gentle rain today.', turkish:'Koyu bulutlar bugün hafif yağmur getirir.', difficulty:2, category:'weather', orderedWords:['Dark','clouds','bring','gentle','rain','today.']},
    {id:'sb-l19-02', english:'Warm sunlight melts the snow.', turkish:'Ilık güneş ışığı karı eritir.', difficulty:2, category:'weather', orderedWords:['Warm','sunlight','melts','the','snow.']},
    {id:'sb-l19-03', english:'Small birds hide among the branches.', turkish:'Küçük kuşlar dalların arasında saklanır.', difficulty:2, category:'nature', orderedWords:['Small','birds','hide','among','the','branches.']}
  ],
  20: [
    {id:'sb-l20-01', english:'We cut colored paper with scissors.', turkish:'Renkli kâğıdı makasla keseriz.', difficulty:2, category:'classroom', orderedWords:['We','cut','colored','paper','with','scissors.']},
    {id:'sb-l20-02', english:'Our teacher writes words on the board.', turkish:'Öğretmenimiz tahtaya kelimeler yazar.', difficulty:2, category:'classroom', orderedWords:['Our','teacher','writes','words','on','the','board.']},
    {id:'sb-l20-03', english:'Our group finishes the classroom project.', turkish:'Grubumuz sınıf projesini bitirir.', difficulty:2, category:'classroom', orderedWords:['Our','group','finishes','the','classroom','project.']}
  ],
  21: [
    {id:'sb-l21-01', english:'I wear boots because the ground is wet.', turkish:'Yer ıslak olduğu için bot giyerim.', difficulty:3, category:'weather', orderedWords:['I','wear','boots','because','the','ground','is','wet.']},
    {id:'sb-l21-02', english:'We open the curtains when morning begins.', turkish:'Sabah başladığında perdeleri açarız.', difficulty:3, category:'daily', orderedWords:['We','open','the','curtains','when','morning','begins.']},
    {id:'sb-l21-03', english:'She brings water because the day is hot.', turkish:'Gün sıcak olduğu için su getirir.', difficulty:3, category:'weather', orderedWords:['She','brings','water','because','the','day','is','hot.']}
  ],
  22: [
    {id:'sb-l22-01', english:'Children collect smooth stones near the river.', turkish:'Çocuklar nehrin yakınında pürüzsüz taşlar toplar.', difficulty:3, category:'nature', orderedWords:['Children','collect','smooth','stones','near','the','river.']},
    {id:'sb-l22-02', english:'Our neighbor grows vegetables behind the house.', turkish:'Komşumuz evin arkasında sebze yetiştirir.', difficulty:3, category:'home', orderedWords:['Our','neighbor','grows','vegetables','behind','the','house.']},
    {id:'sb-l22-03', english:'We follow a path through the forest.', turkish:'Ormanın içinden geçen bir yolu takip ederiz.', difficulty:3, category:'nature', orderedWords:['We','follow','a','path','through','the','forest.']}
  ],
  23: [
    {id:'sb-l23-01', english:'I finish my homework before I play outside.', turkish:'Dışarıda oynamadan önce ödevimi bitiririm.', difficulty:3, category:'daily', orderedWords:['I','finish','my','homework','before','I','play','outside.']},
    {id:'sb-l23-02', english:'A bakery smells wonderful early in the morning.', turkish:'Bir fırın sabahın erken saatlerinde harika kokar.', difficulty:3, category:'places', orderedWords:['A','bakery','smells','wonderful','early','in','the','morning.']},
    {id:'sb-l23-03', english:'We visit the library after our music lesson.', turkish:'Müzik dersimizden sonra kütüphaneyi ziyaret ederiz.', difficulty:3, category:'school', orderedWords:['We','visit','the','library','after','our','music','lesson.']}
  ],
  24: [
    {id:'sb-l24-01', english:'The puppy waits quietly beside its empty bowl.', turkish:'Yavru köpek boş kabının yanında sessizce bekler.', difficulty:3, category:'animals', orderedWords:['The','puppy','waits','quietly','beside','its','empty','bowl.']},
    {id:'sb-l24-02', english:'A bright rainbow appears after the summer rain.', turkish:'Yaz yağmurundan sonra parlak bir gökkuşağı belirir.', difficulty:3, category:'weather', orderedWords:['A','bright','rainbow','appears','after','the','summer','rain.']},
    {id:'sb-l24-03', english:'Our team practices indoors when the weather changes.', turkish:'Hava değiştiğinde takımımız içeride antrenman yapar.', difficulty:3, category:'activities', orderedWords:['Our','team','practices','indoors','when','the','weather','changes.']}
  ],
  25: [
    {id:'sb-l25-01', english:'She chooses a warm jacket for the trip.', turkish:'Gezi için sıcak tutan bir ceket seçer.', difficulty:3, category:'daily', orderedWords:['She','chooses','a','warm','jacket','for','the','trip.']},
    {id:'sb-l25-02', english:'We carry reusable bottles during our nature walk.', turkish:'Doğa yürüyüşümüzde yeniden kullanılabilir şişeler taşırız.', difficulty:3, category:'nature', orderedWords:['We','carry','reusable','bottles','during','our','nature','walk.']},
    {id:'sb-l25-03', english:'Children speak softly inside the reading room.', turkish:'Çocuklar okuma odasında alçak sesle konuşur.', difficulty:3, category:'school', orderedWords:['Children','speak','softly','inside','the','reading','room.']}
  ],
  26: [
    {id:'sb-l26-01', english:'Our science club observes insects in the garden.', turkish:'Bilim kulübümüz bahçedeki böcekleri gözlemler.', difficulty:3, category:'science', orderedWords:['Our','science','club','observes','insects','in','the','garden.']},
    {id:'sb-l26-02', english:'We measure each plant with a wooden ruler.', turkish:'Her bitkiyi ahşap bir cetvelle ölçeriz.', difficulty:3, category:'science', orderedWords:['We','measure','each','plant','with','a','wooden','ruler.']},
    {id:'sb-l26-03', english:'Our class records the weather on a chart.', turkish:'Sınıfımız hava durumunu bir çizelgeye kaydeder.', difficulty:3, category:'science', orderedWords:['Our','class','records','the','weather','on','a','chart.']}
  ],
  27: [
    {id:'sb-l27-01', english:'An artist mixes colors before painting the sky.', turkish:'Bir sanatçı gökyüzünü boyamadan önce renkleri karıştırır.', difficulty:3, category:'activities', orderedWords:['An','artist','mixes','colors','before','painting','the','sky.']},
    {id:'sb-l27-02', english:'We arrange the chairs around the round table.', turkish:'Sandalyeleri yuvarlak masanın etrafına dizeriz.', difficulty:3, category:'classroom', orderedWords:['We','arrange','the','chairs','around','the','round','table.']},
    {id:'sb-l27-03', english:'A curious fox watches butterflies behind a bush.', turkish:'Meraklı bir tilki çalının arkasından kelebekleri izler.', difficulty:3, category:'nature', orderedWords:['A','curious','fox','watches','butterflies','behind','a','bush.']}
  ],
  28: [
    {id:'sb-l28-01', english:'The young explorers carry maps inside their backpacks.', turkish:'Genç kâşifler haritaları sırt çantalarında taşır.', difficulty:3, category:'activities', orderedWords:['The','young','explorers','carry','maps','inside','their','backpacks.']},
    {id:'sb-l28-02', english:'We save clean paper for another classroom project.', turkish:'Başka bir sınıf projesi için temiz kâğıt saklarız.', difficulty:3, category:'classroom', orderedWords:['We','save','clean','paper','for','another','classroom','project.']},
    {id:'sb-l28-03', english:'Our garden attracts colorful birds during early spring.', turkish:'Bahçemiz ilkbaharın başlarında renkli kuşları çeker.', difficulty:3, category:'nature', orderedWords:['Our','garden','attracts','colorful','birds','during','early','spring.']}
  ],
  29: [
    {id:'sb-l29-01', english:'The museum guide explains how old tools worked.', turkish:'Müze rehberi eski aletlerin nasıl çalıştığını açıklar.', difficulty:3, category:'places', orderedWords:['The','museum','guide','explains','how','old','tools','worked.']},
    {id:'sb-l29-02', english:'We compare different leaves by shape and color.', turkish:'Farklı yaprakları şekil ve renklerine göre karşılaştırırız.', difficulty:3, category:'science', orderedWords:['We','compare','different','leaves','by','shape','and','color.']},
    {id:'sb-l29-03', english:'Our school orchestra practices before the evening concert.', turkish:'Okul orkestramız akşam konserinden önce prova yapar.', difficulty:3, category:'activities', orderedWords:['Our','school','orchestra','practices','before','the','evening','concert.']}
  ],
  30: [
    {id:'sb-l30-01', english:'Students design a simple bridge from wooden sticks.', turkish:'Öğrenciler tahta çubuklardan basit bir köprü tasarlar.', difficulty:3, category:'science', orderedWords:['Students','design','a','simple','bridge','from','wooden','sticks.']},
    {id:'sb-l30-02', english:'We prepare healthy snacks for the community picnic.', turkish:'Mahalle pikniği için sağlıklı atıştırmalıklar hazırlarız.', difficulty:3, category:'food', orderedWords:['We','prepare','healthy','snacks','for','the','community','picnic.']},
    {id:'sb-l30-03', english:'The nature journal describes changes during each season.', turkish:'Doğa günlüğü her mevsimdeki değişiklikleri anlatır.', difficulty:3, category:'nature', orderedWords:['The','nature','journal','describes','changes','during','each','season.']}
  ]
};
