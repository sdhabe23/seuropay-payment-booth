import React from "react";
import type { Product } from "../data/products";
import { formatEuro } from "../utils/currency";
import { useLang } from "../context/LanguageContext";
import styles from "./OrderSummary.module.css";

interface OrderSummaryProps {
  items: Product[];
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, tax, total }) => {
  const { t } = useLang();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.orderSummary}</h2>
        <span className={styles.itemCount}>{items.reduce((s, i) => s + i.quantity, 0)} {t.items}</span>
      </div>

      <div className={styles.itemListWrapper}>
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemLeft}>
                <span className={styles.itemQty}>×{item.quantity}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemCategory}>{item.category}</span>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.itemTotal}>
                  {formatEuro(item.price * item.quantity)}
                </span>
                <span className={styles.itemUnit}>
                  {formatEuro(item.price)} {t.each}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>{t.subtotal}</span>
          <span className={styles.totalValue}>{formatEuro(subtotal)}</span>
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>{t.vat}</span>
          <span className={styles.totalValue}>{formatEuro(tax)}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span className={styles.totalLabel}>{t.total}</span>
          <span className={styles.grandTotalValue}>{formatEuro(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
