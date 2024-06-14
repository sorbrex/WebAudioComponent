import { MusicNote, PauseCircleOutline, People, PlayCircleOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useCallback, useState } from "react";
import WebAudioResources from "../libs/WebAudioResources";

const Controls = (props: ControlsProps) => {
  const { AudioResources, selectedTrack, setSelectedTrack } = props

  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = useCallback(() => {
    if (AudioResources.current.context.state === "suspended") AudioResources.current.context.resume()

    AudioResources.current.wavesurfer?.playPause()
    setIsPlaying(!isPlaying)
  }, [AudioResources, isPlaying])


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '600px',
        borderRadius: '5px',
        marginTop: '20px',
        marginBottom: '5px',
        color: '#fff',
        background: 'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);',
      }}
    >
      <Button
        size='small'
        color='success'
        variant='contained'
        onClick={handlePlay}
        sx={{ margin: '10px' }}
      >
        {isPlaying ? <PauseCircleOutline /> : <PlayCircleOutline />}
      </Button>


      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          size='small'
          color='success'
          variant='contained'
          sx={{ margin: '10px' }}
          onClick={() => setSelectedTrack('music')}
        >
          {selectedTrack == 'music' ? <MusicNote sx={{ color: 'black' }} /> : <MusicNote />}
        </Button>
        <Button
          size='small'
          color='success'
          variant='contained'
          sx={{ margin: '0 5px' }}
          onClick={() => setSelectedTrack('talking')}
        >
          {selectedTrack == 'talking' ? <People sx={{ color: 'black' }} /> : <People />}
        </Button>

      </Box>
    </Box >
  )

}

export default Controls;

type ControlsProps = {
  AudioResources: React.MutableRefObject<WebAudioResources>
  selectedTrack: 'music' | 'talking' | 'radio'
  setSelectedTrack: React.Dispatch<React.SetStateAction<'music' | 'talking'>>
}