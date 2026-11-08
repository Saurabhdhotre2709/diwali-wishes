import React from 'react';

export function Toran() { return <div className="toran" aria-hidden="true"><div className="toran-line" />{Array.from({length:17},(_,i)=><span key={i} className={`leaf leaf-${i%3}`} style={{left:`${i*6.25}%`,animationDelay:`${(i%5)*-.3}s`}}><i/><b/><em/></span>)}<div className="bell bell-left">✧</div><div className="bell bell-right">✧</div></div>; }
export function Rangoli() { return <div className="rangoli" aria-hidden="true"><div className="rangoli-ring"><div className="rangoli-flower">{Array.from({length:8},(_,i)=><i key={i} style={{transform:`rotate(${i*45}deg) translateY(-29px)`}} />)}<b/><span/></div></div></div>; }
export function Diyas() { return <><div className="diya diya-left" aria-hidden="true"><i/><b/></div><div className="diya diya-right" aria-hidden="true"><i/><b/></div></>; }
