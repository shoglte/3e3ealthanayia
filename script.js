const audio = document.getElementById("quranAudio");

// محاولة تشغيل الصوت تلقائياً بمجرد تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    audio.play().catch(err => {
        console.log("المتصفح حظر التشغيل التلقائي الصامت. سيتم التشغيل مع أول نقرة على الشاشة.");
        // حل احتياطي: يشتغل الصوت فوراً إذا لمس المستخدم أي مكان بالصفحة
        document.body.addEventListener('click', () => {
            audio.play();
        }, { once: true });
    });
});

function getTargetTargetDate() {
    const now = new Date();
    let currentYear = now.getFullYear();
    
    // تحديد هدف هذا العام ليكون 21 يونيو الساعة 7 صباحاً
    let target = new Date(`June 21, ${currentYear} 07:00:00`);
    
    // حساب موعد نهاية المعركة (بعد شهر كامل من بداية الامتحان)
    let endOfBattle = new Date(target.getTime() + (30 * 24 * 60 * 60 * 1000));

    // إذا كان الوقت الحالي بعد نهاية معركة هذا العام، ننتقل تلقائياً للعام القادم
    if (now.getTime() > endOfBattle.getTime()) {
        target = new Date(`June 21, ${currentYear + 1} 07:00:00`);
    }
    
    return target;
}

// جلب التاريخ المستهدف ذكياً
let targetDate = getTargetTargetDate().getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // حساب موعد نهاية المعركة بناءً على التاريخ الحالي المستهدف
    const currentTargetYear = new Date(targetDate).getFullYear();
    const battleStartTime = new Date(`June 21, ${currentTargetYear} 07:00:00`).getTime();
    const battleEndTime = battleStartTime + (30 * 24 * 60 * 60 * 1000); // بعد شهر

    // حالة 1: وقت الامتحانات شغال حالياً (بين 21 يونيو ونهاية الشهر)
    if (now >= battleStartTime && now <= battleEndTime) {
        document.getElementById("countdownBox").style.display = "none";
        document.getElementById("mainTitle").style.display = "none";
        document.getElementById("battleMsg").style.display = "block";
        return;
    }

    // حالة 2: انتهى الشهر تماماً، نقوم بتحديث الهدف للسنة الجديدة وتدمير الحالة القديمة
    if (now > battleEndTime) {
        targetDate = getTargetTargetDate().getTime(); // تحديث التاريخ للسنة القادمة
        document.getElementById("countdownBox").style.display = "flex";
        document.getElementById("mainTitle").style.display = "block";
        document.getElementById("battleMsg").style.display = "none";
        return;
    }

    // الحسابات الطبيعية للعداد قبل الامتحان
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // إظهار الأرقام بشكل متناسق ثنائي الخانات
    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}

// تحديث اللوب كل ثانية واحدة
setInterval(updateCountdown, 1000);
updateCountdown();