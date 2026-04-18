import React, { useState } from "react";

function StarRating({ value = 0, onChange, readOnly = false, size = "md" }) {
    const [hover, setHover] = useState(0);

    const sizeMap = {
        sm: "1em",
        md: "1.5em",
        lg: "2em",
    };

    const fontSize = sizeMap[size] || sizeMap.md;

    return (
        <div style={{ fontSize, letterSpacing: "4px", display: "inline-block" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hover || value);

                return (
                    <span
                        key={star}
                        onClick={() => {
                            if (!readOnly && onChange) {
                                onChange(star); 
                            }
                        }}
                        onMouseEnter={() => !readOnly && setHover(star)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        style={{
                            cursor: readOnly ? "default" : "pointer",
                            color: isActive ? "#ffc107" : "#ddd",
                            transition: "0.2s",
                            userSelect: "none",
                        }}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}

export default StarRating;