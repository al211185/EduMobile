import { useEffect, useRef } from "react";

/**
 * Notifies parent components when form data actually changes. It avoids
 * propagating redundant updates that can cause flickering or state loops by
 * comparing serialized snapshots. The notification cache resets whenever the
 * provided reset key changes (for example, when new initial data arrives).
 */
const usePropagateDataChange = (data, onChange, resetKey) => {
    const lastSnapshotRef = useRef(null);

    useEffect(() => {
        if (resetKey === undefined) {
            return;
        }
        lastSnapshotRef.current = null;
    }, [resetKey]);

    useEffect(() => {
        if (typeof onChange !== "function") {
            return;
        }

        const snapshot = JSON.stringify(data ?? null);
        if (lastSnapshotRef.current === snapshot) {
            return;
        }

        lastSnapshotRef.current = snapshot;
        onChange(data);
    }, [data, onChange]);
};

export default usePropagateDataChange;