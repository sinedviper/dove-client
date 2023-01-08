import React, { useEffect, useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames'
import ReactGA from 'react-ga'

import { useAuthorization, useError } from 'utils/hooks'
import { useTheme } from 'utils/context'
import { IUser } from 'utils/interface'
import { getMe, loginUser } from 'resolvers/user'
import { Input } from 'components/layouts'
import { actionAddUser } from 'store/slice'
import { DoveIcon, LoadingIcon } from 'assets'

import { FormLoginProps } from './FormLogin.props'
import styles from './FormLogin.module.css'

export const FormLogin = ({ className, ...props }: FormLoginProps): JSX.Element => {
  const navigate = useNavigate()
  const themeChange = useTheme()
  const error = useError()
  const authorization = useAuthorization()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)

  const [queryFunctionUser, { loading: loadingQueryUser }] = useLazyQuery(getMe, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IUser>(data.getMe, actionAddUser)
      navigate('/')
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const [mutateFunction, { loading: loadingMutation }] = useMutation(loginUser, {
    fetchPolicy: 'network-only',
  })

  ReactGA.pageview('/login')

  //when a user logs in sends data and receives a user token
  const onSubmit = async (): Promise<void> => {
    if (
      password.trim().length < 8 ||
      password.trim().length > 40 ||
      email.trim().length < 3 ||
      email.trim().length > 40
    ) {
      setErrorEmail(true)
      setErrorPassword(true)
      error('Please enter the correct fields')
    } else {
      setErrorEmail(false)
      setErrorPassword(false)
      await mutateFunction({ variables: { input: { password, email } } }).then(async (res) => {
        const data = res?.data.loginUser
        if (data.status === 'Invalid') {
          setErrorEmail(true)
          setErrorPassword(true)
          error(data.message)
        }
        if (data.status === 'Success') {
          setErrorEmail(false)
          setErrorPassword(false)
          localStorage.setItem('token', data.access_token)
          await queryFunctionUser()
        }
      })
    }
  }
  //keeps track of the theme of the system
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeChange?.changeTheme('dark')
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      themeChange?.changeTheme('light')
    }
  }, [themeChange])

  return (
    <>
      <section className={cn(className, styles.form)} {...props}>
        <DoveIcon className={styles.svg} />
        <h2 className={styles.head}>Login in Dove</h2>
        <p className={styles.text}>Please enter your full email and enter your full password.</p>
        <p className={styles.text}>
          Note that you need an existing account to log in to Dove. To sign up for Dove, use the
          link down.
        </p>
        <div className={styles.login}>
          <Input
            text={email}
            setText={setEmail}
            placeholderName={'Email'}
            error={errorEmail}
            notification={true}
            notificationText={'Email must be between 3 and 40 characters'}
          />
          <Input
            text={password}
            setText={setPassword}
            error={errorPassword}
            placeholderName={'Password'}
            password={true}
            notification={true}
            notificationText={'Password must be between 8 and 40 characters'}
          />
          <button onClick={onSubmit} className={styles.button}>
            <p>NEXT</p>
            <span className={styles.loading}>
              {loadingMutation || loadingQueryUser ? <LoadingIcon /> : ''}
            </span>
          </button>
          <p className={styles.link}>
            <span
              className={styles.reg}
              onClick={() => navigate('/signup')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/signup')}
              tabIndex={0}
            >
              SIGN UP
            </span>
          </p>
          <p className={styles.link}>
            <span
              className={styles.reg}
              onClick={() => navigate('/confirmation')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/confirmation')}
              tabIndex={0}
            >
              CONFIRMATION
            </span>
          </p>
        </div>
      </section>
    </>
  )
}
