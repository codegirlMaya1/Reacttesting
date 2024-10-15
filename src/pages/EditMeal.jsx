import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMeal = () => {
  const { index } = useParams();
  const [mealPart1, setMealPart1] = useState('');
  const [mealPart2, setMealPart2] = useState('');
  const [mealPart3, setMealPart3] = useState('');
  const [dessert, setDessert] = useState('');
  const [additionalDishes, setAdditionalDishes] = useState([]);
  const [newEntree, setNewEntree] = useState('');
  const [meals, setMeals] = useState([]);
  const [calories, setCalories] = useState(0);
  const [error, setError] = useState(null);
  const [showDessert, setShowDessert] = useState(false);
  const [showNewEntree, setShowNewEntree] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    setMeals(storedMeals);
    const meal = storedMeals[index].split(', ');
    setMealPart1(meal[0] || '');
    setMealPart2(meal[1] || '');
    setMealPart3(meal[2] || '');
  }, [index]);

  const handleSave = () => {
    const updatedMeal = `${mealPart1}, ${mealPart2}, ${mealPart3}${dessert ? `, ${dessert}` : ''}${additionalDishes.length ? `, ${additionalDishes.join(', ')}` : ''}`;
    const updatedMeals = [...meals];
    updatedMeals[index] = updatedMeal;
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    navigate('/meal');
  };

  const fetchCalories = async (query) => {
    try {
      const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
        headers: {
          'X-Api-Key': 'NySt6YE2ytkKbu1pTRXo5w==pJ5uxJzQbJIXvVqI'
        }
      });
      return response.data.items[0].calories;
    } catch (error) {
      console.error('Error fetching calories:', error);
      setError('Error fetching calories. Please try again.');
      return null;
    }
  };

  const handleAddDessert = async () => {
    const calories = await fetchCalories(dessert);
    if (calories > 500) {
      setError('Calories count is too high for the dessert. Please try again.');
      setDessert('');
    } else {
      setError(null);
      setCalories((prev) => prev + calories);
    }
  };

  const handleAddNewEntree = async () => {
    const calories = await fetchCalories(newEntree);
    if (calories > 500) {
      setError('Calories count is too high for the new entree. Please try again.');
      setNewEntree('');
    } else {
      setError(null);
      setAdditionalDishes((prev) => [...prev, newEntree]);
      setCalories((prev) => prev + calories);
    }
  };

  return (
    <div className="container">
      <h1>Edit Meal</h1>
      <input
        type="text"
        value={mealPart1}
        onChange={(e) => setMealPart1(e.target.value)}
        placeholder="Main Entree"
      />
      <input
        type="text"
        value={mealPart2}
        onChange={(e) => setMealPart2(e.target.value)}
        placeholder="Edit meal part 2"
      />
      <input
        type="text"
        value={mealPart3}
        onChange={(e) => setMealPart3(e.target.value)}
        placeholder="Edit meal part 3"
      />
      <button className="btn btn-primary" onClick={handleSave}>Save</button>
      <button className="btn btn-secondary ml-2" onClick={() => setShowDessert(true)}>Add Dessert</button>
      {showDessert && (
        <div>
          <input
            type="text"
            value={dessert}
            onChange={(e) => setDessert(e.target.value)}
            placeholder="Enter dessert"
          />
          <button className="btn btn-secondary ml-2" onClick={handleAddDessert}>Calculate Dessert Calories</button>
        </div>
      )}
      <button className="btn btn-secondary ml-2" onClick={() => setShowNewEntree(true)}>Create a New Entree (Optional)</button>
      {showNewEntree && (
        <div>
          <input
            type="text"
            value={newEntree}
            onChange={(e) => setNewEntree(e.target.value)}
            placeholder="Enter new entree"
          />
          <button className="btn btn-secondary ml-2" onClick={handleAddNewEntree}>Calculate Entree Calories</button>
        </div>
      )}
      {error && <p>{error}</p>}
      {calories !== null && <p>Total Calories: {calories}</p>}
    </div>
  );
};

export default EditMeal;
