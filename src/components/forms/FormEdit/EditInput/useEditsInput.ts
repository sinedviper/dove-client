import { IData } from '../Edit/Edits'
import { useMutation } from '@apollo/client'

import { updateUser } from 'resolvers/user'
import {
  actionAddUser,
  actionAddTabIndexFiveth,
  actionAddTabIndexFourth,
  actionMenuEdit,
} from 'store/slice'
import { useAppDispatch, useAuthorization, useError } from 'utils/hooks'
import { IUser } from 'utils/interface'

interface IEditsInput {
  passwordCheck: number
  data: IData
  user: IUser | undefined
  setData: (data: IData) => void
  initialData: IData
}

export const useEditsInput = ({ passwordCheck, user, data, setData, initialData }: IEditsInput) => {
  const authorization = useAuthorization()
  const error = useError()
  const dispatch = useAppDispatch()

  const { username, name, surname, email, bio, password, passwordNew, passwordRepeat } = data

  //res in db
  const [mutateFunction] = useMutation(updateUser, {
    onCompleted(data) {
      authorization<IUser>(data.updateUser, actionAddUser)
      setData(initialData)
      dispatch(actionAddTabIndexFiveth(-1))
      dispatch(actionAddTabIndexFourth(0))
      dispatch(actionMenuEdit(false))
    },
    onError(errorData) {
      error(errorData.message)
    },
  })

  const onSubmit = async (): Promise<void> => {
    let checkFields = true
    let obj = {}
    setData({
      ...data,
      errorUsername: false,
      errorBio: false,
      errorEmail: false,
      errorName: false,
      errorPassword: false,
      errorPasswordNew: false,
      errorPasswordRepeat: false,
      errorSurname: false,
    })
    //Check main input on value
    if (user?.username !== username) {
      if (
        username.replace(/[A-Za-z0-9]+/g, '').length !== 0 ||
        username.trim().length < 3 ||
        username.trim().length > 40
      ) {
        checkFields = false
        setData({
          ...data,
          errorUsername: true,
        })
        error('Username not correct')
      } else {
        obj = { username }
      }
    }
    if (user?.name !== name) {
      if (
        name.replace(/[A-Za-z]+/g, '').length !== 0 ||
        name.trim().length < 1 ||
        name.trim().length > 40
      ) {
        checkFields = false
        setData({
          ...data,
          errorName: true,
        })
        error('Name not correct')
      } else {
        obj = { ...obj, name }
      }
    }
    if (user?.surname !== surname) {
      if (surname.replace(/[A-Za-z]+/g, '').length !== 0 || surname.trim().length > 40) {
        checkFields = false
        setData({
          ...data,
          errorSurname: true,
        })
        error('Surname not correct')
      } else {
        obj = { ...obj, surname }
      }
    }
    if (user?.email !== email) {
      if (
        // eslint-disable-next-line no-useless-escape
        email.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, '').length !== 0 ||
        email.trim().length < 3 ||
        email.trim().length > 40
      ) {
        checkFields = false
        setData({
          ...data,
          errorEmail: true,
        })
        error('Email not correct')
      } else {
        obj = { ...obj, email }
      }
    }
    if (user?.bio !== bio) {
      if (
        // eslint-disable-next-line no-useless-escape
        bio.replace(/[A-Za-z0-9\.\, ]+/g, '').length !== 0 ||
        bio.trim().length > 40
      ) {
        checkFields = false
        setData({
          ...data,
          errorBio: true,
        })
        error('Bio not correct')
      } else {
        obj = { ...obj, bio }
      }
    }
    //Check password on value
    if (
      passwordNew.trim().length !== 0 &&
      password.trim().length !== 0 &&
      passwordRepeat.trim().length !== 0
    ) {
      if (passwordCheck === 3) {
        if (passwordNew === passwordRepeat) {
          setData({
            ...data,
            errorPassword: false,
            errorPasswordNew: false,
            errorPasswordRepeat: false,
          })
          obj = {
            ...obj,
            password,
            passwordNew,
          }
        }

        if (passwordNew !== passwordRepeat) {
          checkFields = false
          setData({
            ...data,
            errorPasswordRepeat: true,
          })
          error('Please correct repeat password')
        }
      }
      if (passwordCheck < 3) {
        checkFields = false
        error('Please correct new password')
      }
    }
    //displaying information about an incorrect password
    if (!password && passwordNew && passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPassword: true,
      })
      error('Please enter your main password')
    }
    if (password && !passwordNew && passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPasswordNew: true,
      })
      error('Please enter your new password')
    }
    if (password && passwordNew && !passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPasswordRepeat: true,
      })
      error('Please enter your repeat password')
    }
    if (password && !passwordNew && !passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPasswordNew: true,
        errorPasswordRepeat: true,
      })
      error('Please enter your new password and repeat password')
    }
    if (!password && !passwordNew && passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPassword: true,
        errorPasswordNew: true,
      })
      error('Please enter your main password and new password')
    }
    if (!password && passwordNew && !passwordRepeat) {
      checkFields = false
      setData({
        ...data,
        errorPassword: true,
        errorPasswordNew: true,
        errorPasswordRepeat: true,
      })
      error('Please enter all password fields')
    }
    //Update user
    if (checkFields) {
      await mutateFunction({ variables: { input: obj } })
    }
  }

  return { onSubmit }
}
