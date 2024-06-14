import WaveSurfer from "wavesurfer.js";
import { BASE_FILTERS, PRESET_LIST } from "./Constant";
import { IFilter, IPreset } from "./Types";

class WebAudioResources {
  element: HTMLAudioElement
  context: AudioContext
  wavesurfer: WaveSurfer | null = null
  private selectedPreset: string
  private presetList: Array<IPreset>
  private sourceNode: MediaElementAudioSourceNode | null = null
  private filterNodes: BiquadFilterNode[]
  private isChannelSplitted: boolean = false
  private leftChannelVolume: GainNode
  private rightChannelVolume: GainNode
  private readonly channelSplitterNode: ChannelSplitterNode
  private readonly channelMergerNode: ChannelMergerNode
  private readonly preamp: GainNode

  constructor() {
    //Create Audio Context and Element
    this.context = new AudioContext();
    this.element = new Audio();
    this.element.crossOrigin = 'anonymous';

    this.sourceNode = this.context.createMediaElementSource(this.element);

    // Create Preamp and Single Channel Volume Nodes
    this.preamp = this.context.createGain();
    this.leftChannelVolume = this.context.createGain();
    this.rightChannelVolume = this.context.createGain();

    // Set Default Values (So that the sound is not muted by default but the same as the original sound for both channels)
    this.leftChannelVolume.gain.value = 1;
    this.rightChannelVolume.gain.value = 1;

    // Set Presets and Selected Preset
    this.presetList = PRESET_LIST;
    this.selectedPreset = 'none';

    // Create Channel Splitter and Merger Nodes for Stereo Audio (This is the whole Stereo Block, with connection already made)
    this.channelSplitterNode = this.context.createChannelSplitter(2);
    this.channelMergerNode = this.context.createChannelMerger(2);
    this.channelSplitterNode.connect(this.leftChannelVolume, 0);
    this.channelSplitterNode.connect(this.rightChannelVolume, 1);
    this.leftChannelVolume.connect(this.channelMergerNode, 0, 0);
    this.rightChannelVolume.connect(this.channelMergerNode, 0, 1);

    // Create Filters
    this.filterNodes = BASE_FILTERS.map((filter) => {
      const f = this.context.createBiquadFilter()
      f.type = filter.type as BiquadFilterType
      f.frequency.value = filter.f
      f.gain.value = filter.value
      f.Q.value = 1
      return f
    })

    // Connect the filters and media node sequentially
    //@ts-expect-error The First Element is not a Filter Node, but the Source Node
    const equalizer = this.filterNodes.reduce((prev, curr) => {
      prev.connect(curr)
      return curr
    }, this.sourceNode)

    // Connect the last filter to the preamp and then to the destination
    equalizer.connect(this.preamp).connect(this.context.destination)
  }

  // ========================
  // Channel Splitter
  // ========================

  // Check if the Audio Channels are splitted
  isSplitted() {
    return this.isChannelSplitted;
  }

  // Split the Audio Channels
  splitChannels() {
    if (!this.filterNodes[0]) return;

    this.sourceNode?.disconnect(this.filterNodes[0]);

    this.sourceNode?.connect(this.channelSplitterNode);
    this.channelMergerNode.connect(this.filterNodes[0], 0, 0);

    this.isChannelSplitted = true;
  }

  // Merge the Audio Channels
  mergeChannels() {
    this.leftChannelVolume.gain.value = 0;
    this.rightChannelVolume.gain.value = 0;

    // Disconnect Stereo Block
    this.sourceNode?.disconnect(this.channelSplitterNode);
    this.channelMergerNode.disconnect(this.filterNodes[0]);

    // Connect Mono Block
    this.sourceNode?.connect(this.filterNodes[0]);

    this.isChannelSplitted = false;
  }

  // Get Channel Volume
  getChannelsVolume() {
    return this.isChannelSplitted ? [this.leftChannelVolume.gain.value, this.rightChannelVolume.gain.value] : [0, 0];
  }

  // Set Channel Volume
  setChannelVolume(volume: number[]) {
    if (!this.isChannelSplitted) return;
    this.leftChannelVolume.gain.value = volume[0];
    this.rightChannelVolume.gain.value = volume[1];
  }




  // ========================
  // AudioContext
  // ========================

  // Resume AudioContext Instance if it's suspended by the browser
  resume() {
    this.context.resume()
      .then(() => {
        console.log('AudioContext resumed successfully');
      })
      .catch((e) => {
        console.log('Error while resuming AudioContext:', e);
      })
  }

  // Get Source Node of the Audio
  getSource() {
    return this.sourceNode;
  }



  // ========================
  // WaveSurfer
  // ========================

  // Get WaveSurfer Instance
  getWavesurfer() {
    return this.wavesurfer;
  }

  // Clear WaveSurfer
  clearWave() {
    this.wavesurfer?.stop()
    this.wavesurfer?.destroy()
    this.wavesurfer?.empty()
    this.wavesurfer?.unAll()
    this.wavesurfer = null
  }



  // ========================
  // Filters
  // ========================

  // Get Presets List
  getPresets() {
    return this.presetList;
  }

  // Add New Preset to Local List
  addPreset(preset: IPreset) {
    if (this.presetList.map(p => p.key).includes(preset.key)) return;
    this.presetList.push(preset);
  }

  // Update Existing Preset
  updatePreset(preset: IPreset) {
    if (!this.presetList.map(p => p.key).includes(preset.key)) return;
    this.presetList = this.presetList.map(p => p.key === preset.key ? preset : p);
  }

  // Set New User Selected Preset
  setSelectedPreset(preset: string) {
    if (this.presetList.map(p => p.key).includes(preset)) {
      this.selectedPreset = preset
    } else {
      this.selectedPreset = 'none';
    }

    const newFilters = this.presetList.find(p => p.key === preset)?.filters || BASE_FILTERS;
    this.setFilters(newFilters);
  }

  // Get Selected Preset
  getSelectedPreset() {
    return this.selectedPreset;
  }

  // Get Current Active Filters Object
  getFilters() {
    return this.filterNodes;
  }

  // Set all new Filters
  setFilters(filters: IFilter[]) {
    this.filterNodes.forEach((_, index) => {
      this.filterNodes[index].gain.value = filters[index].value;
    });
  }

  // Get Preamp Value
  getPreamp() {
    return this.preamp.gain.value;
  }

  // Set Preamp Value
  setPreamp(value: number) {
    this.preamp.gain.value = Math.pow(10, (value / 10));
  }

}


export default WebAudioResources;