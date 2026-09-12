/* ==========================================================================
   MUSIC.JS - BACKGROUND MUSIC PLAYER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMusicPlayer();
});

function initMusicPlayer() {
  const toggleBtn = document.getElementById('floating-audio-toggle');
  const audio = document.getElementById('bg-music');
  
  if (!toggleBtn || !audio) return;

  let isPlaying = false;
  
  // Set lower volume for ambient music
  audio.volume = 0.5;

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        toggleBtn.classList.add('playing');
        showToast('🎶 Música ambiental activada');
      }).catch(err => {
        console.error("Error reproduciendo audio:", err);
        showToast('Para reproducir, asegúrate de tener el archivo MP3');
      });
    } else {
      audio.pause();
      isPlaying = false;
      toggleBtn.classList.remove('playing');
      showToast('Música pausada');
    }
  });
}
