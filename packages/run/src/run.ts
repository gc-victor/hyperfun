import { Command, RunOptions } from '../types';
import { command } from './command';
import { extend } from './plugins';

export function run(options: RunOptions): Command {
    return command(extend(options));
}
