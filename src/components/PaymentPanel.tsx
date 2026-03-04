import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PaymentPanel.module.css";
import { formatEuro } from "../utils/currency";
import type { Product } from "../data/products";
import { useLang } from "../context/LanguageContext";

type Screen =
  | "idle"          // Choose Card or SeuroPay
  | "seuropay"      // Choose SeuroPay NFC or QR
  | "nfc"           // Tap NFC screen
  | "qr"            // Scan QR screen
  | "card"          // Card terminal screen
  | "processing"
  | "success"
  | "declined";

interface PaymentPanelProps {
  total: number;
  items: Product[];
  subtotal: number;
  onNewOrder: () => void;
}

const QrCode: React.FC = () => (
  <svg viewBox="0 0 100 100" className={styles.qrSvg}>
    {[5, 18, 31, 44, 57, 70, 83].map((x) =>
      [5, 18, 31, 44, 57, 70, 83].map((y) => {
        const isCorner =
          (x <= 31 && y <= 31) || (x >= 57 && y <= 31) || (x <= 31 && y >= 57);
        if (isCorner) return null;
        const seed = (x * 31 + y * 17) % 7;
        if (seed < 3) return null;
        return <rect key={`${x}-${y}`} x={x} y={y} width={10} height={10} fill="#00c9a7" rx="1" />;
      })
    )}
    <rect x="4"  y="4"  width="36" height="36" rx="4" fill="none" stroke="#00c9a7" strokeWidth="4" />
    <rect x="60" y="4"  width="36" height="36" rx="4" fill="none" stroke="#00c9a7" strokeWidth="4" />
    <rect x="4"  y="60" width="36" height="36" rx="4" fill="none" stroke="#00c9a7" strokeWidth="4" />
    <rect x="10" y="10" width="24" height="24" rx="2" fill="#00c9a7" />
    <rect x="66" y="10" width="24" height="24" rx="2" fill="#00c9a7" />
    <rect x="10" y="66" width="24" height="24" rx="2" fill="#00c9a7" />
  </svg>
);

const PaymentPanel: React.FC<PaymentPanelProps> = ({
  total,
  items,
  subtotal,
  onNewOrder,
}) => {
  const { t } = useLang();
  const [screen, setScreen] = useState<Screen>("idle");
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [customerCard, setCustomerCard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerPayment = useCallback(() => {
    // Clear any pending auto-timer and countdown before processing
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    // Capture which method was used
    setPaymentMethod(screen === "card" ? "Card" : screen === "nfc" ? "SeuroPay NFC" : "SeuroPay QR");
    setScreen("processing");
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        // Generate receipt metadata
        const rnd9 = () => Math.floor(100000000 + Math.random() * 900000000).toString();
        const rnd19 = () => Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join("");
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const dateStr = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        setReceiptNo(rnd9());
        setReceiptDate(dateStr);
        setCustomerCard(rnd19());
      }
      setScreen(success ? "success" : "declined");
    }, 2400);
  }, [screen]);

  // Start 7-second auto-trigger when on nfc or qr screen
  useEffect(() => {
    if (screen !== "nfc" && screen !== "qr") return;

    autoTimerRef.current = setTimeout(() => {
      triggerPayment();
    }, 7000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [screen, triggerPayment]);

  const handleReset = () => {
    setScreen("idle");
    onNewOrder();
  };

  /* ── Header shared across idle / seuropay / card / nfc / qr ── */
  const Header = ({ onBack }: { onBack?: () => void }) => (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack} aria-label="Back">
            ‹
          </button>
        )}
        <h2 className={styles.title}>{t.payment}</h2>
      </div>
      <div className={styles.dueAmount}>{formatEuro(total)}</div>
    </div>
  );

  /* ─────────────── PROCESSING ─────────────── */
  if (screen === "processing") {
    return (
      <div className={styles.container}>
        <div className={styles.statusScreen}>
          <div className={styles.processingSpinner} />
          <p className={styles.statusTitle}>{t.processing}</p>
          <p className={styles.statusSub}>{t.pleaseWait}</p>
        </div>
      </div>
    );
  }

  /* ─────────────── SUCCESS ─────────────── */
  if (screen === "success") {
    const subtotalExVat = parseFloat((subtotal / (1 + 0.24)).toFixed(2));
    const vatAmt = parseFloat((subtotal - subtotalExVat).toFixed(2));
    return (
      <div className={styles.container}>
        <div className={`${styles.statusScreen} ${styles.successScreen}`}>
          <div className={styles.checkIcon}>✓</div>
          <p className={styles.statusTitle}>{t.approved}</p>
          <p className={styles.statusSub}>{formatEuro(total)} {t.paid}</p>

          {/* ── Full Estonian-style receipt ── */}
          <div className={styles.receipt}>
            {/* Shop name */}
            <p className={styles.receiptShopName}>{t.receiptShopName}</p>

            {/* Product table */}
            <table className={styles.receiptTable}>
              <thead>
                <tr>
                  <th className={styles.receiptTh}>{t.receiptProduct}</th>
                  <th className={`${styles.receiptTh} ${styles.receiptThRight}`}>{t.receiptQty}</th>
                  <th className={`${styles.receiptTh} ${styles.receiptThRight}`}>{t.receiptTotal}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={styles.receiptTr}>
                    <td className={styles.receiptTd}>{item.name.toUpperCase()}</td>
                    <td className={`${styles.receiptTd} ${styles.receiptTdRight}`}>{item.quantity}</td>
                    <td className={`${styles.receiptTd} ${styles.receiptTdRight}`}>{formatEuro(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.receiptDivider} />

            {/* Grand total row */}
            <div className={`${styles.receiptRow} ${styles.receiptGrandTotal}`}>
              <span>{t.receiptTotal}</span>
              <span>{formatEuro(total)}</span>
            </div>

            <div className={styles.receiptDivider} />

            {/* VAT breakdown section */}
            <table className={styles.receiptTable}>
              <thead>
                <tr>
                  <th className={styles.receiptTh}>{t.receiptVatPct}</th>
                  <th className={`${styles.receiptTh} ${styles.receiptThRight}`}>{t.receiptTotalWithoutVat}</th>
                  <th className={`${styles.receiptTh} ${styles.receiptThRight}`}>{t.receiptVatAmount}</th>
                  <th className={`${styles.receiptTh} ${styles.receiptThRight}`}>{t.receiptTotalWithVat}</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.receiptTr}>
                  <td className={styles.receiptTd}>{t.receiptVatLabel}</td>
                  <td className={`${styles.receiptTd} ${styles.receiptTdRight}`}>{formatEuro(subtotalExVat)}</td>
                  <td className={`${styles.receiptTd} ${styles.receiptTdRight}`}>{formatEuro(vatAmt)}</td>
                  <td className={`${styles.receiptTd} ${styles.receiptTdRight}`}>{formatEuro(total)}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.receiptDivider} />

            {/* Payment method section */}
            <div className={styles.receiptSection}>
              <div className={`${styles.receiptRow} ${styles.receiptSectionHeader}`}>
                <span>{t.receiptPaymentMethod}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>{paymentMethod}</span>
                <span className={styles.receiptValue}>{formatEuro(total)}</span>
              </div>
            </div>

            <div className={styles.receiptDivider} />

            {/* Receipt metadata */}
            <div className={styles.receiptSection}>
              <div className={`${styles.receiptRow} ${styles.receiptSectionHeader}`}>
                <span>{t.receiptReceiptNo}</span>
                <span className={styles.receiptValue}>{receiptNo}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>{t.receiptDate}</span>
                <span className={styles.receiptValue}>{receiptDate}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>{t.receiptCustomerCard}</span>
                <span className={`${styles.receiptValue} ${styles.receiptCustomerCard}`}>{customerCard}</span>
              </div>
            </div>
          </div>

          <button className={styles.newOrderBtn} onClick={handleReset}>
            {t.newOrder}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── DECLINED ─────────────── */
  if (screen === "declined") {
    return (
      <div className={styles.container}>
        <div className={`${styles.statusScreen} ${styles.declinedScreen}`}>
          <div className={styles.crossIcon}>✗</div>
          <p className={styles.statusTitle}>{t.declined}</p>
          <p className={styles.statusSub}>{t.tryAnother}</p>
          <button className={styles.retryBtn} onClick={() => setScreen("idle")}>
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── CARD SCREEN ─────────────── */
  if (screen === "card") {
    return (
      <div className={styles.container}>
        <Header onBack={() => setScreen("idle")} />
        <div className={styles.methodDetail}>
          <div className={styles.methodDetailIcon}>💳</div>
          <p className={styles.methodDetailTitle}>{t.cardTitle}</p>
          <p className={styles.methodDetailHint}>{t.cardHint}</p>
        </div>
        <div className={styles.paySection}>
          <button className={styles.payBtn} onClick={triggerPayment}>
            {t.chargeBtn} {formatEuro(total)}
          </button>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleReset}>
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── SEUROPAY SUB-MENU ─────────────── */
  if (screen === "seuropay") {
    return (
      <div className={styles.container}>
        <Header onBack={() => setScreen("idle")} />

        <div className={styles.seuropayHeader}>
          <div className={styles.seuropayBadge}>
            <span className={styles.seuropayBadgeIcon}>€</span>
            <span>SeuroPay · {formatEuro(total)}</span>
          </div>
          <p className={styles.seuropayTitle}>{t.chooseSeuropay}</p>
        </div>

        <div className={styles.seuropayList}>
          <button className={styles.seuropayOption} onClick={() => setScreen("nfc")}>
            <div className={styles.seuropayOptionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
            </div>
            <div className={styles.seuropayOptionText}>
              <span className={styles.seuropayOptionName}>{t.nfcName}</span>
              <span className={styles.seuropayOptionDesc}>{t.nfcDesc}</span>
            </div>
            <span className={styles.seuropayChevron}>›</span>
          </button>

          <button className={styles.seuropayOption} onClick={() => setScreen("qr")}>
            <div className={styles.seuropayOptionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
                <rect x="14" y="18" width="3" height="3" />
                <rect x="18" y="18" width="3" height="3" />
              </svg>
            </div>
            <div className={styles.seuropayOptionText}>
              <span className={styles.seuropayOptionName}>{t.qrName}</span>
              <span className={styles.seuropayOptionDesc}>{t.qrDesc}</span>
            </div>
            <span className={styles.seuropayChevron}>›</span>
          </button>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleReset}>
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── NFC SCREEN ─────────────── */
  if (screen === "nfc") {
    return (
      <div className={styles.container}>
        <Header onBack={() => setScreen("seuropay")} />
        <div className={styles.methodDetailClickable} onClick={triggerPayment} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && triggerPayment()}>
          <div className={styles.nfcRipple}>
            <div className={styles.nfcRippleRing} />
            <div className={styles.nfcRippleRing} />
            <div className={styles.nfcCore}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
            </div>
          </div>
          <p className={styles.methodDetailTitle}>{t.tapNfcTitle}</p>
          <p className={styles.methodDetailHint}>{t.tapNfcHint}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleReset}>
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── QR SCREEN ─────────────── */
  if (screen === "qr") {
    return (
      <div className={styles.container}>
        <Header onBack={() => setScreen("seuropay")} />
        <div className={styles.methodDetailClickable} onClick={triggerPayment} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && triggerPayment()}>
          <div className={styles.qrFrame}>
            <QrCode />
          </div>
          <p className={styles.methodDetailTitle}>{t.scanQrTitle}</p>
          <p className={styles.methodDetailHint}>{t.scanQrHint}</p>
          <div className={styles.qrAmount}>{formatEuro(total)}</div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleReset}>
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────── IDLE — main method picker ─────────────── */
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t.selectMethod}</p>
        <div className={styles.mainMethodList}>
          <button className={styles.mainMethodBtn} onClick={() => setScreen("card")}>
            <div className={styles.mainMethodLeft}>
              <div className={styles.mainMethodIcon}>💳</div>
              <div className={styles.mainMethodText}>
                <span className={styles.mainMethodName}>{t.payWithCard}</span>
                <span className={styles.mainMethodDesc}>{t.creditDebit}</span>
              </div>
            </div>
            <span className={styles.mainMethodChevron}>›</span>
          </button>

          <button className={styles.mainMethodBtn} onClick={() => setScreen("seuropay")}>
            <div className={styles.mainMethodLeft}>
              <div className={`${styles.mainMethodIcon} ${styles.seuropayIcon}`}>€</div>
              <div className={styles.mainMethodText}>
                <span className={styles.mainMethodName}>{t.payWithSeuropay}</span>
                <span className={styles.mainMethodDesc}>{t.seuropayNfcQr}</span>
              </div>
            </div>
            <span className={styles.mainMethodChevron}>›</span>
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={handleReset}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
};

export default PaymentPanel;
