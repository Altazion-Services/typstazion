export const useHost = () => {
    const isClient = typeof window !== 'undefined';

    const host = isClient ? window.location.host : (useRequestHeaders()?.['host'] ?? '');

    const protocol = isClient
        ? window.location.protocol.replace(':', '')
        : (useRequestHeaders()?.['x-forwarded-proto'] ?? 'http');

    return { host, protocol };
};
