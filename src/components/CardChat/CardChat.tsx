import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";

import { CardChatProps } from "./CardChat.props";
import { colorCard, formateDate } from "helpers";

import styles from "./CardChat.module.css";
import { useLazyQuery, useMutation } from "@apollo/client";

import { getMessage, removeChat } from "mutation";
import { useAppDispatch, useAppSelector } from "hooks";
import { actionAddChats, actionAddMessages, getUser } from "store";
import { toast } from "react-toastify";
import { DeleteIcon } from "assets";

export const CardChat = ({
  className,
  contact,
  ...props
}: CardChatProps): JSX.Element => {
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [queryFunction] = useLazyQuery(getMessage);
  const [mutationFunction] = useMutation(removeChat);

  const [click, setClick] = useState<boolean>(false);

  const user = useAppSelector(getUser);
  const color = colorCard(contact?.user.name.toUpperCase().split("")[0]);

  const handleFocus = async () => {
    await queryFunction({
      variables: {
        message: { chatId: contact.id, senderMessage: Number(user?.id) },
      },
    }).then((res) => {
      const messages = res.data.getMessages;
      if (messages.status === "Invalid") {
        toast.error(messages.message);
      }
      if (messages.status === "Success") {
        dispatch(actionAddMessages(messages.data));
        navigate(`${contact.user.username}`);
      }
    });
  };

  const handleDeleteChat = async () => {
    await mutationFunction({ variables: { idChat: Number(contact.id) } }).then(
      (res) => {
        const data = res.data.deleteChat;
        if (data.status === "Invalid") {
          toast.error(data.message);
        }
        if (data.status === "Success") {
          dispatch(actionAddChats(data.data));
          navigate("");
        }
      }
    );
  };

  useEffect(() => {
    if (params.username === contact.user.username) {
      setClick(true);
    }
    if (params.username !== contact.user.username) {
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
