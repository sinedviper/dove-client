import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { formateDateOnline, colorCard } from "utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useWindowSize,
} from "utils/hooks";
import { IUser } from "utils/interface";
import { deleteContact } from "resolvers/contacts";
import { ButtonMenu } from "components/layouts";
import {
  actionAddContact,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  getUser,
} from "store";

import { CardContactProps } from "./CardContact.props";
import styles from "./CardContact.module.css";

export const CardContact = ({
  className,
  contact,
  handleFocus,
  setValue,
  search,
  tabIndex,
  ...props
}: CardContactProps): JSX.Element => {
  const autorization = useAuthorization();
  const error = useError();
  const dispatch = useAppDispatch();
  const sizeWindow = useWindowSize();
  //store
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
  let timer: any = undefined;
  //function delete contact
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleFocus(contact);
          if (sizeWindow[0] < 1000) {
            dispatch(actionAddTabIndexFirst(-1));
            dispatch(actionAddTabIndexSixth(0));
          }
        }
        if (e.key === "Delete") {
          setMenu(!menu);
        }
      }}
      onMouseDown={(e) => {
        if (e.buttons === 2) {
          setMenu(true);
        }
      }}
      onTouchStart={() => {
        setClick(true);
        timer = setTimeout(() => {
          setMenu(true);
        }, 1000);
      }}
      onClick={() => {
        handleFocus(contact);
      }}
      onMouseUp={() => {
        setClick(false);
      }}
      onTouchEnd={() => {
        setClick(false);
        if (!menu) {
          handleFocus(contact);
          clearTimeout(timer);
        }
      }}
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
      tabIndex={tabIndex}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: contact.file
            ? ""
            : `linear-gradient(${color?.color1}, ${color?.color2})`,
        }}
      >
        {contact.file ? (
          <img
            className={styles.imageContact}
            src={`http://localhost:3001/images/${contact.file}`}
            alt='user img'
          />
        ) : (
          <span>
            {contact?.name && contact?.name.toUpperCase().split("")[0]}
            {contact?.surname && contact?.surname.toUpperCase().split("")[0]}
          </span>
        )}
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
          tabIndex={menu === true ? 0 : -1}
        />
      )}
    </li>
  );
};
