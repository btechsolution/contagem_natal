/* ==========================================================================
   1. CONTAGEM REGRESSIVA AUTOMÁTICA E DINÂMICA
   ========================================================================== */
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const targetDateText = document.getElementById('targetDateText');
const christmasMessage = document.getElementById('christmasMessage');

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Define a data alvo para 25 de Dezembro às 00:00:00
    let christmasDate = new Date(currentYear, 11, 25, 0, 0, 0);

    // Se já tiver passado do dia 25 de Dezembro neste ano, calcula para o próximo ano!
    if (now > new Date(currentYear, 11, 25, 23, 59, 59)) {
        christmasDate = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }

    targetDateText.innerText = `RUMO AO NATAL DE ${christmasDate.getFullYear()} 🎅`;

    const diff = christmasDate - now;

    // Se for exatamente o dia 25 de Dezembro
    if (now.getMonth() === 11 && now.getDate() === 25) {
        daysEl.innerText = "00";
        hoursEl.innerText = "00";
        minutesEl.innerText = "00";
        secondsEl.innerText = "00";
        christmasMessage.innerHTML = "🎉 HO HO HO! FELIZ NATAL! 🎁<br><span class='text-xl text-white'>Que seu dia seja repleto de presentes, amor e alegria!</span>";
        return;
    }

    // Cálculos matemáticos de tempo
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.innerText = d < 10 ? '0' + d : d;
    hoursEl.innerText = h < 10 ? '0' + h : h;
    minutesEl.innerText = m < 10 ? '0' + m : m;
    secondsEl.innerText = s < 10 ? '0' + s : s;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================================
   2. PISCA-PISCA DINÂMICO
   ========================================================================== */
const lightString = document.getElementById('lightString');
const lightCount = Math.floor(window.innerWidth / 22);
for (let i = 0; i < lightCount; i++) {
    const bulb = document.createElement('div');
    bulb.className = 'bulb';
    lightString.appendChild(bulb);
}

/* ==========================================================================
   3. CANVAS DE NEVE INTENSA + BRILHOS
   ========================================================================== */
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const numFlakes = Math.min(width < 768 ? 80 : 150, 180);
const flakes = [];

for (let i = 0; i < numFlakes; i++) {
    flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3.5 + 1,
        speedY: Math.random() * 2 + 0.8,
        speedX: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.8 + 0.2,
        isSparkle: Math.random() > 0.7 // Algumas partículas brilham como ouro
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.isSparkle ? `rgba(255, 215, 0, ${f.opacity})` : `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        f.y += f.speedY;
        f.x += f.speedX;

        if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
        }
    }
    requestAnimationFrame(drawSnow);
}
drawSnow();

/* ==========================================================================
   4. MÚSICA DE NATAL SUPER ANIMADA (WEB AUDIO API - We Wish You a Merry Christmas + Sinos)
   ========================================================================== */
let audioCtx = null;
let isPlaying = false;
let melodyTimeout = null;

// Frequências para notas festivas em tom alegre
const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Partitura animada com ritmo rápido de Natal
const christmasMelody = [
    // We Wish You a Merry Christmas
    { n: N.D4, d: 200 }, { n: N.G4, d: 200 }, { n: N.G4, d: 100 }, { n: N.A4, d: 100 }, { n: N.G4, d: 100 }, { n: N.F4, d: 100 },
    { n: N.E4, d: 200 }, { n: N.C4, d: 200 }, { n: N.E4, d: 200 },
    { n: N.A4, d: 200 }, { n: N.A4, d: 100 }, { n: N.B4, d: 100 }, { n: N.A4, d: 100 }, { n: N.G4, d: 100 },
    { n: N.F4, d: 200 }, { n: N.D4, d: 200 }, { n: N.F4, d: 200 },
    { n: N.B4, d: 200 }, { n: N.B4, d: 100 }, { n: N.C5, d: 100 }, { n: N.B4, d: 100 }, { n: N.A4, d: 100 },
    { n: N.G4, d: 200 }, { n: N.E4, d: 200 }, { n: N.D4, d: 100 }, { n: N.D4, d: 100 },
    { n: N.E4, d: 200 }, { n: N.A4, d: 200 }, { n: N.F4, d: 200 }, { n: N.G4, d: 400 },

    // Jingle Bells Rápido
    { n: N.E4, d: 150 }, { n: N.E4, d: 150 }, { n: N.E4, d: 300 },
    { n: N.E4, d: 150 }, { n: N.E4, d: 150 }, { n: N.E4, d: 300 },
    { n: N.E4, d: 150 }, { n: N.G4, d: 150 }, { n: N.C4, d: 200 }, { n: N.D4, d: 100 }, { n: N.E4, d: 500 }
];

let noteIdx = 0;

function playUpbeatTone(freq, duration) {
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Usando combinação de Sine + Triangle para efeito de sino de Natal brilhante
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration / 1000));

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + (duration / 1000));
    } catch (e) {
        console.log(e);
    }
}

function playNextMelodyNote() {
    if (!isPlaying) return;

    const item = christmasMelody[noteIdx];
    if (item.n) {
        playUpbeatTone(item.n, item.d);
    }

    noteIdx = (noteIdx + 1) % christmasMelody.length;
    melodyTimeout = setTimeout(playNextMelodyNote, item.d + 30);
}

const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const musicBtnText = document.getElementById('musicBtnText');

musicToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
        musicIcon.className = "fa-solid fa-pause text-2xl";
        musicBtnText.innerText = "PAUSAR MÚSICA ⏸️";
        musicToggleBtn.classList.add('scale-105');
        playNextMelodyNote();
    } else {
        musicIcon.className = "fa-solid fa-music text-2xl";
        musicBtnText.innerText = "LIGAR MÚSICA DE NATAL 🎵";
        musicToggleBtn.classList.remove('scale-105');
        clearTimeout(melodyTimeout);
    }
});