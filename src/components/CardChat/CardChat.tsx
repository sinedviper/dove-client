import React, { useState } from "react";
import cn from "classnames";

import { CardChatProps } from "./CardChat.props";

import styles from "./CardChat.module.css";
import { formateDate } from "helpers";

export const CardChat = ({
  className,
  contact,
  ...props
}: CardChatProps): JSX.Element => {
  const [click, setClick] = useState<boolean>(false);

  const handleFocus = () => {
    setClick(!click);
  };

  return (
    <li
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click === true,
      })}
      onClick={handleFocus}
      {...props}
    >
      <div className={styles.contactsPhoto}>
        <span>
          {contact?.user.name.toUpperCase().split("")[0] +
            contact?.user.surname.toUpperCase().split("")[0]}
        </span>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact?.user.name} {contact?.user.surname}
        </span>
        <span className={styles.contactMessage}>
          {contact?.lastMessage && contact?.lastMessage.text}
        </span>
        <span className={styles.contactDate}>
          {contact?.lastMessage &&
            formateDate(new Date(contact?.lastMessage.createdAt))}
        </span>
      </div>
    </li>
  );
};
