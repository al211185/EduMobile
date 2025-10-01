import { useCallback, useEffect, useRef, useState } from "react";

/**
 * General purpose auto-save hook that debounces persistence requests while
 * providing a shared manual save helper. Callers can provide either raw data or
 * a custom payload builder and decide when alerts should be shown.
 */
const useAutoSave = ({
    data,
    buildPayload,
    onSave = async () => true,
    delay = 3000,
    enabled = true,
    serialize = JSON.stringify,
    initialSnapshot,
} = {}) => {
    const timerRef = useRef(null);
    const lastInitialSnapshotRef = useRef(initialSnapshot);
    const [lastSavedSnapshot, setLastSavedSnapshot] = useState(
        initialSnapshot ?? null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (initialSnapshot !== undefined && initialSnapshot !== lastInitialSnapshotRef.current) {
            setLastSavedSnapshot(initialSnapshot);
            lastInitialSnapshotRef.current = initialSnapshot;
        }
    }, [initialSnapshot]);

    const getPayload = useCallback(() => {
        if (!enabled) {
            return null;
        }

        const payload = buildPayload ? buildPayload(data) : data;
        if (payload == null) {
            return null;
        }

        const snapshot = serialize(payload);
        return { payload, snapshot };
    }, [buildPayload, data, enabled, serialize]);

    const saveNow = useCallback(
        async ({ showAlerts = false, force = false } = {}) => {
            clearTimer();

            if (!enabled && !force) {
                return true;
            }

            const result = getPayload();
            if (!result) {
                return false;
            }

            const { payload, snapshot } = result;
            if (!force && (isSaving || snapshot === lastSavedSnapshot)) {
                return true;
            }

            setIsSaving(true);
            setError(null);

            try {
                await onSave(payload, { showAlerts, force });
                setLastSavedSnapshot(snapshot);
                return true;
            } catch (err) {
                setError(err);
                return false;
            } finally {
                setIsSaving(false);
            }
        },
        [clearTimer, enabled, getPayload, isSaving, lastSavedSnapshot, onSave]
    );

    useEffect(() => {
        if (!enabled) {
            clearTimer();
            return undefined;
        }

        const result = getPayload();
        if (!result) {
            return undefined;
        }

        const { snapshot } = result;
        if (snapshot === lastSavedSnapshot) {
            return undefined;
        }

        clearTimer();
        timerRef.current = setTimeout(() => {
            saveNow({ showAlerts: false });
        }, delay);

        return () => {
            clearTimer();
        };
    }, [clearTimer, delay, enabled, getPayload, lastSavedSnapshot, saveNow]);

    useEffect(() => () => clearTimer(), [clearTimer]);

    return { isSaving, saveNow, error, lastSavedSnapshot };
};

export default useAutoSave;