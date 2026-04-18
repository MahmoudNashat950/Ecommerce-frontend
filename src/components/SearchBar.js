import { useState } from "react";

function SearchBar({ onSearch }) {
    const [keyword, setKeyword] = useState("");

    return (
        <div>
            <input
                placeholder="Search..."
                onChange={e => setKeyword(e.target.value)}
            />
            <button onClick={() => onSearch(keyword)}>
                Search
            </button>
        </div>
    );
}

export default SearchBar;