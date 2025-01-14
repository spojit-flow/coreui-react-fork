export const convertToLocalDate = (d: Date, locale: string, options = {}) =>
  d.toLocaleDateString(locale, options)

export const convertToLocalTime = (d: Date, locale: string, options = {}) =>
  d.toLocaleTimeString(locale, options)

export const createGroupsInArray = <T>(arr: T[], numberOfGroups: number): T[][] => {
  const perGroup = Math.ceil(arr.length / numberOfGroups)
  return Array.from({ length: numberOfGroups })
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
}

export const getCurrentYear = () => new Date().getFullYear()

export const getCurrentMonth = () => new Date().getMonth()

export const getMonthName = (month: number, locale: string) => {
  const d = new Date()
  d.setDate(1)
  d.setMonth(month)
  return d.toLocaleString(locale, { month: 'long' })
}

export const getMonthsNames = (locale: string) => {
  const months = []
  const d = new Date()
  d.setDate(1)

  for (let i = 0; i < 12; i++) {
    d.setMonth(i)
    months.push(d.toLocaleString(locale, { month: 'short' }))
  }

  return months
}

export const getYears = (year: number) => {
  const years = []
  for (let _year = year - 6; _year < year + 6; _year++) {
    years.push(_year)
  }

  return years
}

const getLeadingDays = (year: number, month: number, firstDayOfWeek: number) => {
  // 0: sunday
  // 1: monday
  const dates = []
  const d = new Date(year, month)
  const y = d.getFullYear()
  const m = d.getMonth()
  const firstWeekday = new Date(y, m, 1).getDay()
  let leadingDays = 6 - (6 - firstWeekday) - firstDayOfWeek

  if (firstDayOfWeek) {
    leadingDays = leadingDays < 0 ? 7 + leadingDays : leadingDays
  }

  for (let i = leadingDays * -1; i < 0; i++) {
    dates.push({
      date: new Date(y, m, i + 1),
      month: 'previous',
    })
  }

  return dates
}

const getMonthDays = (year: number, month: number) => {
  const dates = []
  const lastDay = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= lastDay; i++) {
    dates.push({
      date: new Date(year, month, i),
      month: 'current',
    })
  }
  return dates
}

const getTrailingDays = (
  year: number,
  month: number,
  leadingDays: { date: Date; month: string }[],
  monthDays: { date: Date; month: string }[],
) => {
  const dates = []
  const days = 42 - (leadingDays.length + monthDays.length)
  for (let i = 1; i <= days; i++) {
    dates.push({
      date: new Date(year, month + 1, i),
      month: 'next',
    })
  }
  return dates
}

export const getMonthDetails = (year: number, month: number, firstDayOfWeek: number) => {
  const daysPrevMonth = getLeadingDays(year, month, firstDayOfWeek)
  const daysThisMonth = getMonthDays(year, month)
  const daysNextMonth = getTrailingDays(year, month, daysPrevMonth, daysThisMonth)
  const days = [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth]

  const weeks: { date: Date; month: string }[][] = []

  days.forEach((day, index) => {
    if (index % 7 === 0 || weeks.length === 0) {
      weeks.push([])
    }
    weeks[weeks.length - 1].push(day)
  })

  return weeks
}

export const isDisableDateInRange = (
  startDate?: Date | null,
  endDate?: Date | null,
  dates?: Date[] | Date[][] | (Date | Date[])[],
) => {
  if (startDate && endDate) {
    const date = new Date(startDate)
    let disabled = false

    while (date < endDate) {
      date.setDate(date.getDate() + 1)
      if (isDateDisabled(date, null, null, dates)) {
        disabled = true
        break
      }
    }

    return disabled
  }

  return false
}

export const isDateDisabled = (
  date: Date,
  min?: Date | null,
  max?: Date | null,
  dates?: Date[] | Date[][] | (Date | Date[])[],
) => {
  let disabled
  if (dates) {
    dates.forEach((_date: Date | Date[]) => {
      if (Array.isArray(_date) && isDateInRange(date, _date[0], _date[1])) {
        disabled = true
      }

      if (_date instanceof Date && isSameDateAs(date, _date)) {
        disabled = true
      }
    })
  }

  if (min && date < min) {
    disabled = true
  }

  if (max && date > max) {
    disabled = true
  }

  return disabled
}

export const isDateInRange = (date: Date, start: Date | null, end: Date | null) => {
  return start && end && start <= date && date <= end
}

export const isDateSelected = (date: Date, start: Date | null, end: Date | null) => {
  return (start && isSameDateAs(start, date)) || (end && isSameDateAs(end, date))
}

export const isEndDate = (date: Date, start: Date | null, end: Date | null) => {
  return start && end && isSameDateAs(end, date) && start < end
}

export const isLastDayOfMonth = (date: Date) => {
  const test = new Date(date.getTime())
  const month = test.getMonth()

  test.setDate(test.getDate() + 1)
  return test.getMonth() !== month
}

export const isSameDateAs = (date: Date | null, date2: Date | null) => {
  if (date instanceof Date && date2 instanceof Date) {
    return (
      date.getDate() === date2.getDate() &&
      date.getMonth() === date2.getMonth() &&
      date.getFullYear() === date2.getFullYear()
    )
  }

  if (date === null && date2 === null) {
    return true
  }

  return false
}

export const isStartDate = (date: Date, start: Date | null, end: Date | null) => {
  return start && end && isSameDateAs(start, date) && start < end
}

export const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isValidDate = (date: string) => {
  const d = new Date(date)
  return d instanceof Date && d.getTime()
}
