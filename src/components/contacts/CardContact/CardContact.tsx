import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { formateDateOnline, colorCard } from "utils/helpers";
import { useAppSelector, useAuthorization, useError } from "utils/hooks";
import { IUser } from "utils/interface";
import { deleteContact } from "resolvers/contacts";
import { ButtonMenu } from "components/layouts";
import { actionAddContact, getUser } from "store";

import { CardContactProps } from "./CardContact.props";
import styles from "./CardContact.module.css";

export const CardContact = ({
  className,
  contact,
  handleFocus,
  setValue,
  search,
  ...props
}: CardContactProps): JSX.Element => {
  const autorization = useAuthorization();
  const error = useError();

  const user: IUser | undefined = useAppSelector(getUser);

  const [mutationFunctionDelete] = useMutation(deleteContact, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      autorization({ data: data.deleteContact, actionAdd: actionAddContact });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);

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
          if (e.nativeEvent.layerX > 210) {
            setLeft(e.nativeEvent.layerX - 200);
          } else setLeft(e.nativeEvent.layerX);
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
        <ButtonMenu
          menu={menu}
          top={top}
          left={left}
          handleDelete={handleDeleteContact}
          text={"Delete"}
        />
      )}
    </li>
  );
};
