import React, { useState } from "react";
import Carousel from "nuka-carousel";

import { colorCard, formateDateOnline } from "utils/helpers";
import {
  InfoIcon,
  MailIcon,
  RemoveIcon,
  UsernameIcon,
  PhotoIcon,
  UpPhotoIcon,
  BackPhotoIcon,
} from "assets";
import { SERVER_LINK } from "utils/constants";

import { SettingsInfoProps } from "./SettingsInfo.props";
import styles from "./SettingsInfo.module.css";

export const SettingsInfo = ({
  className,
  imageUser,
  user,
  handleRemovePhoto,
  profile,
  handleLoadPhoto,
  handleCopy,
  tabIndex,
  ...props
}: SettingsInfoProps): JSX.Element => {
  const [buttonPhoto, setButtonPhoto] = useState<boolean>(false);

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  return (
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
                  src={`${SERVER_LINK}/images/` + user?.file}
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
                  src={`${SERVER_LINK}/images/` + imageUser[0].file}
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
                  nextButtonText: <UpPhotoIcon className={styles.iconButton} />,
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
                      src={`${SERVER_LINK}/images/` + image.file}
                      alt='User'
                    />
                    {buttonPhoto && (
                      <button
                        onClick={() => handleRemovePhoto(image.id, image.file)}
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
  );
};
