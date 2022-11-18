import React, { useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";

import { SettingsProps } from "./Settings.props";
import {
  BackIcon,
  EditIcon,
  InfoIcon,
  MailIcon,
  RemoveIcon,
  RemoveUserIcon,
  UsernameIcon,
} from "assets";
import { colorCard, formateDateOnline } from "helpers";
import { deleteUser } from "mutation";

import styles from "./Settings.module.css";

export const Settings = ({
  className,
  settings,
  setSettings,
  setEdit,
  user,
  profile = false,
  ...props
}: SettingsProps): JSX.Element => {
  const [deleteUsera, setDeleteUser] = useState<boolean>(false);
  const [mutationFunction] = useMutation(deleteUser, {
    fetchPolicy: "network-only",
  });

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copy!");
  };

  const handleRemoveUser = async () => {
    await mutationFunction();
  };

  return (
    <section
      className={cn(className, styles.settingsWrapper, {
        [styles.settingsWrapperOpen]: !profile && settings === true,
        [styles.profile]: profile === true,
      })}
      {...props}
    >
      <div
        className={styles.settingsHead}
        onMouseLeave={() => setDeleteUser(false)}
      >
        <div>
          {profile ? (
            <RemoveIcon
              className={cn(styles.back, styles.remove)}
              onClick={() => setSettings(false)}
            />
          ) : (
            <BackIcon
              className={styles.back}
              onClick={() => {
                setSettings(false);
                setDeleteUser(false);
              }}
            />
          )}
          <h2>{setEdit ? "Settings" : "Profile"}</h2>
        </div>
        <div>
          {setEdit && (
            <EditIcon
              className={styles.edit}
              onClick={() => {
                setEdit(true);
                setDeleteUser(false);
              }}
            />
          )}
          {setEdit && (
            <>
              <button
                className={styles.delete}
                onClick={() => setDeleteUser(!deleteUsera)}
              >
                <span className={styles.dot}></span>
              </button>
              <div
                className={cn(styles.deleteWrapper, {
                  [styles.openDelWrap]: deleteUsera === true,
                })}
              >
                <button
                  className={styles.deleteButton}
                  onClick={handleRemoveUser}
                >
                  <RemoveUserIcon className={styles.removeIcon} />
                  <span>Delete account</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.infoUser}>
        <div
          className={styles.userPhoto}
          style={{
            background: `linear-gradient(${color?.color1}, ${color?.color2})`,
          }}
        >
          {user?.name.toUpperCase().slice()[0]}
          {user?.surname.toUpperCase().slice()[0]}
          <div className={styles.photoFIO}>
            <p>
              {user?.name} {user?.surname}
            </p>
            <p className={styles.userOnline}>
              {user?.online && formateDateOnline(new Date(user?.online))}
            </p>
          </div>
        </div>
        <div className={styles.infoLast}>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.email))}
          >
            <MailIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.email}</p>
              <p className={styles.secondInfo}>Email</p>
            </span>
          </div>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.username))}
          >
            <UsernameIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.username}</p>
              <p className={styles.secondInfo}>Username</p>
            </span>
          </div>
          {user?.bio && (
            <div
              className={styles.info}
              onClick={() => handleCopy(String(user?.username))}
            >
              <InfoIcon className={styles.iconInfo} />
              <span>
                <p className={styles.firstInfo}>{user?.bio}</p>
                <p className={styles.secondInfo}>bio</p>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
