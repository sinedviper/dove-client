import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";
import Carousel from "nuka-carousel";

import { colorCard, formateDateOnline } from "utils/helpers";
import { IImage, IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useDebounce,
  useError,
  useExit,
} from "utils/hooks";
import { deleteUser } from "resolvers/user";
import { deleteUpload } from "resolvers/upload";
import {
  actionAddCopy,
  actionAddImageUser,
  actionMenuEdit,
  actionMenuSetting,
  getImageSender,
  getImageUser,
  getMenuSetting,
  getUser,
} from "store";
import {
  BackIcon,
  EditIcon,
  InfoIcon,
  MailIcon,
  RemoveIcon,
  RemoveUserIcon,
  UsernameIcon,
  PhotoIcon,
  UpPhotoIcon,
  BackPhotoIcon,
} from "assets";
import axios from "../../axios";

import { SettingsProps } from "./Settings.props";
import styles from "./Settings.module.css";

export const Settings = ({
  className,
  setSettings,
  sender,
  profile = false,
  ...props
}: SettingsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const auhtorization = useAuthorization();
  const exit = useExit();
  const error = useError();

  let user: IUser | undefined = useAppSelector(getUser);
  if (sender) {
    user = sender;
  }
  const imageSender: IImage | undefined = useAppSelector(getImageSender);
  const settings: boolean = useAppSelector(getMenuSetting);
  const imageUser: IImage[] | undefined = useAppSelector(getImageUser);

  const [mutationFunction] = useMutation(deleteUser, {
    fetchPolicy: "network-only",
    onCompleted: exit,
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [mutationFunctionDeletePhoto] = useMutation(deleteUpload, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      auhtorization({
        data: data.deleteUpload,
        actionAdd: actionAddImageUser,
      });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [deleteUsera, setDeleteUser] = useState<boolean>(false);
  const [buttonPhoto, setButtonPhoto] = useState<boolean>(false);

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const debouncedMutation = useDebounce(() => {
    dispatch(actionAddCopy(false));
  }, 3000);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    dispatch(actionAddCopy(true));
    debouncedMutation();
  };

  const handleRemoveUser = async () => await mutationFunction();

  const handleLoadPhoto = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);

    const { data } = await axios.post("/upload", formData);
    auhtorization({ data, actionAdd: actionAddImageUser });
    e.target.value = null;
  };

  const handleRemovePhoto = async (idPhoto: number, file: string) => {
    await mutationFunctionDeletePhoto({
      variables: { idPhoto: Number(idPhoto), file: String(file) },
    });
  };

  return (
    <section
      className={cn(className, styles.settingsWrapper, {
        [styles.settingsWrapperOpen]: !profile && settings === true,
        [styles.profile]: profile === true,
      })}
      {...props}
    >
      <div
        className={styles.settingsHead}
        onMouseLeave={() => setDeleteUser(false)}
      >
        <div>
          {profile ? (
            <RemoveIcon
              className={cn(styles.back, styles.remove)}
              onClick={() =>
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuSetting(false))
              }
            />
          ) : (
            <BackIcon
              className={styles.back}
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuSetting(false));
                setDeleteUser(false);
              }}
            />
          )}
          <h2>{!profile ? "Settings" : "Profile"}</h2>
        </div>
        <div>
          {!profile && (
            <EditIcon
              className={styles.edit}
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuEdit(true));
                setDeleteUser(false);
              }}
            />
          )}
          {!profile && (
            <>
              <button
                className={styles.delete}
                onClick={() => setDeleteUser(!deleteUsera)}
              >
                <span className={styles.dot}></span>
              </button>
              <div
                className={cn(styles.deleteWrapper, {
                  [styles.openDelWrap]: deleteUsera === true,
                })}
              >
                <button
                  className={styles.deleteButton}
                  onClick={handleRemoveUser}
                >
                  <RemoveUserIcon className={styles.removeIcon} />
                  <span>Delete account</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.infoUser}>
        <div
          className={styles.userPhoto}
          style={{
            background: profile
              ? !imageSender
                ? `linear-gradient(${color?.color1}, ${color?.color2})`
                : "none"
              : imageUser?.length === 0
              ? `linear-gradient(${color?.color1}, ${color?.color2})`
              : "none",
          }}
        >
          {profile ? (
            imageSender ? (
              <div className={styles.wrapperImage}>
                <div className={styles.userImageWrapper}>
                  <img
                    className={styles.userImage}
                    src={`http://localhost:3001/images/` + imageSender?.file}
                    alt='User'
                  />
                </div>
              </div>
            ) : (
              <>
                {user?.name.toUpperCase().slice()[0]}
                {user?.surname.toUpperCase().slice()[0]}
              </>
            )
          ) : imageUser?.length === 0 ? (
            <>
              {user?.name.toUpperCase().slice()[0]}
              {user?.surname.toUpperCase().slice()[0]}
            </>
          ) : (
            <div
              className={styles.wrapperImage}
              onMouseMove={() => setButtonPhoto(true)}
              onMouseLeave={() => setButtonPhoto(false)}
            >
              {imageUser?.length === 1 ? (
                <div key={imageUser[0].id} className={styles.userImageWrapper}>
                  <img
                    className={styles.userImage}
                    src={`http://localhost:3001/images/` + imageUser[0].file}
                    alt='User'
                  />
                  {buttonPhoto && !profile && (
                    <button
                      onClick={() =>
                        handleRemovePhoto(imageUser[0].id, imageUser[0].file)
                      }
                      className={styles.buttonWrapperRemove}
                    >
                      <RemoveIcon className={styles.removeIconButton} />
                    </button>
                  )}
                </div>
              ) : (
                <Carousel
                  defaultControlsConfig={{
                    nextButtonText: (
                      <UpPhotoIcon className={styles.iconButton} />
                    ),
                    nextButtonStyle: {
                      background: "none",
                      transition: "var(--transition)",
                    },
                    prevButtonText: (
                      <BackPhotoIcon className={styles.iconButton} />
                    ),
                    prevButtonStyle: {
                      background: "none",
                      transition: "var(--transition)",
                    },
                    pagingDotsStyle: { display: "none" },
                  }}
                  withoutControls={!buttonPhoto}
                >
                  {imageUser?.map((image) => (
                    <div key={image.id} className={styles.userImageWrapper}>
                      <img
                        className={styles.userImage}
                        src={`http://localhost:3001/images/` + image.file}
                        alt='User'
                      />
                      {buttonPhoto && (
                        <button
                          onClick={() =>
                            handleRemovePhoto(image.id, image.file)
                          }
                          className={styles.buttonWrapperRemove}
                        >
                          <RemoveIcon className={styles.removeIconButton} />
                        </button>
                      )}
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          )}
          <div className={styles.photoFIO}>
            <p>
              {user?.name} {user?.surname}
            </p>
            <p className={styles.userOnline}>
              {user?.online && formateDateOnline(new Date(user?.online))}
            </p>
          </div>
          {!profile && (
            <div className={styles.uploadWrapper}>
              <button className={styles.uploadPhoto}>
                <label className={styles.iconPhotoWrapper} htmlFor='loadphoto'>
                  <PhotoIcon />
                </label>
                <input
                  name='image'
                  className={styles.input}
                  accept='.jpg, .jpeg, .png'
                  onChange={handleLoadPhoto}
                  type='file'
                  id='loadphoto'
                />
              </button>
            </div>
          )}
        </div>
        <div className={styles.infoLast}>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.email))}
          >
            <MailIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.email}</p>
              <p className={styles.secondInfo}>Email</p>
            </span>
          </div>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.username))}
          >
            <UsernameIcon className={styles.iconInfo} />
            <span>
              <p className={styles.firstInfo}>{user?.username}</p>
              <p className={styles.secondInfo}>Username</p>
            </span>
          </div>
          {user?.bio && (
            <div
              className={styles.info}
              onClick={() => handleCopy(String(user?.username))}
            >
              <InfoIcon className={styles.iconInfo} />
              <span>
                <p className={styles.firstInfo}>{user?.bio}</p>
                <p className={styles.secondInfo}>bio</p>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
