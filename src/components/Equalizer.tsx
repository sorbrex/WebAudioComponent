import { useEffect, useMemo, useState } from 'react'
import WebAudioResources from '../libs/WebAudioResources'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import WaveSurfer from 'wavesurfer.js';
import Filters from './Filters';
import Preset from './Preset';
import { Box, FormControl } from '@mui/material';
import StereoControls from './StereoControls';

const source = {
  music: 'https://www.mfiles.co.uk/mp3-downloads/moonlight-movement1.mp3',
  talking: 'https://www.mfiles.co.uk/mp3-downloads/Toccata-and-Fugue-Dm.mp3'
}

const Equalizer = (props: EqualizerProps) => {
  const { selectedTrack, AudioResources } = props
  const isStereo = useMemo(() => selectedTrack === 'music', [selectedTrack])

  const [localPreset, setLocalPreset] = useState(AudioResources.current.getSelectedPreset())

  useEffect(() => {

    if (!selectedTrack) return

    AudioResources.current.clearWave()
    AudioResources.current.element.src = source[selectedTrack]
    if (isStereo) AudioResources.current.splitChannels()
    AudioResources.current.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      progressColor: '#83b944',
      waveColor: '#c4c8dc',
      minPxPerSec: 1,
      cursorWidth: 1,
      dragToSeek: true,
      fillParent: true,
      autoCenter: false,
      hideScrollbar: false,
      media: AudioResources.current.element,
      plugins: [
        TimelinePlugin.create()
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack])


  return (
    <Box sx={{
      height: '110px',
      width: '600px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'start',
      borderRadius: '5px',
      color: '#fff',
      background: 'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);',
    }}>

      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '8px',
        }}
      >
        {
          /*Channel Splitter Radio Group*/
          isStereo && <StereoControls AudioResources={AudioResources} />
        }

        {/*Preset Select Group*/}
        <Preset AudioResources={AudioResources} localPreset={localPreset} setLocalPreset={setLocalPreset} />

      </FormControl>

      {/* Filters */}
      <Filters AudioResources={AudioResources} localPreset={localPreset} setLocalPreset={setLocalPreset} />

    </Box>
  )
}

export default Equalizer

type EqualizerProps = {
  AudioResources: React.MutableRefObject<WebAudioResources>
  selectedTrack: 'music' | 'talking'
}