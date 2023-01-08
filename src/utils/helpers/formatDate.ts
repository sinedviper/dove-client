//here function that show dat in format what need

export const formateDate = (data: Date): string => {
  const todayDate = new Date()

  if (todayDate.getFullYear() === data.getFullYear()) {
    if (todayDate.getMonth() === data.getMonth()) {
      if (todayDate.getDate() === data.getDate()) {
        return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(data)
      } else {
        if (todayDate.getDate() - 7 <= 0) {
          return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
          }).format(data)
        } else {
          if (todayDate.getDate() - 7 >= data.getDate()) {
            return (
              new Intl.DateTimeFormat('en-US', { month: 'short' }).format(data) +
              ' ' +
              data.getDate()
            )
          } else {
            return new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
            }).format(data)
          }
        }
      }
    } else {
      const day = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 7)

      if (day.getMonth() === data.getMonth()) {
        if (day.getDate() > data.getDate()) {
          return (
            new Intl.DateTimeFormat('en-US', { month: 'short' }).format(data) + ' ' + data.getDate()
          )
        } else {
          return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
          }).format(data)
        }
      } else {
        return (
          new Intl.DateTimeFormat('en-US', { month: 'short' }).format(data) + ' ' + data.getDate()
        )
      }
    }
  } else {
    return String(data.getFullYear())
  }
}

export const formatHours = (data: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data))
}

export const formateDateOnline = (data: Date): string => {
  const todayDate = new Date()
  if (todayDate.getFullYear() === data.getFullYear()) {
    if (todayDate.getMonth() === data.getMonth()) {
      if (todayDate.getDate() === data.getDate()) {
        if (todayDate.getHours() === data.getHours()) {
          if (minutesFormat(todayDate, data) < 30) {
            if (minutesFormat(todayDate, data) < 5) {
              return 'online'
            } else {
              return `last seen ${minutesFormat(todayDate, data)} minutes`
            }
          } else {
            return new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(data)
          }
        } else {
          if (minutesFormat(todayDate, data) < 30) {
            return `last seen ${minutesFormat(todayDate, data)} minutes`
          } else {
            return new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(data)
          }
        }
      } else {
        if (todayDate.getDate() - 7 <= 0) {
          return (
            'last seen ' +
            new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
            }).format(data)
          )
        } else {
          if (todayDate.getDate() - 7 >= data.getDate()) {
            return (
              'last seen ' +
              (new Intl.DateTimeFormat('en-US', { month: 'long' }).format(data) +
                ' ' +
                data.getDate())
            )
          } else {
            return (
              'last seen ' +
              new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
              }).format(data)
            )
          }
        }
      }
    } else {
      const day = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 7)

      if (day.getMonth() === data.getMonth()) {
        if (day.getDate() > data.getDate()) {
          return (
            'last seen ' +
            (new Intl.DateTimeFormat('en-US', { month: 'long' }).format(data) +
              ' ' +
              data.getDate())
          )
        } else {
          return (
            'last seen ' +
            new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
            }).format(data)
          )
        }
      } else {
        return (
          'last seen ' +
          (new Intl.DateTimeFormat('en-US', { month: 'long' }).format(data) + ' ' + data.getDate())
        )
      }
    }
  } else {
    return 'last seen ' + String(data.getFullYear())
  }
}

export const minutesFormat = (d, d2): number => {
  return Math.floor((d - d2) / (60 * 1000))
}

export const formatDay = (data: Date): string => {
  return String(
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
    }).format(data),
  )
    .split(' ')
    .reverse()
    .join(' ')
}
