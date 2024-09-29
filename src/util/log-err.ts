import chalk from 'chalk';

export function logErr(errorStr: string) {
    console.error(chalk.red('Error: ' + errorStr));
}
