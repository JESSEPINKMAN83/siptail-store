export const dynamic = "force-dynamic";

export default function AccessibilityPage() {
  return (
    <div style={{ background: "#F5F4F0" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
          הצהרת נגישות | Accessibility Statement
        </h1>
        <p className="text-sm mb-10" style={{ color: "#6B7280" }}>עודכן: אוגוסט 2026 | Updated: August 2026</p>

        {/* Hebrew */}
        <div className="mb-12" dir="rtl">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "#1B4332" }}>עברית</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#1A1A1A" }}>
            <p>Walk Essentials מחויבת להנגשת אתר האינטרנט שלה לאנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות (תשנ"ח-1998) ותקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013.</p>
            <p>האתר תואם לרמת AA של תקן WCAG 2.1 לנגישות אינטרנט.</p>
            <h3 className="font-bold" style={{ fontFamily: "Georgia, serif" }}>אמצעי נגישות באתר:</h3>
            <ul className="list-disc mr-5 space-y-1">
              <li>ניתן להגדיל או להקטין את גודל הטקסט באמצעות לחצני הנגישות</li>
              <li>ניגודיות צבעים גבוהה זמינה דרך תפריט הנגישות</li>
              <li>כל הכפתורים והאלמנטים הפעילים נגישים למקלדת</li>
              <li>האתר תומך בקוראי מסך</li>
              <li>כל התמונות כוללות תיאור חלופי (alt text)</li>
            </ul>
            <h3 className="font-bold" style={{ fontFamily: "Georgia, serif" }}>פנייה לרכז הנגישות:</h3>
            <p>נתקלת בבעיית נגישות? אנחנו כאן לעזור.</p>
            <p>אימייל: <a href="mailto:hello@walkessentials.com" className="underline" style={{ color: "#1B4332" }}>hello@walkessentials.com</a></p>
            <p>שעות מענה: א׳–ה׳ 9:00–18:00</p>
          </div>
        </div>

        <hr style={{ borderColor: "#D4E6D4" }} className="mb-12" />

        {/* English */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "#1B4332" }}>English</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#1A1A1A" }}>
            <p>Walk Essentials is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
            <p>This site conforms to WCAG 2.1 Level AA accessibility guidelines.</p>
            <h3 className="font-bold" style={{ fontFamily: "Georgia, serif" }}>Accessibility features:</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Text size can be increased or decreased using the accessibility menu</li>
              <li>High contrast mode available via the accessibility widget</li>
              <li>All interactive elements are keyboard-navigable</li>
              <li>Screen reader compatible</li>
              <li>All images include descriptive alt text</li>
            </ul>
            <h3 className="font-bold" style={{ fontFamily: "Georgia, serif" }}>Contact our accessibility coordinator:</h3>
            <p>If you experience an accessibility barrier, please reach out:</p>
            <p>Email: <a href="mailto:hello@walkessentials.com" className="underline" style={{ color: "#1B4332" }}>hello@walkessentials.com</a></p>
            <p>Response hours: Sun–Thu 9:00–18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
