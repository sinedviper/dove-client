import React, { useState } from "react";
import cn from "classnames";

import { actionAddTabIndexFirst, actionAddTabIndexSixth } from "store";
import { SERVER_LINK } from "utils/constants";
import { colorCard } from "utils/helpers";

import { ContactSearchProps } from "./ContactSearch.props";
import styles from "./ContactSearch.module.css";

export const ContactSearch = ({
  handleFocus,
  contact,
  windowSize,
  tabIndex,
  dispatch,
  username,
  className,
  ...props
}: ContactSearchProps): JSX.Element => {
  const { color1, color2 } = colorCard(contact.name.toUpperCase()[0]);

  const [click, setClick] = useState<boolean>(false);

  return (
    <div
      className={cn(styles.contactWrapper, {
        [styles.contactWrapperOn]: username === contact.username,
        [styles.contactWrapperClick]: click === true,
      })}
      onTouchStart={() => {
        setClick(true);
      }}
      onMouseDown={() => setClick(true)}
      onMouseUp={() => {
        setClick(false);
        handleFocus(contact);
      }}
      onTouchEnd={() => {
        setClick(false);
        handleFocus(contact);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleFocus(contact);
          if (windowSize < 1000) {
            dispatch(actionAddTabIndexFirst(-1));
            dispatch(actionAddTabIndexSixth(0));
          }
        }
      }}
      tabIndex={tabIndex}
      {...props}
    >
      <div
        className={styles.contactPhoto}
        style={{
          background: contact.file
            ? ""
            : `linear-gradient(${color1}, ${color2})`,
        }}
      >
        {contact.file ? (
          <img
            className={styles.contactImage}
            src={`${SERVER_LINK}/images/${contact.file}`}
            alt='contact img'
          />
        ) : (
          <span>{contact.name.toUpperCase()[0]}</span>
        )}
      </div>
      <p>{contact.name}</p>
    </div>
  );
};
