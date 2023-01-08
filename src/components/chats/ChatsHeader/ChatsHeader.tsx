import React, { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import cn from 'classnames'
import ReactGA from 'react-ga'
import { useNavigate } from 'react-router-dom'

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useExit,
  useWindowSize,
} from 'utils/hooks'
import { IImage, IUser } from 'utils/interface'
import { getUploads } from 'resolvers/upload'
import { useTheme } from 'utils/context'
import { animation, theme } from 'utils/constants'
import { updateUser } from 'resolvers/user'
import { getContact } from 'resolvers/contacts'
import { ButtonMenuMain, Search } from 'components/layouts'
import {
  getUser,
  getTabIndexFirst,
  getTabIndexThree,
  getTabIndexFourth,
  getTabIndexFiveth,
  getTabIndexSixth,
  getMenuMain,
} from 'store/select'
import {
  actionAddUser,
  actionAddContact,
  actionAddImageUser,
  actionMenuContact,
  actionAddTabIndexFirst,
  actionAddTabIndexThree,
  actionMenuSetting,
  actionAddTabIndexFourth,
  actionAddTabIndexSixth,
  actionMenuMain,
  actionMenuBugs,
  actionAddTabIndexSecond,
} from 'store/slice'

import { ChatsHeaderProps } from './ChatsHeader.props'
import styles from './ChatsHeader.module.css'

export const ChatsHeader = ({
  searchContact,
  setSwiper,
  setSearchUser,
  searchUser,
  valueAll,
  setValueAll,
  className,
  ...props
}: ChatsHeaderProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const themeChange = useTheme()
  const error = useError()
  const exit = useExit()
  const authorization = useAuthorization()
  const windowSize = useWindowSize()

  const [menu, setMenu] = useState(false)

  //store
  const user = useAppSelector(getUser)
  const tabIndexFirst = useAppSelector(getTabIndexFirst)
  const tabIndexThree = useAppSelector(getTabIndexThree)
  const tabIndexFourth = useAppSelector(getTabIndexFourth)
  const tabIndexFiftieth = useAppSelector(getTabIndexFiveth)
  const tabIndexSixth = useAppSelector(getTabIndexSixth)
  const main = useAppSelector(getMenuMain)

  const tabIndexButton: number =
    tabIndexThree === 0 || tabIndexFourth === 0 || tabIndexFiftieth === 0 ? -1 : 0
  const tabIndexSearch: number = menu
    ? -1
    : tabIndexSixth === 0
    ? -1
    : tabIndexThree === 0 || tabIndexFourth === 0 || tabIndexFiftieth === 0
    ? -1
    : 0

  const [mutationFunctionUser] = useMutation(updateUser, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IUser>(data.updateUser, actionAddUser)
      themeChange?.changeAnimation(
        user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF,
      )
      themeChange?.changeTheme(user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const [queryFunctionContactGet] = useLazyQuery(getContact, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IUser[]>(data.getContact, actionAddContact)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const [queryFunctionImageGet] = useLazyQuery(getUploads, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IImage[]>(data.getUpload, actionAddImageUser)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  //the function of obtaining contacts when opened in the menu
  const handleContact = async (): Promise<void> => {
    ReactGA.pageview('/contact')
    await queryFunctionContactGet()
    dispatch(actionMenuContact(true))
    setMenu(false)
    setTimeout(() => searchContact?.current?.focus(), 300)
    dispatch(actionAddTabIndexFirst(-1))
    dispatch(actionAddTabIndexThree(0))
  }
  //the function of opening settings, and downloading data to the store
  const handleSettings = async (): Promise<void> => {
    ReactGA.pageview('/setting')
    await queryFunctionImageGet()
    dispatch(actionMenuSetting(true))
    setMenu(false)
    dispatch(actionAddTabIndexFirst(-1))
    dispatch(actionAddTabIndexFourth(0))
    dispatch(actionAddTabIndexSixth(-1))
  }
  //the function for mouse
  const handleLeaveMouseInBlockChats = (): void => {
    menu && setMenu(false)
    setSwiper(false)
  }
  //then function for change theme
  const handleTheme = async (): Promise<void> => {
    await mutationFunctionUser({
      variables: { input: { theme: !user?.theme } },
    })
  }
  //the function for change animation
  const handleAnimation = async (): Promise<void> => {
    await mutationFunctionUser({
      variables: { input: { animation: !user?.animation } },
    })
  }

  const handleSavedMessage = (): void => {
    ReactGA.pageview('/savemessage')
    setMenu(false)
    dispatch(actionAddTabIndexFirst(windowSize[0] < 1000 ? -1 : 0))
    dispatch(actionAddTabIndexSixth(0))
    dispatch(actionMenuMain(!main))
    navigate(`${user?.username}`)
  }

  const handleBugs = (): void => {
    ReactGA.pageview('/bugs')
    dispatch(actionMenuBugs(true))
    setMenu(false)
    navigate(`/bugs`)
  }

  const handleClick = (): void => {
    if (searchUser) {
      setSearchUser(false)
      setValueAll('')
      dispatch(actionAddTabIndexFirst(0))
      dispatch(actionAddTabIndexSecond(-1))
      dispatch(actionAddTabIndexSixth(0))
      if (windowSize[0] < 1000) {
        dispatch(actionAddTabIndexSixth(-1))
      }
    }
    if (!searchUser) {
      setMenu(!menu)
      dispatch(actionAddTabIndexFirst(tabIndexFirst === 0 ? -1 : 0))
      dispatch(actionAddTabIndexSixth(tabIndexSixth === 0 ? -1 : 0))
      if (windowSize[0] < 1000) {
        dispatch(actionAddTabIndexSixth(-1))
      }
    }
  }

  return (
    <nav
      className={cn(className, styles.menuWrapper)}
      onMouseLeave={handleLeaveMouseInBlockChats}
      {...props}
    >
      <button className={styles.menu} tabIndex={tabIndexButton} onClick={handleClick}>
        <span
          className={cn(styles.line, {
            [styles.lineBack]: searchUser,
          })}
        ></span>
      </button>
      <Search
        value={valueAll}
        setValue={setValueAll}
        setSearchUser={setSearchUser}
        setMenu={setMenu}
        tabIndex={tabIndexSearch}
      />
      <div
        className={cn(styles.menuClose, {
          [styles.menuOpen]: menu,
        })}
        style={{ display: menu ? 'block' : 'none' }}
      >
        <ButtonMenuMain text={'Saved Message'} handleAction={handleSavedMessage} action={'saved'} />
        <ButtonMenuMain text={'Contacts'} handleAction={handleContact} action={'contact'} />
        <ButtonMenuMain text={'Settings'} handleAction={handleSettings} action={'setting'} />
        <ButtonMenuMain
          text={'Dark mode'}
          handleAction={handleTheme}
          action={'theme'}
          theme={user?.theme}
        />
        <ButtonMenuMain
          text={'Animations'}
          handleAction={handleAnimation}
          action={'animation'}
          theme={user?.animation}
        />
        <ButtonMenuMain text={'Bugs report'} handleAction={handleBugs} action={'bugs'} />
        <ButtonMenuMain text={'Log Out'} handleAction={() => exit()} action={'out'} />
        <a
          rel='noreferrer'
          href='https://github.com/sinedviper'
          target='_blank'
          className={styles.creator}
        >
          github repyev denis
        </a>
      </div>
    </nav>
  )
}
