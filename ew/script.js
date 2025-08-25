// This is the script to handle the slide deck functionality.

// We need to import the mermaid library here since we're using a type="module" script
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
            // Use 'elk' renderer for a better, more compact layout
            defaultRenderer: 'elk',
            // Use 'basis' curve for smoother lines that work well with the 'elk' renderer
            curve: 'basis'
        }
    });

    // An array of slide file paths. Add more slides here as you create them.
    const slides = [
        'slide1.html',
        'slide2.html',
        'slide3.html',
        'slide4.html',
        'slide5.html'
    ];
    let currentSlideIndex = 0;

    /**
     * Updates the progress bar based on the current slide index.
     */
    const updateProgressBar = () => {
        const progress = ((currentSlideIndex + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    };

    /**
     * Fetches and loads a slide from the specified URL into the container with a fade animation.
     * @param {string} url - The URL of the slide to load.
     */
    const loadSlide = async (url) => {
        // First, fade out the current slide
        slideContainer.classList.add('fade-out');
        
        // Wait for the fade-out animation to finish
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const slideContent = await response.text();
            
            // Remove the fade-out class and update content
            slideContainer.classList.remove('fade-out');
            slideContainer.innerHTML = slideContent;
            
            // Re-add the fade-in class to trigger the animation
            slideContainer.classList.add('fade-in');
            
            // Tell Mermaid to run and re-render the new diagram content
            await mermaid.run({
                querySelector: '.mermaid',
            });
            
            // Update the progress bar
            updateProgressBar();
            
        } catch (error) {
            console.error('Failed to load slide:', error);
            slideContainer.innerHTML = '<p class="text-danger text-center mt-5">Failed to load content.</p>';
        }
    };

    /**
     * Updates the button states (enabled/disabled) based on the current slide index.
     */
    const updateButtonState = () => {
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;
    };

    // Event listener for the "Previous" button
    prevBtn.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            loadSlide(slides[currentSlideIndex]);
            updateButtonState();
        }
    });

    // Event listener for the "Next" button
    nextBtn.addEventListener('click', () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            loadSlide(slides[currentSlideIndex]);
            updateButtonState();
        }
    });

    // Initial load of the first slide and update button states
    loadSlide(slides[currentSlideIndex]);
    updateButtonState();
});
