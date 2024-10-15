import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Meal = () => {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    setMeals(storedMeals.slice(0, 10)); // Display up to 10 meals
  }, []);

  const handleEdit = (index) => {
    navigate(`/edit-meal/${index}`);
  };

  const handleDelete = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
  };

  return (
    <div className="container">
      <h1>Meal Page</h1>
      <div className="row">
        {meals.map((meal, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Meal Plan {index + 1}</h5>
                <p className="card-text">{meal}</p>
                <button className="btn btn-primary" onClick={() => handleEdit(index)}>Edit</button>
                <button className="btn btn-danger ml-2" onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meal;
