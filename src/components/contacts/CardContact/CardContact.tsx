import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import cn from 'classnames'

import { SERVER_LINK } from 'utils/constants'
import { formateDateOnline, colorCard } from 'utils/helpers'
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useWindowSize,
} from 'utils/hooks'
import { IUser } from 'utils/interface'
import { deleteContact } from 'resolvers/contacts'
import { ButtonMenu } from 'components/layouts'
import { getUser } from 'store/select'
import { actionAddContact, actionAddTabIndexFirst, actionAddTabIndexSixth } from 'store/slice'

import { CardContactProps } from './CardContact.props'
import styles from './CardContact.module.css'

export const CardContact = ({
  className,
  contact,
  handleFocus,
  search,
  tabIndex,
  ...props
}: CardContactProps): JSX.Element => {
  const authorization = useAuthorization()
  const error = useError()
  const dispatch = useAppDispatch()
  const sizeWindow = useWindowSize()
  //store
  const user = useAppSelector(getUser)

  const [mutationFunctionDelete] = useMutation(deleteContact, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IUser>(data.deleteContact, actionAddContact)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [menu, setMenu] = useState(false)
  const [click, setClick] = useState(false)
  let timer
  //function delete contact
  const handleDeleteContact = async (): Promise<void> => {
    if (!search) {
      await mutationFunctionDelete({
        variables: {
          contact: { userId: Number(user?.id), contactId: Number(contact.id) },
        },
      })
    }
  }

  const color = colorCard(contact?.name.toUpperCase().split('')[0])

  const handleOnKeyDown = (e): void => {
    if (e.key === 'Enter') {
      handleFocus && handleFocus(contact)
      if (sizeWindow[0] < 1000) {
        dispatch(actionAddTabIndexFirst(-1))
        dispatch(actionAddTabIndexSixth(0))
      }
    }
    if (e.key === 'Delete') {
      setMenu(!menu)
    }
  }

  const handleOnTouchEnd = (): void => {
    setClick(false)
    if (!menu) {
      handleFocus && handleFocus(contact)
      clearTimeout(timer)
    }
  }

  const handleClientSet = (e) => {
    setTop(e.nativeEvent.layerY)
    if (e.nativeEvent.layerX > 210) {
      setLeft(e.nativeEvent.layerX - 200)
    } else setLeft(e.nativeEvent.layerX)
  }

  const handleMouseDown = (e): void => {
    setMenu(true)
    handleClientSet(e)
  }

  const handleOnTouchStart = (e): void => {
    setClick(true)
    timer = setTimeout(() => {
      setMenu(true)
      handleClientSet(e)
    }, 1000)
  }

  return (
    <li
      {...props}
      className={cn(className, styles.contacts, {
        [styles.contactActive]: click,
      })}
      onKeyDown={handleOnKeyDown}
      onMouseDown={(e) => e.buttons === 2 && handleMouseDown(e)}
      onTouchStart={handleOnTouchStart}
      onClick={() => handleFocus && handleFocus(contact)}
      onMouseUp={() => setClick(false)}
      onTouchEnd={handleOnTouchEnd}
      onMouseLeave={() => setMenu(false)}
      onContextMenu={(e) => {
        e.preventDefault()
        return false
      }}
      tabIndex={tabIndex}
    >
      <div
        className={styles.contactsPhoto}
        style={{
          background: contact.file ? '' : `linear-gradient(${color?.color1}, ${color?.color2})`,
        }}
      >
        {contact.file ? (
          <img
            className={styles.imageContact}
            src={`${SERVER_LINK}/images/${contact.file}`}
            alt='user img'
          />
        ) : (
          <span>
            {contact && contact.name.toUpperCase()[0]}
            {contact && contact.surname.toUpperCase()[0]}
          </span>
        )}
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.contactName}>
          {contact && contact.name} {contact && contact.surname}
        </span>
        <span className={styles.contactMessage}>
          {search
            ? '@' + contact?.username
            : contact?.online && formateDateOnline(new Date(contact?.online)).toLocaleLowerCase()}
        </span>
      </div>
      {!search && menu && (
        <ButtonMenu
          menu={menu}
          top={top}
          left={left}
          handleDelete={handleDeleteContact}
          text={'Delete'}
          tabIndex={menu ? 0 : -1}
        />
      )}
    </li>
  )
}
