const playlist = window.vlogPlaylist || [
    {
        title: "There Is a Light That Never Goes Out",
        artist: "The Smiths",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio(playlist[currentTrackIndex].url);

document.addEventListener('DOMContentLoaded', () => {
    // ===== MUSIC PLAYER =====
    const playBtn = document.querySelector('.controls .play');
    const prevBtn = document.querySelectorAll('.controls button')[0];
    const nextBtn = document.querySelectorAll('.controls button')[2];
    const titleEl = document.querySelector('.song-title');
    const artistEl = document.querySelector('.artist');
    const cdSpin = document.querySelector('.cd-spin');
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');

    function updateTrackInfo() {
        titleEl.textContent = playlist[currentTrackIndex].title;
        artistEl.textContent = playlist[currentTrackIndex].artist;
        audio.src = playlist[currentTrackIndex].url;
        if(isPlaying) {
            audio.play();
            cdSpin.style.animationPlayState = 'running';
        } else {
            cdSpin.style.animationPlayState = 'paused';
        }
    }

    playBtn.addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
            playBtn.textContent = '▶';
            cdSpin.style.animationPlayState = 'paused';
        } else {
            audio.play();
            playBtn.textContent = '⏸';
            cdSpin.style.animationPlayState = 'running';
        }
        isPlaying = !isPlaying;
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        updateTrackInfo();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        updateTrackInfo();
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
    });

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    updateTrackInfo();

    // ===== CALENDAR =====
    const calDays = document.getElementById('cal-days');
    const calMonthYear = document.getElementById('cal-month-year');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let currentDate = new Date();
    let displayMonth = currentDate.getMonth();
    let displayYear = currentDate.getFullYear();

    // Collect post dates from the blog entries on page
    const postDates = [];
    document.querySelectorAll('.entry-date').forEach(el => {
        const text = el.textContent.replace('Date: ', '').trim();
        const parsed = new Date(text);
        if (!isNaN(parsed.getTime())) {
            postDates.push({
                year: parsed.getFullYear(),
                month: parsed.getMonth(),
                day: parsed.getDate()
            });
        }
    });

    function hasPost(year, month, day) {
        return postDates.some(d => d.year === year && d.month === month && d.day === day);
    }

    function renderCalendar() {
        calMonthYear.textContent = `${monthNames[displayMonth]} ${displayYear}`;
        calDays.innerHTML = '';

        const firstDay = new Date(displayYear, displayMonth, 1).getDay();
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        const today = new Date();

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day empty';
            empty.textContent = '.';
            calDays.appendChild(empty);
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = d;

            if (d === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            if (hasPost(displayYear, displayMonth, d)) {
                dayEl.classList.add('has-post');
            }

            calDays.appendChild(dayEl);
        }
    }

    calPrev.addEventListener('click', () => {
        displayMonth--;
        if (displayMonth < 0) {
            displayMonth = 11;
            displayYear--;
        }
        renderCalendar();
    });

    calNext.addEventListener('click', () => {
        displayMonth++;
        if (displayMonth > 11) {
            displayMonth = 0;
            displayYear++;
        }
        renderCalendar();
    });

    renderCalendar();
});
