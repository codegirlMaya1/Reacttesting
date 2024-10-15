import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditMeal from './EditMeal';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('EditMeal Component - High Calorie Count', () => {
  const mockNavigate = jest.fn();
  const mockParams = { index: '0' };

  beforeEach(() => {
    localStorage.setItem('meals', JSON.stringify(['Chicken, Rice, Broccoli']));
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    jest.spyOn(require('react-router-dom'), 'useParams').mockImplementation(() => mockParams);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('displays error for high calorie dessert', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 600 }] } });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <EditMeal />
      </Router>
    );

    fireEvent.click(getByText('Add Dessert'));
    fireEvent.change(getByPlaceholderText('Enter dessert'), { target: { value: 'Cake' } });
    fireEvent.click(getByText('Calculate Dessert Calories'));

    await waitFor(() => {
      expect(getByText('Calories count is too high for the dessert. Please try again.')).toBeInTheDocument();
    });
  });

  test('displays error for high calorie new entree', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 700 }] } });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <EditMeal />
      </Router>
    );

    fireEvent.click(getByText('Create a New Entree (Optional)'));
    fireEvent.change(getByPlaceholderText('Enter new entree'), { target: { value: 'Steak' } });
    fireEvent.click(getByText('Calculate Entree Calories'));

    await waitFor(() => {
      expect(getByText('Calories count is too high for the new entree. Please try again.')).toBeInTheDocument();
    });
  });
});
