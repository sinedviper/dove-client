import React from 'react'
import { useMutation } from '@apollo/client'
import cn from 'classnames'

import { IImage } from 'utils/interface'
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useDebounce,
  useError,
  useExit,
} from 'utils/hooks'
import { deleteUser } from 'resolvers/user'
import { deleteUpload } from 'resolvers/upload'
import { getUser, getMenuSetting, getImageUser } from 'store/select'
import { actionAddImageUser, actionAddCopy } from 'store/slice'
import { axiosSet } from 'utils/service'

import { SettingsImage } from '../SettingImage'
import { SettingsInfo } from '../SettingsInfo'
import { SettingsProps } from './Settings.props'
import styles from './Settings.module.css'

export const Settings = ({
  className,
  setSettings,
  sender,
  profile = false,
  tabIndex,
  ...props
}: SettingsProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const authorization = useAuthorization()
  const exit = useExit()
  const error = useError()
  //store
  let user = useAppSelector(getUser)
  if (sender) {
    user = sender
  }
  const settings = useAppSelector(getMenuSetting)
  const imageUser = useAppSelector(getImageUser)

  const [mutationFunction] = useMutation(deleteUser, {
    fetchPolicy: 'network-only',
    onCompleted: exit,
    onError(errorData) {
      error(errorData.message)
    },
  })

  const [mutationFunctionDeletePhoto] = useMutation(deleteUpload, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      authorization<IImage[]>(data.deleteUpload, actionAddImageUser)
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const debouncedMutation = useDebounce(() => {
    dispatch(actionAddCopy(false))
  }, 3000)
  //copy string
  const handleCopy = async (value: string): Promise<void> => {
    await navigator.clipboard.writeText(value)
    dispatch(actionAddCopy(true))
    debouncedMutation()
  }
  //delete user function
  const handleRemoveUser = async (): Promise<void> => {
    await mutationFunction()
  }
  //load img function in server
  const handleLoadPhoto = async (e): Promise<void> => {
    const formData = new FormData()
    const file = e.target.files[0]
    if (e.target.files[0].size > 3000000) {
      error('File have many size, please select file with 3MB')
      e.target.value = null
    }
    if (e.target.files[0].size < 3000000) {
      formData.append('image', file)
      const { data } = await axiosSet.post('/upload', formData)
      authorization<IImage[]>(data, actionAddImageUser)
      e.target.value = null
    }
  }
  //delete photo
  const handleRemovePhoto = async (idPhoto: number, file: string): Promise<void> => {
    await mutationFunctionDeletePhoto({
      variables: { idPhoto: Number(idPhoto), file: String(file) },
    })
  }

  return (
    <section
      className={cn(className, styles.settingsWrapper, {
        [styles.settingsWrapperOpen]: !profile && settings,
        [styles.profile]: profile,
      })}
      {...props}
    >
      <SettingsImage
        setSettings={setSettings}
        profile={profile}
        handleRemoveUser={handleRemoveUser}
      />
      <SettingsInfo
        imageUser={imageUser}
        user={user}
        handleRemovePhoto={handleRemovePhoto}
        profile={profile}
        handleLoadPhoto={handleLoadPhoto}
        handleCopy={handleCopy}
        tabIndex={tabIndex}
      />
    </section>
  )
}
