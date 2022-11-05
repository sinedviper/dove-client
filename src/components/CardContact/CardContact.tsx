import React, { useState } from "react";
import cn from "classnames";

import { CardContactProps } from "./CardContact.props";

import styles from "./CardContact.module.css";
import { formateDate, colorCard } from "helpers";

export const CardContact = ({
  className,
  contact,
  ...props
}: CardContactProps): JSX.Element => {
  const [click, setClick] = useState<boolean>(false);

  const handleFocus = () => {
    setClick(!click);
  };

  const color = colorCard(contact?.name.toUpperCase().split("")[0]);

  return (
    <li
      {...props}
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click === true,
      })}
      onClick={handleFocus}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: `linear-gradient(${color?.color1}, ${color?.color2})`,
        }}
      >
        <span>
          {contact?.name.toUpperCase().split("")[0] +
            contact?.surname.toUpperCase().split("")[0]}
        </span>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact?.name} {contact.surname}
        </span>
        <span className={styles.contactMessage}>
          last seen {formateDate(new Date(contact?.createdAt))}
        </span>
      </div>
    </li>
  );
};
