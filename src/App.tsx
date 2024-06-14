import { Box, Typography } from '@mui/material'
import Equalizer from './components/Equalizer';
import Controls from './components/Controls';
import { useRef, useState } from 'react';
import WebAudioResources from './libs/WebAudioResources';

function App() {

  const AudioResources = useRef(new WebAudioResources())
  const [selectedTrack, setSelectedTrack] = useState<'music' | 'talking'>('talking')


  return (
    <Box
      sx={{
        fontFamily: 'Roboto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: 'black',
        height: '700px',
        width: '700px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      <Typography variant='h2'>Spyder Equalizer</Typography>
      <hr style={{ width: '80%', color: 'gray' }} />

      {/* Waveform */}
      <div id='waveform' style={{ width: '100%', height: '100px', margin: '50px' }} />

      {/* Controls */}
      <Controls AudioResources={AudioResources} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} />

      <Equalizer AudioResources={AudioResources} selectedTrack={selectedTrack} />

    </Box >
  )
}

export default App
