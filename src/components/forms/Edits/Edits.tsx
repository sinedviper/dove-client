import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import cn from "classnames";

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
  actionAddUser,
  actionMenuEdit,
  getImageUser,
  getMenuEdit,
  getUser,
} from "store";
import { BackIcon, PhotoIcon, SupheedIcon } from "assets";
import axios from "../../../axios";

import { EditsProps } from "./Edits.props";
import styles from "./Edits.module.css";

interface IFormInput {
  name: string;
  surname: string;
  username: string;
  email: string;
  bio: string;
  mainPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export const Edits = ({ className, ...props }: EditsProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const dispatch = useAppDispatch();
  const auhtorization = useAuthorization();
  const error = useError();

  //res in db
  const [mutateFunction, { error: errorMutationUpdateUser }] = useMutation(
    updateUser,
    {
      onCompleted(data) {
        auhtorization({ data: data.updateUser, actionAdd: actionAddUser });
        setPassword("");
        setPasswordNew("");
        setPasswordReapeat("");
        setSubmit(false);
        dispatch(actionMenuEdit(false));
      },
    }
  );

  const user: IUser | undefined = useAppSelector(getUser);
  const edit: boolean = useAppSelector(getMenuEdit);
  const imageUser: IImage | undefined = useAppSelector(getImageUser)?.[0];

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
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorPasswordNew, setErrorPasswordNew] = useState<string>("");
  const [errorPasswordReapeat, setErrorPasswordReapeat] = useState<string>("");

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const handleLoadPhoto = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);
    const { data } = await axios.post("/upload", formData);
    auhtorization({ data, actionAdd: actionAddImageUser });
    e.target.value = null;
  };

  const onSubmit = async (input: IFormInput): Promise<void> => {
    let obj = {};
    //Check main input on value
    if (user?.username !== username) {
      obj = { username: input.username };
    }
    if (user?.name !== name) {
      obj = { ...obj, name: input.name };
    }
    if (user?.surname !== surname) {
      obj = { ...obj, surname: input.surname };
    }
    if (user?.email !== email) {
      obj = { ...obj, email: input.email };
    }
    if (user?.bio !== bio) {
      obj = { ...obj, bio: input.bio };
    }
    //Check password on value
    if (input.mainPassword && input.newPassword && input.repeatPassword) {
      if (input.newPassword === input.repeatPassword) {
        setErrorPassword("");
        setErrorPasswordNew("");
        setErrorPasswordReapeat("");
        obj = {
          ...obj,
          password: input.mainPassword,
          passwordNew: input.newPassword,
        };
      }

      if (input.newPassword !== input.repeatPassword) {
        setErrorPassword("");
        setErrorPasswordNew("");
        setErrorPasswordReapeat("Please correct repeat password");
      }
    }
    if (!input.mainPassword && input.newPassword && input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("");
      setErrorPasswordReapeat("");
    }
    if (input.mainPassword && !input.newPassword && input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("");
    }
    if (input.mainPassword && input.newPassword && !input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    if (input.mainPassword && !input.newPassword && !input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    if (!input.mainPassword && !input.newPassword && input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("");
    }
    if (!input.mainPassword && input.newPassword && !input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    //Update user
    await mutateFunction({ variables: { input: obj } });
  };

  useEffect(() => {
    if (errorMutationUpdateUser) error(errorMutationUpdateUser.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMutationUpdateUser]);

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
    }
    if (
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
          <BackIcon
            className={styles.back}
            onClick={() => dispatch(actionMenuEdit(false))}
          />
          <h2>Edit Profile</h2>
        </div>
      </div>
      <form
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
        onMouseLeave={() => setSwiper(false)}
        onMouseOut={() => setSwiper(true)}
      >
        <div className={styles.editUser}>
          <div className={styles.editPhoto}>
            {imageUser ? (
              <div className={styles.uploadWrapper}>
                <img
                  className={styles.userImage}
                  src={`http://localhost:3001/images/` + imageUser.file}
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
              <div className={styles.uploadWrapper}>
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
            error={Boolean(errors.name)}
            placeholderName='Name'
            {...register("name", {
              minLength: 1,
              maxLength: 40,
            })}
            text={name}
            setText={setName}
          />
          {errors.name && (
            <span className={styles.error}>
              Name must be between 1 and 40 characters
            </span>
          )}
          <Input
            error={Boolean(errors.surname)}
            placeholderName='Surname(optional)'
            {...register("surname", {
              minLength: 1,
              maxLength: 40,
            })}
            text={surname}
            setText={setSurname}
          />
          {errors.surname && (
            <span className={styles.error}>
              Surname must be between 1 and 40 characters
            </span>
          )}
          <Input
            placeholderName='Bio(optional)'
            error={Boolean(errors.bio)}
            {...register("bio", {
              minLength: 0,
              maxLength: 40,
            })}
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
            error={Boolean(errors.email)}
            placeholderName='Email'
            {...register("email", {
              minLength: 3,
              maxLength: 40,
            })}
            text={email}
            setText={setEmail}
          />
          {errors.email && (
            <span className={styles.error}>
              Email must be between 3 and 40 characters
            </span>
          )}
        </div>
        <div className={styles.editInfo}>
          <p>You can change the your email on Dove.</p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Username</h2>
          <Input
            error={Boolean(errors.username)}
            placeholderName='Username'
            {...register("username", {
              minLength: 3,
              maxLength: 40,
            })}
            text={username}
            setText={setUsername}
          />
          {errors.username && (
            <span className={styles.error}>
              Username must be between 3 and 40 characters
            </span>
          )}
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
            error={Boolean(errorPassword ? errorPassword : errors.mainPassword)}
            placeholderName='Main password'
            {...register("mainPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={password}
            setText={setPassword}
          />
          {errors.mainPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPassword && (
            <span className={styles.error}>{errorPassword}</span>
          )}
          <Input
            error={Boolean(
              errorPasswordNew ? errorPasswordNew : errors.newPassword
            )}
            placeholderName='New password'
            {...register("newPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={passwordNew}
            setText={setPasswordNew}
          />
          {errors.newPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPasswordNew && (
            <span className={styles.error}>{errorPasswordNew}</span>
          )}
          <Input
            error={Boolean(
              errorPasswordReapeat
                ? errorPasswordReapeat
                : errors.repeatPassword
            )}
            placeholderName='Repeat password'
            {...register("repeatPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={passwordReapeat}
            setText={setPasswordReapeat}
          />
          {errors.repeatPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPasswordReapeat && (
            <span className={styles.error}>{errorPasswordReapeat}</span>
          )}
        </div>
        <div className={cn(styles.editInfo, styles.info)}>
          <p>You can change the your password on Dove.</p>
        </div>
        <button
          className={cn(styles.supheed, {
            [styles.submit]: submit === true,
          })}
          onClick={handleSubmit(onSubmit)}
        >
          <SupheedIcon />
        </button>
      </form>
    </section>
  );
};
