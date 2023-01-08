import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames'
import { useMutation } from '@apollo/client'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { DoveIcon, LoadingIcon } from 'assets'
import { useTheme } from 'utils/context'
import { useAppDispatch, useAppSelector, useAuthorizationData, useError } from 'utils/hooks'
import { SERVER_LINK } from 'utils/constants'
import { sendReportBugs } from 'resolvers/user'
import { getUser, getImageUser } from 'store/select'
import { actionMenuBugs } from 'store/slice'

import { FormBugsProps } from './FormBugs.props'
import styles from './FormBugs.module.css'

export const FormBugs = ({ className, ...props }: FormBugsProps): JSX.Element => {
  const navigate = useNavigate()
  const error = useError()
  const dispatch = useAppDispatch()
  const authorizationData = useAuthorizationData()
  const themeChange = useTheme()

  const [sendReportBugsMutation, { loading: loadingSendBugs }] = useMutation(sendReportBugs, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorizationData(data.sendReport)
      dispatch(actionMenuBugs(false))
      navigate('/')
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const user = useAppSelector(getUser)
  const image = useAppSelector(getImageUser)?.[0]

  const [bugs, setBugs] = useState('')

  //need send bugs in email
  const onSubmit = async (): Promise<void> => {
    if (bugs.replaceAll(' ', '') === '' || bugs.length < 20) {
      error('Please at least 20 characters')
    } else {
      await sendReportBugsMutation({ variables: { text: bugs } })
    }
  }

  const handleClick = (): void => {
    dispatch(actionMenuBugs(false))
    navigate('/')
  }

  useEffect(() => {
    if (user?.theme) {
      themeChange?.changeTheme('dark')
    }

    if (!user?.theme) {
      themeChange?.changeTheme('light')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeChange])

  return (
    <>
      <section className={cn(className, styles.form)} {...props}>
        <DoveIcon className={styles.svg} />
        <h2 className={styles.head}>Submit your bug in the Dove system</h2>
        <p className={styles.text}>Please indicate your bug in the field below</p>
        <div className={styles.informationUser}>
          <img src={`${SERVER_LINK}/images/${image?.file}`} alt='user' />
          <div>
            <span>
              Username: <p>{user?.username}</p>
            </span>
            <span>
              Email:<p>{user?.email}</p>
            </span>
          </div>
        </div>
        <div className={styles.login}>
          <ReactTextareaAutosize
            value={bugs}
            onChange={(e) => setBugs(e.target.value)}
            minRows={15}
            maxRows={30}
            className={styles.input}
            maxLength={1000}
          />
          <button onClick={onSubmit} className={styles.button}>
            <p>SEND</p>
            <span className={styles.loading}>{loadingSendBugs ? <LoadingIcon /> : ''}</span>
          </button>
          <p className={styles.link}>
            <span
              className={styles.reg}
              onClick={handleClick}
              onKeyDown={(e) => e.key === 'Enter' && handleClick()}
              tabIndex={0}
            >
              BACK
            </span>
          </p>
        </div>
      </section>
    </>
  )
}
