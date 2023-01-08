import React from 'react'
import cn from 'classnames'
import { useLazyQuery } from '@apollo/client'

import { formatDay } from 'utils/helpers'
import { IMessage } from 'utils/interface'
import { useAppSelector, useAuthorization, useError } from 'utils/hooks'
import { getfindMessageDate } from 'resolvers/messages'
import { getHaveMessage } from 'store/select'
import { actionAddMessagesLast } from 'store/slice'

import { MessageCard } from '../'
import { MessageListProps } from './MessageList.props'
import styles from './MessageList.module.css'

export const MessageList = ({
  chat,
  user,
  messagesBefore,
  messages,
  className,
  ...props
}: MessageListProps): JSX.Element => {
  const error = useError()
  const authorization = useAuthorization()

  const haveMessage = useAppSelector(getHaveMessage)

  const [getFindLastMessage] = useLazyQuery(getfindMessageDate, {
    fetchPolicy: 'network-only',
    onError(errorData) {
      chat && error(errorData.message)
    },
  })

  return (
    <section className={cn(className, styles.chatsWrapper)} {...props}>
      <ul className={cn(styles.messageWrapper)}>
        {chat && haveMessage ? (
          <button
            tabIndex={-1}
            onClick={async () =>
              await getFindLastMessage({
                variables: {
                  message: {
                    dataLastMessage: String(haveMessage),
                    chatId: Number(chat?.id),
                    senderMessage: Number(user?.id),
                  },
                },
              }).then((data) => {
                authorization<IMessage[]>(data.data.findMessageDate, actionAddMessagesLast)
              })
            }
            className={styles.buttonLoadMessage}
          >
            {messagesBefore
              ? formatDay(new Date(haveMessage))
              : messages && formatDay(new Date(haveMessage))}
          </button>
        ) : (
          ''
        )}
        {chat && messagesBefore && messagesBefore.length !== 0 && (
          <div className={styles.wrapperWithDate}>
            <p className={styles.dateMessage}>
              {messagesBefore[0] && formatDay(new Date(messagesBefore[0]?.createdAt))}
            </p>
          </div>
        )}
        {chat &&
          messagesBefore &&
          messagesBefore.map((message, index) => {
            if (messagesBefore[index + 1]?.createdAt)
              if (
                new Date(message?.createdAt).getDate() !==
                new Date(messagesBefore[index + 1]?.createdAt).getDate()
              ) {
                return (
                  <div key={message?.id} className={styles.wrapperWithDate}>
                    <MessageCard
                      chat={chat}
                      message={message}
                      index={index}
                      user={user}
                      messages={messagesBefore}
                    />
                    <p className={styles.dateMessage}>
                      {formatDay(new Date(messagesBefore[index + 1]?.createdAt))}
                    </p>
                  </div>
                )
              }
            return (
              <MessageCard
                chat={chat}
                message={message}
                index={index}
                user={user}
                messages={messagesBefore}
                key={message?.id}
              />
            )
          })}
        {chat && messages && messages.length !== 0 && (
          <div className={styles.wrapperWithDate}>
            <p className={styles.dateMessage}>
              {messages[0] && formatDay(new Date(messages[0]?.createdAt))}
            </p>
          </div>
        )}
        {chat &&
          messages &&
          messages.map((message, index) => {
            if (messages[index + 1]?.createdAt)
              if (
                new Date(message?.createdAt).getDate() !==
                new Date(messages[index + 1]?.createdAt).getDate()
              ) {
                return (
                  <div key={message.id} className={styles.wrapperWithDate}>
                    <MessageCard
                      chat={chat}
                      message={message}
                      index={index}
                      user={user}
                      messages={messages}
                    />
                    <p className={styles.dateMessage}>
                      {formatDay(new Date(messages[index + 1].createdAt))}
                    </p>
                  </div>
                )
              }
            return (
              <MessageCard
                chat={chat}
                message={message}
                index={index}
                user={user}
                messages={messages}
                key={message.id}
              />
            )
          })}
      </ul>
    </section>
  )
}
