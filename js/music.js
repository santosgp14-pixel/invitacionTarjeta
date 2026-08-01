/* ==========================================================================
   MUSIC.JS - BACKGROUND MUSIC & WEB AUDIO SYNTHESIZER FALLBACK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMusicPlayer();
});

function initMusicPlayer() {
  const toggleBtn = document.getElementById('floating-audio-toggle');
  if (!toggleBtn) return;

  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  // Romantic chord progression frequencies (C major 7 / A minor 7 warm acoustic pattern)
  const notes = [
    261.63, 329.63, 392.00, 493.88, // C, E, G, B
    220.00, 261.63, 329.63, 392.00, // A, C, E, G
    174.61, 220.00, 261.63, 349.23, // F, A, C, F
    196.00, 246.94, 293.66, 392.00  // G, B, D, G
  ];

  function playSynthMelody() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    let noteIndex = 0;

    synthInterval = setInterval(() => {
      if (!isPlaying) return;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);

      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.2);

      noteIndex = (noteIndex + 1) % notes.length;
    }, 600);
  }

  function stopSynthMelody() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  toggleBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      toggleBtn.classList.add('playing');
      playSynthMelody();
      showToast('🎶 Música ambiental activada');
    } else {
      toggleBtn.classList.remove('playing');
      stopSynthMelody();
      showToast('Música pausada');
    }
  });
}
