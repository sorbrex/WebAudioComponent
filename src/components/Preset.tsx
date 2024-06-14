import { MenuItem, Select, Tooltip } from "@mui/material";
import WebAudioResources from "../libs/WebAudioResources";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCallback } from "react";

//TODO: Fetch user preference to check if custom preset already exists and put inside the preset list

const Preset = (props: PresetProps) => {
  const { AudioResources, localPreset, setLocalPreset } = props

  const handlePresetChange = useCallback((preset: string) => {
    setLocalPreset(preset)
    AudioResources.current.setSelectedPreset(preset)
  }, [AudioResources, setLocalPreset])

  return (
    <>
      {/*Preset Select Group*/}
      <Select
        labelId="preset-label"
        size={'small'}
        sx={{
          fontSize: '14px',
          backgroundColor: '#fff',
          height: '35px',
          width: '155px'
        }}
        value={localPreset}
        onChange={(e) => handlePresetChange(e.target.value)}
        startAdornment={
          <Tooltip title={'Ripristina Preset e Filtri.'}>
            <RestartAltIcon
              sx={{
                marginRight: '10px',
                cursor: 'pointer',
                color: 'black',
                ':hover': { color: 'red' },
              }}
              onClick={() => {
                setLocalPreset('none')
                AudioResources.current.setPreamp(0)
                AudioResources.current.setSelectedPreset('none')
              }}
            />
          </Tooltip>
        }
      >
        {AudioResources.current.getPresets().map((preset) => (
          <MenuItem key={preset.key} value={preset.key}>
            {preset.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default Preset;

type PresetProps = {
  AudioResources: React.MutableRefObject<WebAudioResources>
  localPreset: string
  setLocalPreset: React.Dispatch<React.SetStateAction<string>>
}