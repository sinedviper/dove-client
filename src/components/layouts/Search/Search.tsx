import React, { useState, forwardRef, ForwardedRef } from 'react'
import cn from 'classnames'

import { RemoveIcon, SearchIcon } from 'assets'
import { useAppDispatch } from 'utils/hooks'
import {
  actionAddTabIndexFirst,
  actionAddTabIndexSecond,
  actionAddTabIndexSixth,
} from 'store/slice'

import { SearchProps } from './Search.props'
import styles from './Search.module.css'

// eslint-disable-next-line react/display-name
export const Search = forwardRef(
  (
    { value, setSearchUser, setMenu, setValue, tabIndex, className, ...props }: SearchProps,
    ref?: ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const dispatch = useAppDispatch()

    const [focus, setFocus] = useState(false)

    const handleClick = () => {
      if (setSearchUser) {
        setSearchUser(true)
        dispatch(actionAddTabIndexFirst(-1))
        dispatch(actionAddTabIndexSecond(0))
        dispatch(actionAddTabIndexSixth(-1))
      }
      if (setMenu) {
        setMenu(false)
      }
    }

    return (
      <div className={cn(styles.searchWrapper)}>
        <input
          tabIndex={tabIndex}
          ref={ref}
          type='text'
          className={cn(className, styles.search)}
          onFocus={() => setFocus(true)}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          onBlur={() => setFocus(false)}
          placeholder='Search'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
        <SearchIcon
          className={cn(styles.iconSearch, {
            [styles.focusSearch]: focus,
          })}
        />
        <button
          onClick={() => (setValue(''), setFocus(false))}
          tabIndex={tabIndex}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={cn(styles.buttonRemove, {
            [styles.focusRemove]: focus,
          })}
        >
          <RemoveIcon className={styles.iconRemove} />
        </button>
      </div>
    )
  },
)
