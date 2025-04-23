import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "./components/Button";

function App() {
  const [showElement, setShowElement] = useState<boolean>(false);
  const [unitType, setUnitType] = useState<string>("g");
  const [time, setTime] = useState<string>("day");
  const [measurement, setMeasurement] = useState<string>("mg/mL");
  const [fluidAmount, setFluidAmount] = useState<number>(1000);
  const [weight, setWeight] = useState<number>(0);
  const [fluidRate, setFluidRate] = useState<number>(0);
  const [medications, setMedications] = useState([
    {
      name: "",
      concentration: 0,
      dose: 0,
      weightOverDose: 0,
      weightOverConcentration: 0,
      drugPerBag: 0,
      cri: 0,
    },
  ]);

  const addMedication = () => {
    console.log(medications);
    setMedications([
      ...medications,
      {
        name: "",
        concentration: 0,
        dose: 0,
        weightOverDose: 0,
        weightOverConcentration: 0,
        drugPerBag: 0,
        cri: 0,
      },
    ]);
  };

  function onClick(event: any) {
    setUnitType(event.target.value);
  }

  function onTimeClick(event: any) {
    setTime(event.target.value);
  }

  function onFluidClick(event: any) {
    setFluidAmount(event.target.value);
  }

  function onMeasureClick(event: any) {
    setMeasurement(event.target.value);
  }

  function calculate() {
    const convertedWeight = convertWeight();
    console.log("weight converted", convertWeight);
    getWeightOverDosages(convertedWeight);
    console.log("wieght over dose update", medications);
    getWeightOverConcentration();
    console.log("updated weight over concentration", medications);
    const finalFluidRate = getFinalFluidRate();
    const fluidDuration = getFluidDuration(finalFluidRate);
    console.log("fluid duration", fluidDuration);
    setCRI(fluidDuration);
    console.log("final cri", medications);
  }

  function setDose(key: number, dose: number) {
    medications[key].dose = dose;
  }

  function setConcentration(key: number, concentration: number) {
    medications[key].concentration = concentration;
  }

  function setDrugName(key: number, name: string) {
    medications[key].name = name;
  }

  function convertWeight() {
    // convert the weight into KG unless it already is
    switch (unitType) {
      case "g":
        return weight / 1000;
      case "lb":
        return weight / 2.2;
      default:
        return weight;
    }
  }

  function getWeightOverDosages(weight: number) {
    //loop over all the medications and get the weight over dosage for each (mg/hour)
    medications.forEach((med) => {
      med.weightOverDose = (med.dose * weight) / 24;
    });
  }

  function getWeightOverConcentration() {
    //loop over the medications and divide the weightOverDose by the concentration
    medications.forEach((med) => {
      med.weightOverConcentration = med.weightOverDose / med.concentration;
    });
  }

  function getFluidDuration(finalFluidRate: number) {
    return fluidAmount / finalFluidRate;
  }

  function setCRI(fluidDuration: number) {
    medications.forEach((med) => {
      med.cri = fluidDuration * med.weightOverConcentration;
    });
  }

  function getFinalFluidRate() {
    //given mL/kg/hr, find the mL/hr
    return fluidRate * weight;
  }

  return (
    <div className="App">
      <form>
        <label>
          Weight
          <input
            required
            name="weight"
            type="number"
            onChange={(e) => setWeight(parseInt(e.target.value))}
          />
        </label>
        <p>
          Unit of Measurment:
          <label>
            <input type="radio" name="unit" value="lb" onClick={onClick} />
            lb
          </label>
          <label>
            <input
              type="radio"
              name="unit"
              value="g"
              defaultChecked={true}
              onClick={onClick}
            />
            g
          </label>
          <label>
            <input type="radio" name="unit" value="kg" onClick={onClick} />
            kg
          </label>
        </p>

        <label>
          Fluid Rate (ml/kg/?):{" "}
          <input
            required
            name="fluidRate"
            type="number"
            onChange={(e) => setFluidRate(parseInt(e.target.value))}
          />
          <p>
            Time :
            <label>
              <input
                type="radio"
                name="time"
                value="hr"
                onClick={onTimeClick}
              />
              hr
            </label>
            <label>
              <input
                type="radio"
                name="time"
                value="day"
                defaultChecked={true}
                onClick={onTimeClick}
              />
              day
            </label>
          </p>
        </label>

        <p>
          fluid bag size:
          <label>
            <input
              type="radio"
              name="fluidSize"
              value="500"
              onClick={onFluidClick}
            />
            500
          </label>
          <label>
            <input
              type="radio"
              name="fluidSize"
              value="1000"
              defaultChecked={true}
              onClick={onFluidClick}
            />
            1000
          </label>
        </p>

        <div>
          Are you including medication?
          <label>
            <input
              type="radio"
              name="medication"
              value="y"
              onClick={() => setShowElement(true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="medication"
              value="n"
              defaultChecked={true}
              onClick={() => setShowElement(false)}
            />
            No
          </label>
          {showElement ? (
            <div>
              <Button onClick={addMedication} text="Add another medication" />
              {medications.map((item, i) => (
                <div className="MedInputs" key={i}>
                  <label>
                    name of drug:{" "}
                    <input
                      required
                      name="drugName"
                      type="string"
                      onChange={(e) => setDrugName(i, e.target.value)}
                    />
                  </label>
                  <label>
                    concentration (mg/mL):{" "}
                    <input
                      required
                      name="strength"
                      type="number"
                      onChange={(e) =>
                        setConcentration(i, parseInt(e.target.value))
                      }
                    />
                    <p>
                      measurment :
                      <label>
                        <input
                          type="radio"
                          name="measure"
                          value="percent"
                          onClick={onMeasureClick}
                        />
                        percent
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="measure"
                          value="mg/mL"
                          defaultChecked={true}
                          onClick={onMeasureClick}
                        />
                        mg/mL
                      </label>
                    </p>
                  </label>
                  <label>
                    dose (mg/kg/day):{" "}
                    <input
                      required
                      name="concentration"
                      type="number"
                      onChange={(e) => setDose(i, parseInt(e.target.value))}
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <Button onClick={calculate} text="caculate" />
      </form>
    </div>
  );
}

export default App;
