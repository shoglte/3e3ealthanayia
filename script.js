const audio = document.getElementById("quranAudio");
let playCount = 0;

// دالة ذكية لتشغيل الصوت والتعامل مع قيود المتصفح
function tryToPlayAudio() {
    if (playCount === 0) {
        audio.play().then(() => {
            playCount = 1;
        }).catch(err => {
            console.log("المتصفح حظر التشغيل التلقائي الصامت. سيتم التشغيل التلقائي فور أول حركة للمستخدم بالصفحة.");
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    tryToPlayAudio();
});

const interactionEvents = ['click', 'touchstart', 'mousemove', 'keydown'];
function handleFirstInteraction() {
    if (playCount === 0) {
        audio.play().then(() => {
            playCount = 1;
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

interactionEvents.forEach(event => {
    document.body.addEventListener(event, handleFirstInteraction, { once: true });
});

audio.addEventListener('ended', () => {
    if (playCount < 2) {
        playCount++;
        audio.currentTime = 0;
        audio.play().catch(err => console.log("خطأ في تشغيل المرة الثانية:", err));
    } else {
        console.log("تم تشغيل الآية الكريمة مرتين بنجاح وتوقفت تلقائياً.");
    }
});

// ==========================================
// دوال العداد التنازلي بعد التعديل
// ==========================================
function getTargetDate() {
    const now = new Date();
    let currentYear = now.getFullYear();
    
    // الهدف الآن: 21 يونيو الساعة 00:00:00 (منتصف الليل)
    let target = new Date(`June 21, ${currentYear} 00:00:00`);
    
    // نهاية المعركة: 30 يوم كامل من بداية 21 يونيو 00:00
    let endOfBattle = new Date(target.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    // إذا كنا قد تجاوزنا نهاية المعركة ننتقل للعام القادم
    if (now.getTime() > endOfBattle.getTime()) {
        target = new Date(`June 21, ${currentYear + 1} 00:00:00`);
    }
    
    return target;
}

let targetDate = getTargetDate().getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const battleStart = targetDate;                     // 21 يونيو 00:00
    const yellowEnd = battleStart + (7 * 60 * 60 * 1000); // 21 يونيو 07:00 صباحاً
    const battleEnd = battleStart + (30 * 24 * 60 * 60 * 1000); // بعد 30 يوم
    
    const countdownBox = document.getElementById("countdownBox");
    const mainTitle = document.getElementById("mainTitle");
    const battleMsg = document.getElementById("battleMsg");
    const yellowMsg = document.getElementById("yellowMsg"); // عنصر جديد لرسالة الاصفرار
    
    // المرحلة الصفراء: من 00:00 حتى 07:00
    if (now >= battleStart && now < yellowEnd) {
        // إظهار اللون الأصفر على كامل الموقع
        document.body.classList.add("yellow-phase");
        
        // إخفاء العداد والعنوان الرئيسي
        if (countdownBox) countdownBox.style.display = "none";
        if (mainTitle) mainTitle.style.display = "none";
        if (battleMsg) battleMsg.style.display = "none";
        if (yellowMsg) yellowMsg.style.display = "block";
        return;
    } else {
        // إزالة اللون الأصفر إذا خرجنا من المرحلة
        document.body.classList.remove("yellow-phase");
        if (yellowMsg) yellowMsg.style.display = "none";
    }
    
    // مرحلة المعركة: من 07:00 حتى نهاية الـ 30 يوماً
    if (now >= yellowEnd && now <= battleEnd) {
        if (countdownBox) countdownBox.style.display = "none";
        if (mainTitle) mainTitle.style.display = "none";
        if (battleMsg) battleMsg.style.display = "block";
        return;
    }
    
    // إذا كنا بعد نهاية المعركة، نعيد تحديد هدف السنة القادمة
    if (now > battleEnd) {
        targetDate = getTargetDate().getTime();
        // نعيد إظهار العد التنازلي للدورة الجديدة
        if (countdownBox) countdownBox.style.display = "flex";
        if (mainTitle) mainTitle.style.display = "block";
        if (battleMsg) battleMsg.style.display = "none";
        // نعيد حساب القيم للعرض
        const newTarget = targetDate;
        const difference = newTarget - now;
        updateDisplay(difference);
        return;
    }
    
    // الحالة العادية: العد التنازلي مستمر
    if (countdownBox) countdownBox.style.display = "flex";
    if (mainTitle) mainTitle.style.display = "block";
    if (battleMsg) battleMsg.style.display = "none";
    
    const difference = targetDate - now;
    updateDisplay(difference);
}

function updateDisplay(difference) {
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
