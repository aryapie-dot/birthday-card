document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. DOM Elements
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const openCardBtn = document.getElementById("open-card-btn");
    const envelopeFlap = document.getElementById("envelope-flap");
    const waxSeal = document.getElementById("wax-seal");
    const letter = document.getElementById("letter");
    const introText = document.getElementById("intro-text");
    const celebrateBtn = document.getElementById("celebrate-btn");

    // Audio Elements
    const musicToggle = document.getElementById("music-toggle");
    const bgMusic = document.getElementById("bg-music");
    const musicIcon = document.getElementById("music-icon");
    const btnLabel = musicToggle.querySelector(".btn-label");

    // State
    let isCardOpen = false;
    let isMusicPlaying = false;

    // 3. Generate Ambient Background Floating Elements
    initAmbientBackground();

    // 4. Audio Controls & Interactivity
    function toggleMusic() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                btnLabel.textContent = "Pause Music";
                musicToggle.setAttribute("aria-label", "Pause Background Music");
                // Update Lucide icon to volume-2
                musicToggle.innerHTML = '<i data-lucide="volume-2" id="music-icon"></i><span class="btn-label">Pause Music</span>';
                lucide.createIcons();
            }).catch(err => {
                console.log("Audio playback prevented or failed:", err);
            });
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            btnLabel.textContent = "Play Music";
            musicToggle.setAttribute("aria-label", "Play Background Music");
            musicToggle.innerHTML = '<i data-lucide="volume-x" id="music-icon"></i><span class="btn-label">Play Music</span>';
            lucide.createIcons();
        }
    }

    musicToggle.addEventListener("click", toggleMusic);

    // 5. Confetti Explosion Helper Function
    function triggerConfetti() {
        // Elegant pastel celebratory burst
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b83344', '#e899a1', '#c58f36', '#f5d0c8', '#ffffff']
        });

        // Side cannon bursts for extra magic
        setTimeout(() => {
            confetti({
                particleCount: 40,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors: ['#b83344', '#c58f36', '#e899a1']
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 40,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors: ['#b83344', '#c58f36', '#e899a1']
            });
        }, 400);
    }

    // 6. GSAP Opening Animation Sequence
    function openCard() {
        if (isCardOpen) return;
        isCardOpen = true;

        // Start music automatically on first open if not already playing
        if (!isMusicPlaying) {
            toggleMusic();
        }

        // Disable further clicks during animation
        envelopeWrapper.style.pointerEvents = "none";
        if (openCardBtn) openCardBtn.style.display = "none";

        // Create GSAP Timeline
        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" }
        });

        // Step 1: Fade out the intro prompt text
        tl.to(introText, {
            opacity: 0,
            y: -15,
            duration: 0.4,
            onComplete: () => {
                introText.style.display = "none";
            }
        })

            // Step 2: Rotate envelope top flap 180deg and fade out wax seal
            .to(waxSeal, {
                scale: 0,
                opacity: 0,
                duration: 0.3
            }, "-=0.2")
            .to(envelopeFlap, {
                rotateX: 180,
                duration: 0.6,
                ease: "power3.inOut"
            }, "-=0.3")

            // Step 3: Slide letter up out of the envelope pocket
            .to(letter, {
                y: -130,
                duration: 0.7,
                ease: "power3.out"
            })

            // Step 4: Promote letter Z-index so it sits cleanly above the envelope base
            .set(letter, {
                zIndex: 10
            })

            // Step 5: Expand letter into full card view
            .to(letter, {
                y: -40,
                width: "100%",
                maxWidth: "440px",
                height: "auto",
                duration: 0.6,
                ease: "back.out(1.2)",
                onStart: () => {
                    letter.classList.add("is-open");
                },
                onComplete: () => {
                    // Trigger celebratory confetti burst when fully open!
                    triggerConfetti();
                }
            });
    }

    // Event Listeners for opening
    envelopeWrapper.addEventListener("click", openCard);
    if (openCardBtn) {
        openCardBtn.addEventListener("click", openCard);
    }

    // Event Listener for the internal confetti button
    if (celebrateBtn) {
        celebrateBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent bubbling
            triggerConfetti();
        });
    }

    // 7. Ambient Background Floating Generator
    function initAmbientBackground() {
        const container = document.getElementById("ambient-container");
        const icons = ['✨', '🎈', '🎂', '🎉', '🥳'];
        const count = 15;

        for (let i = 0; i < count; i++) {
            const item = document.createElement("div");
            item.className = "floating-item";
            item.textContent = icons[Math.floor(Math.random() * icons.length)];

            // Random starting positions and animation speeds
            const randomLeft = Math.random() * 100;
            const randomDuration = 15 + Math.random() * 18; // 12s to 30s
            const randomDelay = Math.random() * 10;
            const randomSize = 0.8 + Math.random() * 0.9;

            item.style.left = `${randomLeft}%`;
            item.style.fontSize = `${randomSize}rem`;
            item.style.animation = `floatUp ${randomDuration}s linear infinite`;
            item.style.animationDelay = `-${randomDelay}s`;

            container.appendChild(item);
        }

        // Inject dynamic CSS keyframes for floating
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        15% {
          opacity: 0.6;
        }
        85% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-120vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(styleSheet);
    }
});
