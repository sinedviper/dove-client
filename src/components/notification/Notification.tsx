import React from "react";
import cn from "classnames";

import { useAppSelector } from "utils/hooks";
import { getCopy, getErrors, getLoading } from "store";
import { CopyIcon, LoadingIcon, InfoIcon } from "assets";

import { NotificationProps } from "./Notification.props";
import styles from "./Notification.module.css";

export const Notification = ({
  className,
  ...props
}: NotificationProps): JSX.Element => {
  const errors: { text: string; id: any }[] = useAppSelector(getErrors);
  const loading: boolean = useAppSelector(getLoading);
  const copy: boolean = useAppSelector(getCopy);

  return (
    <section className={cn(className, styles.loadingWrapper)} {...props}>
      {copy && (
        <div className={cn(styles.loading, styles.copy)}>
          <span className={styles.copyIcon}>
            <CopyIcon />
          </span>
          <p>Copy</p>
        </div>
      )}
      {loading && (
        <div className={styles.loading}>
          <span className={styles.loadingIcon}>
            <LoadingIcon />
          </span>
          <p>loading...</p>
        </div>
      )}
      {errors !== null &&
        errors.map((error) => (
          <div key={error?.id} className={styles.error}>
            <span className={styles.errorIcon}>
              <InfoIcon />
            </span>
            <p>{error?.text}</p>
          </div>
        ))}
    </section>
  );
};
