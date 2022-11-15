import React, { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CardContactProps } from "./CardContact.props";
import { formateDate, colorCard } from "helpers";
import { addChat, deleteContact } from "mutation";
import { getUser } from "store";
import { useAppSelector } from "hooks";
import { IUser } from "interface";
import { DeleteIcon } from "assets";

import styles from "./CardContact.module.css";

export const CardContact = ({
  className,
  contact,
  setContact,
  ...props
}: CardContactProps): JSX.Element => {
  const navigate = useNavigate();

  const [mutationFunction] = useMutation(addChat, {
    onCompleted() {
      navigate(`${contact.username}`);
    },
  });
  const [mutationFunctionDelete] = useMutation(deleteContact);

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

  const user: IUser | null = useAppSelector(getUser);

  const handleFocus = async () => {
    setContact(false);
    await mutationFunction({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(contact.id) },
      },
    });
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
          {contact?.name.toUpperCase().split("")[0] +
            contact?.surname.toUpperCase().split("")[0]}
        </span>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact?.name} {contact.surname}
        </span>
        <span className={styles.contactMessage}>
          last seen {formateDate(new Date(contact?.online)).toLocaleLowerCase()}
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
