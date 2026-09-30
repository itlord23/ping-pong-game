
import { audioManager } from "./audio.js";
import { themeManager } from "./theme.js";

const app = {
    elements: {
        startBtn: document.getElementById("start-btn"),
        toggleBtn: document.getElementById("theme-switcher"),
        subtitle: document.getElementById("overlay-subtitle")
    },

    handleEvents() {
        const {startBtn, toggleBtn, subtitle} = this.elements;
        startBtn.addEventListener('click', () => {
            /** Xử lý phát nhạc bắt đầu game: Để sau */
            if(subtitle) {
                subtitle.style.display = "none";
            }
        });

        toggleBtn.addEventListener('click', (e) => {
            const currentTheme = themeManager.toggle(e.currentTarget);
            /** */
            audioManager.play(currentTheme, 'menu');
        });
    },

    start() {
        audioManager.init(() => themeManager.currentTheme);

        this.handleEvents();
    }
};

app.start();