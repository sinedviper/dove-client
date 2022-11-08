import React, { useState } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";

import { HomeProps } from "./Home.props";
import { useAppSelector } from "hooks";
import { getChat, getMessages, getUser } from "store";
import { IUser } from "interface";
import { colorCard, formateDate } from "helpers";
import { Settings } from "components";

import styles from "./Home.module.css";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const [settings, setSettings] = useState<boolean>(false);
  const { username } = useParams();

  let receipt: IUser | undefined = useAppSelector(getChat)
    ?.filter((obj) => obj.user.username === username)
    .map((obj) => obj.user)[0];
  const user = useAppSelector(getUser);
  const messages = useAppSelector(getMessages);

  //Color for photo
  let color = colorCard();
  if (receipt?.name) {
    color = colorCard(receipt?.name && receipt?.name.toUpperCase()[0]);
  }

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      <section className={styles.chatWrapper}>
        <section
          className={styles.headerReceiptWrapper}
          onClick={() => setSettings(true)}
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
              {receipt?.createdAt &&
                formateDate(new Date(receipt?.createdAt)).toLowerCase()}
            </p>
          </div>
        </section>
        <section className={styles.chatsWrapper}>
          <ul className={styles.messageWrapper}>
            {messages && messages?.map((message) => <li>{message.text}</li>)}
          </ul>
          <div className={styles.inputWrapper}>
            <input className={styles.input} />
          </div>
        </section>
      </section>
      <Settings
        settings={settings}
        setSettings={setSettings}
        user={receipt}
        profile={true}
        className={styles.profile}
      />
    </section>
  );
};
