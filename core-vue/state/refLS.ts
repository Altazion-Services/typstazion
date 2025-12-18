import { type Ref, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { LocalStorage } from '../../core';

function resolveDefault<T>(key: string, defaultValue: T | undefined): T | undefined {
    let stored = LocalStorage.get<T>(key);
    if (stored !== undefined) {
        return stored;
    }
    if (defaultValue !== undefined) {
        stored = LocalStorage.set<T>(key, defaultValue);
        return stored;
    }
}

/**
 * Associates a Vue ref with a LocalStorage key.
 * @param key The LocalStorage key to bind to.
 * @param defaultValue The value to use if the key does not exist in LocalStorage.
 * @returns A Vue ref that is synchronized with the LocalStorage key.
 */
export function refLS<T>(key: string, defaultValue?: T): Ref<T | undefined> {
    const state = ref(resolveDefault<T>(key, defaultValue)) as Ref<T | undefined>;

    function onSet(value?: T) {
        state.value = value;
    }

    function onRemove() {
        state.value = undefined;
    }

    onMounted(() => {
        LocalStorage.onSet<T>(key, onSet);
        LocalStorage.onRemove(key, onRemove);
    });

    onBeforeUnmount(() => {
        LocalStorage.clearListeners(key);
    });

    watch(state, value => {
        if (value === undefined) {
            LocalStorage.remove(key);
        } else {
            LocalStorage.set(key, value);
        }
    });

    return state;
}
