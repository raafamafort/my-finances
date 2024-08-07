import React, { useState } from 'react';
import { BlockPicker } from 'react-color';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { colorOptions } from '@lib/utils/colorOptions';

const CustomColorPicker = ({
  color: initialColor,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [color, setColor] = useState(initialColor);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeComplete = (color: any) => {
    setColor(color.hex);
    onChange(color.hex);
  };

  return (
    <Box display="flex" alignItems="center" margin={'12px 0'}>
      <Typography
        variant="body1"
        style={{ color: '#94A3B8', marginRight: '8px' }}
      >
        Color:
      </Typography>
      <Box
        width={24}
        height={24}
        bgcolor={color}
        border="1px solid #ddd"
        borderRadius="4px"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <BlockPicker
          colors={colorOptions}
          color={color}
          onChangeComplete={handleChangeComplete}
        />
      </Popover>
    </Box>
  );
};

export default CustomColorPicker;
