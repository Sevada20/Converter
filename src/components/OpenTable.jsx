function OpenTable({ isTableOpen, initialState, onSelect }) {
  return (
    isTableOpen && (
      <ul className="measurementTypesTable">
        {initialState.map((type) => (
          <li key={type} onClick={() => onSelect(type)}>
            {type}
          </li>
        ))}
      </ul>
    )
  );
}
export default OpenTable;
