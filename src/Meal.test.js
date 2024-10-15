import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditMeal from './EditMeal';
import CreateMeal from './CreateMeal';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('EditMeal Component', () => {
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

  test('renders EditMeal component and saves meal', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <EditMeal />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Main Entree'), { target: { value: 'Beef' } });
    fireEvent.change(getByPlaceholderText('Edit meal part 2'), { target: { value: 'Potatoes' } });
    fireEvent.change(getByPlaceholderText('Edit meal part 3'), { target: { value: 'Carrots' } });

    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(localStorage.getItem('meals')).toBe(JSON.stringify(['Beef, Potatoes, Carrots']));
      expect(mockNavigate).toHaveBeenCalledWith('/meal');
    });
  });

  test('adds dessert and calculates calories', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 200 }] } });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <EditMeal />
      </Router>
    );

    fireEvent.click(getByText('Add Dessert'));
    fireEvent.change(getByPlaceholderText('Enter dessert'), { target: { value: 'Ice Cream' } });
    fireEvent.click(getByText('Calculate Dessert Calories'));

    await waitFor(() => {
      expect(getByText('Total Calories: 200')).toBeInTheDocument();
    });
  });

  test('adds new entree and calculates calories', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 300 }] } });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <EditMeal />
      </Router>
    );

    fireEvent.click(getByText('Create a New Entree (Optional)'));
    fireEvent.change(getByPlaceholderText('Enter new entree'), { target: { value: 'Steak' } });
    fireEvent.click(getByText('Calculate Entree Calories'));

    await waitFor(() => {
      expect(getByText('Total Calories: 300')).toBeInTheDocument();
    });
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
});

describe('CreateMeal Component', () => {
  test('creates a meal and calculates calories', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 400 }] } });
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 200 }] } });
    axios.get.mockResolvedValueOnce({ data: { items: [{ calories: 100 }] } });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <CreateMeal />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Enter food item 1'), { target: { value: 'Chicken' } });
    fireEvent.change(getByPlaceholderText('Enter food item 2'), { target: { value: 'Rice' } });
    fireEvent.change(getByPlaceholderText('Enter food item 3'), { target: { value: 'Broccoli' } });

    fireEvent.click(getByText('Add Meal'));

    await waitFor(() => {
      expect(getByText('Total Calories: 700')).toBeInTheDocument();
      expect(localStorage.getItem('meals')).toBe(JSON.stringify(['Chicken, Rice, Broccoli']));
    });
  });
});
