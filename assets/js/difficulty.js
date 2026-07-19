/* VocaTower — shared adaptive-difficulty infrastructure. */
(function(window){
  'use strict';

  var STORAGE_KEY = 'vocatower_difficulty';
  var STARTING_LEVELS = ['beginner', 'basic', 'intermediate', 'advanced', 'not_sure'];
  var PREFERENCES = ['automatic', 'relaxed', 'balanced', 'challenge'];
  var PREFERENCE_OFFSETS = {automatic:0, relaxed:-0.25, balanced:0, challenge:0.25};
  var FAMILIES = ['recognition', 'listening', 'spelling', 'context', 'construction', 'knowledge', 'visualMemory'];
  var MAX_RECENT_ANSWERS = 20;
  var profile = null;

  function isObject(value){
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isFiniteNumber(value){
    return typeof value === 'number' && isFinite(value);
  }

  function clamp(value, min, max){
    return Math.min(max, Math.max(min, value));
  }

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function defaultRating(){
    return {value:2.5, confidence:0, updatedAt:null};
  }

  function defaults(){
    var families = {};
    FAMILIES.forEach(function(family){ families[family] = defaultRating(); });
    return {
      version: 1,
      onboarding: {startingLevel:'not_sure', selectedAt:null},
      preference: 'automatic',
      ratings: {global:defaultRating(), families:families},
      recentAnswers: {}
    };
  }

  function validNumber(value, min, max){
    return isFiniteNumber(value) && value >= min && value <= max;
  }

  function optionalString(value){
    return typeof value === 'string' ? value : null;
  }

  function sanitizeAnswer(answer){
    if(!isObject(answer) || typeof answer.family !== 'string' || !answer.family.trim() || typeof answer.correct !== 'boolean'){
      return null;
    }
    var responseMs = isFiniteNumber(answer.responseMs) && answer.responseMs >= 0 ? answer.responseMs : null;
    var hintsUsed = Number.isInteger(answer.hintsUsed) && answer.hintsUsed >= 0 ? answer.hintsUsed : 0;
    var attempts = Number.isInteger(answer.attempts) && answer.attempts >= 1 ? answer.attempts : 1;
    return {
      questionId: optionalString(answer.questionId),
      wordId: optionalString(answer.wordId),
      family: answer.family.trim(),
      mode: optionalString(answer.mode),
      format: optionalString(answer.format),
      difficulty: isFiniteNumber(answer.difficulty) ? clamp(answer.difficulty, 1, 5) : null,
      correct: answer.correct,
      responseMs: responseMs,
      hintsUsed: hintsUsed,
      attempts: attempts,
      answeredAt: typeof answer.answeredAt === 'string' && answer.answeredAt ? answer.answeredAt : new Date().toISOString()
    };
  }

  function validateRating(candidate, fallback){
    var rating = isObject(candidate) ? clone(candidate) : {};
    if(!validNumber(rating.value, 1, 5)) rating.value = fallback.value;
    if(!validNumber(rating.confidence, 0, 1)) rating.confidence = fallback.confidence;
    if(rating.updatedAt !== null && typeof rating.updatedAt !== 'string') rating.updatedAt = fallback.updatedAt;
    return rating;
  }

  function validate(candidate){
    var base = defaults();
    var result = isObject(candidate) ? clone(candidate) : {};

    if(!Number.isInteger(result.version) || result.version < 1) result.version = base.version;
    if(!isObject(result.onboarding)) result.onboarding = {};
    if(STARTING_LEVELS.indexOf(result.onboarding.startingLevel) < 0){
      result.onboarding.startingLevel = base.onboarding.startingLevel;
    }
    if(result.onboarding.selectedAt !== null && typeof result.onboarding.selectedAt !== 'string'){
      result.onboarding.selectedAt = base.onboarding.selectedAt;
    }
    if(!Object.prototype.hasOwnProperty.call(result.onboarding, 'selectedAt')){
      result.onboarding.selectedAt = base.onboarding.selectedAt;
    }
    if(PREFERENCES.indexOf(result.preference) < 0) result.preference = base.preference;

    if(!isObject(result.ratings)) result.ratings = {};
    result.ratings.global = validateRating(result.ratings.global, base.ratings.global);
    if(!isObject(result.ratings.families)) result.ratings.families = {};
    FAMILIES.forEach(function(family){
      result.ratings.families[family] = validateRating(result.ratings.families[family], base.ratings.families[family]);
    });

    var repairedAnswers = {};
    if(isObject(result.recentAnswers)){
      Object.keys(result.recentAnswers).forEach(function(family){
        if(!Array.isArray(result.recentAnswers[family])) return;
        var valid = result.recentAnswers[family].map(sanitizeAnswer).filter(function(answer){
          return answer && answer.family === family;
        });
        repairedAnswers[family] = valid.slice(-MAX_RECENT_ANSWERS);
      });
    }
    result.recentAnswers = repairedAnswers;
    return result;
  }

  function load(){
    var stored = window.safeGet ? window.safeGet(STORAGE_KEY, null) : null;
    profile = validate(stored);
    save();
    return getProfile();
  }

  function save(){
    if(!profile) profile = defaults();
    profile = validate(profile);
    if(window.safeSet) return window.safeSet(STORAGE_KEY, profile);
    return false;
  }

  function getProfile(){
    if(!profile) load();
    return clone(profile);
  }

  function reset(){
    profile = defaults();
    save();
    return getProfile();
  }

  function setStartingLevel(level){
    if(STARTING_LEVELS.indexOf(level) < 0) return false;
    if(!profile) load();
    profile.onboarding.startingLevel = level;
    profile.onboarding.selectedAt = new Date().toISOString();
    return save();
  }

  function getStartingLevel(){
    if(!profile) load();
    return profile.onboarding.startingLevel;
  }

  function setPreference(pref){
    if(PREFERENCES.indexOf(pref) < 0) return false;
    if(!profile) load();
    profile.preference = pref;
    return save();
  }

  function getPreference(){
    if(!profile) load();
    return profile.preference;
  }

  function getTargetDifficulty(options){
    options = isObject(options) ? options : {};
    if(!profile) load();
    var familyRating = profile.ratings && profile.ratings.families && profile.ratings.families[options.family];
    var globalRating = profile.ratings && profile.ratings.global;
    var value = familyRating && validNumber(familyRating.value, 1, 5)
      ? familyRating.value
      : globalRating && validNumber(globalRating.value, 1, 5) ? globalRating.value : 2.5;
    var pref = PREFERENCES.indexOf(options.preference) >= 0 ? options.preference : profile.preference;
    return clamp(value + (PREFERENCE_OFFSETS[pref] || 0), 1, 5);
  }

  function getQuestionDifficulty(options){
    options = isObject(options) ? options : {};
    if(!isFiniteNumber(options.baseDifficulty)) return null;
    var total = options.baseDifficulty;
    total += isFiniteNumber(options.modeModifier) ? options.modeModifier : 0;
    total += isFiniteNumber(options.formatModifier) ? options.formatModifier : 0;
    if(Array.isArray(options.extraModifiers)){
      options.extraModifiers.forEach(function(value){ if(isFiniteNumber(value)) total += value; });
    }
    return clamp(total, 1, 5);
  }

  function recordAnswer(answer){
    var clean = sanitizeAnswer(answer);
    if(!clean) return false;
    if(!profile) load();
    var familyAnswers = Array.isArray(profile.recentAnswers[clean.family]) ? profile.recentAnswers[clean.family].slice() : [];
    familyAnswers.push(clean);
    profile.recentAnswers[clean.family] = familyAnswers.slice(-MAX_RECENT_ANSWERS);
    return save();
  }

  function getRecentAnswers(family){
    if(typeof family !== 'string' || !family) return [];
    if(!profile) load();
    return clone(Array.isArray(profile.recentAnswers[family]) ? profile.recentAnswers[family] : []);
  }

  function clearRecentAnswers(family){
    if(typeof family !== 'string' || !family) return false;
    if(!profile) load();
    profile.recentAnswers[family] = [];
    return save();
  }

  function calculateRatingUpdate(options){
    options = isObject(options) ? options : {};
    var previous = validNumber(options.currentRating, 1, 5) ? options.currentRating : 2.5;
    var size = Number.isInteger(options.windowSize) && options.windowSize > 0 ? options.windowSize : 8;
    var answers = Array.isArray(options.answers) ? options.answers.filter(function(answer){
      return isObject(answer) && typeof answer.correct === 'boolean';
    }).slice(-size) : [];
    var count = answers.length;
    var correct = answers.filter(function(answer){ return answer.correct; }).length;
    var accuracy = count ? correct / count : 0;
    var delta = 0;
    var reason = 'stable';
    if(count >= 6){
      if((count === 8 && correct >= 7) || accuracy >= 0.875){
        delta = 0.25;
        reason = 'strong_performance';
      }else if(count - correct >= 3 && accuracy <= 0.625){
        delta = -0.25;
        reason = 'struggling';
      }
    }
    var next = clamp(previous + delta, 1, 5);
    return {
      previousRating: previous,
      nextRating: next,
      delta: next - previous,
      validAnswerCount: count,
      accuracy: accuracy,
      reason: reason
    };
  }

  function applyRatingUpdate(options){
    options = isObject(options) ? options : {};
    var family = options.family;
    var result = options.result;
    if(FAMILIES.indexOf(family) < 0 || !isObject(result)) return null;
    if(!validNumber(result.previousRating, 1, 5) || !validNumber(result.nextRating, 1, 5) ||
       !isFiniteNumber(result.delta) || Math.abs(result.delta) > 0.25 ||
       !Number.isInteger(result.validAnswerCount) || result.validAnswerCount < 0){
      return null;
    }
    if(!profile) load();
    var current = profile.ratings.families[family];
    var expectedNext = clamp(current.value + result.delta, 1, 5);
    if(Math.abs(current.value - result.previousRating) > 0.000001 ||
       Math.abs(expectedNext - result.nextRating) > 0.000001){
      return null;
    }
    var previous = clone(current);
    current.value = result.nextRating;
    current.updatedAt = new Date().toISOString();
    if(result.validAnswerCount >= 6) current.confidence = clamp(current.confidence + 0.1, 0, 1);
    if(!save()){
      profile.ratings.families[family] = previous;
      return null;
    }
    return clone(profile.ratings.families[family]);
  }

  function shuffledCopy(items, rng){
    var copy = items.slice();
    for(var i=copy.length-1;i>0;i--){
      var randomValue = rng();
      if(!isFiniteNumber(randomValue)) randomValue = 0;
      var j = Math.floor(clamp(randomValue, 0, 0.9999999999999999) * (i + 1));
      var temp = copy[i]; copy[i] = copy[j]; copy[j] = temp;
    }
    return copy;
  }

  function selectionQuotas(count){
    if(count === 1) return {easier:1, near:0, harder:0};
    var near = Math.round(count * 0.60);
    var easier = Math.round(count * 0.25);
    return {easier:easier, near:near, harder:Math.max(0, count - easier - near)};
  }

  function itemBand(difficulty, target){
    if(difficulty < target - 0.35) return 'easier';
    if(difficulty > target + 0.35) return 'harder';
    return 'near';
  }

  function selectAdaptiveQuestions(options){
    options = isObject(options) ? options : {};
    var pool = Array.isArray(options.pool) ? options.pool : [];
    var requested = Number.isInteger(options.count) && options.count >= 0 ? options.count : 1;
    var target = isFiniteNumber(options.targetDifficulty) ? clamp(options.targetDifficulty, 1, 5) : 2.5;
    var rng = typeof options.rng === 'function' ? options.rng : Math.random;
    var idFn = typeof options.idFn === 'function' ? options.idFn : null;
    var difficultyFn = typeof options.difficultyFn === 'function' ? options.difficultyFn : null;
    var firstEasier = options.firstQuestionEasier !== false;
    var seen = new Set(Array.isArray(options.seenIds) ? options.seenIds.slice() : []);
    var identities = new Set();
    var candidates = [];

    pool.forEach(function(item){
      var id;
      try{ id = idFn ? idFn(item) : item; }catch(e){ id = item; }
      if(id === undefined || id === null) id = item;
      if(identities.has(id)) return;
      identities.add(id);
      var rawDifficulty;
      try{ rawDifficulty = difficultyFn ? difficultyFn(item) : item && item.difficulty; }catch(e){ rawDifficulty = null; }
      var difficulty = isFiniteNumber(rawDifficulty) ? clamp(rawDifficulty, 1, 5) : target;
      candidates.push({item:item, id:id, difficulty:difficulty, band:itemBand(difficulty, target), seen:seen.has(id)});
    });

    var limit = Math.min(requested, candidates.length);
    var quotas = selectionQuotas(limit);
    var selected = [];
    var selectedIds = new Set();

    function available(seenValue, band){
      return candidates.filter(function(candidate){
        return candidate.seen === seenValue && !selectedIds.has(candidate.id) && (!band || candidate.band === band);
      });
    }
    function take(seenValue, band, count){
      shuffledCopy(available(seenValue, band), rng).slice(0, count).forEach(function(candidate){
        selected.push(candidate); selectedIds.add(candidate.id);
      });
    }
    function fillFrom(seenValue){
      var remaining = limit - selected.length;
      if(remaining > 0) take(seenValue, null, remaining);
    }

    ['easier','near','harder'].forEach(function(band){ take(false, band, quotas[band]); });
    fillFrom(false);
    if(selected.length < limit){
      ['easier','near','harder'].forEach(function(band){
        var needed = Math.max(0, quotas[band] - selected.filter(function(candidate){ return candidate.band === band; }).length);
        take(true, band, needed);
      });
      fillFrom(true);
    }

    var groups = {easier:[], near:[], harder:[]};
    selected.forEach(function(candidate){ groups[candidate.band].push(candidate); });
    groups.easier = shuffledCopy(groups.easier, rng);
    groups.near = shuffledCopy(groups.near, rng);
    groups.harder = shuffledCopy(groups.harder, rng);
    var ordered = [];
    if(firstEasier && groups.easier.length) ordered.push(groups.easier.shift());
    while(ordered.length < selected.length){
      var lastHard = ordered.length && ordered[ordered.length-1].band === 'harder';
      var choices = ['easier','near','harder'].filter(function(band){
        return groups[band].length && !(lastHard && band === 'harder' && (groups.easier.length || groups.near.length));
      });
      var choice = choices[Math.floor(clamp(rng(), 0, 0.9999999999999999) * choices.length)];
      ordered.push(groups[choice].shift());
    }

    var metadata = {
      requestedCount: requested,
      selectedCount: ordered.length,
      targetDifficulty: target,
      easierCount: ordered.filter(function(candidate){ return candidate.band === 'easier'; }).length,
      nearCount: ordered.filter(function(candidate){ return candidate.band === 'near'; }).length,
      harderCount: ordered.filter(function(candidate){ return candidate.band === 'harder'; }).length,
      reusedSeenCount: ordered.filter(function(candidate){ return candidate.seen; }).length
    };
    return {items:ordered.map(function(candidate){ return candidate.item; }), metadata:metadata};
  }

  /* TODO: Later phases may apply calculated rating updates and integrate mode adapters. */
  var DifficultyEngine = {
    load:load, save:save, getProfile:getProfile, reset:reset,
    setStartingLevel:setStartingLevel, getStartingLevel:getStartingLevel,
    setPreference:setPreference, getPreference:getPreference, validate:validate,
    getTargetDifficulty:getTargetDifficulty,
    getQuestionDifficulty:getQuestionDifficulty,
    recordAnswer:recordAnswer,
    getRecentAnswers:getRecentAnswers,
    clearRecentAnswers:clearRecentAnswers,
    calculateRatingUpdate:calculateRatingUpdate,
    applyRatingUpdate:applyRatingUpdate,
    selectAdaptiveQuestions:selectAdaptiveQuestions
  };

  window.DifficultyEngine = DifficultyEngine;
  if(typeof module !== 'undefined' && module.exports) module.exports = DifficultyEngine;
})(typeof window !== 'undefined' ? window : globalThis);
