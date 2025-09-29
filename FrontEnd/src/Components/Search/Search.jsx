import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./srarch.css";

const Search = ({ products, onFilter }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        (p.desc && p.desc.toLowerCase().includes(value))
    );

    onFilter(filtered);
  };

  return (
    <section className="search">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={handleSearch}
        />
      </div>
    </section>
  );
};

export default Search;
