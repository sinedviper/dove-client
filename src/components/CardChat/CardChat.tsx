import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CardChatProps } from "./CardChat.props";
import { colorCard, formateDate } from "helpers";
import { removeChat } from "mutation";
import { useAppDispatch } from "hooks";
import {
  actionAddReceipt,
  actionClearMessages,
  actionClearReceipt,
} from "store";
import { DeleteIcon } from "assets";

import styles from "./CardChat.module.css";

export const CardChat = ({
  className,
  contact,
  ...props
}: CardChatProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();

  const [mutationFunction] = useMutation(removeChat, {
    onCompleted() {
      navigate("");
    },
  });

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

  const color = colorCard(contact?.user.name.toUpperCase().split("")[0]);

  const handleFocus = async () => {
    dispatch(actionClearMessages());
    dispatch(actionClearReceipt());
    dispatch(actionAddReceipt(contact.user));
    navigate(`${contact?.user.username}`);
  };

  const handleDeleteChat = async () =>
    await mutationFunction({ variables: { idChat: Number(contact?.id) } });

  useEffect(() => {
    if (params.username === contact?.user.username) {
      setClick(true);
    }
    if (params.username !== contact?.user.username) {
      setClick(false);
    }
  }, [params, contact]);

  return (
    <li
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click === true,
      })}
      onClick={handleFocus}
      onMouseMoveCapture={(e: any) => {
        if (!menu) {
          setTop(e.nativeEvent.layerY);
          setLeft(e.nativeEvent.layerX);
        }
      }}
      onMouseLeave={() => setMenu(false)}
      onMouseDown={(e) => {
        if (e.buttons === 2) {
          setMenu(true);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      {...props}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: `linear-gradient(${color?.color1}, ${color?.color2})`,
        }}
      >
        <span>
          {contact?.user.name && contact?.user.name.toUpperCase().split("")[0]}
          {contact?.user.surname &&
            contact?.user.surname.toUpperCase().split("")[0]}
        </span>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact?.user?.name && contact?.user?.name}{" "}
          {contact?.user?.surname && contact?.user?.surname}
        </span>
        <span className={styles.contactMessage}>
          {contact?.lastMessage && contact?.lastMessage.text}
        </span>
      </div>
      <span className={styles.contactDate}>
        {contact?.lastMessage &&
          formateDate(new Date(contact?.lastMessage.createdAt))}
      </span>
      <div
        className={cn(styles.menuChat, { [styles.menuChatOn]: menu === true })}
        style={{ top: top, left: left }}
      >
        <span className={styles.menuCard} onClick={handleDeleteChat}>
          <DeleteIcon className={styles.iconDeleteMenu} />
          <p>Delete</p>
        </span>
      </div>
    </li>
  );
};
