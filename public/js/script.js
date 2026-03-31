// ===== FORM VALIDATION =====
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// ===== SMOOTH SCROLL & ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in animation to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`;
  });

  // Add smooth scroll behavior for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseover', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
});

// ===== ANIMATION KEYFRAMES =====
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }
`;
document.head.appendChild(style);

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards for scroll animations
document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});