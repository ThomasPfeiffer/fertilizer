import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import MockDate from "mockdate"

dayjs.extend(customParseFormat)
MockDate.set(new Date(2022, 11, 29, 22, 0, 0))
