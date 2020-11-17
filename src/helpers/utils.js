
import { WindDirection, Months, Weekdays } from './text-arrays'

export const DegreesToDirection = (degrees) => {
  const value = Math.floor((degrees / 22.5) + 0.5);
  return WindDirection[value % 16];
}

const date = new Date();
export const Month =  Months[date.getMonth()];
export const Weekday = Weekdays[date.getDay()];
export const Day = date.getDate();