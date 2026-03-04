import { useState, useCallback } from "react";
import TopBar from "./components/TopBar";
import OrderSummary from "./components/OrderSummary";
import PaymentPanel from "./components/PaymentPanel";
import { generateRandomOrder } from "./data/products";
import { calcSubtotal, calcTax, calcTotal } from "./utils/currency";
import { LanguageProvider, useLang } from "./context/LanguageContext";
import logo from "./assets/seuropay-logo.svg";
import "./App.css";

type AppState = "scan" | "loading" | "ready";

/* ── Deterministic QR pattern (same seed logic as PaymentPanel) ── */
const ScanQr: React.FC = () => (
  <svg viewBox="0 0 100 100" className="scanQrSvg">
    {[5, 18, 31, 44, 57, 70, 83].map((x) =>
      [5, 18, 31, 44, 57, 70, 83].map((y) => {
        const isCorner =
          (x <= 31 && y <= 31) || (x >= 57 && y <= 31) || (x <= 31 && y >= 57);
        if (isCorner) return null;
        const seed = (x * 31 + y * 17) % 7;
        if (seed < 3) return null;
        return <rect key={`${x}-${y}`} x={x} y={y} width={10} height={10} fill="white" rx="1" />;
      })
    )}
    <rect x="4"  y="4"  width="36" height="36" rx="4" fill="none" stroke="white" strokeWidth="4" />
    <rect x="60" y="4"  width="36" height="36" rx="4" fill="none" stroke="white" strokeWidth="4" />
    <rect x="4"  y="60" width="36" height="36" rx="4" fill="none" stroke="white" strokeWidth="4" />
    <rect x="10" y="10" width="24" height="24" rx="2" fill="white" />
    <rect x="66" y="10" width="24" height="24" rx="2" fill="white" />
    <rect x="10" y="66" width="24" height="24" rx="2" fill="white" />
  </svg>
);

/* ── Inner app that can access LanguageContext ── */
function Inner() {
  const { t } = useLang();
  const [appState, setAppState] = useState<AppState>("scan");
  const [items, setItems] = useState(() => generateRandomOrder());

  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal);
  const total = calcTotal(subtotal, tax);

  /* When QR is tapped → loading → ready */
  const handleScanClick = useCallback(() => {
    setAppState("loading");
    setTimeout(() => setAppState("ready"), 1800);
  }, []);

  /* New Order → back to scan splash with a fresh order pre-generated */
  const handleNewOrder = useCallback(() => {
    setItems(generateRandomOrder());
    setAppState("scan");
  }, []);

  /* ── Scan splash ── */
  if (appState === "scan") {
    return (
      <div className="posRoot">
        <TopBar />
        <main className="scanMain" onClick={handleScanClick} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleScanClick()}>

          {/* Left — QR block */}
          <div className="scanLeft">
            <div className="scanQrWrap">
              <ScanQr />
            </div>
            <p className="scanPrompt">{t.scanPrompt}</p>
          </div>

          {/* Divider */}
          <div className="scanDivider" />

          {/* Right — hero text */}
          <div className="scanRight">
            <div className="scanHeroLogo">
              <img src={logo} alt="SeuroPay" className="scanHeroLogoImg" />
            </div>
            <h1 className="scanHeroTitle">SeuroPay</h1>
            <h2 className="scanHeroSub">Payment Eco-system</h2>
            <p className="scanHeroTagline">Fast · Secure · Cost Effective</p>
          </div>

          <footer className="scanFooter">
            <span className="scanFooterBrand">SeuroPay</span>
            <span className="scanFooterSep">·</span>
            <span className="scanFooterStore">Store #0042 · Terminal 1 · Tallinn, EE</span>
          </footer>
        </main>
      </div>
    );
  }

  /* ── Loading screen ── */
  if (appState === "loading") {
    return (
      <div className="posRoot">
        <TopBar />
        <main className="loadingMain">
          <div className="loadingSpinner" />
          <p className="loadingText">{t.loadingOrder}</p>
        </main>
      </div>
    );
  }

  /* ── Ready: two-panel POS ── */
  return (
    <div className="posRoot">
      <TopBar />
      <main className="posMain">
        <section className="posLeft">
          <OrderSummary items={items} subtotal={subtotal} tax={tax} total={total} />
        </section>
        <section className="posRight">
          <PaymentPanel
            total={total}
            items={items}
            subtotal={subtotal}
            onNewOrder={handleNewOrder}
          />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Inner />
    </LanguageProvider>
  );
}

export default App;
