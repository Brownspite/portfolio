/* ==========================================================================
   Minimal Portfolio JS — Theme toggle, mobile nav, active page indicator,
   & Auto-Updating Daily Quote of the Day
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Inject Subtle Atmospheric Ambient Glows
    if (!document.querySelector('.bg-decorations')) {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'bg-decorations';
        bgContainer.innerHTML = `
            <div class="bg-glow-spidey"></div>
            <div class="bg-glow-rm"></div>
        `;
        document.body.prepend(bgContainer);
    }

    // Theme toggle
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);
        });
    }

    // Mobile nav toggle
    const menuBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // Active page indicator based on URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================================================
    // Dynamic Daily Quote of the Day (Updates Automatically Every 24 Hours)
    // ==========================================================================
    initDailyQuote();
});

function initDailyQuote() {
    const quoteElement = document.getElementById('daily-quote');
    if (!quoteElement) return;

    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const cachedDate = localStorage.getItem('daily-quote-date');
    const cachedQuote = localStorage.getItem('daily-quote-text');

    // Use cached quote if already fetched today
    if (cachedDate === todayStr && cachedQuote) {
        quoteElement.innerText = cachedQuote;
        return;
    }

    // Curated high-performance daily quotes (fallback & daily deterministic engine)
    const curatedQuotes = [
        { q: "Work hard in silence, let your success be your noise.", a: "Frank Ocean" },
        { q: "If you don't fight for what you want, don't cry for what you lose.", a: "Real Madrid Motto" },
        { q: "Simplicity is the prerequisite for reliability.", a: "Edsger W. Dijkstra" },
        { q: "To achieve anything, you must be prepared to dabble on the boundary of madness.", a: "Motorsport Vision" },
        { q: "With great power comes great responsibility.", a: "Stan Lee" },
        { q: "Stay hungry, stay foolish.", a: "Steve Jobs" },
        { q: "Hard work beats talent when talent fails to work hard.", a: "Tim Notke" },
        { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
        { q: "Excellence is not an act, but a habit.", a: "Aristotle" },
        { q: "Success is no accident. It is hard work, perseverance, and learning.", a: "Pelé" },
        { q: "Clean code always looks like it was written by someone who cares.", a: "Robert C. Martin" },
        { q: "Never give up, never surrender.", a: "Fierce Pride" }
    ];

    // Compute daily deterministic index
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const selected = curatedQuotes[dayOfYear % curatedQuotes.length];
    const fallbackFormatted = `"${selected.q}" — ${selected.a}`;

    // Set fallback quote immediately
    quoteElement.innerText = fallbackFormatted;

    // Try fetching from live Daily Quote API
    fetch('https://dummyjson.com/quotes/random')
        .then(res => res.json())
        .then(data => {
            if (data && data.quote && data.author) {
                const formatted = `"${data.quote}" — ${data.author}`;
                quoteElement.innerText = formatted;
                localStorage.setItem('daily-quote-date', todayStr);
                localStorage.setItem('daily-quote-text', formatted);
            } else {
                localStorage.setItem('daily-quote-date', todayStr);
                localStorage.setItem('daily-quote-text', fallbackFormatted);
            }
        })
        .catch(() => {
            localStorage.setItem('daily-quote-date', todayStr);
            localStorage.setItem('daily-quote-text', fallbackFormatted);
        });
}
