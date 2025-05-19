// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Track contact form submissions
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': 'Contact Form'
            });
            // You can add your form submission logic here
        });
    }

    // Track "Learn More" button clicks
    const learnMoreButtons = document.querySelectorAll('a.button');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const section = this.closest('section');
            const subject = section.querySelector('h2').textContent;
            gtag('event', 'button_click', {
                'event_category': 'Navigation',
                'event_label': 'Learn More - ' + subject
            });
        });
    });

    // Track time spent on sections
    let sectionTimes = {};
    let currentSection = null;
    let sectionStartTime = null;

    function updateSectionTime() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (currentSection !== section.id) {
                    // Record time spent on previous section
                    if (currentSection && sectionStartTime) {
                        const timeSpent = (Date.now() - sectionStartTime) / 1000;
                        sectionTimes[currentSection] = (sectionTimes[currentSection] || 0) + timeSpent;
                        
                        // Send time spent to Google Analytics
                        gtag('event', 'time_spent', {
                            'event_category': 'Engagement',
                            'event_label': currentSection,
                            'value': Math.round(timeSpent)
                        });
                    }
                    
                    // Start timing new section
                    currentSection = section.id;
                    sectionStartTime = Date.now();
                }
            }
        });
    }

    // Update section time every 5 seconds
    setInterval(updateSectionTime, 5000);

    // Track page navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            gtag('event', 'navigation', {
                'event_category': 'Navigation',
                'event_label': this.getAttribute('href')
            });
        });
    });

    // Track subject section visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const subject = section.querySelector('h2')?.textContent;
                if (subject) {
                    gtag('event', 'section_view', {
                        'event_category': 'Engagement',
                        'event_label': subject
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all subject sections
    document.querySelectorAll('section[id="one"] section').forEach(section => {
        observer.observe(section);
    });
}); 