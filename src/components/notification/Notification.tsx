import React from "react";
import cn from "classnames";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import { actionDeleteError, getCopy, getErrors, getLoading } from "store";
import { CopyIcon, LoadingIcon, InfoIcon, RemoveIcon } from "assets";

import { NotificationProps } from "./Notification.props";
import styles from "./Notification.module.css";

export const Notification = ({
  className,
  ...props
}: NotificationProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const errors: { text: string; id: any }[] = useAppSelector(getErrors);
  const loading: boolean = useAppSelector(getLoading);
  const copy: boolean = useAppSelector(getCopy);

  const handleRemove = (id) => {
    dispatch(actionDeleteError(id));
  };

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
      {errors !== null &&
        errors.map((error) => (
          <div key={error?.id} className={styles.error}>
            <span className={styles.errorIcon}>
              <InfoIcon />
            </span>
            <p>{error?.text}</p>
            <button
              className={styles.removeWrapper}
              onClick={() => handleRemove(error?.id)}
            >
              <RemoveIcon className={styles.removeIcon} />
            </button>
          </div>
        ))}
    </section>
  );
};
