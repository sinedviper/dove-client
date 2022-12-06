import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { SERVER_LINK } from "utils/constants";
import { colorCard } from "utils/helpers";
import { IImage, IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
} from "utils/hooks";
import { updateUser } from "resolvers/user";
import { Input } from "components/layouts";
import {
  actionAddImageUser,
  actionAddTabIndexFiveth,
  actionAddTabIndexFourth,
  actionAddUser,
  actionMenuEdit,
  getImageUser,
  getMenuEdit,
  getTabIndexFiveth,
  getUser,
} from "store";
import { BackIcon, PhotoIcon, SupheedIcon } from "assets";
import axios from "../../../axios";

import { EditsProps } from "./Edits.props";
import styles from "./Edits.module.css";

export const Edits = ({ className, ...props }: EditsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const auhtorization = useAuthorization();
  const error = useError();

  //res in db
  const [mutateFunction] = useMutation(updateUser, {
    onCompleted(data) {
      auhtorization({ data: data.updateUser, actionAdd: actionAddUser });
      setErrorUsername(false);
      setErrorName(false);
      setErrorSurname(false);
      setErrorEmail(false);
      setErrorBio(false);
      setErrorPassword(false);
      setErrorPasswordNew(false);
      setErrorPasswordReapeat(false);
      setSubmit(false);
      dispatch(actionAddTabIndexFiveth(-1));
      dispatch(actionAddTabIndexFourth(0));
      dispatch(actionMenuEdit(false));
    },
    onError(errorData) {
      error(errorData.message);
    },
  });
  //store
  const user: IUser | undefined = useAppSelector(getUser);
  const edit: boolean = useAppSelector(getMenuEdit);
  const imageUser: IImage | undefined = useAppSelector(getImageUser)?.[0];
  const tabIndexFivth: number = useAppSelector(getTabIndexFiveth);

  const [swiper, setSwiper] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(
    user?.username ? user.username : ""
  );
  const [name, setName] = useState<string>(user?.name ? user?.name : "");
  const [surname, setSurname] = useState<string>(
    user?.surname ? user?.surname : ""
  );
  const [email, setEmail] = useState<string>(user?.email ? user?.email : "");
  const [bio, setBio] = useState<string>(user?.bio ? user?.bio : "");
  const [password, setPassword] = useState<string>("");
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [passwordReapeat, setPasswordReapeat] = useState<string>("");

  const [errorUsername, setErrorUsername] = useState<boolean>(false);
  const [errorName, setErrorName] = useState<boolean>(false);
  const [errorSurname, setErrorSurname] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorBio, setErrorBio] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const [errorPasswordNew, setErrorPasswordNew] = useState<boolean>(false);
  const [errorPasswordReapeat, setErrorPasswordReapeat] =
    useState<boolean>(false);

  const [passwordCheck, setPasswordCheck] = useState<number>(0);

  const [permission, setPermission] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  //getting a color for a user if they don't have a photo
  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));
  //load photo
  const handleLoadPhoto = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (e.target.files[0] > 5000000) {
      error("The file is over 5MB");
      e.target.value = null;
    }
    if (e.target.files[0] < 5000000) {
      const URL = window.URL || window.webkitURL;
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = (e: any) => {
        setPermission({ width: e.path[0].width, height: e.path[0].height });
      };
      if (permission.width > 1200 || permission.height > 800) {
        error("Choose a different photo, the resolution is too high");
        setPermission({ width: 0, height: 0 });
      } else {
        formData.append("image", file);
        const { data } = await axios.post("/upload", formData);
        auhtorization({ data, actionAdd: actionAddImageUser });
        setPermission({ width: 0, height: 0 });
        e.target.value = null;
      }
    }
  };

  const onSubmit = async (): Promise<void> => {
    let checkFields: boolean = true;
    let obj = {};
    setErrorUsername(false);
    setErrorName(false);
    setErrorSurname(false);
    setErrorEmail(false);
    setErrorBio(false);
    setErrorPassword(false);
    setErrorPasswordNew(false);
    setErrorPasswordReapeat(false);
    //Check main input on value
    if (user?.username !== username) {
      if (
        username.replaceAll(" ", "") === "" ||
        username.replace(/[A-Za-z0-9]+/g, "").length !== 0 ||
        username.length < 3 ||
        username.length > 40
      ) {
        checkFields = false;
        setErrorUsername(true);
        error("Username not correct");
      } else {
        obj = { username };
      }
    }
    if (user?.name !== name) {
      if (
        name.replaceAll(" ", "") === "" ||
        name.replace(/[A-Za-z]+/g, "").length !== 0 ||
        name.length < 1 ||
        name.length > 40
      ) {
        checkFields = false;
        setErrorName(true);
        error("Name not correct");
      } else {
        obj = { ...obj, name };
      }
    }
    if (user?.surname !== surname) {
      if (
        surname.replace(/[A-Za-z]+/g, "").length !== 0 ||
        surname.length > 40
      ) {
        checkFields = false;
        setErrorSurname(true);
        error("Surname not correct");
      } else {
        obj = { ...obj, surname };
      }
    }
    if (user?.email !== email) {
      if (
        email.replaceAll(" ", "") === "" ||
        // eslint-disable-next-line no-useless-escape
        email.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "").length !== 0 ||
        email.length < 3 ||
        email.length > 40
      ) {
        checkFields = false;
        setErrorEmail(true);
        error("Email not correct");
      } else {
        obj = { ...obj, email };
      }
    }
    if (user?.bio !== bio) {
      if (
        bio.replaceAll(" ", "") === "" ||
        // eslint-disable-next-line no-useless-escape
        bio.replace(/[A-Za-z0-9\.]+/g, "").length !== 0 ||
        bio.length < 1 ||
        bio.length > 40
      ) {
        checkFields = false;
        setErrorBio(true);
        error("Bio not correct");
      } else {
        obj = { ...obj, bio };
      }
    }
    //Check password on value
    if (
      passwordNew.replaceAll(" ", "") !== "" &&
      password.replaceAll(" ", "") !== "" &&
      passwordReapeat.replaceAll(" ", "") !== ""
    ) {
      if (passwordCheck === 3) {
        if (passwordNew === passwordReapeat) {
          setErrorPassword(false);
          setErrorPasswordNew(false);
          setErrorPasswordReapeat(false);
          obj = {
            ...obj,
            password,
            passwordNew,
          };
        }

        if (passwordNew !== passwordReapeat) {
          setErrorPasswordReapeat(true);
          error("Please correct repeat password");
        }
      }
      if (passwordCheck < 3) {
        error("Please correct new password");
      }
    }
    //displaying information about an incorrect password
    if (!password && passwordNew && passwordReapeat) {
      setErrorPassword(true);
      error("Please enter your main password");
    }
    if (password && !passwordNew && passwordReapeat) {
      setErrorPasswordNew(true);
      error("Please enter your new password");
    }
    if (password && passwordNew && !passwordReapeat) {
      setErrorPasswordReapeat(true);
      error("Please enter your repeat password");
    }
    if (password && !passwordNew && !passwordReapeat) {
      setErrorPasswordNew(true);
      setErrorPasswordReapeat(true);
      error("Please enter your new password and repeat password");
    }
    if (!password && !passwordNew && passwordReapeat) {
      setErrorPassword(true);
      setErrorPasswordNew(true);
      error("Please enter your main password and new password");
    }
    if (!password && passwordNew && !passwordReapeat) {
      setErrorPassword(true);
      setErrorPasswordNew(true);
      setErrorPasswordReapeat(true);
      error("Please enter all password fields");
    }
    //Update user
    if (checkFields) {
      await mutateFunction({ variables: { input: obj } });
    }
  };

  //Check values in input, changed or not, when changed button has see
  useEffect(() => {
    if (
      user?.username !== username ||
      user?.name !== name ||
      user?.surname !== surname ||
      user?.email !== email ||
      user?.bio !== bio ||
      passwordReapeat !== "" ||
      password !== "" ||
      passwordNew !== ""
    ) {
      setSubmit(true);
    } else if (
      user?.username === username ||
      user?.name === name ||
      user?.surname === surname ||
      user?.email === email ||
      user?.bio === bio ||
      passwordReapeat === "" ||
      password === "" ||
      passwordNew === ""
    ) {
      setSubmit(false);
    }
  }, [
    user,
    password,
    passwordReapeat,
    passwordNew,
    username,
    name,
    surname,
    email,
    bio,
    submit,
  ]);

  return (
    <section
      className={cn(className, styles.editWrapper, {
        [styles.editWrapperOpen]: edit === true,
      })}
      {...props}
    >
      <div className={styles.editHead}>
        <div>
          <button
            tabIndex={tabIndexFivth}
            className={styles.back}
            onClick={() => {
              setErrorUsername(false);
              setErrorName(false);
              setErrorSurname(false);
              setErrorEmail(false);
              setErrorBio(false);
              setErrorPassword(false);
              setErrorPasswordNew(false);
              setErrorPasswordReapeat(false);
              dispatch(actionMenuEdit(false));
              dispatch(actionAddTabIndexFiveth(-1));
              dispatch(actionAddTabIndexFourth(0));
            }}
          >
            <BackIcon className={styles.backIcon} />
          </button>
          <h2>Edit Profile</h2>
        </div>
      </div>
      <div
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
        onMouseLeave={() => setSwiper(false)}
        onMouseOut={() => setSwiper(true)}
      >
        <div className={styles.editUser}>
          <div className={styles.editPhoto}>
            {imageUser ? (
              <div
                className={styles.uploadWrapper}
                style={{ display: imageUser ? "block" : "none" }}
              >
                <img
                  className={styles.userImage}
                  src={`${SERVER_LINK}/images/` + imageUser.file}
                  alt='User'
                />
                <label className={styles.iconPhotoWrapper} htmlFor='loadphotod'>
                  <PhotoIcon />
                </label>
                <input
                  className={styles.input}
                  accept='.jpg, .jpeg, .png'
                  onChange={(e) => {
                    handleLoadPhoto(e);
                    setPassword("");
                    setPasswordNew("");
                    setPasswordReapeat("");
                    setSubmit(false);
                    dispatch(actionMenuEdit(false));
                  }}
                  type='file'
                  id='loadphotod'
                />
              </div>
            ) : (
              <div
                className={styles.uploadWrapper}
                style={{ display: imageUser ? "block" : "none" }}
              >
                <div
                  className={styles.wrapperLoadNoPhoto}
                  style={{
                    background: `linear-gradient(${color?.color1}, ${color?.color2})`,
                  }}
                ></div>
                <label className={styles.iconPhotoWrapper} htmlFor='loadphoto'>
                  <PhotoIcon />
                </label>
                <input
                  className={styles.input}
                  accept='.jpg, .jpeg, .png'
                  onChange={handleLoadPhoto}
                  type='file'
                  id='loadphoto'
                />
              </div>
            )}
          </div>
          <Input
            tabIndex={tabIndexFivth}
            error={errorName}
            placeholderName='Name'
            notification={true}
            notificationText={"Name must be between 1 and 40 characters"}
            text={name}
            setText={setName}
          />
          <Input
            tabIndex={tabIndexFivth}
            error={errorSurname}
            placeholderName='Surname(optional)'
            notification={true}
            notificationText={"Surname must be between 1 and 40 characters"}
            text={surname}
            setText={setSurname}
          />
          <Input
            tabIndex={tabIndexFivth}
            placeholderName='Bio(optional)'
            error={errorBio}
            text={bio}
            setText={setBio}
          />
        </div>
        <div className={styles.editInfo}>
          <p>Any details such as age, occupation or city.</p>
          <p>Example: 24 y.o. frontend from San Francisco</p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Email</h2>
          <Input
            tabIndex={tabIndexFivth}
            error={errorEmail}
            placeholderName='Email'
            notification={true}
            notificationText={
              "Email must be between 3 and 40 characters and have '@' and variant '.com'"
            }
            text={email}
            setText={setEmail}
          />
        </div>
        <div className={styles.editInfo}>
          <p>You can change the your email on Dove.</p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Username</h2>
          <Input
            tabIndex={tabIndexFivth}
            error={errorUsername}
            placeholderName='Username'
            notification={true}
            notificationText={"Username must be between 3 and 40 characters"}
            text={username}
            setText={setUsername}
          />
        </div>
        <div className={styles.editInfo}>
          <p>
            You can choose a username on Dove. If you do people will be able to
            find you by this username.
          </p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Password</h2>
          <Input
            tabIndex={tabIndexFivth}
            error={errorPassword}
            placeholderName='Main password'
            notification={true}
            notificationText={"Password must be between 8 and 40 characters"}
            password={true}
            text={password}
            setText={setPassword}
          />
          <Input
            tabIndex={tabIndexFivth}
            error={errorPasswordNew}
            placeholderName='New password'
            setPassword={setPasswordCheck}
            notification={true}
            notificationText={
              "Password must be between 8 and 40 characters and have a capital letter and a number"
            }
            password={true}
            text={passwordNew}
            setText={setPasswordNew}
          />
          <Input
            tabIndex={tabIndexFivth}
            error={errorPasswordReapeat}
            placeholderName='Repeat password'
            textCheckPassNew={passwordNew}
            notification={true}
            notificationText={"Please re-enter your password correctly"}
            password={true}
            text={passwordReapeat}
            setText={setPasswordReapeat}
          />
        </div>
        <div className={cn(styles.editInfo, styles.info)}>
          <p>You can change the your password on Dove.</p>
        </div>
        <button
          tabIndex={tabIndexFivth}
          className={cn(styles.supheed, {
            [styles.submit]: submit === true,
          })}
          onClick={onSubmit}
        >
          <SupheedIcon />
        </button>
      </div>
    </section>
  );
};
