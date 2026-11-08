import { useCallback, useEffect, useRef, useState } from 'react';
import { diwaliConfig } from '../config/diwaliConfig.js';

export function useAudioController() {
  const music=useRef(null),effects=useRef(new Map()),context=useRef(null),master=useRef(null),ducked=useRef(false);
  const [enabled,setEnabled]=useState(true),[started,setStarted]=useState(false);
  useEffect(()=>{
    const track=new Audio(diwaliConfig.audio.music);track.loop=true;track.volume=diwaliConfig.audio.volume;music.current=track;
    for(const [key,path] of Object.entries(diwaliConfig.audio.paths)){
      if(!path)continue;const sample=new Audio(path);sample.preload='auto';sample.loop=false;sample.volume=diwaliConfig.audio.effectsVolume;sample.load();effects.current.set(key,sample);
    }
    return()=>{track.pause();music.current=null;effects.current.forEach(sample=>sample.pause());effects.current.clear();context.current?.close?.();};
  },[]);
  const initSound=useCallback(async()=>{
    if(!context.current){const AudioCtx=window.AudioContext||window.webkitAudioContext;if(AudioCtx){context.current=new AudioCtx();master.current=context.current.createGain();master.current.gain.value=.68;master.current.connect(context.current.destination);}}
    if(context.current?.state==='suspended')await context.current.resume();
  },[]);
  const start=useCallback(async()=>{setStarted(true);try{await initSound();}catch{}if(enabled)music.current?.play().catch(()=>{});},[enabled,initSound]);
  useEffect(()=>{const track=music.current;if(!track)return;if(enabled&&started){track.volume=ducked.current?diwaliConfig.audio.duckedVolume:diwaliConfig.audio.volume;track.play().catch(()=>{});}else if(!enabled)track.pause();},[enabled,started]);
  const toggle=useCallback(()=>setEnabled(value=>!value),[]);
  const setDucked=useCallback(value=>{ducked.current=value;if(music.current&&enabled)music.current.volume=value?diwaliConfig.audio.duckedVolume:diwaliConfig.audio.volume;},[enabled]);
  const playEffect=useCallback(key=>{
    if(!enabled)return;
    const synthesize=()=>{
      const ctx=context.current;if(!ctx||!master.current)return;const now=ctx.currentTime;
      const noise=(when,length,cutoff=2600,volume=.3,resonance=.7)=>{const size=Math.max(1,Math.floor(ctx.sampleRate*length)),buffer=ctx.createBuffer(1,size,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*(1-i/size);const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.setValueAtTime(cutoff,when);filter.Q.value=resonance;gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(volume,when+.012);gain.gain.exponentialRampToValueAtTime(.0001,when+length);source.connect(filter);filter.connect(gain);gain.connect(master.current);source.start(when);source.stop(when+length);};
      const tone=(when,length,from,to,volume=.18,wave='sine')=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=wave;osc.frequency.setValueAtTime(Math.max(35,from),when);osc.frequency.exponentialRampToValueAtTime(Math.max(35,to),when+length);gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(volume,when+.018);gain.gain.exponentialRampToValueAtTime(.0001,when+length);osc.connect(gain);gain.connect(master.current);osc.start(when);osc.stop(when+length);};
      if(key==='anar'){for(let i=0;i<43;i++)noise(now+i*.057,.11,3000+Math.random()*1700,.07+Math.random()*.045,.65);}
      else if(key==='chakri'){tone(now,3.35,700,1750,.065,'sawtooth');tone(now+3.35,.48,1750,260,.05,'sawtooth');for(let i=0;i<38;i++)noise(now+i*.085,.1,2800+Math.random()*1300,.045,.9);}
      else if(key==='rocketLaunch'){tone(now,1.05,250,1800,.13,'sawtooth');noise(now,.95,2100,.075,.7);}
      else if(key==='rocketExplosion'){noise(now,.42,650,.42,.8);noise(now+.04,.7,2200,.22,.6);tone(now,.24,110,50,.2,'sine');}
      else if(key==='ladi'){for(let i=0;i<15;i++){const at=now+i*(.105-i*.004);noise(at,.16,700+Math.random()*1300,.16+Math.random()*.06,.7);tone(at,.08,110+Math.random()*100,55,.055,'triangle');}}
      else{for(let i=0;i<12;i++){const at=now+i*.205;tone(at,.36,520+i*105,1600+i*90,.09,'sine');noise(at+.06,.18,3000+i*100,.07,.8);}}
    };
    const path=diwaliConfig.audio.paths[key];
    if(path){let sample=effects.current.get(key);if(!sample){sample=new Audio(path);sample.preload='auto';effects.current.set(key,sample);}sample.volume=diwaliConfig.audio.effectsVolume;sample.playbackRate=diwaliConfig.audio.playbackRate[key]||1;sample.preservesPitch=true;sample.currentTime=0;sample.play().catch(synthesize);}
    else synthesize();
  },[enabled]);
  const stopEffect=useCallback(key=>{const sample=effects.current.get(key);if(sample){sample.pause();sample.currentTime=0;}},[]);
  return {enabled,started,start,toggle,playEffect,stopEffect,setDucked};
}
