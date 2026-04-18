import React from "react";

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="input-group search-input-group">
      <span className="input-group-text bg-white border-end-0">🔍</span>
      <input
        type="search"
        className="form-control border-start-0"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchInput;
