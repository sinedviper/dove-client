import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import cn from 'classnames'
import ReactGA from 'react-ga'

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useAuthorizationData,
  useError,
} from 'utils/hooks'
import { IMessage, IUser } from 'utils/interface'
import { getHaveMessages, getMessage } from 'resolvers/messages'
import { getUserSender } from 'resolvers/user'
import { MessageHeader, MessageInput, MessageList } from 'components/message'
import { Settings } from 'components'
import {
  getFetch,
  getUser,
  getRecipient,
  getMessages,
  getMessagesBefore,
  getMenuMain,
  getTabIndexSeventh,
  getChatUser,
} from 'store/select'
import {
  actionHaveMessage,
  actionAddMessages,
  actionAddFetch,
  actionAddRecipient,
  actionAddLoading,
} from 'store/slice'

import { SideRightProps } from './SideRight.props'
import styles from './SideRight.module.css'

export const SideRight = ({ className, ...props }: SideRightProps): JSX.Element => {
  const { username } = useParams()
  const error = useError()
  const dispatch = useAppDispatch()
  const authorization = useAuthorization()
  const authorizationHave = useAuthorizationData()

  //store
  const fetch = useAppSelector(getFetch)
  const user = useAppSelector(getUser)
  const sender = useAppSelector(getRecipient)
  const chat = useAppSelector((state) => getChatUser(state, sender?.id))
  const messages = useAppSelector(getMessages)
  const messagesBefore = useAppSelector(getMessagesBefore)
  const main = useAppSelector(getMenuMain)
  const tabIndexSeventh = useAppSelector(getTabIndexSeventh)

  const [pollIntervalOne, setPollIntervalOne] = useState(200)

  ReactGA.pageview('/chattingwithuser')

  const { loading: loadingHaveMessage } = useQuery(getHaveMessages, {
    variables: {
      message: {
        id: Number(messagesBefore !== undefined ? messagesBefore?.[0]?.id : messages?.[0]?.id),
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const haveMessage = authorizationHave<Date | null>(data.haveMessageFind)
      if (haveMessage || haveMessage === null) dispatch(actionHaveMessage(haveMessage))
    },
    onError(errorData) {
      chat !== undefined && error(errorData.message)
    },
  })

  const { loading: loadingMessage } = useQuery(getMessage, {
    variables: {
      message: {
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      authorization<IMessage[]>(data.getMessages, actionAddMessages)
      setPollIntervalOne(200)
      fetch && dispatch(actionAddFetch(false))
    },
    onError() {
      setPollIntervalOne(10000)
    },
    pollInterval: pollIntervalOne,
  })

  const { loading: loadingSender } = useQuery(getUserSender, {
    variables: { input: { username } },
    onCompleted(data) {
      authorization<IUser>(data.getUser, actionAddRecipient)
      fetch && dispatch(actionAddFetch(false))
    },
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })

  const [settings, setSettings] = useState<boolean>(false)

  useEffect(() => {
    if (loadingMessage || loadingSender || loadingHaveMessage) {
      dispatch(actionAddLoading(true))
    }
    if ((!loadingMessage && !loadingSender) || !loadingHaveMessage) {
      dispatch(actionAddLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessage, loadingSender])

  return (
    <section
      className={cn(className, styles.wrapper, {
        [styles.wrapperMainOn]: main,
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
        <MessageList chat={chat} user={user} messagesBefore={messagesBefore} messages={messages} />
        <div className={styles.inputWrap}>
          <MessageInput main={main} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings,
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
  )
}
