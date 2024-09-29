import { TextField } from "@mui/material"

const Input = ({disabled, id, label, type, color, error, required, onChange, variant})=>{
    return(
        <TextField
          disabled={disabled}
          id={id}
          label={label}
          type={type}
          color={color}
          error={error}
          required={required}
          onChange={onChange}
          variant={variant}
        />
    )
}

export default Input