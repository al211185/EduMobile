import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";

const ImageDropZone = ({
    id,
    label,
    previewUrl,
    onFileSelected,
    accept = "image/*",
    disabled = false,
    helperText,
    emptyMessage = "No se ha seleccionado ninguna imagen.",
    className = "",
    imageClassName = "max-h-64 object-contain rounded-xl shadow-sm",
}) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const resetInput = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, []);

    const handleFiles = useCallback(
        (files) => {
            if (disabled) {
                return;
            }
            const file = files && files.length > 0 ? files[0] : null;
            if (onFileSelected) {
                onFileSelected(file);
            }
            resetInput();
        },
        [disabled, onFileSelected, resetInput]
    );

    const handleInputChange = (event) => {
        handleFiles(event.target.files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (disabled) {
            return;
        }
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (disabled) {
            return;
        }
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        if (disabled) {
            return;
        }
        setIsDragging(false);
    };

    const handleClick = () => {
        if (disabled) {
            return;
        }
        inputRef.current?.click();
    };

    return (
        <div className={className}>
            {label ? (
                <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
                    {label}
                </label>
            ) : null}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed transition-colors p-6 text-center ${disabled
                        ? "cursor-not-allowed opacity-60 bg-gray-100 border-gray-200"
                        : "cursor-pointer bg-gray-50 border-gray-300 hover:border-[#4F46E5]"
                    } ${isDragging ? "border-[#4F46E5] bg-indigo-50" : ""}`}
            >
                <p className="text-sm text-gray-600">
                    Arrastra y suelta una imagen aquí o {" "}
                    <span className="text-[#4F46E5] font-semibold">haz clic para seleccionar</span>
                </p>
                {helperText ? <p className="mt-1 text-xs text-gray-500">{helperText}</p> : null}
                {previewUrl ? (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={previewUrl}
                            alt={label || "Vista previa"}
                            className={`mx-auto ${imageClassName}`}
                        />
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-gray-500">{emptyMessage}</p>
                )}
            </div>
            <input
                id={id}
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleInputChange}
                disabled={disabled}
            />
        </div>
    );
};

ImageDropZone.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    previewUrl: PropTypes.string,
    onFileSelected: PropTypes.func,
    accept: PropTypes.string,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    emptyMessage: PropTypes.string,
    className: PropTypes.string,
    imageClassName: PropTypes.string,
};

export default ImageDropZone;