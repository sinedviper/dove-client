import React, { useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";

import { SettingsProps } from "./Settings.props";
import {
  BackIcon,
  EditIcon,
  MailIcon,
  RemoveIcon,
  RemoveUserIcon,
  UsernameIcon,
} from "assets";

import styles from "./Settings.module.css";
import { colorCard } from "helpers";
import { useMutation } from "@apollo/client";
import { deleteUser } from "mutation";
import { useAppDispatch } from "hooks";
import { actionClearChats, actionClearContact, actionClearUser } from "store";
import { useNavigate } from "react-router-dom";

export const Settings = ({
  className,
  settings,
  setSettings,
  setEdit,
  user,
  profile = false,
  ...props
}: SettingsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteUsera, setDeleteUser] = useState<boolean>(false);
  const [mutationFunction] = useMutation(deleteUser);

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copy!");
  };

  const handleRemoveUser = async () => {
    await mutationFunction().then((res) => {
      const data = res.data.deleteUser;
      if (data.status === "Invalid") {
        toast.error(data.message);
      }
      if (data.status === "Success") {
        toast.success("Account delete");
        localStorage.removeItem("token");
        dispatch(actionClearChats());
        dispatch(actionClearContact());
        dispatch(actionClearUser());
        navigate("/login");
      }
    });
  };

  return (
    <section
      className={cn(className, styles.settingsWrapper, {
        [styles.settingsWrapperOpen]: settings === true,
        [styles.profile]: profile === true,
        [styles.onProfile]: settings === true && profile === true,
      })}
      {...props}
    >
      <div className={styles.settingsHead}>
        <div>
          {profile ? (
            <RemoveIcon
              className={cn(styles.back, styles.remove)}
              onClick={() => setSettings(false)}
            />
          ) : (
            <BackIcon
              className={styles.back}
              onClick={() => setSettings(false)}
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
            <p>{user?.name}</p>
            <p>{user?.surname}</p>
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
        </div>
      </div>
    </section>
  );
};
