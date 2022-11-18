import React, { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CardContactProps } from "./CardContact.props";
import { colorCard, formateDateOnline } from "helpers";
import { deleteContact } from "mutation";
import {
  actionAddReceipt,
  actionClearMessages,
  actionClearReceipt,
  getUser,
} from "store";
import { useAppDispatch, useAppSelector } from "hooks";
import { IUser } from "interface";
import { DeleteIcon } from "assets";

import styles from "./CardContact.module.css";

export const CardContact = ({
  className,
  contact,
  setContact,
  setValue,
  search,
  ...props
}: CardContactProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [mutationFunctionDelete] = useMutation(deleteContact);

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

  const user: IUser | null = useAppSelector(getUser);

  const handleFocus = async () => {
    setValue("");
    setContact(false);
    dispatch(actionClearMessages());
    dispatch(actionClearReceipt());
    dispatch(actionAddReceipt(contact));
    navigate(`${contact?.username}`);
  };

  const handleDeleteContact = async () => {
    if (!search) {
      await mutationFunctionDelete({
        variables: {
          contact: { userId: Number(user?.id), contactId: Number(contact.id) },
        },
      });
    }
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
          {search
            ? "@" + contact?.username
            : contact?.online &&
              formateDateOnline(new Date(contact?.online)).toLocaleLowerCase()}
        </span>
      </div>
      {!search && (
        <div
          className={cn(styles.menuChat, {
            [styles.menuChatOn]: menu === true,
          })}
          style={{ top: top, left: left }}
        >
          <span className={styles.menuCard} onClick={handleDeleteContact}>
            <DeleteIcon className={styles.iconDeleteMenu} />
            <p>Delete</p>
          </span>
        </div>
      )}
    </li>
  );
};
