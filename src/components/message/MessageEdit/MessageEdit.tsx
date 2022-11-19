import React from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import { IUser } from "utils/interface";
import { deleteMessages } from "resolvers/messages";
import { actionAddMessageEdit, getUser } from "store";
import { CopyIcon, DeleteIcon, EditIcon, ReplyIcon } from "assets";

import { MessageEditProps } from "./MessageEdit.props";
import styles from "./MessageEdit.module.css";

export const MessageEdit = ({
  setEditMessage,
  editMessage,
  client,
  position,
  clientX,
  clientY,
  className,
  ...props
}: MessageEditProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const [mutationFunction] = useMutation(deleteMessages);

  const user: IUser | undefined = useAppSelector(getUser);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleDelete = async () => {
    setEditMessage(false);
    await mutationFunction({
      variables: {
        message: {
          id: Number(client.id),
          chatId: client.chatId,
          senderMessage: Number(client.user),
        },
      },
    });
  };

  const handleMessage = (edit) => {
    dispatch(
      actionAddMessageEdit({
        message: {
          id: Number(client.id),
          text: client.text,
          chatId: Number(client.chatId),
        },
        edit,
      })
    );
  };

  return (
    <div
      className={cn(className, styles.messageWrapperEdit, {
        [styles.messageWrapperEditOn]: editMessage === true,
      })}
      style={
        position
          ? {
              top:
                user?.id === client.senderMessage
                  ? clientY - 120
                  : clientY - 65,
              left: clientX,
            }
          : {
              top: clientY,
              left: clientX,
            }
      }
      {...props}
    >
      <span
        className={styles.editMessagePerson}
        onClick={() => {
          setEditMessage(false);
          handleMessage(false);
        }}
      >
        <ReplyIcon className={styles.editIconMessage} />
        <p>Reply</p>
      </span>
      {user?.id === client.senderMessage ? (
        <span
          className={styles.editMessagePerson}
          onClick={() => {
            setEditMessage(false);
            handleMessage(true);
          }}
        >
          <EditIcon
            className={cn(styles.editIconMessage, styles.editIconMessageE)}
          />
          <p>Edit</p>
        </span>
      ) : null}
      <span
        className={styles.editMessagePerson}
        onClick={() => {
          setEditMessage(false);
          handleCopy(client.text);
        }}
      >
        <CopyIcon className={styles.editIconMessage} />
        <p>Copy</p>
      </span>
      {user?.id === client.senderMessage ? (
        <span
          className={cn(styles.editMessagePerson, styles.deleteMessage)}
          onClick={handleDelete}
        >
          <DeleteIcon className={styles.editIconMessage} />
          <p>Delete</p>
        </span>
      ) : null}
    </div>
  );
};
