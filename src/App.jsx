import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { diwaliConfig } from './config/diwaliConfig.js';
import './styles/finale.css';
import './styles/welcome-diya.css';
import { useAudioController } from './hooks/useAudioController.js';
import { Toran, Rangoli, Diyas } from './components/Decorations.jsx';
import CrackerButton from './components/CrackerButton.jsx';
import FireworkCanvas from './components/FireworkCanvas.jsx';

export default function App(){
  const [begun,setBegun]=useState(false),[screen,setScreen]=useState(0),[burst,setBurst]=useState(null),[busy,setBusy]=useState(false),[sourceScreen,setSourceScreen]=useState(null);
  const activeTransition=useRef(false), revealedRef=useRef(false), doneRef=useRef(null);
  const audio=useAudioController(); const current=diwaliConfig.screens[screen];
  const begin=()=>{setBegun(true);audio.start();};
  const ignite=(event)=>{if(activeTransition.current)return;activeTransition.current=true;revealedRef.current=false;setBusy(true);setSourceScreen(screen);const type=current.cracker;const rect=event.currentTarget.getBoundingClientRect();setBurst({id:Date.now(),type,x:rect.left+rect.width/2,y:rect.top+rect.height/2});audio.setDucked(true);audio.playEffect(type==='anar'?'anar':type==='chakri'?'chakri':type==='rocket'?'rocketLaunch':type==='ladi'?'ladi':'final');};
  const revealNext=()=>{if(revealedRef.current||current.final)return;revealedRef.current=true;setScreen(n=>Math.min(n+1,4));};
  const done=()=>{if(!activeTransition.current)return;if(!revealedRef.current&&!current.final)revealNext();activeTransition.current=false;audio.stopEffect(burst?.type==='anar'?'anar':burst?.type==='chakri'?'chakri':burst?.type==='ladi'?'ladi':'rocketLaunch');audio.setDucked(false);setBurst(null);setBusy(false);setSourceScreen(null);};
  doneRef.current=done;
  useEffect(()=>{if(!burst)return;const fallback=window.setTimeout(()=>doneRef.current?.(),4000);return()=>window.clearTimeout(fallback);},[burst]);
  const message=(current?.message||'').replaceAll('{name}',diwaliConfig.name);
  return <main className="stage"><div className="grain"/><Toran/><Diyas/><button className="music-control" onClick={audio.toggle} aria-label={audio.enabled?'Mute music':'Enable music'} title={audio.enabled?'Mute music':'Enable music'}>{audio.enabled?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
    <div className={`card-content ${begun?`message-screen screen-${current.cracker}`:'screen-welcome'} ${busy&&screen===sourceScreen?'source-hidden':''}`} key={begun?`screen-${screen}`:'welcome'}>
      {!begun?<><div className="eyebrow">A FESTIVE LITTLE SURPRISE</div><h1>Something special<br/>is waiting for you...</h1><div className="gold-rule"><span>✦</span></div><p className="welcome-copy">A little light, a little love,<br/>and a Diwali wish made just for you.</p><button className="welcome-diya" onClick={begin} aria-label="Tap to Begin"><span className="welcome-tap">Tap to Begin ✨</span><span className="diya-halo"/><span className="diya-flame"/><span className="diya-wick"/><span className="diya-rim"/><span className="diya-bowl"/><span className="diya-foot"/><span className="diya-ornament">✦　❀　✦</span></button></>:<><div className="eyebrow">A DIWALI WISH, JUST FOR YOU</div><h1>{current.heading.replace('{name}',diwaliConfig.name)}</h1><div className="gold-rule"><span>✦</span></div><p className="message">{message}</p>{current.final&&<p className="final-line">{current.finalLine.replace('{name}',diwaliConfig.name)}</p>}<div className="cracker-area"><div className="tap-hint">{current.instruction}</div><CrackerButton type={current.cracker} label={current.label} disabled={busy} onClick={ignite}/></div></>}
    </div><Rangoli/>{burst&&<FireworkCanvas key={burst.id} event={burst} duration={diwaliConfig.animationDuration[burst.type]} onCover={revealNext} onComplete={done} onExplosion={()=>audio.playEffect('rocketExplosion')}/>} 
  </main>;
}
