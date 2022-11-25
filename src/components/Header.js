import './Header.css';

const Header = ({ handleRestore }) => {
  return (
    <div className="header">
      <h2 className="header-title" onClick={handleRestore}>
        Admin UI
      </h2>
      <input
        placeholder="Search by name, email or role"
        name="search"
        className="search-bar"
      />
    </div>
  );
};

export default Header;
