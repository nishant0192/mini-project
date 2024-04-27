import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import bg from "./assets/bg.jpg"; // Import the background image

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isManualInput, setIsManualInput] = useState(true);
  const [inputData, setInputData] = useState({
    aluminium: 1.5,
    ammonia: 100.0,
    arsenic: 0.008,
    barium: 1.7,
    cadmium: 0.003,
    chloramine: 3.5,
    chromium: 0.09,
    copper: 1.0,
    flouride: 1.2,
    bacteria: 0.01,
    viruses: 0.02,
    lead: 0.01,
    nitrates: 5.0,
    nitrites: 0.5,
    mercury: 0.001,
    perchlorate: 25.0,
    radium: 4.0,
    selenium: 0.4,
    silver: 0.08,
    uranium: 0.2,
  });
  const inputs = Object.keys(inputData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let dataToSend = {};

      if (isManualInput) {
        // Construct data object from manual inputs
        inputs.forEach((input) => {
          const inputValue = inputData[input]
            ? parseFloat(inputData[input])
            : 0.0;
          dataToSend[input] = inputValue;
        });
      } else {
        // Parse JSON data
        try {
          dataToSend = JSON.parse(inputData);
          // Convert values to float format
          Object.keys(dataToSend).forEach((key) => {
            dataToSend[key] = parseFloat(dataToSend[key]) || 0.0;
          });
        } catch (error) {
          throw new Error("Invalid JSON data provided");
        }
      }

      console.log("Resultant JSON:", dataToSend); // Print resultant JSON

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      console.log("manual input", isManualInput);
      console.log("input data", inputData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error:", error.message);
      // Display user-friendly error message (e.g., using toast notification)
      alert(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Parse value as float
    // const parsedValue = parseFloat(value);
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  // Inside the form
  {
    inputs.map((input) => (
      <div key={input} className="input-group">
        <label htmlFor={input}>{input}</label>
        <input
          type="text" // Change type to "text"
          id={input}
          name={input}
          value={inputData[input] || ""}
          onChange={handleInputChange}
          required
        />
      </div>
    ));
  }

  const toggleInputMethod = () => {
    setInputData({});
    setIsManualInput(!isManualInput);
  };

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <h1>Water Quality Prediction</h1>
      <form onSubmit={handleSubmit} className="form">
        {isManualInput ? (
          <>
            {inputs.map((input) => (
              <div key={input} className="input-group">
                <label htmlFor={input}>
                  {input.charAt(0).toUpperCase() + input.slice(1)}
                </label>
                <input
                  type="text"
                  id={input}
                  name={input}
                  value={inputData[input] || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3>JSON Data</h3>
            <div className="input-group">
              <label htmlFor="jsonData">JSON Data:</label>
              <textarea
                id="jsonData"
                name="jsonData"
                value={inputData}
                onChange={(event) => setInputData(event.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="btns">
        <button type="submit" className="submit-btn">
          Predict
        </button>

        <button onClick={toggleInputMethod} className="toggle-btn">
          {isManualInput ? "Switch to JSON" : "Switch to Manual"}
        </button>
        </div>
      </form>
      <div className="prediction-section">
        <h2>Predictions</h2>
        {prediction !== null ? (
          <div>
            <p>
              Prediction:{" "}
              {prediction.includes(0) ? "Water is not safe" : "Water is safe"}
            </p>
          </div>
        ) : (
          <p>Submit the form to get a prediction.</p>
        )}
      </div>
    </div>
  );
}

export default App;
