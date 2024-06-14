import { useCallback, useEffect, useState } from "react";
import WebAudioResources from "../libs/WebAudioResources";
import { Box, Slider, Typography } from "@mui/material";
import { BASE_FILTERS } from "../libs/Constant";

const Filters = (props: FiltersProps) => {
  const { AudioResources, localPreset, setLocalPreset } = props

  const [preamp, setPreamp] = useState(AudioResources.current.getPreamp())
  const [activeFilters, setActiveFilters] = useState(BASE_FILTERS)

  const handleSavePreamp = useCallback(() => {
    AudioResources.current.setPreamp(preamp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preamp])


  useEffect(() => {
    const filterObject = AudioResources.current.getPresets().find(p => p.key === localPreset)?.filters || BASE_FILTERS
    setActiveFilters(filterObject)
  }, [AudioResources, localPreset])

  const handleFilterChange = useCallback((filterIndex: number, value: number) => {
    const newFilters = activeFilters.map((filter, index) => {
      if (index === filterIndex) {
        return { ...filter, value }
      }
      return filter
    })
    setActiveFilters(newFilters)
  }, [activeFilters])

  const handleSaveFilters = useCallback(() => {
    //We have to make the change only in the Custom Preset

    // Check if the Custom Preset exists
    const customPreset = AudioResources.current.getPresets().find(p => p.key === 'custom')

    if (customPreset) {
      // If Exists: Update the Custom Preset
      const newCustomPreset = {
        key: 'custom',
        name: 'Personalizzato',
        filters: activeFilters
      }

      AudioResources.current.updatePreset(newCustomPreset)
    } else {
      // If do not Exists: Create the Custom Preset based on the current filters
      AudioResources.current.addPreset({
        key: 'custom',
        name: 'Personalizzato',
        filters: activeFilters
      })
    }
    // TODO: In Any Case Save in User Preferences

    // Switch to the Custom Preset
    AudioResources.current.setSelectedPreset('custom')
    setLocalPreset('custom')

  }, [AudioResources, activeFilters, setLocalPreset])


  return (
    <>
      {/* Preamp */}
      <Box
        key={'preamp'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90px',
          padding: '3px',
          border: '1px outset #000',
          borderRadius: '5px',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontSize: '10px' }}>+20db</Typography>
            <Typography sx={{ fontSize: '10px' }}>-20db</Typography>
          </Box>
          <Slider
            orientation="vertical"
            color={'success'}
            marks={[{ value: 0, label: '' }]}
            value={preamp}
            onChange={(_, newValue) => setPreamp(newValue as number)}
            onMouseUp={() => handleSavePreamp()}
            min={-20}
            max={20}
            step={1}
            valueLabelDisplay='auto'
          />
        </Box>
        <Typography variant='body2'>{'Preamp'}</Typography>
      </Box>

      {/* Single Filters */}
      {activeFilters?.map((filter, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90px',
            margin: '0 2px',
          }}>
          <Slider
            orientation="vertical"
            color={'success'}
            marks={[{ value: 0, label: '' }]}
            value={filter.value}
            onChange={(_, newValue) => handleFilterChange(index, newValue as number)}
            onMouseUp={() => handleSaveFilters()}
            min={-40}
            max={40}
            step={1}
            valueLabelDisplay='auto'
          />
          <Typography variant='body2'>{filter.label}</Typography>
        </Box>
      ))}
    </>
  )
}

export default Filters;

type FiltersProps = {
  AudioResources: React.MutableRefObject<WebAudioResources>
  localPreset: string
  setLocalPreset: React.Dispatch<React.SetStateAction<string>>
}