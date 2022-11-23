import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { colorCard, formateDateOnline } from "utils/helpers";
import { IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useDebounce,
  useError,
  useExit,
} from "utils/hooks";
import { deleteUser } from "resolvers/user";
import {
  actionAddCopy,
  actionMenuEdit,
  actionMenuSetting,
  getMenuSetting,
  getUser,
} from "store";
import {
  BackIcon,
  EditIcon,
  InfoIcon,
  MailIcon,
  RemoveIcon,
  RemoveUserIcon,
  UsernameIcon,
} from "assets";

import { SettingsProps } from "./Settings.props";
import styles from "./Settings.module.css";

export const Settings = ({
  className,
  setSettings,
  sender,
  profile = false,
  ...props
}: SettingsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const exit = useExit();
  const error = useError();

  let user: IUser | undefined = useAppSelector(getUser);
  if (sender) {
    user = sender;
  }
  const settings: boolean = useAppSelector(getMenuSetting);

  const [mutationFunction, { error: errorMutationUser }] = useMutation(
    deleteUser,
    {
      fetchPolicy: "network-only",
      onCompleted: () => exit(),
    }
  );

  const [deleteUsera, setDeleteUser] = useState<boolean>(false);

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const debouncedMutation = useDebounce(() => {
    dispatch(actionAddCopy(false));
  }, 3000);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    dispatch(actionAddCopy(true));
    debouncedMutation();
  };

  const handleRemoveUser = async () => await mutationFunction();

  useEffect(() => {
    if (errorMutationUser) error(errorMutationUser.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMutationUser]);

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
              onClick={() =>
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuSetting(false))
              }
            />
          ) : (
            <BackIcon
              className={styles.back}
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuSetting(false));
                setDeleteUser(false);
              }}
            />
          )}
          <h2>{!profile ? "Settings" : "Profile"}</h2>
        </div>
        <div>
          {!profile && (
            <EditIcon
              className={styles.edit}
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuEdit(true));
                setDeleteUser(false);
              }}
            />
          )}
          {!profile && (
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
