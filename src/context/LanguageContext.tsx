import React, { createContext, useContext, useState } from "react";

export type Lang = "EST" | "ENG";

export const LABELS: Record<Lang, Record<string, string>> = {
  ENG: {
    orderSummary: "Order Summary",
    items: "items",
    subtotal: "Subtotal",
    vat: "VAT (24%)",
    total: "Total",
    payment: "Payment",
    selectMethod: "Select Method",
    payWithCard: "Pay with Card",
    creditDebit: "Credit or Debit Card",
    payWithSeuropay: "Pay with SeuroPay",
    seuropayNfcQr: "NFC or QR via SeuroPay App",
    chooseSeuropay: "Choose SeuroPay Method",
    nfcName: "SeuroPay NFC",
    nfcDesc: "Tap your phone to pay",
    qrName: "SeuroPay QR",
    qrDesc: "Scan QR code with your app",
    tapNfcTitle: "Tap SeuroPay App with NFC Terminal",
    tapNfcHint: "Hold your phone near the NFC terminal to complete payment",
    scanQrTitle: "Scan QR in SeuroPay App and Pay",
    scanQrHint: "Open SeuroPay, tap Scan & Pay, then scan this code",
    chargeBtn: "Charge",
    processing: "Processing Payment…",
    pleaseWait: "Please wait",
    approved: "Payment Approved",
    paid: "paid",
    receipt: "Receipt",
    newOrder: "New Order",
    declined: "Payment Declined",
    tryAnother: "Please try another method",
    tryAgain: "Try Again",
    cancel: "Cancel & New Order",
    cardTitle: "Pay with Card",
    cardHint: "Insert, tap or swipe your card on the terminal below",
    each: "each",
    scanPrompt: "Scan to start your order",
    scanSub: "Point your phone camera at the QR code",
    loadingOrder: "Loading order summary…",
    receiptShopName: "Grocery Shop",
    receiptProduct: "Product",
    receiptQty: "Qty",
    receiptTotal: "Total",
    receiptVatPct: "VAT %",
    receiptTotalWithoutVat: "Total without VAT",
    receiptVatAmount: "VAT",
    receiptTotalWithVat: "Total with VAT",
    receiptVatLabel: "VAT 24 %",
    receiptPaymentMethod: "Payment method",
    receiptReceiptNo: "Receipt no",
    receiptDate: "Date",
    receiptCustomerCard: "Customer card",
  },
  EST: {
    orderSummary: "Tellimuse kokkuvõte",
    items: "toodet",
    subtotal: "Vahesumma",
    vat: "KM (24%)",
    total: "Kokku",
    payment: "Makse",
    selectMethod: "Vali meetod",
    payWithCard: "Maksa kaardiga",
    creditDebit: "Krediit- või deebetkaart",
    payWithSeuropay: "Maksa SeuroPay'ga",
    seuropayNfcQr: "NFC või QR SeuroPay rakendusega",
    chooseSeuropay: "Vali SeuroPay meetod",
    nfcName: "SeuroPay NFC",
    nfcDesc: "Puuduta telefoniga maksmiseks",
    qrName: "SeuroPay QR",
    qrDesc: "Skaneeri QR-kood rakendusega",
    tapNfcTitle: "Puuduta SeuroPay rakendusega NFC terminali",
    tapNfcHint: "Hoidke telefoni NFC terminali lähedal makse sooritamiseks",
    scanQrTitle: "Skaneeri QR SeuroPay rakenduses ja maksa",
    scanQrHint: "Ava SeuroPay, vajuta Skaneeri ja maksa, seejärel skaneeri kood",
    chargeBtn: "Võta",
    processing: "Makse töötlemisel…",
    pleaseWait: "Palun oodake",
    approved: "Makse kinnitatud",
    paid: "makstud",
    receipt: "Kviitung",
    newOrder: "Uus tellimus",
    declined: "Makse tagasi lükatud",
    tryAnother: "Proovige teist meetodit",
    tryAgain: "Proovi uuesti",
    cancel: "Tühista ja uus tellimus",
    cardTitle: "Maksa kaardiga",
    cardHint: "Sisestage, puudutage või libistage kaarti alloleval terminalil",
    each: "tk",
    scanPrompt: "Skaneeri tellimuse alustamiseks",
    scanSub: "Suunake telefonikaamera QR-koodi poole",
    loadingOrder: "Tellimuse kokkuvõte laadimine…",
    receiptShopName: "Grocery Shop",
    receiptProduct: "Toode",
    receiptQty: "Kogus",
    receiptTotal: "Kokku",
    receiptVatPct: "KM %",
    receiptTotalWithoutVat: "Summa käibemaksuta",
    receiptVatAmount: "Käibemaks",
    receiptTotalWithVat: "Summa käibemaksuga",
    receiptVatLabel: "Käibemaks 24 %",
    receiptPaymentMethod: "Makseviis",
    receiptReceiptNo: "Kviitungi nr",
    receiptDate: "Kuupäev",
    receiptCustomerCard: "Kliendikaart",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ENG",
  setLang: () => {},
  t: LABELS.ENG,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("ENG");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: LABELS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
