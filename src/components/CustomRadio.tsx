import { FormControlLabel, Radio, Typography } from '@mui/material'

export const CustomRadio = (props: { value: string, label: string, checked: boolean }) => {
  return (
    <FormControlLabel
      value={props.value}
      label={<Typography variant="body2" color="white">{props.label}</Typography>}
      control={
        <Radio
          checked={props.checked}
          size={'small'}
          color={'secondary'}
          sx={{
            color: 'white',
            '&.Mui-checked': {
              color: 'secondary'
            },
            '& .MuiSvgIcon-root': {
              fontSize: 16,
            },
          }}
        />
      }
    />
  )
}