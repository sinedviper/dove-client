import React from "react";
import cn from "classnames";

import { DeleteIcon } from "assets";

import { ButtonMenuProps } from "./ButtonMenu.props";
import styles from "./ButtonMenu.module.css";

export const ButtonMenu = ({
  menu,
  top,
  left,
  handleDelete,
  text,
  className,
  tabIndex,
  ...props
}: ButtonMenuProps): JSX.Element => {
  return (
    <div
      className={cn(className, styles.menuChat, {
        [styles.menuChatOn]: menu === true,
      })}
      style={{ top: top, left: left }}
      {...props}
    >
      <span
        className={styles.menuCard}
        onClick={handleDelete}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleDelete();
          }
        }}
        tabIndex={tabIndex}
      >
        <DeleteIcon className={styles.iconDeleteMenu} />
        <p>{text}</p>
      </span>
    </div>
  );
};
