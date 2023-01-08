import React, { useRef, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import cn from 'classnames'
import ReactGA from 'react-ga'

import { minutesFormat } from 'utils/helpers'
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useDebounce,
  useError,
  useExit,
  useWindowSize,
} from 'utils/hooks'
import { useTheme } from 'utils/context'
import { theme, animation } from 'utils/constants'
import { IChat, IContact, IUser } from 'utils/interface'
import { getContact } from 'resolvers/contacts'
import { updateUserOnline } from 'resolvers/user'
import { getChats } from 'resolvers/chats'
import { Contacts } from 'components/contacts'
import { Edits } from 'components/forms'
import { Chats } from 'components/chats'
import { Settings, Notification } from 'components'
import { getFetch, getUser, getMenuMain, getTabIndexFourth } from 'store/select'
import {
  actionAddUser,
  actionAddContact,
  actionAddFetch,
  actionAddChats,
  actionMenuMain,
  actionAddLoading,
  actionAddTabIndexSixth,
  actionMenuBugs,
} from 'store/slice'

import { SideLeftProps } from './SideLeft.props'
import styles from './SideLeft.module.css'

// that left block in display, here all function what update data in store
export const SideLeft = ({ className, ...props }: SideLeftProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const themeChange = useTheme()
  const exit = useExit()
  const authorization = useAuthorization()
  const sizeWindow = useWindowSize()
  const navigate = useNavigate()
  const error = useError()

  const [pollIntervalOne, setPollIntervalOne] = useState(200)

  ReactGA.pageview('/')

  const [mutationUserOnlineFunction] = useMutation(updateUserOnline, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      authorization<IUser>(data.updateUserOnline, actionAddUser)
    },
  })

  const { loading: loadQueryContact } = useQuery(getContact, {
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      authorization<IContact[]>(data.getContacts, actionAddContact)
      fetch && dispatch(actionAddFetch(false))
    },
  })

  const { loading: loadQueryChat } = useQuery(getChats, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IChat[]>(data.getChats, actionAddChats)
      setPollIntervalOne(200)
      fetch && dispatch(actionAddFetch(false))
    },
    onError() {
      setPollIntervalOne(10000)
    },
    pollInterval: pollIntervalOne,
  })

  const searchContact = useRef<HTMLInputElement>(null)

  const fetch = useAppSelector(getFetch)
  const user = useAppSelector(getUser)
  const main = useAppSelector(getMenuMain)
  const getIndexFourth = useAppSelector(getTabIndexFourth)

  const token: string | null = localStorage.getItem('token')

  const debouncedMutation = useDebounce(() => {
    mutationUserOnlineFunction({ variables: { input: { online: 'ping' } } }).catch((err) =>
      error(err.message()),
    )
  }, 300000)

  const userOnlineUpdate = () =>
    user?.online && minutesFormat(new Date(), new Date(user?.online)) > 4
      ? mutationUserOnlineFunction({
          variables: { input: { online: 'ping' } },
        })
      : debouncedMutation

  //here if size many 1000 to block left have show in display
  useEffect(() => {
    if (sizeWindow[0] > 1000) {
      dispatch(actionMenuMain(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeWindow[0]])

  //here we push in store true when data loading
  useEffect(() => {
    //loading
    if (loadQueryContact || loadQueryChat) dispatch(actionAddLoading(true))
    if (!loadQueryContact && !loadQueryChat) dispatch(actionAddLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQueryChat, loadQueryContact])

  //here change theme when user change theme in menu in left block
  useEffect(() => {
    themeChange?.changeTheme(user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT)
    themeChange?.changeAnimation(user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF)
  }, [user?.animation, user?.theme])

  //when user open site first that dispatch in store what menu show and right block not tab because in right block not have chat
  useEffect(() => {
    if (sizeWindow[0] < 1000) {
      dispatch(actionMenuMain(true))
      dispatch(actionAddTabIndexSixth(-1))
    }
    dispatch(actionMenuBugs(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!token) {
      exit()
      navigate('/login')
    }
  }, [exit, navigate, token])

  return (
    <main
      className={cn(className, styles.main)}
      onKeyDown={userOnlineUpdate}
      onTouchStart={userOnlineUpdate}
      {...props}
    >
      <Notification />
      <section
        className={cn(styles.chatWrapper, {
          [styles.chatWrapperOn]: main,
        })}
      >
        <Chats searchContact={searchContact} />
        <Contacts searchContact={searchContact} />
        <Settings tabIndex={getIndexFourth} />
        <Edits />
      </section>
      <Outlet />
    </main>
  )
}
