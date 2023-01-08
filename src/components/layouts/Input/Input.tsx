import React, { ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import { EyeCloseIcon, EyeIcon, InfoIcon } from 'assets'

import { InputProps } from './Input.props'
import styles from './Input.module.css'

// eslint-disable-next-line react/display-name
export const Input = forwardRef(
  (
    {
      password = false,
      check = false,
      error,
      text,
      setText,
      placeholderName,
      className,
      tabIndex,
      setPassword = undefined,
      notification = false,
      notificationText = 'Please enter correctly',
      textCheckPassNew,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const [eye, setEye] = useState(true)
    const [type, setType] = useState(false)
    const [value, setValue] = useState('')
    const [notifica, setNotifica] = useState(false)

    const checkValue: boolean = (text && text.trim().length !== 0) || value.trim().length !== 0

    const handleCheckPass = useCallback((): number => {
      let check = 0
      if ((text && text.search(/[A-Z]/g) >= 0) || value.search(/[A-Z]/g) >= 0) {
        check++
      }

      if ((text && text.search(/[0-9]/g) >= 0) || value.search(/[0-9]/g) >= 0) {
        check++
      }

      if ((text && text.length >= 8) || value.length >= 8) {
        check++
      }

      return check
    }, [text, value])

    useEffect(() => {
      if (check)
        if (setPassword !== undefined) {
          setPassword(handleCheckPass())
        }
    }, [check, setPassword, handleCheckPass])

    return (
      <div className={cn(styles.wrapper)}>
        <label
          className={cn(styles.placeholder, {
            [styles.labelOn]: type,
            [styles.errorLabel]: error,
          })}
        >
          {placeholderName}
          {error && ' Invalid'}
        </label>
        <input
          tabIndex={tabIndex}
          className={cn(className, styles.input, {
            [styles.error]: error,
            [styles.password]: password,
            [styles.checkPasswordNes]:
              (textCheckPassNew && textCheckPassNew !== value) ||
              (textCheckPassNew && textCheckPassNew !== text),
            [styles.checkPasswordNesOn]:
              (textCheckPassNew && textCheckPassNew === value) ||
              (textCheckPassNew && textCheckPassNew === text),
          })}
          ref={ref}
          onFocus={() => setType(true)}
          type={password && eye ? 'password' : 'text'}
          value={text ? text : value}
          onBlurCapture={() => setType(false)}
          {...props}
          onChange={(e) => {
            setText ? setText(e.target.value) : setValue(e.target.value)
          }}
        />
        <span className={styles.eyeWrapper}>
          {password === true ? (
            eye ? (
              <EyeIcon
                className={cn(styles.eye, {
                  [styles.eyeOn]: type,
                  [styles.errorOn]: error,
                })}
                onClick={() => setEye(false)}
                tabIndex={tabIndex}
                onKeyDown={(e) => e.key === 'Enter' && setEye(false)}
              />
            ) : (
              <EyeCloseIcon
                className={cn(styles.eye, {
                  [styles.eyeOn]: type,
                  [styles.errorOn]: error,
                })}
                onClick={() => setEye(true)}
                tabIndex={tabIndex}
                onKeyDown={(e) => e.key === 'Enter' && setEye(true)}
              />
            )
          ) : (
            ''
          )}
        </span>
        {password && check && (
          <span className={styles.checkWrapper}>
            <span
              className={cn(styles.checkOne, {
                [styles.checkOn]: checkValue,
                [styles.checkText]: handleCheckPass() >= 1,
              })}
            ></span>
            <span
              className={cn(styles.checkTwo, {
                [styles.checkOn]: checkValue,
                [styles.checkText]: handleCheckPass() >= 2,
                [styles.checkTextBefore]: handleCheckPass() < 2 && handleCheckPass() > 0,
              })}
            ></span>
            <span
              className={cn(styles.checkThree, {
                [styles.checkOn]: checkValue,
                [styles.checkText]: handleCheckPass() === 3,
                [styles.checkTextBefore]: handleCheckPass() < 3 && handleCheckPass() > 0,
              })}
            ></span>
          </span>
        )}
        {notification && (
          <>
            <span
              className={styles.infoIcon}
              onMouseMove={() => setNotifica(true)}
              onMouseLeave={() => setNotifica(false)}
              onKeyDown={(e) => e.key === 'Enter' && setNotifica(!notifica)}
              tabIndex={tabIndex}
            >
              <InfoIcon />
            </span>
            {notifica && <span className={styles.notificaText}>{notificationText}</span>}
          </>
        )}
      </div>
    )
  },
)
