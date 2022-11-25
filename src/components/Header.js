import './Header.css';

const Header = ({ handleRestore, searchText, handleSearch }) => {
  return (
    <div className="header">
      <h2 className="header-title" onClick={handleRestore}>
        Admin UI
      </h2>
      <input
        placeholder="Search by name, email or role"
        name="search"
        className="search-bar"
        value={searchText}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default Header;
