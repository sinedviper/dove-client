import React, { useState, forwardRef, ForwardedRef } from "react";
import cn from "classnames";

import { RemoveIcon, SearchIcon } from "assets";

import { SearchProps } from "./Search.props";
import styles from "./Search.module.css";
import { useAppDispatch } from "utils/hooks";
import {
  actionAddTabIndexFirst,
  actionAddTabIndexSecond,
  actionAddTabIndexSixth,
} from "store";

export const Search = forwardRef(
  (
    {
      value,
      setSearchUser,
      setMenu,
      setValue,
      tabIndex,
      className,
      ...props
    }: SearchProps,
    ref?: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const dispatch = useAppDispatch();

    const [focus, setFocus] = useState<boolean>(false);

    return (
      <div className={cn(styles.searchWrapper)}>
        <input
          tabIndex={tabIndex}
          ref={ref}
          type='text'
          className={cn(className, styles.search)}
          onFocus={() => {
            setFocus(true);
          }}
          onClick={() => {
            if (setSearchUser) {
              setSearchUser(true);
              dispatch(actionAddTabIndexFirst(-1));
              dispatch(actionAddTabIndexSecond(0));
              dispatch(actionAddTabIndexSixth(-1));
            }
            if (setMenu) {
              setMenu(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (setSearchUser) {
                setSearchUser(true);
                dispatch(actionAddTabIndexFirst(-1));
                dispatch(actionAddTabIndexSecond(0));
                dispatch(actionAddTabIndexSixth(-1));
              }
              if (setMenu) {
                setMenu(false);
              }
            }
          }}
          onBlur={() => setFocus(false)}
          placeholder='Search'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
        <SearchIcon
          className={cn(styles.iconSearch, {
            [styles.focusSearch]: focus === true,
          })}
        />
        <button
          onClick={() => setValue("")}
          tabIndex={tabIndex}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => setFocus(false)}
          className={cn(styles.buttonRemove, {
            [styles.focusRemove]: focus === true,
          })}
        >
          <RemoveIcon className={styles.iconRemove} />
        </button>
      </div>
    );
  }
);
