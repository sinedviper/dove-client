import React, { useState } from "react";
import cn from "classnames";

import {
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
      className={cn(className, styles.menuCard, styles.menuCardCheck, {
        [styles.menuClick]: click === true,
      })}
      onClick={handleAction}
      onMouseDown={() => setClick(true)}
      onMouseUp={() => setClick(false)}
      {...props}
    >
      <div>
        {action === "contact" && (
          <ContactsIcon className={cn(styles.cardIcon, styles.contact)} />
        )}
        {action === "setting" && <SettingsIcon className={styles.cardIcon} />}
        {action === "theme" && <MoonIcon className={cn(styles.cardIcon)} />}
        {action === "animation" && (
          <MeteorIcon className={cn(styles.cardIcon)} />
        )}
        {action === "out" && (
          <LogoutIcon className={cn(styles.cardIcon, styles.logout)} />
        )}
        <span>{text}</span>
      </div>
      {animation !== undefined && (
        <div
          className={cn(styles.checkBox, {
            [styles.checkBoxClick]: animation === true,
          })}
        >
          <input type='checkbox' checked={animation} onChange={() => {}} />
          <label />
        </div>
      )}
      {theme !== undefined && (
        <div
          className={cn(styles.checkBox, {
            [styles.checkBoxClick]: theme === true,
          })}
        >
          <input type='checkbox' checked={theme} onChange={() => {}} />
          <label />
        </div>
      )}
    </button>
  );
};
