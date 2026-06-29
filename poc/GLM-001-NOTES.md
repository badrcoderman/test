# GLM-001 WebPage::close notes

Target: `Source/WebKit/WebProcess/WebPage/WebPage.cpp`, `WebPage::close`.

No normal HTML PoC was created for this target. The suspicious source shape is in WebKit WebProcess page teardown:

```text
WebPage::close()
  -> WebProcess::singleton().removeWebPage(m_identifier)
  -> comment says the WebPage can be destroyed by this call
  -> function then reads m_processDisplayName for updateActivePages(...)
```

This appears to require WebKit UIProcess/WebProcess close-page orchestration rather than a direct DOM/browser-page primitive. A browser-loadable HTML file would only request ordinary navigation/window close behavior and would not prove that the specific `WebPage::close` path is reached or that the last ref is dropped at the suspicious point.

Recommended next validation: source patch or debugger/ASan instrumentation around `WebPage::close`, or a WebKit API/UIProcess harness that can deterministically invoke `WebPage::close` and observe lifetime after `removeWebPage(m_identifier)`.
