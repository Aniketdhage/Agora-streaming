import React from 'react';
import { Link } from 'react-router-dom';

const SelectType = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '50vh',
      }}
    >
      <h1>Please select user type</h1>
      <Link to="/host">
        <button>Host </button>
      </Link>
      <br />
      <hr />
      <Link to="/audience">
        <button>Audience</button>
      </Link>
    </div>
  );
};

export default SelectType;
