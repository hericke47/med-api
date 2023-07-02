interface IDateProvider {
  addDays(days: number): Date;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  subtractMinutes(date: Date, minutes: number): Date;
  addMinutes(date: Date, minutes: number): Date;
}

export { IDateProvider };
