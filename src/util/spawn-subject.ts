import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Subject } from 'rxjs';

export class SpawnSubject extends Subject<string> {
    public proc: ChildProcessWithoutNullStreams;

    constructor(command: string, args: string[]) {
        super();
        this.proc = spawn(command, args);
        this.proc.stdout.setEncoding('utf-8');
        this.proc.stdout.on('data', (chunk) => this.next(chunk));
        this.proc.on('error', (error) => this.error(error));
        this.proc.on('exit', () => this.complete());
        return this;
    }

    override unsubscribe() {
        this.proc?.disconnect();
        super.unsubscribe();
    }
}
