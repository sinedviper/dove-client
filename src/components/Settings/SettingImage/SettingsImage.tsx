import React, { useState } from "react";
import cn from "classnames";

import { useAppDispatch, useWindowSize } from "utils/hooks";
import {
  actionAddTabIndexFirst,
  actionAddTabIndexFiveth,
  actionAddTabIndexFourth,
  actionAddTabIndexSeventh,
  actionAddTabIndexSixth,
  actionMenuEdit,
  actionMenuSetting,
} from "store";
import { BackIcon, EditIcon, RemoveIcon, RemoveUserIcon } from "assets";

import { SettingsImageProps } from "./SettingsImage.props";
import styles from "./SettingsImage.module.css";

export const SettingsImage = ({
  className,
  setSettings,
  profile,
  handleRemoveUser,
  tabIndex,
  ...props
}: SettingsImageProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const windowSize = useWindowSize();

  const [deleteUsera, setDeleteUser] = useState<boolean>(false);

  return (
    <div
      className={styles.settingsHead}
      onMouseLeave={() => setDeleteUser(false)}
    >
      <div>
        {profile ? (
          <button
            className={cn(styles.back, styles.backCorrcet)}
            onClick={() => {
              if (setSettings) {
                setSettings(false);
                dispatch(actionAddTabIndexFirst(0));
                dispatch(actionAddTabIndexSixth(0));
                dispatch(actionAddTabIndexSeventh(-1));
                if (windowSize[0] < 1000) {
                  dispatch(actionAddTabIndexFirst(-1));
                  dispatch(actionAddTabIndexSixth(0));
                }
              }
              if (!setSettings) {
                dispatch(actionMenuSetting(false));
              }
            }}
            tabIndex={tabIndex}
          >
            <RemoveIcon className={styles.removeIcon} />
          </button>
        ) : (
          <button
            onClick={() => {
              setSettings
                ? setSettings(false)
                : dispatch(actionMenuSetting(false));
              setDeleteUser(false);
              dispatch(actionAddTabIndexFourth(-1));
              dispatch(actionAddTabIndexFirst(0));
              dispatch(actionAddTabIndexSixth(0));
              if (windowSize[0] < 1000) {
                dispatch(actionAddTabIndexSixth(-1));
              }
            }}
            className={styles.back}
            tabIndex={tabIndex}
          >
            <BackIcon className={styles.backIcon} />
          </button>
        )}
        <h2>{!profile ? "Settings" : "Profile"}</h2>
      </div>
      <div>
        {!profile && (
          <button
            className={styles.edit}
            onClick={() => {
              setSettings ? setSettings(false) : dispatch(actionMenuEdit(true));
              setDeleteUser(false);
              dispatch(actionAddTabIndexFourth(-1));
              dispatch(actionAddTabIndexFiveth(0));
            }}
            tabIndex={tabIndex}
          >
            <EditIcon className={styles.editIcon} />
          </button>
        )}
        {!profile && (
          <>
            <button
              className={styles.delete}
              onClick={() => setDeleteUser(!deleteUsera)}
              tabIndex={tabIndex}
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
                tabIndex={deleteUsera === true ? 0 : -1}
              >
                <RemoveUserIcon className={styles.removeIcon} />
                <span>Delete account</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
