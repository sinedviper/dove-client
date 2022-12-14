import React, { useState } from 'react'
import cn from 'classnames'
import ReactGA from 'react-ga'

import { useAppDispatch, useAppSelector, useWindowSize } from 'utils/hooks'
import { getUser } from 'store/select'
import {
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  actionAddTabIndexSeventh,
  actionMenuSetting,
  actionAddTabIndexFourth,
  actionMenuEdit,
  actionAddTabIndexFiveth,
} from 'store/slice'
import { BackIcon, EditIcon, RemoveIcon, RemoveUserIcon } from 'assets'

import { SettingsImageProps } from './SettingsImage.props'
import styles from './SettingsImage.module.css'

export const SettingsImage = ({
  className,
  setSettings,
  profile,
  handleRemoveUser,
  tabIndex,
  ...props
}: SettingsImageProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const windowSize = useWindowSize()

  const [deleteUser, setDeleteUser] = useState(false)

  const user = useAppSelector(getUser)

  const email = user?.email === 'test@gmail.com'

  const handleClickRemove = (): void => {
    if (setSettings) {
      setSettings(false)
      dispatch(actionAddTabIndexFirst(0))
      dispatch(actionAddTabIndexSixth(0))
      dispatch(actionAddTabIndexSeventh(-1))
      if (windowSize[0] < 1000) {
        dispatch(actionAddTabIndexFirst(-1))
        dispatch(actionAddTabIndexSixth(0))
      }
    }
    if (!setSettings) {
      dispatch(actionMenuSetting(false))
    }
  }

  const handleClickBack = (): void => {
    setSettings ? setSettings(false) : dispatch(actionMenuSetting(false))
    setDeleteUser(false)
    dispatch(actionAddTabIndexFourth(-1))
    dispatch(actionAddTabIndexFirst(0))
    dispatch(actionAddTabIndexSixth(0))
    if (windowSize[0] < 1000) {
      dispatch(actionAddTabIndexSixth(-1))
    }
  }

  const handleClickEdit = (): void => {
    ReactGA.pageview('/edits')
    setSettings ? setSettings(false) : dispatch(actionMenuEdit(true))
    setDeleteUser(false)
    dispatch(actionAddTabIndexFourth(-1))
    dispatch(actionAddTabIndexFiveth(0))
  }

  return (
    <div
      className={cn(className, styles.settingsHead)}
      onMouseLeave={() => setDeleteUser(false)}
      {...props}
    >
      <div>
        {profile ? (
          <button
            className={cn(styles.back, styles.backCorrect)}
            onClick={handleClickRemove}
            tabIndex={tabIndex}
          >
            <RemoveIcon className={styles.removeIcon} />
          </button>
        ) : (
          <button onClick={handleClickBack} className={styles.back} tabIndex={tabIndex}>
            <BackIcon className={styles.backIcon} />
          </button>
        )}
        <h2>{!profile ? 'Settings' : 'Profile'}</h2>
      </div>
      <div>
        {!profile && (
          <button className={styles.edit} onClick={handleClickEdit} tabIndex={tabIndex}>
            <EditIcon className={styles.editIcon} />
          </button>
        )}
        {!profile && !email && (
          <>
            <button
              className={styles.delete}
              onClick={() => setDeleteUser(!deleteUser)}
              tabIndex={tabIndex}
            >
              <span className={styles.dot}></span>
            </button>
            <div
              className={cn(styles.deleteWrapper, {
                [styles.openDelWrap]: deleteUser,
              })}
            >
              <button
                className={styles.deleteButton}
                onClick={handleRemoveUser}
                tabIndex={deleteUser ? 0 : -1}
              >
                <RemoveUserIcon className={styles.removeIcon} />
                <span>Delete account</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
