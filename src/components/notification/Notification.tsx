import React from 'react'
import cn from 'classnames'

import { useAppDispatch, useAppSelector } from 'utils/hooks'
import { CopyIcon, LoadingIcon, InfoIcon, RemoveIcon } from 'assets'
import { getErrors, getLoading, getCopy } from 'store/select'
import { actionDeleteError } from 'store/slice'

import { NotificationProps } from './Notification.props'
import styles from './Notification.module.css'

export const Notification = ({ className, ...props }: NotificationProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const errors = useAppSelector(getErrors)
  const loading: boolean = useAppSelector(getLoading)
  const copy: boolean = useAppSelector(getCopy)
  //remove error layout
  const handleRemove = (id: string): void => {
    dispatch(actionDeleteError(id))
  }

  return (
    <section className={cn(className, styles.loadingWrapper)} {...props}>
      {copy && (
        <div className={cn(styles.loading, styles.copy)}>
          <span className={styles.copyIcon}>
            <CopyIcon />
          </span>
          <p>Row copied</p>
        </div>
      )}
      {loading && (
        <div className={styles.loading}>
          <span className={styles.loadingIcon}>
            <LoadingIcon />
          </span>
          <p>Loading data...</p>
        </div>
      )}
      {errors &&
        errors.map((error) => (
          <div key={error.id} className={styles.error}>
            <span className={styles.errorIcon}>
              <InfoIcon />
            </span>
            <p>{error?.text}</p>
            <button
              className={styles.removeWrapper}
              onClick={() => handleRemove(error.id)}
              tabIndex={0}
            >
              <RemoveIcon className={styles.removeIcon} />
            </button>
          </div>
        ))}
    </section>
  )
}
