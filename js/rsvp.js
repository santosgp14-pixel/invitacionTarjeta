/* ==========================================================================
   RSVP.JS - FORM VALIDATION & CONFIRMATION HANDLING
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRSVPForm();
});

function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const attendanceSelect = document.getElementById('guest-attendance');
  const guestsCountGroup = document.getElementById('group-guests-count');

  if (!form) return;

  // Toggle guest count visibility based on attendance choice
  if (attendanceSelect && guestsCountGroup) {
    attendanceSelect.addEventListener('change', () => {
      if (attendanceSelect.value === 'no_asistira') {
        guestsCountGroup.style.display = 'none';
      } else {
        guestsCountGroup.style.display = 'block';
      }
    });
  }

  const dietOtherCheckbox = document.getElementById('diet-other-checkbox');
  const dietOtherContainer = document.getElementById('diet-other-container');

  if (dietOtherCheckbox && dietOtherContainer) {
    dietOtherCheckbox.addEventListener('change', () => {
      dietOtherContainer.style.display = dietOtherCheckbox.checked ? 'block' : 'none';
    });
  }

  // Check if guest already responded previously in localStorage
  const savedResponse = localStorage.getItem('wedding_rsvp_submission');
  if (savedResponse) {
    try {
      const data = JSON.parse(savedResponse);
      renderConfirmationState(data);
    } catch (e) {
      console.warn('Could not parse stored RSVP data', e);
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const attendance = document.getElementById('guest-attendance').value;
    const count = attendance === 'no_asistira' ? 0 : parseInt(document.getElementById('guest-count').value, 10);
    const song = document.getElementById('song-request').value.trim();

    // Collect checked dietary preferences
    const checkedDiets = Array.from(document.querySelectorAll('input[name="diet"]:checked'))
      .map(cb => {
        if (cb.value === 'Alergico') {
          const details = document.getElementById('diet-other-input') ? document.getElementById('diet-other-input').value.trim() : '';
          return details ? `Alérgico/Otro: ${details}` : 'Otro (alérgico)';
        }
        return cb.value;
      });

    if (!name || !attendance) {
      showToast('Por favor completa todos los campos obligatorios');
      return;
    }

    const rsvpData = {
      name,
      attendance,
      count,
      dietary: checkedDiets,
      song,
      timestamp: new Date().toISOString()
    };

    // Save to LocalStorage
    localStorage.setItem('wedding_rsvp_submission', JSON.stringify(rsvpData));

    // Render Confirmation UI
    renderConfirmationState(rsvpData);
    showToast('¡Respuesta registrada con éxito!');
  });
}

function renderConfirmationState(data) {
  const rsvpCard = document.querySelector('.rsvp-card');
  if (!rsvpCard) return;

  const isAttending = data.attendance === 'asistira';

  rsvpCard.innerHTML = `
    <div style="text-align: center; padding: 1.5rem 0;">
      <div style="width: 70px; height: 70px; background: var(--color-ivory); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; border: 2px solid var(--color-gold); color: var(--color-gold);">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <span class="subtitle-script">¡Muchas Gracias!</span>
      <h3 style="font-size: 2.2rem; color: var(--color-olive-dark); margin-bottom: 1rem;">
        ${escapeHtml(data.name)}
      </h3>

      <p style="font-size: 1.1rem; color: var(--color-olive); margin-bottom: 1.5rem;">
        ${isAttending 
          ? `Hemos confirmado tu asistencia para <strong>${data.count} ${data.count === 1 ? 'persona' : 'personas'}</strong>. ¡Nos llena de alegría celebrar juntos!`
          : 'Lamentamos que no puedas acompañarnos, pero agradecemos profundamente tu mensaje.'}
      </p>

      ${data.dietary && data.dietary.length > 0 ? `
        <div style="background: var(--color-ivory); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; text-align: left; display: inline-block;">
          <strong style="color: var(--color-olive-dark);">Preferencia alimentaria registrada:</strong>
          <p style="margin: 0.3rem 0 0 0; color: var(--color-olive);">${data.dietary.join(', ')}</p>
        </div>
      ` : ''}

      <div style="margin-top: 1.5rem;">
        <button id="reset-rsvp-btn" class="btn-secondary" style="font-size: 0.8rem;">
          Modificar mi respuesta
        </button>
      </div>
    </div>
  `;

  const resetBtn = document.getElementById('reset-rsvp-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('wedding_rsvp_submission');
      window.location.reload();
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
