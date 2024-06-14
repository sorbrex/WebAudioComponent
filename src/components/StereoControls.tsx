import { Box, RadioGroup, Slider, Typography } from "@mui/material"
import WebAudioResources from "../libs/WebAudioResources"
import { CustomRadio } from "./CustomRadio"
import { useState } from "react"

const StereoControls = (props: StereoControlsProps) => {
  const { AudioResources } = props
  const [localChannelVolume, setLocalChannelVolume] = useState(0)
  const [mono, setMono] = useState(false)

  const handleChannelVolumeChange = (value: number) => {
    // let left = 0.5
    // let right = 0.5

    // if (value === 0) {
    //   // left = 0.5;
    //   // right = 0.5;
    // } else if (value < 0) {
    //   //left
    //   left += Math.abs(value) / 2
    //   right -= Math.abs(value) / 2
    // } else {
    //   //right
    //   left -= Math.abs(value) / 2
    //   right += Math.abs(value) / 2
    // }

    // normalize
    const left = 1 - value
    const right = 1 + value

    AudioResources.current.setChannelVolume([left, right])
    setLocalChannelVolume(value)
  }

  return (
    <>
      <RadioGroup
        row
        defaultValue="stereo"
        name="channel-splitter-group"
        // value={value}
        onChange={(_, value) => {
          if (value === 'stereo') {
            AudioResources.current.splitChannels()
            setMono(false)
          } else {
            AudioResources.current.mergeChannels()
            setMono(true)
          }
        }}
      >
        <CustomRadio value={'mono'} label={'Mono'} checked={mono} />
        <CustomRadio value={'stereo'} label={'Stereo'} checked={!mono} />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body2" color="white">
          sx
        </Typography>
        <Slider
          defaultValue={0}
          valueLabelDisplay="off"
          color={'secondary'}
          step={0.1}
          min={-1}
          max={1}
          sx={{ width: '70%' }}
          value={localChannelVolume}
          onChange={(_, value) => handleChannelVolumeChange(value as number)}
        />
        <Typography variant="body2" color="white">
          dx
        </Typography>
      </Box>
    </>
  )

}

export default StereoControls

type StereoControlsProps = {
  AudioResources: React.MutableRefObject<WebAudioResources>
}