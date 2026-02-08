document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".single-slide");
    let currentSlide = 0;
    let mainInterval;
    let innerInterval; // Variable für den inneren Wechsel

    function nextSlide() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
        
        checkMedia(); 
    }

    function startMainTimer() {
        stopMainTimer(); 
        mainInterval = setInterval(nextSlide, 5000);
    }

    function stopMainTimer() {
        clearInterval(mainInterval);
    }

    function checkMedia() {
        const activeSlide = slides[currentSlide];
        const innerMedia = activeSlide.querySelectorAll('.slide-media-container img, .slide-media-container video');
        
        let activeMedia = Array.from(innerMedia).find(el => 
            el.classList.contains('inner-active') || el.classList.contains('active')
        );

        if (activeMedia && activeMedia.tagName === "VIDEO") {
            stopMainTimer(); 
            activeMedia.currentTime = 0;
            activeMedia.play();

            activeMedia.onended = function() {
                nextSlide();
            };
        } else {
            startMainTimer();
        }
    }

    // Initialer Start
    startMainTimer();

    // 2. INNERER SLIDER (Bildwechsel innerhalb eines Slides)
    innerInterval = setInterval(() => {
        const activeSlide = document.querySelector('.single-slide.active');
        if (!activeSlide) return;

        const innerMedia = activeSlide.querySelectorAll('.slide-media-container img, .slide-media-container video');
        if (innerMedia.length <= 1) return;

        let activeIdx = Array.from(innerMedia).findIndex(el => 
            el.classList.contains('inner-active') || el.classList.contains('active')
        );

        // FALLS ein Video gerade spielt, brechen wir den 2.5s-Timer hier ab
        if (innerMedia[activeIdx].tagName === "VIDEO" && !innerMedia[activeIdx].paused) {
            return; 
        }

        innerMedia[activeIdx].classList.remove('inner-active', 'active');
        innerMedia[activeIdx].style.opacity = "0";

        let nextIdx = (activeIdx + 1) % innerMedia.length;
        const nextMedia = innerMedia[nextIdx];

        nextMedia.classList.add('inner-active', 'active');
        nextMedia.style.opacity = "1";

        if (nextMedia.tagName === "VIDEO") {
            stopMainTimer();
            nextMedia.currentTime = 0;
            nextMedia.play();
            nextMedia.onended = () => {
                nextSlide();
            };
        } else {
            if (!mainInterval) startMainTimer();
        }
    }, 2500);

    // 3. UNTERSEITEN SLIDER (Info-Blöcke)
    setInterval(() => {
        const containers = document.querySelectorAll('.image-side.inner-fade');
        containers.forEach(container => {
            const images = container.querySelectorAll('img');
            if (images.length > 1) {
                let currentIdx = Array.from(images).findIndex(img => img.classList.contains('inner-active'));
                if (currentIdx === -1) currentIdx = 0;
                images[currentIdx].classList.remove('inner-active');
                let nextIdx = (currentIdx + 1) % images.length;
                images[nextIdx].classList.add('inner-active');
            }
        });
    }, 10000);
}); 