const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function setHeaderState() {
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
}

setHeaderState();
window.addEventListener('scroll', setHeaderState);

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(function (item, index) {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 360)}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add('is-visible');
  });
}

const filterButtons = document.querySelectorAll('.filter-chip');
const directoryCards = document.querySelectorAll('.directory-card');
const directorySections = document.querySelectorAll('.directory-section');

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const selected = button.getAttribute('data-filter');
    filterButtons.forEach(function (chip) {
      chip.classList.remove('active');
    });
    button.classList.add('active');

    directorySections.forEach(function (section) {
      const sectionName = section.getAttribute('data-section');
      if (selected === 'all' || selected === sectionName) {
        section.classList.remove('is-hidden');
      } else {
        section.classList.add('is-hidden');
      }
    });

    directoryCards.forEach(function (card, index) {
      const category = card.getAttribute('data-category');
      const match = selected === 'all' || selected === category;
      card.classList.toggle('is-filtered-out', !match);
      if (match) {
        card.style.animationDelay = `${Math.min(index * 20, 240)}ms`;
        card.classList.remove('pulse-in');
        requestAnimationFrame(function () {
          card.classList.add('pulse-in');
        });
      }
    });
  });
});

const magneticItems = document.querySelectorAll('.magnetic');
magneticItems.forEach(function (item) {
  item.addEventListener('mousemove', function (event) {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
  });

  item.addEventListener('mouseleave', function () {
    item.style.transform = 'translate(0, 0)';
  });
});

function setError(input, messageId, message) {
  const box = document.getElementById(messageId);
  if (box) box.textContent = message;
  if (input) input.classList.toggle('has-error', Boolean(message));
}

function hasOnlyNumbers(value) {
  if (value.length === 0) return false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 48 || code > 57) {
      return false;
    }
  }
  return true;
}

function hasSelectedPreference() {
  const preferenceInputs = document.querySelectorAll('input[name="preference"]');
  for (let i = 0; i < preferenceInputs.length; i += 1) {
    if (preferenceInputs[i].checked) {
      return true;
    }
  }
  return false;
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const phoneInput = document.getElementById('phoneNumber');
    const topicInput = document.getElementById('interestTopic');
    const agreementInput = document.getElementById('agreement');
    const successBox = document.getElementById('successBox');

    const fullName = nameInput.value.trim();
    const emailAddress = emailInput.value.trim();
    const phoneNumber = phoneInput.value.trim();
    const topic = topicInput.value;

    let isValid = true;

    if (fullName.length === 0) {
      setError(nameInput, 'nameError', 'Name must not be empty.');
      isValid = false;
    } else if (fullName.length < 3) {
      setError(nameInput, 'nameError', 'Name must contain at least 3 characters.');
      isValid = false;
    } else {
      setError(nameInput, 'nameError', '');
    }

    if (emailAddress.length === 0) {
      setError(emailInput, 'emailError', 'Email must not be empty.');
      isValid = false;
    } else if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
      setError(emailInput, 'emailError', 'Email must include “@” and “.”.');
      isValid = false;
    } else if (emailAddress.indexOf('@') === 0 || emailAddress.lastIndexOf('.') < emailAddress.indexOf('@')) {
      setError(emailInput, 'emailError', 'Please enter a complete email address.');
      isValid = false;
    } else {
      setError(emailInput, 'emailError', '');
    }

    if (phoneNumber.length === 0) {
      setError(phoneInput, 'phoneError', 'Phone number must not be empty.');
      isValid = false;
    } else if (!hasOnlyNumbers(phoneNumber)) {
      setError(phoneInput, 'phoneError', 'Phone number must contain only numbers.');
      isValid = false;
    } else if (phoneNumber.length < 8) {
      setError(phoneInput, 'phoneError', 'Phone number must contain at least 8 digits.');
      isValid = false;
    } else {
      setError(phoneInput, 'phoneError', '');
    }

    if (topic === '') {
      setError(topicInput, 'topicError', 'Please select a topic of interest.');
      isValid = false;
    } else {
      setError(topicInput, 'topicError', '');
    }

    if (!hasSelectedPreference()) {
      setError(null, 'preferenceError', 'Please select an update preference.');
      isValid = false;
    } else {
      setError(null, 'preferenceError', '');
    }

    if (!agreementInput.checked) {
      setError(agreementInput, 'agreementError', 'Please agree before submitting.');
      isValid = false;
    } else {
      setError(agreementInput, 'agreementError', '');
    }

    if (isValid) {
      successBox.textContent = 'Registration successful. Welcome to the FontDale glow list.';
      successBox.classList.add('is-visible');
      newsletterForm.reset();
      const controls = newsletterForm.querySelectorAll('input, select');
      controls.forEach(function (control) {
        control.classList.remove('has-error');
      });
    } else {
      successBox.textContent = '';
      successBox.classList.remove('is-visible');
    }
  });
}

function createAmbientDots() {
  const container = document.querySelector('.ambient-bg');
  if (!container) return;
  for (let i = 0; i < 18; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'micro-light';
    dot.style.left = `${(i * 37) % 100}%`;
    dot.style.top = `${(i * 53) % 100}%`;
    dot.style.animationDelay = `${i * 0.33}s`;
    container.appendChild(dot);
  }
}

createAmbientDots();


// Improved directory search, works together with filter chips.
const directorySearchInput = document.getElementById('directorySearch');
const directorySearchStatus = document.getElementById('directorySearchStatus');

function getActiveDirectoryFilter() {
  const activeChip = document.querySelector('.filter-chip.active');
  return activeChip ? activeChip.getAttribute('data-filter') : 'all';
}

function applyDirectorySearch() {
  if (!directorySearchInput || !directoryCards.length) return;
  const query = directorySearchInput.value.trim().toLowerCase();
  const selected = getActiveDirectoryFilter();
  let visibleCount = 0;

  directoryCards.forEach(function (card) {
    const text = card.getAttribute('data-search') || card.textContent.toLowerCase();
    const category = card.getAttribute('data-category');
    const categoryMatch = selected === 'all' || selected === category;
    const textMatch = query.length === 0 || text.includes(query);
    const show = categoryMatch && textMatch;
    card.classList.toggle('is-search-hidden', !show);
    if (show) visibleCount += 1;
  });

  directorySections.forEach(function (section) {
    const cardsInSection = section.querySelectorAll('.directory-card:not(.is-search-hidden)');
    const sectionName = section.getAttribute('data-section');
    const sectionAllowed = selected === 'all' || selected === sectionName;
    section.classList.toggle('is-hidden-by-search', !sectionAllowed || cardsInSection.length === 0);
  });

  if (directorySearchStatus) {
    if (visibleCount === 0) {
      directorySearchStatus.textContent = 'No tenant found. Try coffee, fashion, sushi, sneakers, beauty, or level 2.';
    } else if (query.length > 0) {
      directorySearchStatus.textContent = 'Showing ' + visibleCount + ' matching tenant cards.';
    } else {
      directorySearchStatus.textContent = 'Showing ' + visibleCount + ' featured tenants.';
    }
  }
}

if (directorySearchInput) {
  directorySearchInput.addEventListener('input', debounce(applyDirectorySearch, 150));
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      window.setTimeout(applyDirectorySearch, 0);
    });
  });
  applyDirectorySearch();
}

// Event details modal.
const eventModal = document.getElementById('eventModal');
const eventModalClose = document.getElementById('eventModalClose');
const eventModalTitle = document.getElementById('eventModalTitle');
const eventModalDate = document.getElementById('eventModalDate');
const eventModalDescription = document.getElementById('eventModalDescription');
const eventModalLocation = document.getElementById('eventModalLocation');
const eventButtons = document.querySelectorAll('.event-detail-button');

function closeEventModal() {
  if (!eventModal) return;
  eventModal.classList.remove('is-open');
  eventModal.setAttribute('aria-hidden', 'true');
}

function openEventModal(card) {
  if (!eventModal || !card) return;
  if (eventModalTitle) eventModalTitle.textContent = card.getAttribute('data-title') || 'FontDale Event';
  if (eventModalDate) eventModalDate.textContent = card.getAttribute('data-date') || 'Event date';
  if (eventModalDescription) eventModalDescription.textContent = card.getAttribute('data-description') || 'Event description';
  if (eventModalLocation) eventModalLocation.textContent = card.getAttribute('data-location') || 'FontDale';
  eventModal.classList.add('is-open');
  eventModal.setAttribute('aria-hidden', 'false');
  if (eventModalClose) eventModalClose.focus();
}

eventButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    openEventModal(button.closest('.fd-event-card'));
  });
});

if (eventModalClose) {
  eventModalClose.addEventListener('click', closeEventModal);
}

if (eventModal) {
  eventModal.addEventListener('click', function (event) {
    if (event.target === eventModal) closeEventModal();
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeEventModal();

  if (event.key === 'Tab' && eventModal && eventModal.classList.contains('is-open')) {
    const panel = eventModal.querySelector('.event-modal-panel');
    if (!panel) return;
    const focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
});
