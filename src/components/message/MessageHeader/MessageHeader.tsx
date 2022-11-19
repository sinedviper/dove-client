import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { colorCard, formateDateOnline } from "utils/helpers";
import { useAppSelector } from "utils/hooks";
import { IUser } from "utils/interface";
import { addContact, deleteContact } from "resolvers/contacts";
import { getContacts, getUser } from "store";
import { AddUserIcon, RemoveUserIcon } from "assets";

import { MessageHeaderProps } from "./MessageHeader.props";
import styles from "./MessageHeader.module.css";

export const MessageHeader = ({
  setSettings,
  receipt,
  className,
  ...props
}: MessageHeaderProps): JSX.Element => {
  const [mutationFunctionDelete] = useMutation(deleteContact);
  const [mutationFunctionAdd] = useMutation(addContact);

  const contact: IUser | undefined = useAppSelector(getContacts)?.filter(
    (contact) => contact.id === receipt?.id
  )[0];
  const user: IUser | undefined = useAppSelector(getUser);

  const [menuMessage, setmenuMessage] = useState<boolean>(false);

  let color = colorCard();

  if (receipt) {
    color = colorCard(receipt?.name && receipt?.name.toUpperCase()[0]);
  }

  const handleEditContact = async () => {
    if (contact) {
      await mutationFunctionDelete({
        variables: {
          contact: { userId: Number(user?.id), contactId: Number(receipt?.id) },
        },
      });
    }
    if (!contact) {
      await mutationFunctionAdd({
        variables: {
          contact: { userId: Number(user?.id), contactId: Number(receipt?.id) },
        },
      });
    }
  };

  return (
    <section
      className={cn(className, styles.headerReceiptWrapper)}
      onMouseLeave={() => setmenuMessage(false)}
      {...props}
    >
      <div className={styles.headerWrapper} onClick={() => setSettings(true)}>
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
            {receipt?.online &&
              formateDateOnline(new Date(receipt?.online)).toLowerCase()}
          </p>
        </div>
      </div>
      <button
        className={styles.delete}
        onClick={() => setmenuMessage(!menuMessage)}
      >
        <span className={styles.dot}></span>
      </button>
      <div
        className={cn(styles.menuMessageWrapper, {
          [styles.menuMessageWrapperOn]: menuMessage === true,
        })}
      >
        <button className={styles.deleteButton} onClick={handleEditContact}>
          {contact ? (
            <>
              <RemoveUserIcon className={styles.removeIcon} />
              <span>Delete contact</span>
            </>
          ) : (
            <>
              <AddUserIcon className={styles.removeIcon} />
              <span>Add contact</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
