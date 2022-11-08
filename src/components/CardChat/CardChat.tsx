import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";

import { CardChatProps } from "./CardChat.props";
import { colorCard, formateDate } from "helpers";

import styles from "./CardChat.module.css";
import { useLazyQuery } from "@apollo/client";

import { getMessage } from "mutation";
import { useAppDispatch, useAppSelector } from "hooks";
import { actionAddMessages, getUser } from "store";
import { toast } from "react-toastify";

export const CardChat = ({
  className,
  contact,
  ...props
}: CardChatProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [queryFunction] = useLazyQuery(getMessage);

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
    </li>
  );
};
