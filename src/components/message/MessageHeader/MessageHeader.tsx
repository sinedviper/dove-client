import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";
import { useParams } from "react-router-dom";

import { SERVER_LINK } from "utils/constants";
import { colorCard, formateDateOnline } from "utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useWindowSize,
} from "utils/hooks";
import { IUser } from "utils/interface";
import { addContact, deleteContact } from "resolvers/contacts";
import {
  getRecipient,
  getContacts,
  getUser,
  getMenuMain,
  getTabIndexSixth,
} from "store/select";
import {
  actionAddContact,
  actionMenuMain,
  actionAddTabIndexSixth,
  actionAddTabIndexFirst,
  actionAddTabIndexSeventh,
} from "store/slice";
import { AddUserIcon, BackIcon, BookmarkIcon, RemoveUserIcon } from "assets";

import { MessageHeaderProps } from "./MessageHeader.props";
import styles from "./MessageHeader.module.css";

export const MessageHeader = ({
  setSettings,
  settings,
  className,
  ...props
}: MessageHeaderProps): JSX.Element => {
  const { username } = useParams();
  const error = useError();
  const dispatch = useAppDispatch();
  const authorization = useAuthorization();
  const windowSize = useWindowSize();
  let color = colorCard();
  //store
  const receipt: IUser | undefined = useAppSelector(getRecipient);
  const contact: IUser | undefined = useAppSelector(getContacts)?.filter(
    (contact) => contact.id === receipt?.id
  )[0];
  const user: IUser | undefined = useAppSelector(getUser);
  const main: boolean = useAppSelector(getMenuMain);
  const tabIndexSixth = useAppSelector(getTabIndexSixth);

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

  const handleEditContact = async (): Promise<void> => {
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

  const handleButtonBack = (): void => {
    if (windowSize[0] < 1000) {
      dispatch(actionMenuMain(!main));
      dispatch(actionAddTabIndexSixth(tabIndexSixth === -1 ? 0 : -1));
      dispatch(actionAddTabIndexFirst(0));
      if (windowSize[0] < 600) {
        dispatch(actionAddTabIndexSixth(-1));
        dispatch(actionAddTabIndexFirst(0));
      }
      if (settings) {
        setSettings(false);
      }
    }
  };

  const handleOpenInfo = (): void => {
    setSettings(true);
    dispatch(actionAddTabIndexSeventh(0));
    dispatch(actionAddTabIndexFirst(-1));
    dispatch(actionAddTabIndexSixth(-1));
    if (settings) dispatch(actionMenuMain(false));
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
        onClick={handleButtonBack}
        tabIndex={windowSize[0] < 1000 ? tabIndexSixth : -1}
        className={cn(styles.buttonBackMain)}
      >
        <BackIcon
          className={cn({
            [styles.menuMainOn]: main,
          })}
        />
      </button>
      {username === user?.username ? (
        <div className={styles.headerWrapper}>
          <div className={styles.headerWrapper}>
            <BookmarkIcon className={styles.bookmarkIconHeaderMessageWrapper} />
            <div className={styles.headerReceiptInfo}>
              <p className={styles.infoName}>Saved Message</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={styles.headerWrapper}
            onClick={handleOpenInfo}
            onKeyDown={(e) => e.key === "Enter" && handleOpenInfo()}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setSettings(true);
                if (settings) dispatch(actionMenuMain(false));
              }
            }}
            tabIndex={tabIndexSixth}
          >
            <div className={styles.headerReceiptPhoto}>
              {receipt?.file ? (
                <img
                  src={`${SERVER_LINK}/images/${receipt?.file}`}
                  alt='sender'
                  className={styles.imageSender}
                />
              ) : (
                <span
                  className={styles.receiptNamePhoto}
                  style={{
                    background: receipt?.file
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
            tabIndex={tabIndexSixth}
          >
            <span className={styles.dot}></span>
          </button>
          <div
            className={cn(styles.menuMessageWrapper, {
              [styles.menuMessageWrapperOn]: menuMessage,
            })}
            style={{ display: menuMessage ? "block" : "none" }}
          >
            <button
              className={styles.deleteButton}
              onClick={handleEditContact}
              tabIndex={tabIndexSixth}
            >
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
        </>
      )}
    </section>
  );
};
