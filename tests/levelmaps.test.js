'use strict';

var assert = require('assert');
var data = {};
global.window = global;
global.STORAGE_KEYS = { levelmaps: 'vocatower_levelmaps' };
global.safeGet = function(key, fallback){
  if(!Object.prototype.hasOwnProperty.call(data, key)) return fallback;
  try{ return JSON.parse(data[key]); }catch(e){ return fallback; }
};
global.safeSet = function(key, value){ data[key] = JSON.stringify(value); return true; };

require('../assets/js/levelmaps.js');

function seed(mode, mm){ data = {}; data[global.STORAGE_KEYS.levelmaps] = JSON.stringify(mode ? {} : {}); var all = {}; all[mode] = mm; data[global.STORAGE_KEYS.levelmaps] = JSON.stringify(all); }

// 1. Fresh Level 1 pass -> completes L1, unlocks L2, stores stars on L1
seed('quiz', {level:1, completed:[]});
window.setLevelMapPlayedLevel('quiz', 1);
var r1 = window.completeLevelIfPassed('quiz', 10, 10, window.takeLevelMapPlayedLevel('quiz'));
var mm1 = window.getModeMap('quiz');
assert.strictEqual(r1.passed, true, 'L1 100% passes');
assert.strictEqual(r1.leveledUp, true, 'L1 pass unlocks next');
assert.strictEqual(mm1.level, 2, 'current level advances to 2');
assert.deepStrictEqual(mm1.completed, [1], 'L1 marked completed');
assert.strictEqual(mm1.stars[1], 3, 'stars stored on L1');
assert.strictEqual(mm1.stars[2], undefined, 'no stars leaked onto L2');

// 2. Replay L1 while current level is L2 -> stars update on L1, current remains L2
window.setLevelMapPlayedLevel('quiz', 1);
var r2 = window.completeLevelIfPassed('quiz', 6, 10, window.takeLevelMapPlayedLevel('quiz')); // 60% -> 1 star, lower than existing 3
var mm2 = window.getModeMap('quiz');
assert.strictEqual(r2.passed, true, 'replay 60% passes');
assert.strictEqual(r2.leveledUp, false, 'replay never unlocks next');
assert.strictEqual(mm2.level, 2, 'current level stays at 2 after replay');
assert.strictEqual(mm2.stars[1], 3, 'lower replay score does not downgrade best stars');
assert.strictEqual(mm2.stars[2], undefined, 'L2 still has no stars (not played yet)');

// 3. Pass current L2 -> completes L2, unlocks L3, stars store on L2
window.setLevelMapPlayedLevel('quiz', 2);
var r3 = window.completeLevelIfPassed('quiz', 8, 10, window.takeLevelMapPlayedLevel('quiz')); // 80% -> 2 stars
var mm3 = window.getModeMap('quiz');
assert.strictEqual(r3.leveledUp, true, 'passing current frontier level unlocks next');
assert.strictEqual(mm3.level, 3, 'current level advances to 3');
assert.strictEqual(mm3.stars[2], 2, 'stars stored on L2');
assert.strictEqual(mm3.stars[1], 3, 'L1 stars untouched');

// 4. Failed replay -> no progression and no star loss
window.setLevelMapPlayedLevel('quiz', 1);
var r4 = window.completeLevelIfPassed('quiz', 1, 10, window.takeLevelMapPlayedLevel('quiz')); // 10% fail
var mm4 = window.getModeMap('quiz');
assert.strictEqual(r4.passed, false, 'failed replay reports not passed');
assert.strictEqual(mm4.level, 3, 'current level unchanged after failed replay');
assert.strictEqual(mm4.stars[1], 3, 'existing stars preserved after failed replay');

// 5. Old saves without stars still load
seed('legacy', {level:4, completed:[1,2,3]});
var mmLegacy = window.getModeMap('legacy');
assert.deepStrictEqual(mmLegacy.stars, {}, 'legacy save normalizes missing stars to {}');
assert.strictEqual(mmLegacy.level, 4, 'legacy level preserved');
assert.deepStrictEqual(mmLegacy.completed, [1,2,3], 'legacy completed preserved');

// Fallback: no explicit playedLevel provided still behaves like before (uses mm.level)
seed('nomap', {level:1, completed:[]});
var r5 = window.completeLevelIfPassed('nomap', 10, 10); // no playedLevel arg
assert.strictEqual(window.getModeMap('nomap').stars[1], 3, 'missing playedLevel falls back to current mm.level');

console.log('levelmaps.test.js: PASS');
