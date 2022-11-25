import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <h2 className="header-title">Admin UI</h2>
      <input
        placeholder="Search by name, email or role"
        name="search"
        className="search-bar"
      />
    </div>
  );
};

export default Header;
