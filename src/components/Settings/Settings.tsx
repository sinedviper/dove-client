import React from "react";
import cn from "classnames";
import { toast } from "react-toastify";

import { SettingsProps } from "./Settings.props";
import { BackIcon, EditIcon, MailIcon, UsernameIcon } from "assets";

import styles from "./Settings.module.css";
import { colorCard } from "helpers";

export const Settings = ({
  className,
  settings,
  setSettings,
  setEdit,
  user,
  ...props
}: SettingsProps): JSX.Element => {
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copy!");
  };

  const color = colorCard(String(user?.data.name.toUpperCase().slice()[0]));

  return (
    <section
      className={cn(className, styles.settingsWrapper, {
        [styles.settingsWrapperOpen]: settings === true,
      })}
      {...props}
    >
      <div className={styles.settingsHead}>
        <div>
          <BackIcon
            className={styles.back}
            onClick={() => setSettings(false)}
          />
          <h2>Settings</h2>
        </div>
        <EditIcon className={styles.edit} onClick={() => setEdit(true)} />
      </div>
      <div className={styles.infoUser}>
        <div
          className={styles.userPhoto}
          style={{
            background: `linear-gradient(${color?.color1}, ${color?.color2})`,
          }}
        >
          {user?.data.surname.toUpperCase().slice()[0]}
          {user?.data.name.toUpperCase().slice()[0]}
          <div className={styles.photoFIO}>
            <p>{user?.data.name}</p>
            <p>{user?.data.surname}</p>
          </div>
        </div>
        <div className={styles.infoLast}>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.data.email))}
          >
            <MailIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.data.email}</p>
              <p className={styles.secondInfo}>Email</p>
            </span>
          </div>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.data.username))}
          >
            <UsernameIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.data.username}</p>
              <p className={styles.secondInfo}>Username</p>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
