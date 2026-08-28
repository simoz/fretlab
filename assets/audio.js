(function attachFretLabAudio(global) {
  "use strict";

  const AudioContextClass = () => global.AudioContext || global.webkitAudioContext;

  function midiToFrequency(midi) {
    if (!Number.isFinite(Number(midi))) {
      throw new TypeError("MIDI note must be a finite number.");
    }
    return 440 * Math.pow(2, (Number(midi) - 69) / 12);
  }

  function normalizeEvents(events) {
    if (!Array.isArray(events)) {
      throw new TypeError("Audio events must be an array.");
    }

    return events.map((event, index) => {
      if (!event || typeof event !== "object") {
        throw new TypeError(`Audio event ${index} must be an object.`);
      }
      const midi = Number(event.midi);
      const start = Number(event.start);
      const duration = Number(event.duration);
      if (!Number.isFinite(midi) || !Number.isFinite(start) || !Number.isFinite(duration)) {
        throw new TypeError(`Audio event ${index} contains a non-finite value.`);
      }
      if (duration <= 0) {
        throw new RangeError(`Audio event ${index} duration must be greater than zero.`);
      }
      const velocity = event.velocity == null ? 1 : Number(event.velocity);
      if (!Number.isFinite(velocity)) {
        throw new TypeError(`Audio event ${index} velocity must be finite.`);
      }
      return {
        ...event,
        midi,
        start,
        duration,
        velocity: Math.max(0, Math.min(1, velocity))
      };
    }).sort((a, b) => a.start - b.start);
  }

  function isSupported() {
    return typeof AudioContextClass() === "function";
  }

  function createPlayer() {
    let context = null;
    let playbackToken = 0;
    let completionTimer = null;
    const oscillators = new Set();
    const eventTimers = new Set();
    let playing = false;

    function clearTimer(timer) {
      global.clearTimeout(timer);
      eventTimers.delete(timer);
    }

    function stopOscillators() {
      oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch (_error) {
          // An oscillator may already have stopped.
        }
        try {
          oscillator.disconnect();
        } catch (_error) {
          // Disconnect is best effort during cleanup.
        }
      });
      oscillators.clear();
    }

    function clearCompletionTimer() {
      if (completionTimer !== null) {
        global.clearTimeout(completionTimer);
        completionTimer = null;
      }
    }

    function stop() {
      playbackToken += 1;
      playing = false;
      clearCompletionTimer();
      eventTimers.forEach(clearTimer);
      eventTimers.clear();
      stopOscillators();
    }

    function play(events, callbacks = {}) {
      const { onStart, onEvent, onEnd, onError } = callbacks || {};
      stop();
      const token = playbackToken;
      let normalized;
      try {
        normalized = normalizeEvents(events);
      } catch (error) {
        if (typeof onError === "function") onError(error);
        return false;
      }
      if (normalized.length === 0) {
        const error = new Error("Cannot play an empty audio event sequence.");
        if (typeof onError === "function") onError(error);
        return false;
      }

      const Context = AudioContextClass();
      if (typeof Context !== "function") {
        const error = new Error("Web Audio is not supported in this browser.");
        if (typeof onError === "function") onError(error);
        return false;
      }

      try {
        if (!context) context = new Context();
      } catch (error) {
        if (typeof onError === "function") onError(error);
        return false;
      }

      Promise.resolve()
        .then(() => (typeof context.resume === "function" ? context.resume() : undefined))
        .then(() => {
          if (token !== playbackToken) return;
          playing = true;
          if (typeof onStart === "function") onStart();
          const baseTime = Number(context.currentTime) || 0;
          normalized.forEach((event) => {
            const delay = Math.max(0, event.start * 1000);
            const timer = global.setTimeout(() => {
              eventTimers.delete(timer);
              if (token !== playbackToken) return;
              if (typeof onEvent === "function") onEvent(event);
              let oscillator = null;
              let gain = null;
              try {
                oscillator = context.createOscillator();
                gain = context.createGain();
                const startTime = Math.max(baseTime + event.start, Number(context.currentTime) || baseTime);
                const endTime = startTime + event.duration;
                const attack = Math.min(0.015, event.duration / 4);
                const release = Math.min(0.08, event.duration / 3);
                const peak = Math.max(0.0001, event.velocity * 0.22);
                oscillator.type = "triangle";
                oscillator.frequency.setValueAtTime(midiToFrequency(event.midi), startTime);
                gain.gain.setValueAtTime(0.0001, startTime);
                gain.gain.linearRampToValueAtTime(peak, startTime + attack);
                gain.gain.setValueAtTime(peak, Math.max(startTime + attack, endTime - release));
                gain.gain.linearRampToValueAtTime(0.0001, endTime);
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillators.add(oscillator);
                oscillator.onended = () => {
                  oscillators.delete(oscillator);
                  try {
                    oscillator.disconnect();
                    gain.disconnect();
                  } catch (_error) {
                    // Cleanup is best effort.
                  }
                };
                oscillator.start(startTime);
                oscillator.stop(endTime);
              } catch (error) {
                if (oscillator !== null && !oscillators.has(oscillator)) {
                  try {
                    oscillator.stop();
                  } catch (_error) {
                    // An oscillator may not have started.
                  }
                  try {
                    oscillator.disconnect();
                  } catch (_error) {
                    // Cleanup is best effort.
                  }
                }
                if (gain !== null) {
                  try {
                    gain.disconnect();
                  } catch (_error) {
                    // Cleanup is best effort.
                  }
                }
                playbackToken += 1;
                playing = false;
                clearCompletionTimer();
                eventTimers.forEach(clearTimer);
                eventTimers.clear();
                stopOscillators();
                if (typeof onError === "function") onError(error);
              }
            }, delay);
            eventTimers.add(timer);
          });
          const totalDuration = Math.max(...normalized.map((event) => event.start + event.duration));
          completionTimer = global.setTimeout(() => {
            completionTimer = null;
            if (token !== playbackToken) return;
            playing = false;
            if (typeof onEnd === "function") onEnd();
          }, Math.max(0, totalDuration * 1000 + 30));
        })
        .catch((error) => {
          if (token !== playbackToken) return;
          playing = false;
          if (typeof onError === "function") onError(error);
        });
      return true;
    }

    return {
      play,
      stop,
      isPlaying: () => playing
    };
  }

  global.FretLabAudio = {
    midiToFrequency,
    normalizeEvents,
    createPlayer,
    isSupported
  };
}(window));
