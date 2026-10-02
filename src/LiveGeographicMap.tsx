import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Restaurant = {id:number|string;name:string;surplus:number;category:string;status:string;lat:number;lng:number};
type NGO = {id:number|string;name:string;area:string;need:number;hours:string;lat:number;lng:number};
type Props = {filter:string;restaurants:Restaurant[];ngos:NGO[];notify:(message:string)=>void};

export default function LiveGeographicMap({filter,restaurants,ngos,notify}:Props){
  const [tilesFailed,setTilesFailed]=useState(false);
  const visibleRestaurants=restaurants.filter(r=>filter==='All'||filter==='Restaurants'||(filter==='High surplus'&&r.surplus>=18)||(filter==='Urgent'&&r.status==='Urgent'));
  const showNgos=['All','NGOs','Active matches','High surplus','Urgent'].includes(filter);
  return <MapContainer center={[20,0]} zoom={2} minZoom={2} maxZoom={18} scrollWheelZoom style={{height:'100%',width:'100%'}}>
    {tilesFailed&&<div className="map-world-backdrop" aria-hidden="true"><svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice"><path d="M86 108l35-22 42 5 24 24-9 27-36 6-12 23-34 3-17-20-28-4 5-26zm78 86 33-12 28 18 4 39-19 38-6 48-21 28-16-30 7-39-21-32zm145-106 38-21 36 11 10 24-23 13-12 27-38-4-22-22zm64 58 43-21 51 12 40 25-6 30-29 6-12 35-31 23-18 54-28 30-16-21 7-42-22-35 5-32-22-29zm151-94 57-17 61 12 31 31-17 31-43 7-14 31-37 5-17 29-30-8 5-32-24-27 7-35-26-12zm112 175 41-11 42 17 21 30-13 22-37-6-26-19z"/></svg></div>}
    {!tilesFailed&&<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" eventHandlers={{tileerror:()=>setTilesFailed(true)}}/>}
    {visibleRestaurants.map(r=><CircleMarker key={`r${r.id}`} center={[r.lat,r.lng]} radius={r.surplus>18?9:7} pathOptions={{color:'#fff',weight:2,fillColor:r.status==='Urgent'?'#ee8768':'#42936b',fillOpacity:.96}} eventHandlers={{click:()=>notify(`${r.name} · ${r.surplus} kg surplus`)}}><Popup><b>{r.name}</b><br/>{r.surplus} kg · {r.category}<br/>Pickup before 9:00 PM</Popup></CircleMarker>)}
    {showNgos&&ngos.map(n=><CircleMarker key={`n${n.id}`} center={[n.lat,n.lng]} radius={7} pathOptions={{color:'#fff',weight:2,fillColor:'#668da8',fillOpacity:.96}} eventHandlers={{click:()=>notify(`${n.name} · ${n.need} kg need`)}}><Popup><b>{n.name}</b><br/>Need {n.need} kg · {n.area}<br/>{n.hours}</Popup></CircleMarker>)}
    {(filter==='All'||filter==='Active matches')&&<Polyline positions={[[19.076,72.877],[19.088,72.881]]} pathOptions={{color:'#ec9e48',weight:4,dashArray:'8 8'}}/>}
  </MapContainer>;
}
