import React from 'react';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

function SearchBar() {
  return (
    <Paper component="form" elevation={2} className="search__wrapper">
      <InputBase
        style={{ marginLeft: '5px', flex: 1 }}
        placeholder="Tìm kiếm"
        inputProps={{ 'aria-label': 'search for videos' }}
      />
      <IconButton type="submit" className="search__icon" aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
