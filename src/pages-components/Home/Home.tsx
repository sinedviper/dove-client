import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import cn from "classnames";

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { IChat, IMessage, IUser } from "utils/interface";
import {
  getfindMessageDate,
  getHaveMessages,
  getMessage,
} from "resolvers/messages";
import { getUserSender } from "resolvers/user";
import { formatDay } from "utils/helpers";
import { MessageCard, MessageHeader, MessageInput } from "components/message";
import { Settings } from "components";
import {
  actionAddFetch,
  actionAddLoading,
  actionAddMessages,
  actionAddMessagesLast,
  actionAddRecipient,
  getChat,
  getMenuMain,
  getMessages,
  getMessagesBefore,
  getRecipient,
  getTabIndexSeventh,
  getUser,
} from "store";

import { HomeProps } from "./Home.props";
import styles from "./Home.module.css";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const { username } = useParams();
  const error = useError();
  const dispatch = useAppDispatch();
  const authorization = useAuthorization();
  const authorizationHave = useAuthorizationSearch();

  //store
  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);
  const messagesBegore: IMessage[] | undefined =
    useAppSelector(getMessagesBefore);
  const main: boolean = useAppSelector(getMenuMain);
  const tabIndexSeventh: number = useAppSelector(getTabIndexSeventh);
  const [haveMessage, setHaveMassge] = useState<Date | null>(null);

  const [getFindLastMessage] = useLazyQuery(getfindMessageDate, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({
        data: data.findMessageDate,
        actionAdd: actionAddMessagesLast,
      });
    },
    onError(errorData) {
      chat && error(errorData.message + " getfindMessageDate");
    },
  });

  const { loading: loadingMessage } = useQuery(getMessage, {
    variables: {
      message: {
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({ data: data.getMessages, actionAdd: actionAddMessages });
      dispatch(actionAddFetch(false));
    },
    onError(errorData) {
      chat && error(errorData.message + " getMessage");
    },
    pollInterval: chat === undefined ? 300000 : 200,
  });

  // eslint-disable-next-line no-empty-pattern
  const {} = useQuery(getHaveMessages, {
    variables: {
      message: {
        id: Number(
          messagesBegore !== undefined
            ? messagesBegore?.[0]?.id
            : messages?.[0]?.id
        ),
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted(data) {
      setHaveMassge(authorizationHave({ data: data.haveMessageFind }));
    },
    onError(errorData) {
      chat && error(errorData.message + " getHaveMessages");
    },
  });

  const { loading: loadingSender } = useQuery(getUserSender, {
    variables: { input: { username } },
    onCompleted(data) {
      authorization({ data: data.getUser, actionAdd: actionAddRecipient });
      dispatch(actionAddFetch(false));
    },
    onError(errorData) {
      error(errorData.message + " getUserSender");
    },
    fetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const [settings, setSettings] = useState<boolean>(false);

  useEffect(() => {
    if (loadingMessage || loadingSender) {
      dispatch(actionAddLoading(true));
    }
    if (!loadingMessage || !loadingSender) {
      dispatch(actionAddLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessage, loadingSender]);

  return (
    <section
      className={cn(className, styles.wrapper, {
        [styles.wrapperMainOn]: main === true,
      })}
      {...props}
    >
      {user?.theme ? (
        <section className={styles.backgroundDark}></section>
      ) : (
        <section className={styles.backgroundLight}></section>
      )}
      <section className={styles.chatWrapper}>
        <MessageHeader setSettings={setSettings} settings={settings} />
        <section className={styles.chatsWrapper}>
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
        <div className={styles.inputWrap}>
          <MessageInput main={main} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings
          setSettings={setSettings}
          sender={sender}
          profile={true}
          tabIndex={tabIndexSeventh}
        />
      </section>
    </section>
  );
};
