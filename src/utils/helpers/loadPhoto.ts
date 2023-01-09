import { axiosSet } from '../service'
import { IImage, IRes } from '../interface'
import { actionAddImageUser } from 'store/slice'

export const handleLoadPhoto = async (
  e,
  error,
  authorization: <T>(data: IRes<T>, actionAdd) => void,
): Promise<void> => {
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
