import React, { useState } from "react";

const Tooltip = ({ description }) => {
    const [show, setShow] = useState(false);

    return (
        <span
            style={{ position: "relative", cursor: "pointer", marginLeft: "5px", color: "blue" }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onClick={() => setShow(!show)}
        >
            !
            {show && (
                <span
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "0",
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                    }}
                >
                    {description}
                </span>
            )}
        </span>
    );
};

export default Tooltip;
