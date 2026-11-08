import React, { useEffect, useRef } from 'react';

const gold=['#fff3bc','#ffd36e','#f4a846','#ffed9c','#eab849'];
const colorSet=['#fff3bc','#ffd36e','#f4a846','#ffed9c','#dd72a5','#a982d7','#eab849'];
export default function FireworkCanvas({event,onComplete,onCover,duration,onExplosion}) {
  const canvasRef=useRef(null), completeRef=useRef(onComplete), coverRef=useRef(onCover), explosionRef=useRef(onExplosion);
  completeRef.current=onComplete;coverRef.current=onCover;explosionRef.current=onExplosion;
  useEffect(()=>{
    if(!event)return;
    let raf=0,stopped=false,completed=false,covered=false,removeResize=()=>{};
    const cleanup=()=>{stopped=true;cancelAnimationFrame(raf);removeResize();};
    const finish=()=>{if(completed)return;completed=true;cleanup();completeRef.current?.();};
    try{
      const canvas=canvasRef.current,ctx=canvas?.getContext('2d');if(!ctx){finish();return cleanup;}
      const rocketArtwork=new Image();rocketArtwork.src=`${import.meta.env.BASE_URL}images/firecrackers/rocket.png`;
      const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
      const kind=event.type,runFor=reduced?1250:(duration||({anar:3900,chakri:3600,rocket:3100,ladi:2500,final:3000}[kind]??2700));
      let w=0,h=0,dpr=1,frame=0,startedAt=null,lastFrameAt=null,rotation=0,spinSpeed=.35,exploded=false;
      const particles=[],smoke=[],emissionCarry={};
      const countFor=(key,rate,dt)=>{const amount=(emissionCarry[key]||0)+rate*dt,count=Math.floor(amount);emissionCarry[key]=amount-count;return count;};
      const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,1.5);w=window.innerWidth;h=window.innerHeight;canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);};
      resize();window.addEventListener('resize',resize);removeResize=()=>window.removeEventListener('resize',resize);
      const origin={x:Number.isFinite(event.x)?event.x:w*.5,y:Number.isFinite(event.y)?event.y:h*.76};
      const addSpark=(x,y,angle,speed,color=gold[(Math.random()*gold.length)|0],life=35+Math.random()*45,gravity=.035+Math.random()*.045)=>particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life,max:life,size:.8+Math.random()*2.3,color,gravity});
      const addSmoke=(x,y)=>smoke.push({x:x+(Math.random()-.5)*16,y,vx:(Math.random()-.5)*.35,vy:-.45-Math.random()*.5,life:42,max:42,size:5+Math.random()*8});
      let lastPop=-1,rocketY=h*.88,blastPoint={x:origin.x,y:h*.34},transitionCenter={...origin};
      const heartTargets=[];
      if(kind==='final'){
        for(let t=0;t<Math.PI*2;t+=.12){const x=16*Math.pow(Math.sin(t),3),y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);heartTargets.push({x,y});}
      }
      const draw=()=>{
        if(stopped)return;
        try{
          const now=performance.now();frame++;if(startedAt===null)startedAt=now;const elapsed=now-startedAt,dt=Math.min(2.5,lastFrameAt===null?1:(now-lastFrameAt)/16.667);lastFrameAt=now;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='source-over';
          const fade=elapsed>runFor*.7?Math.max(0,1-(elapsed-runFor*.7)/(runFor*.3)):1;
          if(kind==='anar'){
            const baseY=Math.min(h-95,origin.y+19);
            if(elapsed<runFor*.78)for(let i=0;i<countFor('anar',reduced?2:14,dt);i++){const spread=(Math.random()-.5)*1.9-Math.PI/2,speed=5+Math.random()*9,heightFactor=.65+Math.random()*.8;addSpark(origin.x+(Math.random()-.5)*5,baseY,spread,speed*(.72+heightFactor*.4),gold[(Math.random()*gold.length)|0],56+Math.random()*40);}
            const flame=ctx.createRadialGradient(origin.x,baseY-2,2,origin.x,baseY-2,31);flame.addColorStop(0,'rgba(255,255,215,.95)');flame.addColorStop(.22,'rgba(255,203,82,.88)');flame.addColorStop(1,'rgba(255,148,30,0)');ctx.globalAlpha=fade;ctx.fillStyle=flame;ctx.beginPath();ctx.ellipse(origin.x,baseY-16,17+Math.sin(elapsed*.023)*3,31+Math.sin(elapsed*.032)*5,0,0,Math.PI*2);ctx.fill();
          }else if(kind==='chakri'){
            const cx=origin.x,cy=Math.min(h-112,origin.y+10),swell=Math.min(1,elapsed/(runFor*.56)),outerR=20+Math.hypot(w,h)*.74*swell;
            if(elapsed<runFor*.77){spinSpeed=Math.max(.075,spinSpeed*Math.pow(.997,dt)+Math.random()*.004*dt);rotation+=spinSpeed*dt;for(let i=0;i<countFor('chakri',reduced?2:5,dt);i++){const a=rotation+Math.random()*.5,trailR=18+Math.random()*outerR,sp=1.3+Math.random()*3.6;addSpark(cx+Math.cos(a)*trailR,cy+Math.sin(a)*trailR,a+(Math.random()-.5)*.9,sp,gold[(Math.random()*gold.length)|0],32+Math.random()*38);}}
            transitionCenter={x:cx,y:cy};ctx.globalAlpha=fade*.62;ctx.strokeStyle='rgba(255,196,76,.7)';ctx.lineWidth=2;ctx.shadowBlur=12;ctx.shadowColor='#ffb52e';ctx.beginPath();ctx.arc(cx,cy,outerR,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,outerR*.56,rotation,rotation+Math.PI*1.3);ctx.stroke();ctx.shadowBlur=0;
          }else if(kind==='rocket'){
            // The rocket reaches its apex exactly when the launch sample finishes, then bursts immediately.
            const burstAt=runFor*.38,progress=Math.min(1,elapsed/burstAt),ascent=progress*progress;rocketY=origin.y-(origin.y-h*.15)*ascent;
            if(!exploded&&progress>=1){exploded=true;blastPoint={x:origin.x,y:h*.25};transitionCenter=blastPoint;const n=reduced?52:220;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+(Math.random()-.5)*.04,s=2.2+Math.random()*Math.hypot(w,h)*.03;addSpark(blastPoint.x,blastPoint.y,a,s,colorSet[i%colorSet.length],54+Math.random()*48);}for(let ring=0;ring<2;ring++)for(let i=0;i<(reduced?12:42);i++){const a=i/(reduced?12:42)*Math.PI*2,s=3.1+Math.random()*2.5;addSpark(blastPoint.x,blastPoint.y,a,s,ring?'#fff4cb':'#ffbd4e',35+Math.random()*20);}explosionRef.current?.();}
            if(!exploded){for(let i=0;i<countFor('rocketTrail',reduced?2:5,dt);i++)addSpark(origin.x+(Math.random()-.5)*8,rocketY+Math.random()*14,Math.PI/2+(Math.random()-.5)*.9,1+Math.random()*3,gold[(Math.random()*gold.length)|0],26+Math.random()*25);if(frame%3===0)addSmoke(origin.x,rocketY);}
            else if(elapsed<runFor*.78)for(let i=0;i<countFor('rocketEmbers',reduced?2:5,dt);i++)addSpark(blastPoint.x+(Math.random()-.5)*18,blastPoint.y+(Math.random()-.5)*18,Math.random()*Math.PI*2,1+Math.random()*3,colorSet[(Math.random()*colorSet.length)|0],24+Math.random()*34);
            if(!exploded){ctx.globalAlpha=1;const spriteH=Math.min(165,h*.24),spriteW=spriteH*(rocketArtwork.naturalWidth/rocketArtwork.naturalHeight||.45);if(rocketArtwork.complete&&rocketArtwork.naturalWidth){ctx.save();ctx.translate(origin.x,rocketY);ctx.rotate(-.045);ctx.drawImage(rocketArtwork,-spriteW/2,-spriteH/2,spriteW,spriteH);ctx.restore();}else{ctx.fillStyle='#bf493e';ctx.shadowBlur=14;ctx.shadowColor='#ffbc42';ctx.beginPath();ctx.moveTo(origin.x,rocketY-spriteH*.32);ctx.lineTo(origin.x+spriteW*.14,rocketY-spriteH*.2);ctx.lineTo(origin.x+spriteW*.13,rocketY+spriteH*.3);ctx.lineTo(origin.x-spriteW*.13,rocketY+spriteH*.3);ctx.lineTo(origin.x-spriteW*.14,rocketY-spriteH*.2);ctx.closePath();ctx.fill();ctx.shadowBlur=0;}const flame=ctx.createRadialGradient(origin.x,rocketY+spriteH*.31,2,origin.x,rocketY+spriteH*.31,20);flame.addColorStop(0,'rgba(255,255,218,.95)');flame.addColorStop(.35,'rgba(255,181,67,.86)');flame.addColorStop(1,'rgba(255,123,38,0)');ctx.fillStyle=flame;ctx.beginPath();ctx.arc(origin.x,rocketY+spriteH*.31,20,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
          }else if(kind==='ladi'){
            const count=19,interval=runFor*.76/count,index=Math.floor(elapsed/interval);
            if(index>lastPop&&index<count&&elapsed<runFor*.76){for(let pop=lastPop+1;pop<=index&&pop<count;pop++){const step=Math.ceil(pop/2),sideReach=step/Math.floor(count/2),px=pop===0?origin.x:(pop%2?origin.x*(1-sideReach):origin.x+(w-origin.x)*sideReach),py=Math.min(h-113,origin.y+8+Math.sin(pop*.8)*Math.min(24,h*.025)),n=reduced?7:22,radius=(18+Math.hypot(w,h)*.016)*(1+pop*.025);for(let i=0;i<n;i++)addSpark(px,py,Math.random()*Math.PI*2,1+Math.random()*radius*.19,gold[(Math.random()*gold.length)|0],24+Math.random()*35);addSmoke(px,py-3);}lastPop=index;}
          }else if(kind==='final'){
            const cx=w*.5,cy=h*.35,r=Math.min(w*.013,h*.022);
            transitionCenter={x:cx,y:cy};
            if(frame===1){for(let i=0;i<heartTargets.length;i++){const p=heartTargets[i],angle=Math.atan2(p.y,p.x),speed=2+Math.random()*3.1,scale=r*(1+Math.random()*.14);particles.push({x:cx,y:cy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,tx:cx+p.x*scale,ty:cy-p.y*scale,life:110,max:110,size:1.5+Math.random()*2,color:colorSet[i%colorSet.length],gravity:.002});}}
          }
          // A luminous expanding curtain covers the old message, then stays over both screens while the next one mounts.
          const p=elapsed/runFor,coverStart=kind==='rocket'?.38:.14,coverEnd=kind==='rocket'?.46:.5,fadeStart=kind==='rocket'?.56:.59,expandDuration=kind==='rocket'?.08:.38,expand=Math.max(0,Math.min(1,(p-coverStart)/expandDuration)),veilRadius=Math.hypot(w,h)*1.32*expand;
          let veilAlpha=0;if(p>coverStart&&p<coverEnd)veilAlpha=.98*Math.pow((p-coverStart)/(coverEnd-coverStart),.72);else if(p>=coverEnd&&p<=fadeStart)veilAlpha=.98;else if(p>fadeStart)veilAlpha=.98*Math.max(0,1-(p-fadeStart)/.39);
          if(veilAlpha>0&&veilRadius>1){const c=kind==='final'?'#e8b4cf':kind==='rocket'?'#f3bd65':kind==='chakri'?'#efbf5b':'#f5ca78';ctx.globalCompositeOperation='source-over';ctx.globalAlpha=veilAlpha;const veil=ctx.createRadialGradient(transitionCenter.x,transitionCenter.y,veilRadius*.02,transitionCenter.x,transitionCenter.y,veilRadius);veil.addColorStop(0,'rgba(255,250,227,.98)');veil.addColorStop(.32,`${c}f2`);veil.addColorStop(.74,'rgba(255,226,164,.96)');veil.addColorStop(1,'rgba(255,247,218,.91)');ctx.fillStyle=veil;ctx.beginPath();ctx.arc(transitionCenter.x,transitionCenter.y,veilRadius,0,Math.PI*2);ctx.fill();ctx.globalAlpha=veilAlpha*.62;ctx.strokeStyle=kind==='final'?'rgba(218,118,167,.92)':'rgba(255,255,238,.95)';ctx.lineWidth=2.4;ctx.shadowBlur=18;ctx.shadowColor=c;ctx.beginPath();ctx.arc(transitionCenter.x,transitionCenter.y,veilRadius*.94,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;if(p>=coverEnd&&!covered){covered=true;coverRef.current?.();}}
          ctx.globalCompositeOperation='lighter';
          for(let i=particles.length-1;i>=0;i--){const p=particles[i];if(p.life<=0||p.x<-100||p.x>w+100||p.y<-100||p.y>h+100){particles.splice(i,1);continue;}p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(.991,dt);p.life-=dt;const alpha=Math.min(1,p.life/12)*fade;ctx.globalAlpha=alpha*.72;ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(.8,p.size*.8);ctx.shadowBlur=i%4===0?8:0;ctx.shadowColor=p.color;ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x-p.vx*7,p.y-p.vy*7);ctx.stroke();ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.tx===undefined?p.x:p.x+(p.tx-p.x)*.045*dt,p.ty===undefined?p.y:p.y+(p.ty-p.y)*.045*dt,p.size,0,Math.PI*2);ctx.fill();if(p.tx!==undefined){p.x+=(p.tx-p.x)*.045*dt;p.y+=(p.ty-p.y)*.045*dt;}}
          for(let i=smoke.length-1;i>=0;i--){const p=smoke[i];if(p.life<=0){smoke.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;ctx.globalAlpha=(p.life/p.max)*.16*fade;ctx.fillStyle='#9c8774';ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1+(1-p.life/p.max)),0,Math.PI*2);ctx.fill();}
          ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;
          if(elapsed>=runFor){finish();return;}raf=requestAnimationFrame(draw);
        }catch{finish();}
      };
      ctx.globalCompositeOperation='lighter';raf=requestAnimationFrame(draw);
    }catch{finish();}
    return cleanup;
  },[event,duration]);
  return <canvas ref={canvasRef} className="firework-canvas" aria-hidden="true"/>;
}
