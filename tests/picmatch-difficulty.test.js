'use strict';

var assert=require('assert');
var fs=require('fs');
var html=fs.readFileSync(require('path').join(__dirname,'../game/index.html'),'utf8');
var helperSource=html.match(/function normalizePicmatchWord[\s\S]*?function getPicmatchSeenIds/);
assert.ok(helperSource,'picmatch difficulty helpers found');
var mappingSource=helperSource[0].replace(/function getPicmatchSeenIds[\s\S]*$/,'');
var lookup={easy:{difficulty:1},medium:{difficulty:2},hard:{difficulty:3},broken:{difficulty:9}};
var factory=new Function('window',mappingSource+'; return getPicmatchWordDifficulty;');
var mapDifficulty=factory({VOCAB_BY_EN:lookup});
assert.strictEqual(mapDifficulty('EASY'),1.5);
assert.strictEqual(mapDifficulty('medium'),2.75);
assert.strictEqual(mapDifficulty('hard'),4.0);
assert.strictEqual(mapDifficulty('missing'),2.5);
assert.strictEqual(mapDifficulty('broken'),2.5);

assert.ok(/onResult:function\(ok\)[\s\S]*?recordAnswer\(adaptiveAnswer\)/.test(html),'accepted answer telemetry seam');
assert.ok(/questionId:'picmatch:'\+normalized/.test(html));
assert.ok(/family:'recognition'/.test(html));
assert.ok(/mode:'picmatch'/.test(html));
assert.ok(/format:'image_to_word'/.test(html));
assert.ok(/!s\.adaptiveRatingApplied/.test(html),'one-time completion guard');
assert.ok(/calculateRatingUpdate\([\s\S]*?answers:s\.adaptiveAnswers/.test(html),'session-local rating window');
assert.ok(/applyRatingUpdate\(\{family:'recognition'/.test(html));
assert.ok(/recordWord: item\[0\]/.test(html),'mastery remains active');
assert.ok(/completeGameSession\('picmatch'/.test(html),'completion remains active');
assert.ok(/var others=pick\(EMOJI_WORDS\.filter/.test(html),'distractor algorithm remains');
assert.ok(/return fallback\(\);/.test(html),'adaptive fallback present');
assert.strictEqual((html.match(/pickUnseen\('picmatch'/g)||[]).length,1,'single fallback history selection');
assert.ok(/if\(pmState!==s \|\| window\._activeSession!==picmatchSession/.test(html),'stale callback guard remains');
assert.ok(/document\.getElementById\('picmatch'\)\.classList\.contains\('hidden'\)/.test(html),'Home callback guard');
assert.ok(/isLocked:function\(\)\{ return s\.locked; \}/.test(html),'duplicate acceptance guard remains');
assert.ok(/rounds\.forEach[\s\S]*?markSeen\('picmatch'/.test(html),'successful adaptive selection marks history');

console.log('picmatch-difficulty.test.js: PASS');
