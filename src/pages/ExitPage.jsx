import React, { useEffect, useState } from 'react';

const ExitPage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="container">
      <h2>Thank you, {username}, for visiting the site!</h2>
      <p>Please close or exit this page.</p>
    </div>
  );
};

export default ExitPage;
