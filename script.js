// This is the script to handle the slide deck functionality.

// Import Mermaid
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const slideContainer = document.getElementById('slide-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    
    // Set Mermaid's global configuration for responsiveness
    mermaid.initialize({
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
            defaultRenderer: 'elk',
            curve: 'basis'
        }
    });

    // Slides array
    const slides = [
        'slides/slide1.html',
        'slides/slide2.html',
        'slides/slide3.html',
        'slides/slide4.html',
        'slides/slide5.html',
        'slides/slide6.html',
        'slides/slide7.html',
        'slides/slide8.html',
        'slides/slide9.html'
    ];
    let currentSlideIndex = 0;

    // Update progress bar
    const updateProgressBar = () => {
        const progress = ((currentSlideIndex + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    };

    // Load slide
    const loadSlide = async (url) => {
        slideContainer.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const slideContent = await response.text();
            slideContainer.classList.remove('fade-out');
            slideContainer.innerHTML = slideContent;
            slideContainer.classList.add('fade-in');
            
            await mermaid.run({ querySelector: '.mermaid' });
            updateProgressBar();
        } catch (error) {
            console.error('Failed to load slide:', error);
            slideContainer.innerHTML = '<p class="text-danger text-center mt-5">Failed to load content.</p>';
        }
    };

    // Update button states
    const updateButtonState = () => {
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;
    };

    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            loadSlide(slides[currentSlideIndex]);
            updateButtonState();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            loadSlide(slides[currentSlideIndex]);
            updateButtonState();
        }
    });

    // Theme toggle logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.classList.replace('bi-moon', 'bi-sun');
            themeToggleBtn.querySelector('span').textContent = 'Light';
        } else {
            themeIcon.classList.replace('bi-sun', 'bi-moon');
            themeToggleBtn.querySelector('span').textContent = 'Dark';
        }
    }

    // Check saved preference or system default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Toggle on click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Initial load
    loadSlide(slides[currentSlideIndex]);
    updateButtonState();
});
