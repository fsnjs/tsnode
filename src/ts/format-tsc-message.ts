import chalk, { ChalkInstance } from 'chalk';

export function formatTscMessage(data: string) {
    if (/error TS/.test(data)) {
        console.error(chalk.red(data.trim()));
        return false;
    }

    if (/(Starting compilation)|(File change detected)/i.test(data)) {
        console.clear();
        console.log(formatTsMsg(data.trim(), chalk.blue) + '\n');
        return false;
    }

    if (/Found 0 errors/.test(data)) {
        console.log(formatTsMsg(data.trim(), chalk.green) + '\n');
        return true;
    }

    if (/Found \d{1,} errors/i.test(data)) {
        console.error(formatTsMsg(data.trim(), chalk.red) + '\n');
        return false;
    }

    if (data.trim().length > 0) {
        console.log(data);
    }

    return false;
}

function formatTsMsg(msg: string, color: ChalkInstance) {
    if (/\d{1,2}:\d{2}:\d{2}/.test(msg)) {
        const [timestamp, message] = msg.split('-');
        return (
            chalk.gray(`[${timestamp.trim()}]`) + ' ' + color(message.trim())
        );
    }

    return color(msg);
}
