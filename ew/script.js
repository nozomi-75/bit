// This is the script to handle the slide deck functionality.

document.addEventListener('DOMContentLoaded', () => {
    const slideContainer = document.getElementById('slide-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // An array of slide file paths. Add more slides here as you create them.
    const slides = [
        'slide1.html',
        'slide2.html'
    ];
    let currentSlideIndex = 0;

    /**
     * Fetches and loads a slide from the specified URL into the container.
     * @param {string} url - The URL of the slide to load.
     */
    const loadSlide = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const slideContent = await response.text();
            slideContainer.innerHTML = slideContent;
            // Reinitialize Mermaid after the new content is loaded
            mermaid.init();
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
