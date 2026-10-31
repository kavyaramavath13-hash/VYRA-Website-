const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  navLinks.classList.toggle('open', open);
});

navLinks.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Add confirmed profiles and activities here. Keep image paths relative to vyra-site/.
// Team images must be genuine, approved portraits; journey images must document confirmed work.
const TEAM_MEMBERS = [
  { name: 'Kavya' },
  { name: 'Neeha' },
  { name: 'Lokagna' },
  // Complete each profile with a confirmed role, contribution and real portrait before publishing.
  // { name: 'Name', role: 'Confirmed role', description: 'Confirmed contribution', image: 'assets/team/member.jpg' },
];
const JOURNEY_ACTIVITIES = [
  // { title: 'Confirmed activity', description: 'What the team did', image: 'assets/journey/activity.jpg', stage: 'Optional date or stage', members: ['Optional confirmed names'] },
];
// Leave empty until a real, secure form endpoint is configured. Never put secrets here.
const CONTACT_FORM_ENDPOINT = '';

const isLocalDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const showContentPlaceholders = isLocalDevelopment && new URLSearchParams(window.location.search).get('content-preview') === 'development';

const teamSection = document.querySelector('#team');
const teamGrid = document.querySelector('#team-grid');
const journeySection = document.querySelector('#journey');
const journeyGrid = document.querySelector('#journey-grid');

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function validImagePath(path = '') {
  return /^assets\/(team|journey)\/[\w./-]+\.(?:avif|webp|png|jpe?g)$/i.test(path) && !path.includes('..');
}

const teamProfiles = TEAM_MEMBERS.filter((member) => member.name && member.role && member.description && validImagePath(member.image));
teamSection.hidden = !teamProfiles.length && !showContentPlaceholders;
document.querySelectorAll('a[href="#team"]').forEach((link) => { link.hidden = teamSection.hidden; });
teamGrid.innerHTML = teamProfiles.map((member, index) => `
  <article class="team-card reveal" style="--card-index:${index}">
    <div class="team-portrait"><img src="${escapeHTML(member.image)}" alt="Portrait of ${escapeHTML(member.name)}" loading="lazy"></div>
    <div class="team-card-copy"><p class="team-role">${escapeHTML(member.role)}</p><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.description)}</p></div>
  </article>`).join('');
if (showContentPlaceholders) {
  const pendingProfiles = TEAM_MEMBERS.filter((member) => !teamProfiles.includes(member));
  teamGrid.insertAdjacentHTML('beforeend', pendingProfiles.map((member, index) => `
    <article class="team-card team-placeholder reveal" style="--card-index:${teamProfiles.length + index}">
      <div class="team-placeholder-art"><span>Real portrait<br>photo goes here</span><small>DEVELOPMENT PLACEHOLDER</small></div>
      <div class="team-card-copy"><p class="team-role">Role to confirm</p><h3>${escapeHTML(member.name || 'Name to confirm')}</h3><p>Add the confirmed role, contribution and approved real portrait in TEAM_MEMBERS.</p></div>
    </article>`).join(''));
}

const journeyItems = JOURNEY_ACTIVITIES.filter((activity) => activity.title && activity.description && validImagePath(activity.image));
journeySection.hidden = !journeyItems.length && !showContentPlaceholders;
document.querySelectorAll('a[href="#journey"]').forEach((link) => { link.hidden = journeySection.hidden; });
journeyGrid.innerHTML = journeyItems.map((activity, index) => `
  <article class="journey-card reveal" style="--card-index:${index}">
    <button class="journey-photo-button" type="button" data-image="${escapeHTML(activity.image)}" data-caption="${escapeHTML(activity.title)}" aria-label="View photo: ${escapeHTML(activity.title)}">
      <img src="${escapeHTML(activity.image)}" alt="${escapeHTML(activity.description)}" loading="lazy"><span class="photo-zoom" aria-hidden="true">↗</span>
    </button>
    <div class="journey-card-copy">${activity.stage ? `<p class="journey-stage">${escapeHTML(activity.stage)}</p>` : ''}<h3>${escapeHTML(activity.title)}</h3><p>${escapeHTML(activity.description)}</p>${activity.members?.length ? `<p class="journey-members">With ${activity.members.map(escapeHTML).join(', ')}</p>` : ''}</div>
  </article>`).join('');
if (showContentPlaceholders && !journeyItems.length) {
  journeyGrid.innerHTML = Array.from({ length: 3 }, (_, index) => `
    <article class="journey-card journey-placeholder reveal" style="--card-index:${index}">
      <div class="journey-placeholder-art"><span>Confirmed activity photo<br>goes here</span><small>DEVELOPMENT PLACEHOLDER</small></div>
      <div class="journey-card-copy"><p class="journey-stage">Optional date or stage</p><h3>Confirmed activity title</h3><p>Add only completed and confirmed activity details in JOURNEY_ACTIVITIES.</p></div>
    </article>`).join('');
}

const lightbox = document.querySelector('#journey-lightbox');
journeyGrid.addEventListener('click', (event) => {
  const trigger = event.target.closest('.journey-photo-button');
  if (!trigger) return;
  const image = lightbox.querySelector('.lightbox-image');
  image.src = trigger.dataset.image;
  image.alt = trigger.dataset.caption;
  lightbox.querySelector('.lightbox-caption').textContent = trigger.dataset.caption;
  lightbox.showModal();
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

const contactForm = document.querySelector('#contact-form');
const contactSubmit = contactForm.querySelector('[type="submit"]');
const contactStatus = document.querySelector('.form-status');
contactSubmit.disabled = !CONTACT_FORM_ENDPOINT;
if (!CONTACT_FORM_ENDPOINT) {
  contactSubmit.textContent = 'Contact form setup needed';
  contactSubmit.setAttribute('aria-describedby', 'form-note');
}
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!CONTACT_FORM_ENDPOINT) {
    contactStatus.textContent = 'Messages cannot be sent yet. Configure a secure form endpoint before enabling this form.';
    return;
  }

  contactSubmit.disabled = true;
  contactStatus.textContent = 'Sending your message…';
  try {
    const response = await fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
    contactForm.reset();
    contactStatus.textContent = 'Your message was sent. Thank you for getting in touch.';
  } catch {
    contactStatus.textContent = 'Your message could not be sent. Please try again later.';
  } finally {
    contactSubmit.disabled = false;
  }
});
