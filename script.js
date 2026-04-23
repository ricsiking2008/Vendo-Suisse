document.addEventListener("DOMContentLoaded", function () {
    const mainNav = document.querySelector(".main-navigation");
    let menuToggle = document.querySelector(".menu-toggle");
    const dropdowns = document.querySelectorAll(".dropdown");
    const mobileSlider = document.querySelector(".solutions-grid");
    const solutionCards = mobileSlider ? mobileSlider.querySelectorAll(".solution-card") : [];
    const dots = document.querySelectorAll(".dot");
    let autoScroll;

    if (!menuToggle && mainNav) {
        menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.setAttribute("type", "button");
        menuToggle.setAttribute("aria-label", "Navigation umschalten");
        menuToggle.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `;
        mainNav.parentNode.insertBefore(menuToggle, mainNav);
    }

    function syncMenuState(isOpen) {
        if (!menuToggle || !mainNav) return;
        mainNav.classList.toggle("active", isOpen);
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

        if (!isOpen) {
            dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
        }
    }

    function isMobileNav() {
        return window.innerWidth <= 768;
    }

    if (menuToggle && mainNav) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.addEventListener("click", function () {
            syncMenuState(!mainNav.classList.contains("active"));
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", function () {
                if (isMobileNav() && link.classList.contains("dropdown-trigger")) {
                    return;
                }
                syncMenuState(false);
            });
        });
    }

    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".dropdown-trigger");

        if (!trigger) return;

        trigger.addEventListener("click", function (event) {
            if (!isMobileNav()) return;

            event.preventDefault();
            dropdown.classList.toggle("open");
        });
    });

    function isMobileSolutionsSlider() {
        return window.innerWidth <= 640;
    }

    function updateDots() {
        if (!mobileSlider || dots.length === 0) return;
        const sliderWidth = mobileSlider.clientWidth || window.innerWidth;
        const currentIndex = Math.round(mobileSlider.scrollLeft / sliderWidth);

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function startMobileTimer() {
        clearInterval(autoScroll);

        if (!mobileSlider || !isMobileSolutionsSlider() || solutionCards.length === 0) {
            return;
        }

        autoScroll = setInterval(() => {
            const sliderWidth = mobileSlider.clientWidth || window.innerWidth;
            let nextIndex = Math.round(mobileSlider.scrollLeft / sliderWidth) + 1;

            if (nextIndex >= solutionCards.length) {
                nextIndex = 0;
            }

            mobileSlider.scrollTo({
                left: nextIndex * sliderWidth,
                behavior: "smooth",
            });
        }, 10000);
    }

    if (mobileSlider) {
        mobileSlider.addEventListener("scroll", updateDots);
        mobileSlider.addEventListener("touchstart", () => clearInterval(autoScroll));
        mobileSlider.addEventListener("touchend", startMobileTimer);

        dots.forEach((dot, index) => {
            dot.addEventListener("click", function () {
                if (!isMobileSolutionsSlider()) return;

                const sliderWidth = mobileSlider.clientWidth || window.innerWidth;
                mobileSlider.scrollTo({
                    left: index * sliderWidth,
                    behavior: "smooth",
                });
                startMobileTimer();
            });
        });

        updateDots();
        startMobileTimer();
    }

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            syncMenuState(false);
        }

        if (mobileSlider && !isMobileSolutionsSlider()) {
            mobileSlider.scrollTo({
                left: 0,
                behavior: "auto",
            });
        }

        updateDots();
        startMobileTimer();
    });

    const slides = document.querySelectorAll(".single-slide");

    if (slides.length > 0) {
        let currentSlide = 0;
        let mainInterval;

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
            const innerMedia = activeSlide.querySelectorAll(".slide-media-container img, .slide-media-container video");
            const activeMedia = Array.from(innerMedia).find((element) =>
                element.classList.contains("inner-active") || element.classList.contains("active")
            );

            if (activeMedia && activeMedia.tagName === "VIDEO") {
                stopMainTimer();
                activeMedia.currentTime = 0;
                activeMedia.play();
                activeMedia.onended = () => nextSlide();
            } else {
                startMainTimer();
            }
        }

        startMainTimer();

        setInterval(() => {
            const activeSlide = document.querySelector(".single-slide.active");
            if (!activeSlide) return;

            const innerMedia = activeSlide.querySelectorAll(".slide-media-container img, .slide-media-container video");
            if (innerMedia.length <= 1) return;

            let activeIndex = Array.from(innerMedia).findIndex((element) =>
                element.classList.contains("inner-active") || element.classList.contains("active")
            );

            if (activeIndex === -1) {
                activeIndex = 0;
            }

            if (innerMedia[activeIndex].tagName === "VIDEO" && !innerMedia[activeIndex].paused) {
                return;
            }

            innerMedia[activeIndex].classList.remove("inner-active", "active");
            innerMedia[activeIndex].style.opacity = "0";

            const nextIndex = (activeIndex + 1) % innerMedia.length;
            const nextMedia = innerMedia[nextIndex];
            nextMedia.classList.add("inner-active", "active");
            nextMedia.style.opacity = "1";

            if (nextMedia.tagName === "VIDEO") {
                stopMainTimer();
                nextMedia.currentTime = 0;
                nextMedia.play();
                nextMedia.onended = () => nextSlide();
            }
        }, 2500);
    }

    setInterval(() => {
        const containers = document.querySelectorAll(".image-side.inner-fade, .product-visual-box.inner-fade");

        containers.forEach((container) => {
            const images = container.querySelectorAll("img");

            if (images.length <= 1) {
                return;
            }

            let currentIndex = Array.from(images).findIndex((image) => image.classList.contains("inner-active"));
            if (currentIndex === -1) {
                currentIndex = 0;
            }

            images[currentIndex].classList.remove("inner-active");
            const nextIndex = (currentIndex + 1) % images.length;
            images[nextIndex].classList.add("inner-active");
        });
    }, 10000);
});
