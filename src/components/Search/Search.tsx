import React, { useState, forwardRef, ForwardedRef } from "react";
import cn from "classnames";

import { SearchProps } from "./Search.props";

import styles from "./Search.module.css";
import { RemoveIcon, SearchIcon } from "assets";

export const Search = forwardRef(
  (
    { value, setValue, className, ...props }: SearchProps,
    ref?: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
      <div className={styles.searchWrapper}>
        <input
          ref={ref}
          type='text'
          className={cn(className, styles.search)}
          onFocus={() => setFocus(true)}
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
