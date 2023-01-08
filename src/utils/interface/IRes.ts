export interface IRes<T> {
  status: 'Invalid' | 'Success'
  code: number
  data: T
  message: string
}
