import React from 'react';

export default function CrackerButton({type,onClick,disabled,label}) {
  const photographic = ['anar','chakri','rocket','ladi'].includes(type);
  return <button className={`cracker-button cracker-${type}`} onClick={onClick} disabled={disabled} aria-label={label}>
    {photographic&&<img className={`cracker-photo photo-${type}`} src={`${import.meta.env.BASE_URL}images/firecrackers/${type}.png`} alt="" aria-hidden="true" draggable="false"/>}
    {type==='anar'&&<div className="anar-art"><span className="anar-neck"/><span className="anar-body"/><span className="anar-fuse"/><span className="anar-spark">✦</span><small>ANAR</small></div>}
    {type==='chakri'&&<div className="chakri-art"><span/><i/><b/><em/><small>CHAKRI</small></div>}
    {type==='rocket'&&<div className="rocket-art"><span className="rocket-stick"/><span className="rocket-body"><i/><b/></span><span className="rocket-tail"/><small>ROCKET</small></div>}
    {type==='ladi'&&<div className="ladi-art">{Array.from({length:7},(_,i)=><span key={i}><i/><b/></span>)}<small>LADI</small></div>}
    {type==='final'&&<div className="final-art"><span>✦</span><i>♡</i><b>✧</b></div>}
  </button>;
}
