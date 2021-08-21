import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const queryString = location.search;
  const queryParamsParser = new URLSearchParams(queryString);
  const queryParams = {};
  queryParamsParser.forEach((v, k) => {
    queryParams[k] = v;
  });

  console.log(queryParams);

  return (
    <div>
      <h2>Search Results</h2>
      {Object.entries(queryParams).map(([key, value]) => <p>{key}={value}</p>)}
    </div>
  );
};

export default SearchResults;
