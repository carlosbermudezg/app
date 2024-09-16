import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';

const CustomButton = ({text, onClick, variant})=> {

  const ColorButton = styled(Button)(({ theme }) => ({
    color: variant == 'outlined' ? purple[500] : "#FFF",
    backgroundColor: variant == 'contained' ? purple[500] : "#FFF",
    borderColor: purple[500]
  }));

  return (
      <ColorButton variant={variant} onClick={onClick}>{text}</ColorButton>
  );
}

export default CustomButton