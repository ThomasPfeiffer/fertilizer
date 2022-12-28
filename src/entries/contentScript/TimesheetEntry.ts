import { Dayjs } from "dayjs";

export interface TimesheetEntry {
  start: Dayjs;
  end: Dayjs | null;
  element: Element;
  id: string;
}
