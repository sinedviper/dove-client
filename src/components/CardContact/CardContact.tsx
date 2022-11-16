import React, { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import { CardContactProps } from "./CardContact.props";
import { checkAuthorization, colorCard, formateDateOnline } from "helpers";
import { addChat, deleteContact, getMessage } from "mutation";
import {
  actionAddMessages,
  actionClearMessages,
  getChat,
  getUser,
} from "store";
import { useAppDispatch, useAppSelector } from "hooks";
import { IChat, IUser } from "interface";
import { DeleteIcon } from "assets";
import { useTheme } from "context";

import styles from "./CardContact.module.css";

export const CardContact = ({
  className,
  contact,
  setContact,
  setValue,
  ...props
}: CardContactProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeChange = useTheme();

  const [queryFunction] = useLazyQuery(getMessage, {
    onCompleted(data) {
      checkAuthorization({
        dispatch,
        navigate,
        data: data.getMessages,
        actionAdd: actionAddMessages,
        themeChange,
      });
    },
  });

  const [mutationFunction] = useMutation(addChat, {
    onCompleted() {},
  });
  const [mutationFunctionDelete] = useMutation(deleteContact);

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

  const user: IUser | null = useAppSelector(getUser);
  const chat: IChat[] | null = useAppSelector(getChat);

  const handleFocus = async () => {
    setValue("");
    setContact(false);
    dispatch(actionClearMessages());
    await mutationFunction({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(contact.id) },
      },
    });
    // eslint-disable-next-line array-callback-return
    const chatId = chat?.filter((obj) => {
      if (obj.user.id === contact.id) {
        return obj;
      }
    })[0];
    await queryFunction({
      variables: {
        message: {
          chatId: Number(chatId?.id),
          senderMessage: Number(user?.id),
        },
      },
    });
    navigate(`${contact?.username}`);
  };

  const handleDeleteContact = async () => {
    await mutationFunctionDelete({
      variables: {
        contact: { userId: Number(user?.id), contactId: Number(contact.id) },
      },
    });
  };

  const color = colorCard(contact?.name.toUpperCase().split("")[0]);

  return (
    <li
      {...props}
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click === true,
      })}
      onClick={handleFocus}
      onMouseDown={(e) => {
        if (e.buttons === 2) {
          setMenu(true);
        } else setClick(true);
      }}
      onMouseUp={() => setClick(false)}
      onMouseMoveCapture={(e: any) => {
        if (!menu) {
          setTop(e.nativeEvent.layerY);
          setLeft(e.nativeEvent.layerX);
        }
      }}
      onMouseLeave={() => setMenu(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: `linear-gradient(${color?.color1}, ${color?.color2})`,
        }}
      >
        <span>
          {contact?.name && contact?.name.toUpperCase().split("")[0]}
          {contact?.surname && contact?.surname.toUpperCase().split("")[0]}
        </span>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact?.name && contact?.name}{" "}
          {contact?.surname && contact?.surname}
        </span>
        <span className={styles.contactMessage}>
          {contact?.online &&
            formateDateOnline(new Date(contact?.online)).toLocaleLowerCase()}
        </span>
      </div>
      <div
        className={cn(styles.menuChat, { [styles.menuChatOn]: menu === true })}
        style={{ top: top, left: left }}
      >
        <span className={styles.menuCard} onClick={handleDeleteContact}>
          <DeleteIcon className={styles.iconDeleteMenu} />
          <p>Delete</p>
        </span>
      </div>
    </li>
  );
};
