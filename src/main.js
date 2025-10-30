import './style.css'

const stack = document.getElementById('cardStack');
const cards = Array.from(stack.children);

    cards.forEach((card, index) => {
      card.style.zIndex = cards.length - index;
      initDrag(card);
    });

    function initDrag(card) {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      let moved = false;

      const startDrag = (e) => {
        isDragging = true;
        moved = false;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
      };

      const duringDrag = (e) => {
        if (!isDragging) return;
        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - startX;

        if (Math.abs(deltaX) > 5) moved = true;

        if (moved) {
          card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
        }
      };

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.transition = 'transform 0.3s ease-out';
        card.style.cursor = 'grab';

        const deltaX = currentX - startX;

        if (moved && Math.abs(deltaX) > 120) {
          const direction = deltaX > 0 ? 1 : -1;
          card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 45}deg)`;

         
          const audio = card.querySelector("audio");
            if (audio) {
             audio.pause();
             audio.currentTime = 0;
             const btn = card.querySelector(".play-btn");
            if (btn) btn.innerHTML = "▶ <span>Play</span>";
    }

         
          setTimeout(() => {
            card.style.transition = 'none';
            card.style.transform = 'translateX(0) rotate(0deg)';
            card.style.zIndex = 1;
            stack.appendChild(card); 
            updateZIndexes();
          }, 300);
        } else {
          card.style.transform = 'translateX(0) rotate(0deg)';
        }
      };

      card.addEventListener('mousedown', startDrag);
      card.addEventListener('mousemove', duringDrag);
      card.addEventListener('mouseup', endDrag);
      card.addEventListener('mouseleave', endDrag);

      card.addEventListener('touchstart', startDrag);
      card.addEventListener('touchmove', duringDrag);
      card.addEventListener('touchend', endDrag);
    }

    function updateZIndexes() {
      const allCards = Array.from(stack.children);
      allCards.forEach((c, i) => (c.style.zIndex = allCards.length - i));
    }

    // --- Play/Pause Buttons ---
    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".card");
        const audio = card.querySelector("audio");

        if (audio.paused) {
          document.querySelectorAll("audio").forEach(a => a.pause());
          audio.play();
          btn.innerHTML = "⏸ <span>Pause</span>";
        } else {
          audio.pause();
          btn.innerHTML = "▶ <span>Play</span>";
        }
      });
    });