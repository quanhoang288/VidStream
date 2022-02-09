import React from 'react';

import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    marginTop: 5,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 18,
      width: 10,
      height: 10,
      backgroundColor: 'white',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
});

export default function MenuPopover({ children, ...other }) {
  const classes = useStyles();
  return (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        elevation: 0,
        className: classes.root,
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
