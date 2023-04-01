import "./App.css";
import { useEffect, useRef, useState } from "react";
import { fakeDataApi } from "./data";
import Button from "./components/Button";
import OpenTable from "./components/OpenTable";

const initialMeasurementTypes = ["Distance", "Temperature", "Money"];
const initialDistanceTypes = ["Meter", "Kilometer"];
const initialTableTemperature = ["Celsius", "Fahrenheit"];
function App() {
  const buttonRef = useRef();
  const button1Ref = useRef();
  const button2Ref = useRef();
  const [tableDistance, setTableDistance] = useState(initialDistanceTypes);
  const [money, setMoney] = useState([]);

  const [openTableMeasurementTypes, setOpenTableMeasurementTypes] =
    useState(false);
  const [openTable1, setOpenTable1] = useState(false);
  const [openTable2, setOpenTable2] = useState(false);

  const [activeMeasurementType, setActiveMeasurementType] = useState(
    initialMeasurementTypes[0]
  );
  const [activeType1, setActiveType1] = useState(tableDistance[0]);
  const [activeType2, setActiveType2] = useState(tableDistance[0]);

  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [formula, setFormula] = useState("");
  const [loaded, setLoaded] = useState(true);

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
    if (name === "Meter") setActiveType2("Kilometer");
    else if (name === "Kilometer") setActiveType2("Meter");
    else if (name === "Celsius") setActiveType2("Fahrenheit");
    else if (name === "Fahrenheit") setActiveType2("Celsius");
  };
  const onSelectOpenTable2 = (name) => {
    setActiveType2(name);
    setOpenTable2(false);
    if (name === "Meter") setActiveType1("Kilometer");
    else if (name === "Kilometer") setActiveType1("Meter");
    else if (name === "Celsius") setActiveType1("Fahrenheit");
    else if (name === "Fahrenheit") setActiveType1("Celsius");
  };

  const changeValueInput1 = (value) => {
    setInputValue1(value);
  };
  const changeValueInput2 = (value) => {
    setInputValue2(value);
  };

  let onlineBuyArr = [] && money.map(({ online }) => online.buy);
  let [usd, eur, rub, gbp] = onlineBuyArr;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!buttonRef.current.contains(event.target)) {
        setOpenTableMeasurementTypes(false);
      }
      if (!button1Ref.current.contains(event.target)) {
        setOpenTable1(false);
      }
      if (!button2Ref.current.contains(event.target)) {
        setOpenTable2(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [buttonRef]);

  useEffect(() => {
    if (activeMeasurementType === "Temperature") {
      setActiveType1(initialTableTemperature[0]);
      setActiveType2(initialTableTemperature[1]);
      setTableDistance(initialTableTemperature);
      setFormula("");
      setInputValue1("");
      setInputValue2("");
      setLoaded(true);
    } else if (activeMeasurementType === "Distance") {
      setTableDistance(initialDistanceTypes);
      setActiveType1(initialDistanceTypes[0]);
      setActiveType2(initialDistanceTypes[1]);
      setFormula("");
      setInputValue1("");
      setInputValue2("");
      setLoaded(true);
    } else {
      setInputValue1("");
      setInputValue2("");
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://www.inecobank.am/api/rates";
      fetch(proxyUrl + targetUrl).then((response) =>
        response
          .json()
          .then((data) => {
            setMoney(data.items);
            setTableDistance(data.items.map((item) => item.code));
            setActiveType1(data.items[0].code);
            setActiveType2(data.items[1].code);
          })
          .catch((error) => {
            console.log(error);
            setMoney(fakeDataApi.items);
            setTableDistance(fakeDataApi.items.map((item) => item.code));
            setActiveType1(fakeDataApi.items[0].code);
            setActiveType2(fakeDataApi.items[1].code);
          })
          .finally(() => {
            setFormula("");
            setLoaded(false);
          })
      );
    }
  }, [activeMeasurementType]);
  useEffect(() => {
    if (activeType1 === activeType2) setInputValue2(inputValue1);
    else if (activeType1 === "Kilometer" && activeType2 === "Meter") {
      setInputValue2(inputValue1 * 1000);
      setFormula('Multiply the "Length" value by 1000');
    } else if (activeType1 === "Meter" && activeType2 === "Kilometer") {
      setInputValue2(inputValue1 / 1000);
      setFormula('Divide the "Length" value by 1000');
    } else if (activeType1 === "Celsius" && activeType2 === "Fahrenheit") {
      let newValue = inputValue1 && (inputValue1 * (9 / 5) + 32).toFixed(4);
      setInputValue2(newValue);
      setFormula(`(${inputValue1} °C × 9/5) + 32 = ${newValue} °F`);
    } else if (activeType1 === "Fahrenheit" && activeType2 === "Celsius") {
      let newValue = inputValue1 && ((inputValue1 - 32) * (5 / 9)).toFixed(4);
      setInputValue2(newValue);
      setFormula(`(${inputValue2} °F − 32) × 5/9 = ${newValue} °C`);
    } else if (activeType1 === "USD" && activeType2 === "EUR") {
      let newValue = ((inputValue1 * usd) / eur).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} USD * ${usd}$ / ${eur}(€) = ${newValue} (€)`);
    } else if (activeType1 === "EUR" && activeType2 === "USD") {
      let newValue = ((inputValue1 * eur) / usd).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} EUR * ${eur}(€) / ${usd}$ = ${newValue} $`);
    } else if (activeType1 === "USD" && activeType2 === "RUB") {
      let newValue = ((inputValue1 * usd) / rub).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} USD * ${usd}$ / ${rub}(₽) = ${newValue} (₽)`);
    } else if (activeType1 === "RUB" && activeType2 === "USD") {
      let newValue = ((inputValue1 * rub) / usd).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} RUB * ${rub}(₽) / ${usd}$ = ${newValue} $`);
    } else if (activeType1 === "USD" && activeType2 === "GBP") {
      let newValue = ((inputValue1 * usd) / gbp).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} USD * ${usd}$ / ${gbp}(£) = ${newValue} $`);
    } else if (activeType1 === "GBP" && activeType2 === "USD") {
      let newValue = ((inputValue1 * gbp) / usd).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} GBP * ${gbp}(£) / ${usd}$ = ${newValue} (£)`);
    } else if (activeType1 === "EUR" && activeType2 === "RUB") {
      let newValue = ((inputValue1 * eur) / rub).toFixed(4);
      setInputValue2(newValue);
      setFormula(`${inputValue1} EUR * ${eur}(£) / ${rub}$ = ${newValue} (€)`);
    } else if (activeType1 === "RUB" && activeType2 === "EUR") {
      let newValue = ((inputValue1 * rub) / eur).toFixed(4);
      setInputValue2(newValue);
      setFormula(
        `${inputValue1} RUB * ${rub}(₽) / ${eur}(€) = ${newValue} (₽)`
      );
    } else if (activeType1 === "EUR" && activeType2 === "GBP") {
      let newValue = ((inputValue1 * eur) / gbp).toFixed(4);
      setInputValue2(newValue);
      setFormula(
        `${inputValue1} EUR * ${eur}(€) / ${gbp}(£) = ${newValue} (€)`
      );
    } else if (activeType1 === "GBP" && activeType2 === "EUR") {
      let newValue = ((inputValue1 * gbp) / eur).toFixed(4);
      setInputValue2(newValue);
      setFormula(
        `${inputValue1} GBP * ${gbp}(£) / ${eur}(€) = ${newValue} (£)`
      );
    } else if (activeType1 === "RUB" && activeType2 === "GBP") {
      let newValue = ((inputValue1 * rub) / gbp).toFixed(4);
      setInputValue2(newValue);
      setFormula(
        `${inputValue1} RUB * ${rub}(₽) / ${gbp}(£) = ${newValue} (₽)`
      );
    } else if (activeType1 === "GBP" && activeType2 === "RUB") {
      let newValue = ((inputValue1 * gbp) / rub).toFixed(4);
      setInputValue2(newValue);
      setFormula(
        `${inputValue1} GBP * ${gbp}(£) / ${rub}(₽) = ${newValue} (£)`
      );
    }
  }, [inputValue1, inputValue2, activeType1, activeType2]);

  return (
    <div className="App">
      {activeMeasurementType === "Money" && loaded ? <h4>...Loading</h4> : ""}
      {activeMeasurementType === "Money" && !loaded ? (
        <h4>This data is not up-to-date</h4>
      ) : (
        ""
      )}
      <Button
        buttonRef={buttonRef}
        onClick={toggleOpenTableMeasurementTypes}
        activeType={activeMeasurementType}
        className={"measurementTypes"}
      />
      <OpenTable
        isTableOpen={openTableMeasurementTypes}
        initialState={initialMeasurementTypes}
        onSelect={onSelectItemMeasurementType}
      />
      <div className="unitsContainer">
        <div className="unitLeft">
          <input
            placeholder="0"
            type="number"
            value={inputValue1}
            onChange={(e) => changeValueInput1(e.target.value)}
          />
          <Button
            buttonRef={button1Ref}
            onClick={toggleOpenTable1}
            activeType={activeType1}
          />
          <OpenTable
            isTableOpen={openTable1}
            initialState={tableDistance}
            onSelect={onSelectOpenTable1}
          />
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
          <Button
            buttonRef={button2Ref}
            onClick={toggleOpenTable2}
            activeType={activeType2}
          />
          <OpenTable
            isTableOpen={openTable2}
            initialState={tableDistance}
            onSelect={onSelectOpenTable2}
          />
        </div>
      </div>
      <div>
        <div className="formula">
          <span>Formula</span>
          <span>{formula}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
