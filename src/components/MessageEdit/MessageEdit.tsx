import React from "react";
import cn from "classnames";
import { useMutation } from "@apollo/client";

import { MessageEditProps } from "./MessageEdit.props";
import { CopyIcon, DeleteIcon, EditIcon, ReplyIcon } from "assets";
import { deleteMessages } from "mutation";
import { useAppDispatch, useAppSelector } from "hooks";
import { actionAddMessageEdit, getUser } from "store";

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

  const user = useAppSelector(getUser);

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

  const handleEdit = () => {
    dispatch(
      actionAddMessageEdit({
        message: {
          id: Number(client.id),
          text: client.text,
          chatId: Number(client.chatId),
        },
        edit: true,
      })
    );
  };
  const handleReply = () => {
    dispatch(
      actionAddMessageEdit({
        message: {
          id: Number(client.id),
          text: client.text,
          chatId: Number(client.chatId),
        },
        edit: false,
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
          handleReply();
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
            handleEdit();
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
