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

const sanitizeBaseUrl = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const trimmed = value.trim();
    if (!trimmed || trimmed === "/") {
        return "";
    }

    return trimmed.replace(/\/$/, "");
};

const sanitizeEndpoint = (endpoint) => {
    if (typeof endpoint !== "string") {
        return "";
    }

    const trimmed = endpoint.trim();
    if (!trimmed) {
        return "";
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed.replace(/\/$/, "");
    }

    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withLeadingSlash.replace(/\/$/, "");
};

export const getApiBaseUrl = () => {
    const { VITE_API_BASE_URL } = import.meta.env ?? {};
    return sanitizeBaseUrl(VITE_API_BASE_URL);
};

export const buildPreviewUrl = (baseEndpoint, filePath) => {
    if (!filePath) {
        return "";
    }

    if (/^https?:\/\//i.test(filePath)) {
        return filePath;
    }

    const segments = `${filePath}`.split(/[\\/]+/).filter(Boolean);
    const fileName = segments.length ? segments[segments.length - 1] : "";
    if (!fileName) {
        return "";
    }

    const endpoint = sanitizeEndpoint(baseEndpoint);
    if (!endpoint) {
        return "";
    }

    const path = `${endpoint}/${encodeURIComponent(fileName)}`;

    const baseUrl = getApiBaseUrl();
    if (!baseUrl || /^https?:\/\//i.test(endpoint)) {
        return path;
    }

    return `${baseUrl}${path}`;
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