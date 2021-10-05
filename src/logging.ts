import winston, { format } from "winston";
import { Console } from "winston/lib/winston/transports";

winston.level = process.env.LOG_LEVEL

const basicFormat = format.combine(
    format.metadata(), 
    format.timestamp(),
);

winston.add(
    new Console({
        format: format.combine(format.colorize(), format.errors(),basicFormat, format.simple()),
    })
);

export function getLogger(label: string) {
    return winston.child({ label });
}
