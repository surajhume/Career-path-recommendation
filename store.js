/**
 * store.js - persistence for the user's profile, saved careers and roadmap progress.
 *
 * Everything lives in the browser (localStorage); nothing is sent anywhere.
 * If storage is blocked or full (private mode, quota), the store silently keeps
 * data in memory for the session and reports `persistent === false`.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CareerStore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const PREFIX = "career-path-explorer:v1:";

  function isStringArray(v) {
    return Array.isArray(v) && v.every((x) => typeof x === "string");
  }

  /**
   * @param {Storage|null|undefined} storage anything with getItem/setItem/removeItem
   */
  function createStore(storage) {
    const memory = new Map();
    let persistent = Boolean(storage);

    function read(key, fallback, validate) {
      const full = PREFIX + key;
      let text = null;
      if (persistent) {
        try {
          text = storage.getItem(full);
        } catch (e) {
          persistent = false;
        }
      }
      if (text === null && memory.has(full)) text = memory.get(full);
      if (text === null || text === undefined) return fallback;
      try {
        const value = JSON.parse(text);
        return validate(value) ? value : fallback;
      } catch (e) {
        return fallback; // corrupted JSON
      }
    }

    function write(key, value) {
      const full = PREFIX + key;
      const text = JSON.stringify(value);
      memory.set(full, text);
      if (persistent) {
        try {
          storage.setItem(full, text);
        } catch (e) {
          persistent = false;
        }
      }
    }

    function remove(key) {
      const full = PREFIX + key;
      memory.delete(full);
      if (persistent) {
        try {
          storage.removeItem(full);
        } catch (e) {
          persistent = false;
        }
      }
    }

    /* ---- profile ---- */
    const isProfile = (v) =>
      v && typeof v === "object" && typeof v.qualification === "string" &&
      isStringArray(v.interests) && isStringArray(v.skills) && typeof v.goal === "string";

    function getProfile() {
      return read("profile", null, isProfile);
    }
    function setProfile(profile) {
      if (isProfile(profile)) write("profile", profile);
    }

    function clearProfile() {
      remove("profile");
    }

    /* ---- saved careers ---- */
    function getSaved() {
      return read("saved", [], isStringArray);
    }
    function isSaved(career) {
      return getSaved().includes(career);
    }
    /** @returns {boolean} true if the career is saved after the toggle */
    function toggleSaved(career) {
      const saved = getSaved();
      const i = saved.indexOf(career);
      if (i >= 0) saved.splice(i, 1);
      else saved.push(career);
      write("saved", saved);
      return i < 0;
    }

    /* ---- roadmap progress ---- */
    function progressKey(career) {
      return "progress:" + career;
    }
    function getCompleted(career) {
      return read(progressKey(career), [], isStringArray);
    }
    function setTaskDone(career, taskId, done) {
      const set = new Set(getCompleted(career));
      if (done) set.add(taskId);
      else set.delete(taskId);
      if (set.size) write(progressKey(career), [...set]);
      else remove(progressKey(career));
    }
    function resetProgress(career) {
      remove(progressKey(career));
    }

    function clearAll() {
      // Progress can exist for careers that are not saved, so sweep by prefix.
      if (persistent) {
        try {
          const doomed = [];
          for (let i = 0; i < storage.length; i++) {
            const k = storage.key(i);
            if (k && k.startsWith(PREFIX)) doomed.push(k);
          }
          doomed.forEach((k) => storage.removeItem(k));
        } catch (e) {
          persistent = false;
        }
      }
      for (const k of [...memory.keys()]) if (k.startsWith(PREFIX)) memory.delete(k);
    }

    return {
      get persistent() {
        return persistent;
      },
      getProfile,
      setProfile,
      clearProfile,
      getSaved,
      isSaved,
      toggleSaved,
      getCompleted,
      setTaskDone,
      resetProgress,
      clearAll,
    };
  }

  return { createStore, PREFIX };
});
