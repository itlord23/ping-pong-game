/** file này tui sẽ đóng gói trình phát nhạc cho toàn bộ trò chơi */
export const audioManager = {
    isUnlocked: false,
    activeTrack: null,
    tracks : {
        neon : {
            menu : new Audio('./assets/audio/retro.mkv'),
            game : new Audio('')
        },
        arcade : {
            menu: new Audio('./assets/audio/aka.mkv'),
            game: new Audio('./assets/audio/practice.mkv')
        }
    },
    
    init(getCurrentTheme) {
        Object.values(this.tracks).forEach(themeObj => {
            Object.values(themeObj).forEach(audio => {
                audio.loop = true;
                audio.volume = 0.4;
            });
        });
        /** Xử lý unlocked event */
        this.handleUnlockedEvents(getCurrentTheme);    
    },

    handleUnlockedEvents(getCurrentTheme) {
        const unlock = () => {
            this.isUnlocked = true;

            const theme = getCurrentTheme ? getCurrentTheme() : 'neon';
            this.play(theme, 'menu');
            document.removeEventListener('click', unlock);
        }

        document.addEventListener('click', unlock);
    },

    play(theme, type) {
        if(!this.isUnlocked) return;

        /** Đang phát */
        if(this.activeTrack) {
            this.activeTrack.pause();
            this.activeTrack.currentTime = 0;
        }

        const track = this.tracks[theme]?.[type]
        if(track) {
            this.activeTrack = track;
            track.play().catch(() => {});
        }
    }
}
