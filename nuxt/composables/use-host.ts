export const useHost = () => {
    const host = window.location.host ?? useRequestHeaders()['host'] ?? '';
    return { host };
};
