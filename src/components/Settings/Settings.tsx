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
  useWindowSize,
} from "utils/hooks";
import { deleteUser } from "resolvers/user";
import { deleteUpload } from "resolvers/upload";
import {
  actionAddCopy,
  actionAddImageUser,
  actionAddTabIndexFirst,
  actionAddTabIndexFiveth,
  actionAddTabIndexFourth,
  actionAddTabIndexSeventh,
  actionAddTabIndexSixth,
  actionMenuEdit,
  actionMenuSetting,
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
  tabIndex,
  ...props
}: SettingsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const auhtorization = useAuthorization();
  const exit = useExit();
  const error = useError();
  const windowSize = useWindowSize();
  //store
  let user: IUser | undefined = useAppSelector(getUser);
  if (sender) {
    user = sender;
  }
  const settings: boolean = useAppSelector(getMenuSetting);
  const imageUser: IImage[] | undefined = useAppSelector(getImageUser);

  const [permission, setPermission] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

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
  //copy string
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    dispatch(actionAddCopy(true));
    debouncedMutation();
  };
  //delete user function
  const handleRemoveUser = async () => await mutationFunction();
  //load img function in server
  const handleLoadPhoto = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (e.target.files[0].size > 5000000) {
      error("File have many size, please select file with 5MB");
      e.target.value = null;
    }
    if (e.target.files[0].size < 5000000) {
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
  //delete photo
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
            <button
              className={cn(styles.back, styles.backCorrcet)}
              onClick={() => {
                if (setSettings) {
                  setSettings(false);
                  dispatch(actionAddTabIndexFirst(0));
                  dispatch(actionAddTabIndexSixth(0));
                  dispatch(actionAddTabIndexSeventh(-1));
                  if (windowSize[0] < 1000) {
                    dispatch(actionAddTabIndexFirst(-1));
                    dispatch(actionAddTabIndexSixth(0));
                  }
                }
                if (!setSettings) {
                  dispatch(actionMenuSetting(false));
                }
              }}
              tabIndex={tabIndex}
            >
              <RemoveIcon className={styles.removeIcon} />
            </button>
          ) : (
            <button
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuSetting(false));
                setDeleteUser(false);
                dispatch(actionAddTabIndexFourth(-1));
                dispatch(actionAddTabIndexFirst(0));
                dispatch(actionAddTabIndexSixth(0));
                if (windowSize[0] < 1000) {
                  dispatch(actionAddTabIndexSixth(-1));
                }
              }}
              className={styles.back}
              tabIndex={tabIndex}
            >
              <BackIcon className={styles.backIcon} />
            </button>
          )}
          <h2>{!profile ? "Settings" : "Profile"}</h2>
        </div>
        <div>
          {!profile && (
            <button
              className={styles.edit}
              onClick={() => {
                setSettings
                  ? setSettings(false)
                  : dispatch(actionMenuEdit(true));
                setDeleteUser(false);
                dispatch(actionAddTabIndexFourth(-1));
                dispatch(actionAddTabIndexFiveth(0));
              }}
              tabIndex={tabIndex}
            >
              <EditIcon className={styles.editIcon} />
            </button>
          )}
          {!profile && (
            <>
              <button
                className={styles.delete}
                onClick={() => setDeleteUser(!deleteUsera)}
                tabIndex={tabIndex}
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
                  tabIndex={deleteUsera === true ? 0 : -1}
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
              ? !user?.file
                ? `linear-gradient(${color?.color1}, ${color?.color2})`
                : "none"
              : imageUser?.length === 0
              ? `linear-gradient(${color?.color1}, ${color?.color2})`
              : "none",
          }}
        >
          {profile ? (
            user?.file ? (
              <div className={styles.wrapperImage}>
                <div className={styles.userImageWrapper}>
                  <img
                    className={styles.userImage}
                    src={`http://localhost:3001/images/` + user?.file}
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
                      tabIndex={-1}
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
                          tabIndex={-1}
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
              <button className={styles.uploadPhoto} tabIndex={-1}>
                <label
                  className={styles.iconPhotoWrapper}
                  htmlFor='loadphoto'
                  tabIndex={tabIndex}
                >
                  <PhotoIcon />
                </label>
                <input
                  name='image'
                  className={styles.input}
                  accept='.jpg, .jpeg, .png'
                  onChange={handleLoadPhoto}
                  type='file'
                  id='loadphoto'
                  data-required='true'
                />
              </button>
            </div>
          )}
        </div>
        <div className={styles.infoLast}>
          <div
            className={styles.info}
            onClick={() => handleCopy(String(user?.email))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCopy(String(user?.email));
              }
            }}
            tabIndex={tabIndex}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCopy(String(user?.username));
              }
            }}
            tabIndex={tabIndex}
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
              onClick={() => handleCopy(String(user?.bio))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCopy(String(user?.bio));
                }
              }}
              tabIndex={tabIndex}
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
