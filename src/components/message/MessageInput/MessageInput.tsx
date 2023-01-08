import React, { useEffect, useRef, useState } from 'react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import cn from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'

import { useAppDispatch, useAppSelector, useWindowSize } from 'utils/hooks'
import {
  getMessageEdit,
  getUser,
  getRecipient,
  getTabIndexEighth,
  getTabIndexSixth,
  getTabIndexFirst,
  getChatUser,
} from 'store/select'
import {
  actionAddTabIndexEighth,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
} from 'store/slice'
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from 'assets'

import { useMessageInput } from './useMessageInput'
import { MessageInputProps } from './MessageInput.props'
import styles from './MessageInput.module.css'

export const MessageInput = ({ className, main }: MessageInputProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const windowSize = useWindowSize()

  const textarea = useRef<HTMLTextAreaElement>(null)

  const {
    message: { message, edit },
  } = useAppSelector(getMessageEdit)
  const user = useAppSelector(getUser)
  const sender = useAppSelector(getRecipient)
  const chat = useAppSelector((state) => getChatUser(state, sender?.id))
  const tabIndexEighth = useAppSelector(getTabIndexEighth)
  const tabIndexSixth = useAppSelector(getTabIndexSixth)
  const tabIndexFirst = useAppSelector(getTabIndexFirst)

  const [emoji, setEmoji] = useState(false)
  const [send, setSend] = useState(message?.text ?? '')
  //all functional what need work for input message
  const { handleEmoji, handleSend, handleSendClick, handleRemoveEditMessage } = useMessageInput(
    chat,
    send,
    sender,
    setSend,
    message,
    user,
    Boolean(edit),
  )

  const handleButtonOpenEmoji = (): void => {
    setEmoji(!emoji)
    dispatch(actionAddTabIndexEighth(tabIndexEighth === 0 ? -1 : 0))
    dispatch(actionAddTabIndexFirst(tabIndexFirst === 0 ? -1 : 0))
    dispatch(actionAddTabIndexSixth(tabIndexSixth === 0 ? -1 : 0))
    if (windowSize[0] < 1000) {
      dispatch(actionAddTabIndexFirst(-1))
    }
  }

  //makes sure that in editing, if editing is true, then it adds text to the field, if not, it makes it empty
  useEffect(() => {
    if (message) {
      if (edit) setSend(message.text)
      if (!edit) setSend('')
    }
  }, [message, edit])

  useEffect(() => {
    setSend('')
  }, [])

  useEffect(() => {
    if (!main) {
      setSend(' ')
    }
  }, [main])

  return (
    <div className={cn(styles.inputWrapper)}>
      {chat && message && Number(message.chatId) === Number(chat?.id) && (
        <div className={styles.messageReply}>
          {edit ? (
            <EditIcon className={styles.iconEditMessage} />
          ) : (
            <ReplyIcon className={styles.iconEditMessage} />
          )}
          <div className={styles.textWrapper}>
            <p className={styles.messageWrapperEdit}>{edit ? 'Editing' : 'Reply'}</p>
            <p className={styles.textMessage}>{message.text}</p>
          </div>
          <RemoveIcon className={styles.iconRemoveEdit} onClick={handleRemoveEditMessage} />
        </div>
      )}
      <TextareaAutosize
        tabIndex={tabIndexSixth}
        value={send}
        placeholder='Message'
        className={cn(className, styles.input, {
          [styles.textareaOff]: !send,
        })}
        onChange={(e) => (setSend(e.target.value), setEmoji(false))}
        onFocus={() => setEmoji(false)}
        onKeyDown={async (e) => e.key === 'Enter' && (await handleSend(e))}
        maxLength={1000}
        style={{ overflow: send.length === 0 ? 'hidden' : '' }}
        minRows={1}
        maxRows={21}
        ref={textarea}
      />
      <button
        className={cn(styles.smileIconWrapper)}
        tabIndex={tabIndexEighth === -1 ? (tabIndexSixth === 0 ? 0 : -1) : 0}
        onClick={handleButtonOpenEmoji}
      >
        <SmileIcon
          className={cn(styles.smileIcon, {
            [styles.emojiIconOn]: emoji,
          })}
        />
      </button>
      <button className={cn(styles.send)} onClick={handleSendClick} tabIndex={tabIndexSixth}>
        <SendIcon className={cn(styles.sendIcon)} />
      </button>
      <div
        className={cn(styles.emojiWrapper, {
          [styles.emojiWrapperOn]: emoji,
        })}
        tabIndex={tabIndexEighth}
      >
        <Picker
          theme={user?.theme ? 'dark' : 'light'}
          data={data}
          onEmojiSelect={handleEmoji}
          tabIndex={tabIndexEighth}
        />
      </div>
    </div>
  )
}
