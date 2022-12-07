import React from "react";
import cn from "classnames";

import { MessageListProps } from "./MessageList.props";
import styles from "./MessageList.module.css";
import { MessageCard } from "../MessageCard/MessageCard";
import { formatDay } from "utils/helpers";
import { useLazyQuery } from "@apollo/client";
import { useAuthorization, useError } from "utils/hooks";
import { getfindMessageDate } from "resolvers/messages";
import { actionAddMessagesLast } from "store";

export const MessageList = ({
  chat,
  haveMessage,
  user,
  messagesBegore,
  messages,
  className,
  ...props
}: MessageListProps): JSX.Element => {
  const error = useError();
  const authorization = useAuthorization();

  const [getFindLastMessage] = useLazyQuery(getfindMessageDate, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({
        data: data.findMessageDate,
        actionAdd: actionAddMessagesLast,
      });
    },
    onError(errorData) {
      chat && error(errorData.message);
    },
  });

  return (
    <section className={styles.chatsWrapper} {...props}>
      <ul className={cn(styles.messageWrapper)}>
        {chat && haveMessage !== null ? (
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
              })
            }
            className={styles.buttonLoadMessage}
          >
            {messagesBegore !== undefined
              ? formatDay(new Date(haveMessage))
              : messages && formatDay(new Date(haveMessage))}
          </button>
        ) : (
          ""
        )}
        {chat && messagesBegore && messagesBegore?.length !== 0 && (
          <div className={styles.wrapperWithDate}>
            <p className={styles.dateMessage}>
              {messagesBegore[0] &&
                formatDay(new Date(messagesBegore[0]?.createdAt))}
            </p>
          </div>
        )}
        {chat &&
          messagesBegore &&
          messagesBegore?.map((message, index) => {
            if (messagesBegore[index + 1]?.createdAt)
              if (
                new Date(message?.createdAt).getDate() !==
                new Date(messagesBegore[index + 1]?.createdAt).getDate()
              ) {
                return (
                  <div key={message?.id} className={styles.wrapperWithDate}>
                    <MessageCard
                      chat={chat}
                      message={message}
                      index={index}
                      user={user}
                      messages={messagesBegore}
                    />
                    <p className={styles.dateMessage}>
                      {formatDay(
                        new Date(messagesBegore[index + 1]?.createdAt)
                      )}
                    </p>
                  </div>
                );
              }
            return (
              <MessageCard
                chat={chat}
                message={message}
                index={index}
                user={user}
                messages={messagesBegore}
                key={message?.id}
              />
            );
          })}
        {chat && messages && messages.length !== 0 && (
          <div className={styles.wrapperWithDate}>
            <p className={styles.dateMessage}>
              {messages[0] && formatDay(new Date(messages[0]?.createdAt))}
            </p>
          </div>
        )}
        {messages &&
          chat &&
          messages?.map((message, index) => {
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
                );
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
            );
          })}
      </ul>
    </section>
  );
};
