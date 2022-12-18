import React, { useState } from "react";
import cn from "classnames";

import {
  BookmarkIcon,
  BugIcon,
  ContactsIcon,
  LogoutIcon,
  MeteorIcon,
  MoonIcon,
  SettingsIcon,
} from "assets";

import { ButtonMenuMainProps } from "./ButtonMenuMain.props";
import styles from "./ButtonMenuMain.module.css";

export const ButtonMenuMain = ({
  handleAction,
  text,
  animation,
  theme,
  action,
  className,
  ...props
}: ButtonMenuMainProps): JSX.Element => {
  const [click, setClick] = useState<boolean>(false);

  return (
    <button
      className={cn(className, styles.menuCard, {
        [styles.menuClick]: click,
      })}
      onClick={handleAction}
      onMouseDown={() => setClick(true)}
      onMouseUp={() => setClick(false)}
      {...props}
    >
      <div>
        {action === "contact" && <ContactsIcon className={styles.contact} />}
        {action === "setting" && <SettingsIcon className={styles.cardIcon} />}
        {action === "theme" && <MoonIcon className={styles.cardIcon} />}
        {action === "animation" && <MeteorIcon className={styles.cardIcon} />}
        {action === "out" && <LogoutIcon className={styles.logout} />}
        {action === "saved" && <BookmarkIcon className={styles.cardIcon} />}
        {action === "bugs" && <BugIcon className={styles.cardIcon} />}
        <span>{text}</span>
      </div>
      {animation !== undefined && (
        <div
          className={cn(styles.checkBox, {
            [styles.checkBoxClick]: animation,
          })}
        >
          <input type='checkbox' checked={animation} onChange={() => {}} />
          <label />
        </div>
      )}
      {theme !== undefined && (
        <div
          className={cn(styles.checkBox, {
            [styles.checkBoxClick]: theme,
          })}
        >
          <input type='checkbox' checked={theme} onChange={() => {}} />
          <label />
        </div>
      )}
    </button>
  );
};
