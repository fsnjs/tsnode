import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Subject } from 'rxjs';
import { formatTscMessage } from './format-tsc-message.js';

export class TscSubject extends Subject<{
    message: string;
    continue: boolean;
}> {
    public proc: ChildProcessWithoutNullStreams;

    constructor(tsconfigPath: string, watch?: boolean) {
        super();
        this.proc = spawn('tsc', this._mkArgs(tsconfigPath, watch));
        this.proc.stdout.setEncoding('utf-8');
        this.proc.stdout.on('data', (message) => {
            this.next({ continue: formatTscMessage(message), message });
        });
        this.proc.on('error', (error) => this.error(error));
        this.proc.on('exit', () => this.complete());
    }

    private _mkArgs(tsconfigPath: string, watch?: boolean) {
        const tscArgs = ['-p', tsconfigPath];
        if (watch) tscArgs.push('--watch');
        return tscArgs;
    }

    override unsubscribe() {
        this.proc?.disconnect();
        super.unsubscribe();
    }
}
