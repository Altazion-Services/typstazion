import type { NuxtAppInterface } from './types';

export default function consoleHandler(nuxtApp: NuxtAppInterface) {
    nuxtApp.vueApp.config.errorHandler = (err: unknown, _, info: string) => {
        console.error(err, info);
    };

    nuxtApp.vueApp.config.warnHandler = (msg: string, _, trace: string) => {
        if (process.env.IGNORE_CONSOLE_WARNINGS) {
            return;
        }
        console.warn(msg, trace);
    };
}
