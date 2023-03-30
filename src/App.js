import "./App.css";
import { useEffect, useState } from "react";

const initialMeasurementTypes = ["Distance", "Temperature", "Money"];
const initialDistanceTypes = ["Meter", "Kilometer"];
const initialTableTemperature = ["Celsius", "Fahrenheit"];

function App() {
  const [measurementTypes, setMeasurementTypes] = useState(
    initialMeasurementTypes
  );
  const [tableDistance, setTableDistance] = useState(initialDistanceTypes);
  const [tableTemperature, setTableTemperature] = useState(
    initialTableTemperature
  );
  const [money, setMoney] = useState([]);

  const [openTableMeasurementTypes, setOpenTableMeasurementTypes] =
    useState(false);
  const [openTable1, setOpenTable1] = useState(false);
  const [openTable2, setOpenTable2] = useState(false);

  const [activeMeasurementType, setActiveMeasurementType] = useState(
    measurementTypes[0]
  );
  const [activeType1, setActiveType1] = useState(tableDistance[0]);
  const [activeType2, setActiveType2] = useState(tableDistance[0]);

  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [formula, setFormula] = useState("");

  const toggleOpenTableMeasurementTypes = () => {
    setOpenTableMeasurementTypes(
      (openTableMeasurementTypes) => !openTableMeasurementTypes
    );
  };
  const toggleOpenTable1 = () => {
    setOpenTable1((openTable1) => !openTable1);
  };
  const toggleOpenTable2 = () => {
    setOpenTable2((openTable2) => !openTable2);
  };

  const onSelectItemMeasurementType = (name) => {
    setActiveMeasurementType(name);
    setOpenTableMeasurementTypes(false);
  };
  const onSelectOpenTable1 = (name) => {
    setActiveType1(name);
    setOpenTable1(false);
  };
  const onSelectOpenTable2 = (name) => {
    setActiveType2(name);
    setOpenTable2(false);
  };

  const changeValueInput1 = (value) => {
    setInputValue1(value);
  };
  const changeValueInput2 = (value) => {
    setInputValue2(value);
  };

  useEffect(() => {
    if (activeMeasurementType === "Temperature") {
      setActiveType1(initialTableTemperature[0]);
      setActiveType2(initialTableTemperature[1]);
      setTableDistance(initialTableTemperature);
      setFormula("");
      setInputValue1("");
      setInputValue2("");
    } else if (activeMeasurementType === "Distance") {
      setTableDistance(initialDistanceTypes);
      setActiveType1(initialDistanceTypes[0]);
      setActiveType2(initialDistanceTypes[1]);
      setFormula("");
      setInputValue1("");
      setInputValue2("");
    }
  }, [activeMeasurementType]);

  useEffect(() => {
    if (activeType1 === activeType2) {
      setInputValue2(inputValue1);
    } else if (activeType1 === "Kilometer" && activeType2 === "Meter") {
      setInputValue2(inputValue1 * 1000);
      setFormula('Multiply the "Length" value by 1000');
    } else if (activeType1 === "Meter" && activeType2 === "Kilometer") {
      setInputValue2(inputValue1 / 1000);
      setFormula('Divide the "Length" value by 1000');
    } else if (activeType1 === activeType2) {
      setInputValue2(inputValue1);
    } else if (activeType1 === "Celsius" && activeType2 === "Fahrenheit") {
      let newValue = inputValue1 && (inputValue1 * (9 / 5) + 32).toFixed(4);
      setInputValue2(newValue);
      setFormula(`(${inputValue1} °C × 9/5) + 32 = ${newValue} °F`);
    } else if (activeType1 === "Fahrenheit" && activeType2 === "Celsius") {
      let newValue = inputValue1 && ((inputValue1 - 32) * (5 / 9)).toFixed(4);
      setInputValue2(newValue);
      setFormula(`(${inputValue2} °F − 32) × 5/9 = ${newValue} °C`);
    }
  }, [inputValue1, inputValue2, activeType1, activeType2]);

  return (
    <div className="App">
      <button onClick={toggleOpenTableMeasurementTypes}>
        <div className="measurementTypes">
          {activeMeasurementType}
          <div className="arrows">
            <div>{"\u25B2"}</div>
            <div>{"\u25BC"}</div>
          </div>
        </div>
      </button>
      {openTableMeasurementTypes && (
        <ul className="measurementTypesTable">
          {measurementTypes.map((type) => (
            <li key={type} onClick={() => onSelectItemMeasurementType(type)}>
              {type}
            </li>
          ))}
        </ul>
      )}
      <div className="unitsContainer">
        <div className="unitLeft">
          <input
            placeholder="0"
            type="number"
            value={inputValue1}
            onChange={(e) => changeValueInput1(e.target.value)}
          />
          <button onClick={toggleOpenTable1}>
            <span>
              {activeType1}
              <div className="arrows">
                <div>{"\u25B2"}</div>
                <div>{"\u25BC"}</div>
              </div>
            </span>
          </button>
          {openTable1 && (
            <ul className="measurementTypesTable">
              {tableDistance.map((type) => (
                <li key={type} onClick={() => onSelectOpenTable1(type)}>
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span>=</span>
        <div className="unitRight">
          <input
            placeholder="0"
            type="number"
            value={inputValue2}
            onChange={(e) => {
              changeValueInput2(e.target.value);
            }}
          />
          <button onClick={toggleOpenTable2}>
            <span>
              {activeType2}
              <div className="arrows">
                <div>{"\u25B2"}</div>
                <div>{"\u25BC"}</div>
              </div>
            </span>
          </button>
          {openTable2 && (
            <ul className="measurementTypesTable">
              {tableDistance.map((type) => (
                <li key={type} onClick={() => onSelectOpenTable2(type)}>
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <div className="formula">
          <span>Formula</span>
          <span>
            {formula}
            {/* for an approximate result, mulityply the length value by 3,281 */}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
