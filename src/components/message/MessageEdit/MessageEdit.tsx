import React from 'react'
import { useMutation } from '@apollo/client'
import cn from 'classnames'

import { useAppDispatch, useAppSelector, useAuthorization, useError } from 'utils/hooks'
import { IMessage } from 'utils/interface'
import { deleteMessages } from 'resolvers/messages'
import { getUser } from 'store/select'
import { actionAddMessages, actionAddMessageEdit } from 'store/slice'
import { CopyIcon, DeleteIcon, EditIcon, ReplyIcon } from 'assets'

import { MessageEditProps } from './MessageEdit.props'
import styles from './MessageEdit.module.css'

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
  const dispatch = useAppDispatch()
  const authorization = useAuthorization()
  const error = useError()
  //store
  const user = useAppSelector(getUser)

  const [mutationFunction] = useMutation(deleteMessages, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IMessage[]>(data.addMessages, actionAddMessages)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })
  //copy string
  const handleCopy = async (value: string): Promise<void> => {
    await navigator.clipboard.writeText(value)
  }
  //remove message
  const handleDelete = async (): Promise<void> => {
    setEditMessage(false)
    await mutationFunction({
      variables: {
        message: {
          id: Number(client.id),
          chatId: Number(client.chatId),
          senderMessage: Number(client.user),
        },
      },
    })
  }
  //add edit message in store
  const handleMessage = (edit: boolean): void => {
    dispatch(
      actionAddMessageEdit({
        message: {
          id: Number(client.id),
          text: client.text,
          chatId: Number(client.chatId),
        },
        edit,
      }),
    )
  }

  const stylePosition = (): { top: number; left: number } => {
    return position
      ? {
          top: user?.id === client.senderMessage ? clientY - 120 : clientY - 65,
          left: clientX,
        }
      : {
          top: clientY,
          left: clientX,
        }
  }

  return (
    <div
      className={cn(className, styles.messageWrapperEdit, {
        [styles.messageWrapperEditOn]: editMessage,
      })}
      style={stylePosition()}
      {...props}
    >
      <span
        className={styles.editMessagePerson}
        onClick={() => (setEditMessage(false), handleMessage(false))}
      >
        <ReplyIcon className={styles.editIconMessage} />
        <p>Reply</p>
      </span>
      {user?.id === client.senderMessage ? (
        <span
          className={styles.editMessagePerson}
          onClick={() => (setEditMessage(false), handleMessage(true))}
        >
          <EditIcon className={cn(styles.editIconMessage, styles.editIconMessageE)} />
          <p>Edit</p>
        </span>
      ) : null}
      <span
        className={styles.editMessagePerson}
        onClick={async () => (setEditMessage(false), await handleCopy(client.text))}
      >
        <CopyIcon className={styles.editIconMessage} />
        <p>Copy</p>
      </span>
      {user?.id === client.senderMessage ? (
        <span className={cn(styles.editMessagePerson, styles.deleteMessage)} onClick={handleDelete}>
          <DeleteIcon className={styles.editIconMessage} />
          <p>Delete</p>
        </span>
      ) : null}
    </div>
  )
}
