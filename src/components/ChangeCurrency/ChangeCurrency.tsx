import * as React from 'react';
import { MenuItem, Menu, Typography } from '@mui/material';
import { useCurrency } from '@context/CurrencyContext';

export default function ChangeCurrency() {
  const { currency, setCurrency } = useCurrency();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        style={{
          width: '58px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          onClick={handleClick}
          style={{ fontWeight: 'bold', fontSize: 24, color: '#94A3B8' }}
        >
          {currency}
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="currency-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            bgcolor: '#1D283A',
            '& .MuiMenuItem-root': {
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 4,
              width: 10,
              height: 10,
              bgcolor: '#1D283A',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => handleCurrencyChange('R$')}
          sx={{ color: '#FFF' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            R$
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleCurrencyChange('$')}
          sx={{ color: '#FFF' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            $
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
