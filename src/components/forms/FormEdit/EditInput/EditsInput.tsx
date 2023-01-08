import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import { SERVER_LINK } from 'utils/constants'
import { Input } from 'components/layouts'
import { getImageUser, getTabIndexFiveth, getUser } from 'store/select'
import { actionMenuEdit } from 'store/slice'
import { useAppDispatch, useAppSelector } from 'utils/hooks'
import { colorCard } from 'utils/helpers'
import { IUser, IImage } from 'utils/interface'
import { PhotoIcon, SupheedIcon } from 'assets'

import { useEditsInput } from './useEditsInput'
import { EditsInputProps } from './EditsInput.props'
import styles from './EditsInput.module.css'

export const EditsInput = ({
  data,
  setData,
  initialData,
  className,
  ...props
}: EditsInputProps): JSX.Element => {
  const dispatch = useAppDispatch()

  //store
  const user: IUser | undefined = useAppSelector(getUser)
  const imageUser: IImage | undefined = useAppSelector(getImageUser)?.[0]
  const tabIndexFifth: number = useAppSelector(getTabIndexFiveth)

  const [swiper, setSwiper] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)

  const {
    username,
    name,
    surname,
    email,
    bio,
    password,
    passwordNew,
    passwordRepeat,
    errorBio,
    errorEmail,
    errorName,
    errorPassword,
    errorSurname,
    errorUsername,
    errorPasswordNew,
    errorPasswordRepeat,
  } = data

  //getting a color for a user if they don't have a photo
  const color = colorCard(String(user?.name.toUpperCase().slice()[0]))

  const [passwordCheck, setPasswordCheck] = useState<number>(0)

  const { onSubmit, handleLoadPhoto } = useEditsInput({
    passwordCheck,
    data,
    user,
    setData,
    initialData,
  })

  const handleInput = async (e): Promise<void> => {
    await handleLoadPhoto(e)
    setData({
      ...data,
      password: '',
      passwordNew: '',
      passwordRepeat: '',
    })
    setSubmit(false)
    dispatch(actionMenuEdit(false))
  }

  //Check values in input, changed or not, when changed button has see
  useEffect(() => {
    if (
      username !== user?.username ||
      name !== user?.name ||
      surname !== user?.surname ||
      email !== user?.email ||
      bio !== user?.bio ||
      password !== '' ||
      passwordNew !== '' ||
      passwordRepeat !== ''
    ) {
      setSubmit(true)
    }
    if (
      username === user?.username &&
      name === user?.name &&
      surname === user?.surname &&
      email === user?.email &&
      bio === user?.bio &&
      password === '' &&
      passwordNew === '' &&
      passwordRepeat === ''
    ) {
      setSubmit(false)
    }
  }, [username, user, name, surname, email, bio, password, passwordNew, passwordRepeat])

  return (
    <div
      className={cn(className, styles.contactsList, {
        [styles.swiper]: swiper,
      })}
      onMouseLeave={() => setSwiper(false)}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <div className={styles.editUser}>
        <div className={styles.editPhoto}>
          {imageUser ? (
            <div className={styles.uploadWrapper} style={{ display: imageUser ? 'block' : 'none' }}>
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
                onChange={handleInput}
                type='file'
                id='loadphotod'
              />
            </div>
          ) : (
            <div
              className={styles.uploadWrapper}
              style={{ display: !imageUser ? 'block' : 'none' }}
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
          tabIndex={tabIndexFifth}
          error={errorName}
          placeholderName='Name'
          notification={true}
          notificationText={'Name must be between 1 and 40 characters'}
          text={name}
          setText={(name) => setData({ ...data, name })}
        />
        <Input
          tabIndex={tabIndexFifth}
          error={errorSurname}
          placeholderName='Surname(optional)'
          notification={true}
          notificationText={'Surname must be between 1 and 40 characters'}
          text={surname}
          setText={(surname) => setData({ ...data, surname })}
        />
        <Input
          tabIndex={tabIndexFifth}
          placeholderName='Bio(optional)'
          error={errorBio}
          text={bio}
          setText={(bio) => setData({ ...data, bio })}
        />
      </div>
      <div className={styles.editInfo}>
        <p>Any details such as age, occupation or city.</p>
        <p>Example: 24 y.o. frontend from San Francisco</p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Email</h2>
        <Input
          tabIndex={tabIndexFifth}
          error={errorEmail}
          placeholderName='Email'
          notification={true}
          notificationText={
            "Email must be between 3 and 40 characters and have '@' and variant '.com'"
          }
          text={email}
          setText={(email) => setData({ ...data, email })}
        />
      </div>
      <div className={styles.editInfo}>
        <p>You can change the your email on Dove.</p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Username</h2>
        <Input
          tabIndex={tabIndexFifth}
          error={errorUsername}
          placeholderName='Username'
          notification={true}
          notificationText={'Username must be between 3 and 40 characters'}
          text={username}
          setText={(username) => setData({ ...data, username })}
        />
      </div>
      <div className={styles.editInfo}>
        <p>
          You can choose a username on Dove. If you do people will be able to find you by this
          username.
        </p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Password</h2>
        <Input
          tabIndex={tabIndexFifth}
          error={errorPassword}
          placeholderName='Main password'
          notification={true}
          notificationText={'Password must be between 8 and 40 characters'}
          password={true}
          text={password}
          setText={(password) => setData({ ...data, password })}
        />
        <Input
          tabIndex={tabIndexFifth}
          error={errorPasswordNew}
          placeholderName='New password'
          setPassword={setPasswordCheck}
          notification={true}
          notificationText={
            'Password must be between 8 and 40 characters and have a capital letter and a number'
          }
          password={true}
          check={true}
          text={passwordNew}
          setText={(passwordNew) => setData({ ...data, passwordNew })}
        />
        <Input
          tabIndex={tabIndexFifth}
          error={errorPasswordRepeat}
          placeholderName='Repeat password'
          textCheckPassNew={passwordNew}
          notification={true}
          notificationText={'Please re-enter your password correctly'}
          password={true}
          text={passwordRepeat}
          setText={(passwordRepeat) => setData({ ...data, passwordRepeat })}
        />
      </div>
      <div className={cn(styles.editInfo, styles.info)}>
        <p>You can change the your password on Dove.</p>
      </div>
      <button
        tabIndex={tabIndexFifth}
        className={cn(styles.supheed, {
          [styles.submit]: submit,
        })}
        onClick={onSubmit}
      >
        <SupheedIcon />
      </button>
    </div>
  )
}
