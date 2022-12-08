import React from "react";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import {
  actionAddTabIndexFiveth,
  actionAddTabIndexFourth,
  actionMenuEdit,
  getTabIndexFiveth,
} from "store";
import { BackIcon } from "assets";

import { EditsHeaderProps } from "./EditsHeader.props";
import styles from "./EditsHeader.module.css";

export const EditsHeader = ({
  data,
  initialData,
  setData,
  className,
  ...props
}: EditsHeaderProps): JSX.Element => {
  const dispatch = useAppDispatch();

  //store
  const tabIndexFivth: number = useAppSelector(getTabIndexFiveth);

  const handleClick = () => {
    setData({
      username:
        data.username !== initialData.username
          ? initialData.username
          : data.username,
      surname:
        data.surname !== initialData.surname
          ? initialData.surname
          : data.surname,
      name: data.name !== initialData.name ? initialData.name : data.name,
      email: data.email !== initialData.email ? initialData.email : data.email,
      bio: data.bio !== initialData.bio ? initialData.bio : data.bio,
      password:
        data.password !== initialData.password
          ? initialData.password
          : data.password,
      passwordNew:
        data.passwordNew !== initialData.passwordNew
          ? initialData.passwordNew
          : data.passwordNew,
      passwordRepeat:
        data.passwordRepeat !== initialData.passwordRepeat
          ? initialData.passwordRepeat
          : data.passwordRepeat,
      errorBio: false,
      errorEmail: false,
      errorName: false,
      errorPassword: false,
      errorPasswordNew: false,
      errorPasswordRepeat: false,
      errorSurname: false,
      errorUsername: false,
    });
    dispatch(actionMenuEdit(false));
    dispatch(actionAddTabIndexFiveth(-1));
    dispatch(actionAddTabIndexFourth(0));
  };

  return (
    <div className={styles.editHead} {...props}>
      <div>
        <button
          tabIndex={tabIndexFivth}
          className={styles.back}
          onClick={handleClick}
        >
          <BackIcon className={styles.backIcon} />
        </button>
        <h2>Edit Profile</h2>
      </div>
    </div>
  );
};
