export const extractFilePath = (result) => {
    if (!result || typeof result !== "object") {
        return "";
    }

    return (
        result.filePath ??
        result.FilePath ??
        result.filepath ??
        result.Filepath ??
        result.path ??
        result.Path ??
        ""
    );
};

export const buildPreviewUrl = (baseEndpoint, filePath) => {
    if (!filePath) {
        return "";
    }

    const segments = `${filePath}`.split(/[\\/]+/).filter(Boolean);
    const fileName = segments.length ? segments[segments.length - 1] : "";
    if (!fileName) {
        return "";
    }

    return `${baseEndpoint}/${encodeURIComponent(fileName)}`;
};

export const normalizeKeysToCamelCase = (data) => {
    if (Array.isArray(data)) {
        return data.map((item) => normalizeKeysToCamelCase(item));
    }

    if (!data || typeof data !== "object") {
        return data;
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
        const camelKey = key.length > 0 ? key[0].toLowerCase() + key.slice(1) : key;
        acc[camelKey] = normalizeKeysToCamelCase(value);
        return acc;
    }, {});
};