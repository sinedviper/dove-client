import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import cn from 'classnames'

import { BookmarkIcon, CheckIcon } from 'assets'
import { IChat } from 'utils/interface'
import { SERVER_LINK } from 'utils/constants'
import { colorCard, formateDate } from 'utils/helpers'
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useWindowSize,
} from 'utils/hooks'
import { removeChat } from 'resolvers/chats'
import { ButtonMenu } from 'components/layouts'
import {
  actionAddChats,
  actionAddRecipient,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  actionClearMessages,
  actionClearRecipient,
  actionMenuMain,
} from 'store/slice'
import { getUser } from 'store/select'

import { CardChatProps } from './CardChat.props'
import styles from './CardChat.module.css'

export const CardChat = ({
  className,
  tabIndex,
  chat: { id, user, lastMessage, image },
  ...props
}: CardChatProps): JSX.Element => {
  const { username } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const error = useError()
  const authorization = useAuthorization()
  const windowSize = useWindowSize()

  const [mutationFunction] = useMutation(removeChat, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IChat[]>(data.deleteChat, actionAddChats)
      dispatch(actionAddTabIndexSixth(-1))
      navigate('')
    },
    onError(errorData) {
      error(errorData.message)
    },
  })
  //store
  const userMain = useAppSelector(getUser)

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [menu, setMenu] = useState(false)
  let timer

  const color = colorCard(user.name.toUpperCase()[0])
  //function to process the request when clicking on the chat
  const handleFocus = (): void => {
    if (String(user.username) !== String(username)) {
      dispatch(actionClearMessages())
      dispatch(actionClearRecipient())
      dispatch(actionAddRecipient(user))
      dispatch(actionAddTabIndexSixth(0))
      navigate(`${user.username}`)
    }
    if (windowSize[0] < 1000) {
      dispatch(actionMenuMain(false))
      dispatch(actionAddTabIndexFirst(-1))
    }
  }
  //function delete chat
  const handleDeleteChat = async (): Promise<void> => {
    await mutationFunction({ variables: { idChat: Number(id) } })
  }

  const handleSetPosition = (e): void => {
    setTop(e.nativeEvent.layerY)
    if (e.nativeEvent.layerX > 210) {
      setLeft(e.nativeEvent.layerX - 200)
    } else setLeft(e.nativeEvent.layerX)
  }

  const handleTouchStart = (e): void => {
    timer = setTimeout(() => {
      setMenu(true)
      handleSetPosition(e)
    }, 1000)
  }

  const handleMouseDown = (e): void => {
    setMenu(true)
    handleSetPosition(e)
  }

  const handleKeyDown = (e): void => {
    if (e.key === 'Enter') {
      handleFocus()
      if (windowSize[0] < 1000) {
        dispatch(actionAddTabIndexFirst(-1))
        dispatch(actionAddTabIndexSixth(0))
      }
    }
    if (e.key === 'Delete') {
      setMenu(!menu)
    }
  }

  return (
    <li
      tabIndex={tabIndex}
      className={cn(className, styles.contacts, {
        [styles.contactActive]: username === user.username,
      })}
      onClick={handleFocus}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => !menu && clearTimeout(timer)}
      onMouseLeave={() => setMenu(false)}
      onMouseDown={(e) => e.buttons === 2 && handleMouseDown(e)}
      onContextMenu={(e) => {
        e.preventDefault()
        return false
      }}
      {...props}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: !image ? `linear-gradient(${color?.color1}, ${color?.color2})` : '',
        }}
      >
        {userMain?.username === user.username ? (
          <span
            className={cn(styles.bookMarkerWrapper, {
              [styles.bookMarkerWrapperOn]: username === user.username,
            })}
          >
            <BookmarkIcon />
          </span>
        ) : !image ? (
          <span>
            {user.name && user.name.toUpperCase()[0]}
            {user.surname && user.surname.toUpperCase()[0]}
          </span>
        ) : (
          <span>
            <img src={`${SERVER_LINK}/images/${image?.file}`} alt='user' />
          </span>
        )}
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {userMain?.username === user.username ? (
            'Saved Message'
          ) : (
            <>{`${user.name && user.name} ${user?.surname && user.surname}`}</>
          )}
        </span>
        <span className={styles.contactMessage}>{lastMessage && lastMessage.text}</span>
      </div>
      <div className={styles.contactDate}>
        {userMain?.username !== user.username && (
          <CheckIcon
            className={cn(styles.wrapperIcon, {
              [styles.wrapperIconOne]: username !== user.username && lastMessage?.read,
              [styles.wrapperIconMark]: username === user.username && lastMessage?.read,
              [styles.wrapperIconMarkNotRead]: username === user.username && !lastMessage?.read,
            })}
          />
        )}
        <span>{lastMessage && formateDate(new Date(lastMessage.createdAt))}</span>
      </div>
      {menu && (
        <ButtonMenu
          top={top}
          left={left}
          menu={menu}
          handleDelete={handleDeleteChat}
          text={'Delete'}
          tabIndex={menu ? 0 : -1}
        />
      )}
    </li>
  )
}
