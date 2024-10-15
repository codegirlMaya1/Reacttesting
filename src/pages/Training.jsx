import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NutritionInfo = () => {
  const [queries, setQueries] = useState(['', '', '']);
  const [calories, setCalories] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const apiUrl = 'https://api.calorieninjas.com/v1/nutrition?query=';
  const apiKey = 'NySt6YE2ytkKbu1pTRXo5w==pJ5uxJzQbJIXvVqI';

  const fetchData = async () => {
    try {
      const responses = await Promise.all(
        queries.map(query =>
          axios.get(apiUrl + query, {
            headers: { 'X-Api-Key': apiKey }
          })
        )
      );
      const caloriesData = responses.map(response => response.data.items[0].calories);
      setCalories(caloriesData);
      const total = caloriesData.reduce((acc, curr) => acc + curr * 8, 0); // 8 slices per pizza
      setTotalCalories(total);
      if (total > 1500) {
        setError('Test failed. Total meal must be less than 1500 calories. Please click next button to continue.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleCalculate = () => {
    setCalculating(true);
    fetchData();
  };

  const handleNext = () => {
    navigate('/create-meal');
  };

  return (
    <div className="container">
      <h2>Hello, {username}!</h2>
      <p>Please enter three types of pizza and ensure each name ends with "pizza" such as cheese pizza, chicken pizza, etc.</p>
      {queries.map((query, index) => (
        <input
          key={index}
          type="text"
          value={query}
          onChange={(e) => {
            const newQueries = [...queries];
            newQueries[index] = e.target.value;
            setQueries(newQueries);
          }}
          placeholder={`Enter pizza type ${index + 1}`}
        />
      ))}
      <button className="btn btn-primary" onClick={fetchData}>Get Nutrition Info</button>
      <button className="btn btn-info" onClick={handleCalculate}>Calculate</button>
      {calculating && <p>Calculating 8 slices per pizza...</p>}
      {calories.map((cal, index) => cal && <p key={index}>Calories in {queries[index]}: {cal}</p>)}
      {totalCalories > 0 && <p>Total Calories: {totalCalories}</p>}
      {error && <p>{error}</p>}
      {error && <button className="btn btn-secondary" onClick={handleNext}>Next</button>}
    </div>
  );
};

export default NutritionInfo;
