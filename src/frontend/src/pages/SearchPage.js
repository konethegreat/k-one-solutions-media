import React from 'react';
import PropTypes from 'prop-types';
import Search from '../components/Search';

const SearchPage = () => {
  return (
    <div>
      <h1>Search</h1>
      <Search />
    </div>
  );
};
SearchPage.propTypes = {
  onSearch: PropTypes.func,
  initialQuery: PropTypes.string
};

SearchPage.defaultProps = {
  onSearch: () => {},
  initialQuery: ''
};

export default SearchPage;