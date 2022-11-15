import React from "react";
import cn from "classnames";

import { MessageHeaderProps } from "./MessageHeader.props";

import styles from "./MessageHeader.module.css";
import { colorCard, formateDate, formateDateOnline } from "helpers";

export const MessageHeader = ({
  setSettings,
  receipt,
  className,
  ...props
}: MessageHeaderProps): JSX.Element => {
  let color = colorCard();

  if (receipt?.name) {
    color = colorCard(receipt?.name && receipt?.name.toUpperCase()[0]);
  }

  return (
    <section
      className={cn(className, styles.headerReceiptWrapper)}
      onClick={() => setSettings(true)}
      {...props}
    >
      <div className={styles.headerReceiptPhoto}>
        <span
          className={styles.receiptNamePhoto}
          style={{
            background: `linear-gradient(${color?.color1}, ${color?.color2})`,
          }}
        >
          {receipt?.name && receipt?.name.toUpperCase()[0]}
          {receipt?.surname && receipt?.surname.toUpperCase()[0]}
        </span>
      </div>
      <div className={styles.headerReceiptInfo}>
        <p className={styles.infoName}>
          {receipt?.name && receipt?.name}{" "}
          {receipt?.surname && receipt?.surname}
        </p>
        <p className={styles.infoDate}>
          last seen{" "}
          {receipt?.online &&
            formateDateOnline(new Date(receipt?.online)).toLowerCase()}
        </p>
      </div>
    </section>
  );
};
