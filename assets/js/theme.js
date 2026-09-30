export const themeManager = {
    currentTheme: 'neon',
    wrapped: document.querySelector('.wrapped'),

    /* Giao diện đầu game, xử lý chuyển theme */
    toggle (btn) {
        const isNeon = this.wrapped.classList.contains("theme-neon");
        if (isNeon) {
            this.wrapped.classList.replace("theme-neon", "theme-arcade");
            if(btn) btn.textContent = "Cyber Neon";
            this.currentTheme = 'arcade';
        } else {
            this.wrapped.classList.replace("theme-arcade", "theme-neon");
            if(btn) btn.textContent = "Retro Arcade";
            this.currentTheme = 'neon';
        }
        
        return this.currentTheme;
    }
}