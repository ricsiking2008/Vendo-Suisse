document.addEventListener("DOMContentLoaded", function() {
    
    // 1. HAUPTSLIDER (Startseite)
    const slides = document.querySelectorAll(".single-slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 5000);
    }

    // 2. INNERER SLIDER (Bilder im Hauptslider rechts)
    setInterval(() => {
        const activeSlide = document.querySelector('.single-slide.active');
        if (!activeSlide) return;

        const innerImages = activeSlide.querySelectorAll('.slide-media-container img');
        if (innerImages.length <= 1) return;

        let activeIdx = Array.from(innerImages).findIndex(img => 
            img.classList.contains('inner-active') || getComputedStyle(img).opacity === "1"
        );
        
        innerImages[activeIdx].classList.remove('inner-active');
        innerImages[activeIdx].style.opacity = "0";

        let nextIdx = (activeIdx + 1) % innerImages.length;
        innerImages[nextIdx].classList.add('inner-active');
        innerImages[nextIdx].style.opacity = "1";
    }, 2500);

    // 3. UNTERSEITEN SLIDER (Briefkästen Info-Blöcke)
    setInterval(() => {
        const containers = document.querySelectorAll('.image-side.inner-fade');
        containers.forEach(container => {
            const images = container.querySelectorAll('img');
            if (images.length > 1) {
                let currentIdx = Array.from(images).findIndex(img => img.classList.contains('inner-active'));
                
                images[currentIdx].classList.remove('inner-active');
                
                let nextIdx = (currentIdx + 1) % images.length;
                images[nextIdx].classList.add('inner-active');
            }
        });
    }, 10000); // 10 Sekunden Takt
});