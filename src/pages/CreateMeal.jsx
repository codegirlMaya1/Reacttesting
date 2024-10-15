import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMeal = () => {
  const [queries, setQueries] = useState(['', '', '']);
  const [calories, setCalories] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      const total = caloriesData.reduce((acc, curr) => acc + curr, 0);
      setTotalCalories(total);

      if (total <= 1500) {
        const mealPlan = queries.join(', ');
        const storedMeals = JSON.parse(localStorage.getItem('meals')) || [];
        const updatedMeals = [mealPlan, ...storedMeals].slice(0, 10); // Keep up to 10 meals
        localStorage.setItem('meals', JSON.stringify(updatedMeals));
        setError(null);
        setSuccess(true);
      } else {
        setError('Total meal must be less than 1500 calories.');
        setSuccess(false);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      setSuccess(false);
    }
  };

  const handleAddMeal = () => {
    fetchData();
  };

  const handleReturnToMeals = () => {
    navigate('/meal');
  };

  return (
    <div className="container">
      <h1>Create Meal</h1>
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
          placeholder={`Enter Meal Dish ${index + 1}`}
        />
      ))}
      <button className="btn btn-primary" onClick={handleAddMeal}>Add Meal</button>
      {calories.map((cal, index) => cal !== null && <p key={index}>Calories in {queries[index]}: {cal}</p>)}
      {totalCalories > 0 && <p>Total Calories: {totalCalories}</p>}
      {success && <p>Meal was created successfully!</p>}
      {error && <p>{error}</p>}
      {success && <button className="btn btn-secondary" onClick={handleReturnToMeals}>Return to Meal Page</button>}
    </div>
  );
};

export default CreateMeal;
