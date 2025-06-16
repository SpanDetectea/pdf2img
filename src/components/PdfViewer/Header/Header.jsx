import "./Header.css";

function Header({ setScale, scale, cropToBase64 }) {
  const handleMoreButton = () => {
    if (scale < 2.5) setScale((prev) => prev + 0.5);
  };
  const handleLessButton = () => {
    if (scale > 0.5) setScale((prev) => prev - 0.5);
  };

  return (
    <div className="header">
      <button onClick={cropToBase64} className="header-apply">
        Применить
      </button>
      <div className="header__scale">
        <button
          className="header__scale-more scale"
          onClick={handleMoreButton}
        >
          +
        </button>
        <button
          className="header__scale-less scale"
          onClick={handleLessButton}
        >
          -
        </button>
        <div>{scale}</div>
      </div>
    </div>
  );
}

export default Header;
