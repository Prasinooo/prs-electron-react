import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  // const [state, setstate] = useState('xx');
  // useEffect(() => {
  //   console.log('test');
  // }, []);
  return (
    <div className="page-container">
      Test
      <Link to="/">Hello</Link>
    </div>
  );
};

export default TestPage;
