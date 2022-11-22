import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import {
  checkAuthorization,
  colorCard,
  formateDateOnline,
} from "utils/helpers";
import { useAppDispatch, useAppSelector } from "utils/hooks";
import { IUser } from "utils/interface";
import { useTheme } from "utils/context";
import { addContact, deleteContact } from "resolvers/contacts";
import {
  actionAddContact,
  actionAddError,
  getContacts,
  getRecipient,
  getUser,
} from "store";
import { AddUserIcon, RemoveUserIcon } from "assets";

import { MessageHeaderProps } from "./MessageHeader.props";
import styles from "./MessageHeader.module.css";
import { useEffect } from "react";

export const MessageHeader = ({
  setSettings,
  className,
  ...props
}: MessageHeaderProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();
  let color = colorCard();

  const receipt: IUser | undefined = useAppSelector(getRecipient);
  const contact: IUser | undefined = useAppSelector(getContacts)?.filter(
    (contact) => contact.id === receipt?.id
  )[0];
  const user: IUser | undefined = useAppSelector(getUser);

  const [mutationFunctionDelete, { error: errorMutationContactDelete }] =
    useMutation(deleteContact, {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.deleteContact,
          actionAdd: actionAddContact,
          themeChange,
        });
      },
    });
  const [mutationFunctionAdd, { error: errorMutationContactAdd }] = useMutation(
    addContact,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.addContact,
          actionAdd: actionAddContact,
          themeChange,
        });
      },
    }
  );

  const [menuMessage, setmenuMessage] = useState<boolean>(false);

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

  useEffect(() => {
    if (errorMutationContactDelete)
      dispatch(actionAddError(errorMutationContactDelete.message));
    if (errorMutationContactAdd)
      dispatch(actionAddError(errorMutationContactAdd.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMutationContactDelete, errorMutationContactAdd]);

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
