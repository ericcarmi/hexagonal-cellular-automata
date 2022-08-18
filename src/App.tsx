import styled from 'styled-components';
import './App.css';
import {useState} from 'react';
import {Hexagons} from './Hexagon';

const hexsize = 100;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']

/*
useState hooks are needed to update through style={{}} in html return without 200+ render warning
so the selectors aren't used in the styled button, which is kind of annoying
maybe they just need to be two different things, don't control the color with hooks, but keep the hooks anyway
2 representations for the same thing, is there a way to guarantee they are in sync?

but what selectors will set the hovered ones to active when the mouse is down?

problem with useState is because onMouseEnter is changing all of them
just make an array, they all have different colors
---

almost working but it only updates after mouseup, even without using mouseup/down logic
might need to put the updateColor functionality inside useEffect with a callback?
wtf is the point of the hooks then if you have to use a separate callback, they are supposed to update as is
---
moved to its own component still nothing
is it because the style doesn't get updated? from the log, it's clear that the state variable is updated
passing to styled.div works though


*/



function App() {
const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(25).fill('black'));
const [isMouseDown, setMouseDown] = useState(false);
const [isMouseOver, setMouseOver] = useState(Array(25).fill(false));



const [isActive, setActive] = useState<boolean[]>(Array(25).fill(false));

const updateColor = (id:number, newcolor:string) => {
  const r = backgroundColor;
  r[id] = newcolor;
  setBackgroundColor(r);
  const q = isActive;
    q[id] = newcolor == 'white' ? true : false;
    setActive(q);
  console.log(isActive);
}
  


  return (
    <div className="App" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
      <header className="App-header">
    <Hexagons isMouseDown={isMouseDown}/>
      <Rules/>
     </header>

    </div>
  );
}


const Rules = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 20px;
  background: black;
  color: white;
`

export default App;
