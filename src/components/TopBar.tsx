import React from "react";
import styles from "./TopBar.module.css";
import { useLang } from "../context/LanguageContext";
import type { Lang } from "../context/LanguageContext";
import logo from "../assets/seuropay-logo.svg";

const LANGS: Lang[] = ["EST", "ENG"];

const TopBar: React.FC = () => {
  const { lang, setLang } = useLang();

  const now = new Date();
  const time = now.toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("et-EE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src={logo} alt="SeuroPay" className={styles.logoImg} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>SeuroPay</span>
          <span className={styles.brandSub}>Payment Booth</span>
        </div>
      </div>

      <div className={styles.storeInfo}>
        <span className={styles.storeName}>Store #0042 · Terminal 1</span>
        <span className={styles.storeLocation}>Tallinn, EE</span>
      </div>

      <div className={styles.right}>
        <div className={styles.langSwitcher}>
          {LANGS.map((l) => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.langActive : ""}`}
              onClick={() => setLang(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className={styles.clock}>
          <span className={styles.time}>{time}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
