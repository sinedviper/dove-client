import axios from 'axios'

import { IImage, IRes } from '../interface'
import { actionAddImageUser } from 'store/slice'
import { SERVER_LINK } from '../constants'

export const handleLoadPhoto = async (
  e,
  error: (val: string) => void,
  authorization: <T>(data: IRes<T>, actionAdd) => void,
) => {
  const formData = new FormData()
  const file = e.target.files[0]
  if (e.target.files[0].size > 3000000) {
    error('File have many size, please select file with 3MB')
    e.target.value = null
  }
  if (e.target.files[0].size < 3000000) {
    formData.append('image', file)
    const { data } = await axios.post(SERVER_LINK + '/upload', formData, {
      headers: {
        Authorization: window.localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    })
    authorization<IImage[]>(data, actionAddImageUser)
    e.target.value = null
  }
}
