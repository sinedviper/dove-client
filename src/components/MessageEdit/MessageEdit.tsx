import React from "react";
import cn from "classnames";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";

import { MessageEditProps } from "./MessageEdit.props";
import { CopyIcon, DeleteIcon, EditIcon, ReplyIcon } from "assets";
import { deleteMessages } from "mutation";
import { useAppDispatch, useAppSelector } from "hooks";
import { actionAddMessages, getUser } from "store";

import styles from "./MessageEdit.module.css";

export const MessageEdit = ({
  setEditMessage,
  editMessage,
  client,
  clientX,
  clientY,
  className,
  ...props
}: MessageEditProps): JSX.Element => {
  const [mutationFunction] = useMutation(deleteMessages);
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleDelete = async () => {
    setEditMessage(false);
    await mutationFunction({
      variables: {
        message: {
          id: client.id,
          chatId: client.chatId,
          senderMessage: Number(client.user),
        },
      },
    }).then((res) => {
      const data = res.data.deleteMessage;
      if (data.status === "Invalid") {
        toast.error(data.message);
      }
      if (data.status === "Success") {
        dispatch(actionAddMessages(data.data));
      }
    });
  };

  return (
    <div
      className={cn(className, styles.messageWrapperEdit, {
        [styles.messageWrapperEditOn]: editMessage === true,
      })}
      style={{ top: clientY, left: clientX }}
      {...props}
    >
      <span
        className={styles.editMessagePerson}
        onClick={() => {
          setEditMessage(false);
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
