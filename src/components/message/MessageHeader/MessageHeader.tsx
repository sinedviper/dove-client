import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { colorCard, formateDateOnline } from "utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useWindowSize,
} from "utils/hooks";
import { IImage, IUser } from "utils/interface";
import { addContact, deleteContact } from "resolvers/contacts";
import {
  actionAddContact,
  actionMenuMain,
  getContacts,
  getImageSender,
  getMenuMain,
  getRecipient,
  getUser,
} from "store";
import { AddUserIcon, BackIcon, RemoveUserIcon } from "assets";

import { MessageHeaderProps } from "./MessageHeader.props";
import styles from "./MessageHeader.module.css";

export const MessageHeader = ({
  setSettings,
  settings,
  className,
  ...props
}: MessageHeaderProps): JSX.Element => {
  const error = useError();
  const dispatch = useAppDispatch();
  const authorization = useAuthorization();
  const windowSize = useWindowSize();
  let color = colorCard();

  const receipt: IUser | undefined = useAppSelector(getRecipient);
  const contact: IUser | undefined = useAppSelector(getContacts)?.filter(
    (contact) => contact.id === receipt?.id
  )[0];
  const user: IUser | undefined = useAppSelector(getUser);
  const imageSender: IImage | undefined = useAppSelector(getImageSender);
  const main: boolean = useAppSelector(getMenuMain);

  const [mutationFunctionDelete] = useMutation(deleteContact, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({
        data: data.deleteContact,
        actionAdd: actionAddContact,
      });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });
  const [mutationFunctionAdd] = useMutation(addContact, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({ data: data.addContact, actionAdd: actionAddContact });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

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

  return (
    <section
      className={cn(className, styles.headerReceiptWrapper)}
      onMouseLeave={() => {
        setmenuMessage(false);
      }}
      {...props}
    >
      <button
        onClick={() => {
          if (windowSize[0] < 1000) {
            dispatch(actionMenuMain(!main));
            if (settings === true) {
              setSettings(false);
            }
          }
        }}
        className={cn(styles.buttonBackMain)}
      >
        <BackIcon
          className={cn({
            [styles.menuMainOn]: main,
          })}
        />
      </button>
      <div
        className={styles.headerWrapper}
        onClick={() => {
          setSettings(true);
          if (settings === true) dispatch(actionMenuMain(false));
        }}
      >
        <div className={styles.headerReceiptPhoto}>
          {imageSender ? (
            <img
              src={`http://localhost:3001/images/${imageSender.file}`}
              alt='sender'
              className={styles.imageSender}
            />
          ) : (
            <span
              className={styles.receiptNamePhoto}
              style={{
                background: imageSender
                  ? ""
                  : `linear-gradient(${color?.color1}, ${color?.color2})`,
              }}
            >
              {receipt?.name && receipt?.name.toUpperCase()[0]}
              {receipt?.surname && receipt?.surname.toUpperCase()[0]}
            </span>
          )}
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
