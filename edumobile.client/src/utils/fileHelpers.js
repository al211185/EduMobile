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

    const endpoint = sanitizeEndpoint(baseEndpoint);
    if (!endpoint) {
        return "";
    }

    let workingPath = `${filePath}`.trim();
    if (!workingPath) {
        return "";
    }

    if (workingPath.startsWith(endpoint)) {
        workingPath = workingPath.slice(endpoint.length);
    }

    workingPath = workingPath.replace(/^\/+/, "");

    const segments = workingPath.split(/[\\/]+/).filter(Boolean);
    if (!segments.length) {
        return endpoint;
    }

    if (segments[0].toLowerCase() === "uploads") {
        segments.shift();
    }

    if (!segments.length) {
        return endpoint;
    }

    const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");
    const path = `${endpoint}/${encodedPath}`;

    const baseUrl = getApiBaseUrl();
    if (!baseUrl || /^https?:\/\//i.test(endpoint)) {
        return path;
    }

    return `${baseUrl}${path}`;
};

const normalizeUploadPath = (value, endpoint) => {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    let working = value.trim();

    if (/^https?:\/\//i.test(working)) {
        try {
            const url = new URL(working);
            working = url.pathname;
        } catch {
            return "";
        }
    }

    if (endpoint && working.startsWith(endpoint)) {
        working = working.slice(endpoint.length);
    }

    working = working.replace(/^\/+/, "");

    const segments = working.split(/[\\/]+/).filter(Boolean);
    if (!segments.length) {
        return "";
    }

    if (segments[0].toLowerCase() === "uploads") {
        segments.shift();
    }

    if (!segments.length) {
        return "";
    }

    return `/uploads/${segments.join("/")}`;
};

export const extractUploadPathFromPreview = (previewUrl, baseEndpoint) => {
    const endpoint = sanitizeEndpoint(baseEndpoint);
    return normalizeUploadPath(previewUrl, endpoint);
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