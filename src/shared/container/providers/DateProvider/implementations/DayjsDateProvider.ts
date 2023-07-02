import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../models/IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return dayjs().utc(true).add(days, "days").toDate();
  }

  addMinutes(date: Date, minutes: number): Date {
    return dayjs(date).utc(true).add(minutes, "minutes").toDate();
  }

  subtractMinutes(date: Date, minutes: number): Date {
    return dayjs(date).utc(true).subtract(minutes, "minutes").toDate();
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }
}

export { DayjsDateProvider };
