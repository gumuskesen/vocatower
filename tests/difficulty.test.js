'use strict';

var assert = require('assert');
var data = {};
global.safeGet = function(key, fallback){
  if(!Object.prototype.hasOwnProperty.call(data, key)) return fallback;
  try{ return JSON.parse(data[key]); }catch(e){ return fallback; }
};
global.safeSet = function(key, value){ data[key] = JSON.stringify(value); return true; };

var engine = require('../assets/js/difficulty.js');

function seed(value){ data = {vocatower_difficulty:JSON.stringify(value)}; engine.load(); }
function fresh(){ data = {}; engine.reset(); }
function answers(correct, wrong){
  return Array(correct).fill(0).map(function(){ return {correct:true}; })
    .concat(Array(wrong).fill(0).map(function(){ return {correct:false}; }));
}
function rng(seedValue){
  var state = seedValue >>> 0;
  return function(){ state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

fresh();
seed({version:1,onboarding:{startingLevel:'advanced',selectedAt:null},preference:'automatic',ratings:{global:{value:3,confidence:0,updatedAt:null},families:{recognition:{value:4,confidence:0,updatedAt:null}}},recentAnswers:{}});
assert.strictEqual(engine.getTargetDifficulty({family:'recognition'}), 4, 'family rating');
assert.strictEqual(engine.getTargetDifficulty({family:'unknown'}), 3, 'global fallback');
assert.strictEqual(engine.getTargetDifficulty({family:'recognition',preference:'relaxed'}), 3.75, 'preference offset');
seed({version:1,preference:'challenge',ratings:{global:{value:5,confidence:0,updatedAt:null},families:{}},recentAnswers:{}});
assert.strictEqual(engine.getTargetDifficulty({family:'unknown'}), 5, 'upper clamp');
seed({version:1,preference:'relaxed',ratings:{global:{value:1,confidence:0,updatedAt:null},families:{}},recentAnswers:{}});
assert.strictEqual(engine.getTargetDifficulty({family:'unknown'}), 1, 'lower clamp');
assert.strictEqual(engine.getQuestionDifficulty({baseDifficulty:2,modeModifier:.5,formatModifier:.25,extraModifiers:[.1,-.1,'x']}), 2.75);
assert.strictEqual(engine.getQuestionDifficulty({baseDifficulty:'x'}), null);

fresh();
assert.strictEqual(engine.recordAnswer({family:'recognition',correct:'yes'}), false, 'malformed rejected');
assert.strictEqual(engine.recordAnswer({family:'recognition',correct:true,difficulty:9,responseMs:-1,hintsUsed:-2,attempts:0,questionId:'q1'}), true);
var sanitized = engine.getRecentAnswers('recognition')[0];
assert.strictEqual(sanitized.difficulty, 5); assert.strictEqual(sanitized.responseMs, null);
assert.strictEqual(sanitized.hintsUsed, 0); assert.strictEqual(sanitized.attempts, 1);
for(var i=0;i<25;i++) engine.recordAnswer({family:'recognition',correct:i%2===0,questionId:'q'+i});
engine.recordAnswer({family:'listening',correct:true});
assert.strictEqual(engine.getRecentAnswers('recognition').length, 20, 'rolling cap');
assert.strictEqual(engine.getRecentAnswers('listening').length, 1, 'family independence');
var defensive = engine.getRecentAnswers('recognition'); defensive[0].correct = 'changed';
assert.strictEqual(typeof engine.getRecentAnswers('recognition')[0].correct, 'boolean', 'defensive copy');
engine.clearRecentAnswers('listening'); assert.strictEqual(engine.getRecentAnswers('listening').length, 0);

var one = engine.calculateRatingUpdate({currentRating:3,answers:answers(1,0)});
assert.strictEqual(one.delta, 0, 'one answer stable');
var strong = engine.calculateRatingUpdate({currentRating:3,answers:answers(7,1)});
assert.strictEqual(strong.delta, .25); assert.strictEqual(strong.reason, 'strong_performance');
var struggle = engine.calculateRatingUpdate({currentRating:3,answers:answers(4,4)});
assert.strictEqual(struggle.delta, -.25); assert.strictEqual(struggle.reason, 'struggling');
var mixed = engine.calculateRatingUpdate({currentRating:3,answers:answers(6,2)});
assert.strictEqual(mixed.delta, 0); assert.strictEqual(mixed.reason, 'stable');
assert.strictEqual(engine.calculateRatingUpdate({currentRating:5,answers:answers(8,0)}).nextRating, 5);
assert.strictEqual(engine.calculateRatingUpdate({currentRating:1,answers:answers(3,5)}).nextRating, 1);

var pool = [];
for(i=0;i<4;i++) pool.push({id:'e'+i,difficulty:1});
for(i=0;i<8;i++) pool.push({id:'n'+i,difficulty:3});
for(i=0;i<4;i++) pool.push({id:'h'+i,difficulty:5});
var snapshot = JSON.stringify(pool);
var selection = engine.selectAdaptiveQuestions({pool:pool,count:8,targetDifficulty:3,idFn:function(x){return x.id;},difficultyFn:function(x){return x.difficulty;},rng:rng(7)});
assert.strictEqual(JSON.stringify(pool), snapshot, 'pool immutable');
assert.strictEqual(new Set(selection.items.map(function(x){return x.id;})).size, 8, 'unique selection');
assert.deepStrictEqual([selection.metadata.easierCount,selection.metadata.nearCount,selection.metadata.harderCount],[2,5,1]);
assert.strictEqual(selection.items[0].difficulty, 1, 'first easier');
assert.strictEqual(engine.selectAdaptiveQuestions({pool:pool,count:1,targetDifficulty:3,idFn:function(x){return x.id;},rng:rng(4)}).items[0].difficulty,1,'single first question easier');
for(i=1;i<selection.items.length;i++) assert.ok(!(selection.items[i-1].difficulty===5 && selection.items[i].difficulty===5), 'no consecutive hard');

var unbalanced = Array(6).fill(0).map(function(_,index){return {id:index,difficulty:1};});
assert.strictEqual(engine.selectAdaptiveQuestions({pool:unbalanced,count:5,targetDifficulty:3,idFn:function(x){return x.id;},rng:rng(1)}).items.length,5);
var unseen = engine.selectAdaptiveQuestions({pool:pool,count:3,targetDifficulty:3,idFn:function(x){return x.id;},seenIds:['e0','n0'],rng:rng(2)});
assert.strictEqual(unseen.metadata.reusedSeenCount,0,'avoid seen');
var reuse = engine.selectAdaptiveQuestions({pool:pool.slice(0,4),count:4,targetDifficulty:3,idFn:function(x){return x.id;},seenIds:['e0','e1','e2'],rng:rng(2)});
assert.strictEqual(reuse.metadata.reusedSeenCount,3,'reuse only as needed');
var firstRun = engine.selectAdaptiveQuestions({pool:pool,count:8,targetDifficulty:3,idFn:function(x){return x.id;},rng:rng(99)}).items.map(function(x){return x.id;});
var secondRun = engine.selectAdaptiveQuestions({pool:pool,count:8,targetDifficulty:3,idFn:function(x){return x.id;},rng:rng(99)}).items.map(function(x){return x.id;});
assert.deepStrictEqual(firstRun,secondRun,'seed repeatable');
var missingDifficulty = engine.selectAdaptiveQuestions({pool:[{id:'a'},{id:'b'}],count:2,targetDifficulty:3,idFn:function(x){return x.id;},rng:rng(3)});
assert.strictEqual(missingDifficulty.metadata.nearCount,2,'missing difficulty near');

seed({version:1,onboarding:{startingLevel:'basic'},preference:'balanced',ratings:{global:{value:4.2,confidence:.5,updatedAt:null},families:{}},recentAnswers:{recognition:[{family:'recognition',correct:true},{bad:true}],broken:'x'},unknown:{keep:true}});
var repaired = engine.getProfile();
assert.strictEqual(repaired.ratings.global.value,4.2); assert.strictEqual(repaired.recentAnswers.recognition.length,1);
assert.strictEqual(repaired.unknown.keep,true); assert.ok(!Object.prototype.hasOwnProperty.call(repaired.recentAnswers,'broken'));
assert.strictEqual(engine.setStartingLevel('advanced'),true); assert.strictEqual(engine.getStartingLevel(),'advanced');
assert.strictEqual(engine.setPreference('challenge'),true); assert.strictEqual(engine.getPreference(),'challenge');
var reloaded = JSON.parse(data.vocatower_difficulty); engine.load();
assert.strictEqual(engine.getStartingLevel(),reloaded.onboarding.startingLevel,'persistence');

fresh();
var globalBefore=engine.getProfile().ratings.global.value;
var listeningBefore=engine.getProfile().ratings.families.listening.value;
var applyResult=engine.calculateRatingUpdate({currentRating:2.5,answers:answers(7,1)});
var applied=engine.applyRatingUpdate({family:'recognition',result:applyResult});
assert.strictEqual(applied.value,2.75,'rating update applied');
assert.strictEqual(applied.confidence,.1,'confidence increased');
assert.strictEqual(engine.getProfile().ratings.global.value,globalBefore,'global unchanged');
assert.strictEqual(engine.getProfile().ratings.families.listening.value,listeningBefore,'other family unchanged');
assert.strictEqual(engine.applyRatingUpdate({family:'recognition',result:applyResult}),null,'stale result rejected');
assert.strictEqual(engine.applyRatingUpdate({family:'recognition',result:{previousRating:2.75,nextRating:3.5,delta:.75,validAnswerCount:8}}),null,'large delta rejected');
fresh();
var strugglingApply=engine.calculateRatingUpdate({currentRating:2.5,answers:answers(5,3)});
assert.strictEqual(engine.applyRatingUpdate({family:'recognition',result:strugglingApply}).value,2.25,'struggling rating applied');
fresh();
var stableApply=engine.calculateRatingUpdate({currentRating:2.5,answers:answers(6,2)});
assert.strictEqual(engine.applyRatingUpdate({family:'recognition',result:stableApply}).value,2.5,'stable rating applied');

console.log('difficulty.test.js: PASS');
