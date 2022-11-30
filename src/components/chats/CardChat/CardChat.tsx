import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { colorCard, formateDate } from "utils/helpers";
import {
  useAppDispatch,
  useAuthorization,
  useError,
  useWindowSize,
} from "utils/hooks";
import { removeChat } from "resolvers/chats";
import { ButtonMenu } from "components/layouts";
import {
  actionAddChats,
  actionAddRecipient,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  actionClearImageSender,
  actionClearMessages,
  actionClearRecipient,
  actionMenuMain,
} from "store";

import { CardChatProps } from "./CardChat.props";
import styles from "./CardChat.module.css";

export const CardChat = ({
  className,
  tabIndex,
  chat: { id, user, lastMessage, image },
  ...props
}: CardChatProps): JSX.Element => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useError();
  const autorization = useAuthorization();
  const windowSize = useWindowSize();

  const [mutationFunction, { error: errorMutationChat }] = useMutation(
    removeChat,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorization({ data: data.deleteChat, actionAdd: actionAddChats });
        dispatch(actionAddTabIndexSixth(-1));
        navigate("");
      },
    }
  );

  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);
  let timer: any;

  const color = colorCard(user.name.toUpperCase().split("")[0]);

  const handleFocus = () => {
    if (String(user.username) !== String(username)) {
      dispatch(actionClearMessages());
      dispatch(actionClearRecipient());
      dispatch(actionAddRecipient(user));
      dispatch(actionClearImageSender());
      dispatch(actionAddTabIndexSixth(0));
      navigate(`${user.username}`);
    }
    if (windowSize[0] < 1000) {
      dispatch(actionMenuMain(false));
      dispatch(actionAddTabIndexFirst(-1));
    }
  };

  const handleDeleteChat = async () =>
    await mutationFunction({ variables: { idChat: Number(id) } });

  useEffect(() => {
    if (username === user.username) {
      setClick(true);
    }
    if (username !== user.username) {
      setClick(false);
    }
    if (errorMutationChat) error(errorMutationChat.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, user, errorMutationChat]);

  return (
    <li
      tabIndex={tabIndex}
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click === true,
      })}
      onMouseUp={(e) => {
        if (e.buttons === 1) {
          if (!menu) {
            handleFocus();
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleFocus();
          if (windowSize[0] < 1000) {
            dispatch(actionAddTabIndexFirst(-1));
            dispatch(actionAddTabIndexSixth(0));
          }
        }
        if (e.key === "Delete") {
          setMenu(!menu);
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
      onMouseDown={(e) => {
        if (e.buttons === 2) {
          setMenu(true);
        }
        if (e.buttons === 1) {
          setTimeout(() => {
            setMenu(true);
          }, 1000);
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
          background:
            image === null
              ? `linear-gradient(${color?.color1}, ${color?.color2})`
              : "",
        }}
      >
        {image === null ? (
          <span>
            {user.name && user.name.toUpperCase().split("")[0]}
            {user.surname && user.surname.toUpperCase().split("")[0]}
          </span>
        ) : (
          <span>
            <img
              src={`http://localhost:3001/images/${image.file}`}
              alt='user'
            />
          </span>
        )}
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {user.name && user.name} {user?.surname && user.surname}
        </span>
        <span className={styles.contactMessage}>
          {lastMessage && lastMessage.text}
        </span>
      </div>
      <span className={styles.contactDate}>
        {lastMessage && formateDate(new Date(lastMessage.createdAt))}
      </span>
      <ButtonMenu
        top={top}
        left={left}
        menu={menu}
        handleDelete={handleDeleteChat}
        text={"Delete"}
        tabIndex={menu === true ? 0 : -1}
      />
    </li>
  );
};
