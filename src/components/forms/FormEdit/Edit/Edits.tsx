import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import { useAppSelector } from 'utils/hooks'
import { getMenuEdit, getUser } from 'store/select'

import { EditsHeader } from '../EditHeader/EditsHeader'
import { EditsInput } from '../EditInput/EditsInput'
import { EditsProps } from './Edits.props'
import styles from './Edits.module.css'

export interface IData {
  username: string
  name: string
  surname: string
  email: string
  bio: string
  password: string
  passwordNew: string
  passwordRepeat: string
  errorUsername: boolean
  errorName: boolean
  errorSurname: boolean
  errorEmail: boolean
  errorBio: boolean
  errorPassword: boolean
  errorPasswordNew: boolean
  errorPasswordRepeat: boolean
}

export const Edits = ({ className, ...props }: EditsProps): JSX.Element => {
  //store
  const edit = useAppSelector(getMenuEdit)
  const user = useAppSelector(getUser)

  const initialData: IData = {
    username: user?.username ? user.username : '',
    name: user?.name ? user?.name : '',
    surname: user?.surname ? user?.surname : '',
    email: user?.email ? user?.email : '',
    bio: user?.bio ? user?.bio : '',
    password: '',
    passwordNew: '',
    passwordRepeat: '',
    errorUsername: false,
    errorName: false,
    errorSurname: false,
    errorEmail: false,
    errorBio: false,
    errorPassword: false,
    errorPasswordNew: false,
    errorPasswordRepeat: false,
  }

  const [data, setData] = useState(initialData)

  useEffect(() => {
    if (!edit && user) {
      if (user.username && user.username !== data.username) {
        setData({ ...data, username: user.username })
      }
      if (user.name && user.name !== data.name) {
        setData({ ...data, name: user.name })
      }
      if (user.surname && user.surname !== data.surname) {
        setData({ ...data, surname: user.surname })
      }
      if (user.email && user.email !== data.email) {
        setData({ ...data, email: user.email })
      }
      if (user.bio && user.bio !== data.bio) {
        setData({ ...data, bio: user.bio })
      }
    }
  }, [user, data, edit])

  return (
    <section
      className={cn(className, styles.editWrapper, {
        [styles.editWrapperOpen]: edit,
      })}
      {...props}
    >
      <EditsHeader data={data} setData={setData} initialData={initialData} />
      <EditsInput data={data} setData={setData} initialData={initialData} />
    </section>
  )
}
