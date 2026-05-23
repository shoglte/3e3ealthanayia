const audio = document.getElementById("quranAudio");
let playCount = 0; // عداد لحساب عدد مرات التشغيل

// دالة ذكية لتشغيل الصوت والتعامل مع قيود المتصفح
function tryToPlayAudio() {
    if (playCount === 0) {
        audio.play().then(() => {
            playCount = 1; // تم تشغيل المرة الأولى بنجاح
        }).catch(err => {
            console.log("المتصفح حظر التشغيل التلقائي الصامت. سيتم التشغيل التلقائي فور أول حركة للمستخدم بالصفحة.");
        });
    }
}

// 1. محاولة التشغيل فور تحميل الهيكل (DOM)
window.addEventListener('DOMContentLoaded', () => {
    tryToPlayAudio();
});

// 2. الحل السحري: تشغيل الصوت تلقائياً بمجرد أن يتحرك المستخدم أو يضغط في أي مكان بالموقع
const interactionEvents = ['click', 'touchstart', 'mousemove', 'keydown'];
function handleFirstInteraction() {
    if (playCount === 0) {
        audio.play().then(() => {
            playCount = 1;
            // تنظيف المستمعين لعدم تكرار الكود مع كل حركة
            removeInteractionListeners();
        }).catch(err => console.log("في انتظار تفاعل حقيقي من المستخدم..."));
    } else {
        removeInteractionListeners();
    }
}

function removeInteractionListeners() {
    interactionEvents.forEach(event => {
        document.body.removeEventListener(event, handleFirstInteraction);
    });
}

// تفعيل مراقبة حركة المستخدم فوراً
interactionEvents.forEach(event => {
    document.body.addEventListener(event, handleFirstInteraction, { once: true });
});


// ==========================================
// منطق مراقبة انتهاء الصوت لتشغيله للمرة الثانية والأخيرة
// ==========================================
audio.addEventListener('ended', () => {
    if (playCount < 2) {
        playCount++;           // زيادة العداد للمرة الثانية
        audio.currentTime = 0; // إعادة التراك الصوتي من البداية
        audio.play().catch(err => console.log("خطأ في تشغيل المرة الثانية:", err));
    } else {
        console.log("تم تشغيل الآية الكريمة مرتين بنجاح وتوقفت تلقائياً.");
    }
});


// ==========================================
// منطق العداد التنازلي السنوي الذكي (دون تعديل)
// ==========================================
function getTargetTargetDate() {
    const now = new Date();
    let currentYear = now.getFullYear();
    
    let target = new Date(`June 21, ${currentYear} 07:00:00`);
    let endOfBattle = new Date(target.getTime() + (30 * 24 * 60 * 60 * 1000));

    if (now.getTime() > endOfBattle.getTime()) {
        target = new Date(`June 21, ${currentYear + 1} 07:00:00`);
    }
    
    return target;
}

let targetDate = getTargetTargetDate().getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const currentTargetYear = new Date(targetDate).getFullYear();
    const battleStartTime = new Date(`June 21, ${currentTargetYear} 07:00:00`).getTime();
    const battleEndTime = battleStartTime + (30 * 24 * 60 * 60 * 1000);

    if (now >= battleStartTime && now <= battleEndTime) {
        document.getElementById("countdownBox").style.display = "none";
        document.getElementById("mainTitle").style.display = "none";
        document.getElementById("battleMsg").style.display = "block";
        return;
    }

    if (now > battleEndTime) {
        targetDate = getTargetTargetDate().getTime();
        document.getElementById("countdownBox").style.display = "flex";
        document.getElementById("mainTitle").style.display = "block";
        document.getElementById("battleMsg").style.display = "none";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();
