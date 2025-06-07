import { useState } from "react";

export default function StarRating({ onRate }) {
    const [selected, setSelected] = useState(0);

    const handleClick = (value) => {
        setSelected(value);
        onRate(value);
    };

    return (
        <div>
            {[1, 2, 3, 4, 5].map((val) => (
                <span
                    key={val}
                    style={{
                        cursor: "pointer",
                        color: selected >= val ? "gold" : "gray",
                        fontSize: "24px",
                    }}
                    onClick={() => handleClick(val)}
                >
          ★
        </span>
            ))}
        </div>
    );
}