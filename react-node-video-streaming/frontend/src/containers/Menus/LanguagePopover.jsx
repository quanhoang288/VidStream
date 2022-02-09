import React, { useRef, useState } from 'react';
// material
// import { alpha } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemText, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

// import LanguageIcon from '@material-ui/icons/Language';
// components
import MenuPopover from '../../components/MenuPopover/MenuPopover';

const LANGS = [
  {
    value: 'vn',
    label: 'Vietnamese',
    code: 'VN',
  },
  {
    value: 'en',
    label: 'English',
    code: 'GB',
  },
];

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem('lang')) || LANGS[0],
  );

  const { i18n } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSelect = (option) => {
    localStorage.setItem('lang', JSON.stringify(option));
    i18n.changeLanguage(option.value);
    setLanguage(option);
    setOpen(false);
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen}>
        <img
          loading="lazy"
          width="24"
          src={`https://flagcdn.com/w20/${language.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${language.code.toLowerCase()}.png 2x`}
          alt=""
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <Box style={{ paddingTop: 1 }}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === language.value}
              onClick={() => handleSelect(option)}
            >
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
