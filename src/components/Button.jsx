const Button = ({ buttonRef, onClick, activeType, className }) => {
  return (
    <button ref={buttonRef} onClick={onClick}>
      <span className={className}>
        {activeType}
        <div className="arrows">
          <div>{"\u25B2"}</div>
          <div>{"\u25BC"}</div>
        </div>
      </span>
    </button>
  );
};
export default Button;
