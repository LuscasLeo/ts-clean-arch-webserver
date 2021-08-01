import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Console } from "winston/lib/winston/transports";

const basicFormat = format.combine(
    format.metadata(), 
    format.timestamp(),
);

winston.add(
    new Console({
        format: format.combine(format.colorize(), format.errors(),basicFormat, format.simple()),
    })
);

winston.add(
    new DailyRotateFile({
        filename: "logs/%DATE%.log",
        format: format.combine(basicFormat, format.json()),
    })
);

export function getLogger(label: string) {
    return winston.child({ label });
}
