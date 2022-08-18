import styled from 'styled-components';
import {useState, useEffect} from 'react';

const hexsize = 100;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']


interface IHexagons {
  isMouseDown:boolean,
}

  
export const Hexagons = ({isMouseDown}:IHexagons) => {
  
  const numrows = 20;
  const numcols = 10;
  const numhex = numcols * numrows;

const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));

const updateColor = (id:number, newcolor:string) => {
  const r = backgroundColor;
  r[id] = newcolor;
  setBackgroundColor(r);
  const q = isActive;
    q[id] = newcolor == 'white' ? true : false;
    setActive(q);
}

  return(
      <Grid>
        {[...Array(numrows)].map((x, i) =>
          [...Array(numcols)].map((y, j) => 
          <Hexagon key={i*numcols+j} left={100+i*50 - (j%2) * 25} top={75*(j+1)} 
            style={{background: backgroundColor[i*numcols+j]}}
            onMouseDown={(e) => {if(e.shiftKey){
                      updateColor(i*numcols+j, 'black');
                    }
                    else {
                      updateColor(i*numcols+j, 'white');
                    }
                  }}
            onMouseEnter={(e) => { 
                  if(isMouseDown){
                    if(e.shiftKey){
                      updateColor(i*numcols+j, 'black');
              
                    }
                    else {
                      updateColor(i*numcols+j, 'white');
                    }
                  }
            }}
            onMouseMove={(e) => { 
                  if(isMouseDown){
                    if(e.shiftKey){
                      updateColor(i*numcols+j, 'black');
                    }
                    else {
                      updateColor(i*numcols+j, 'white');
                    }
                  }
            }}

          />
    ))}
    </Grid>
  );
}



const Hexagon = styled.div.attrs((props : {top : number, left : number, background : string, mousedown : boolean, isactive : boolean}) => props)`
  position: absolute;
  width: ${hexsize}px;
  background: ${props => props.background};
  height: 50px;
  border: none;
  outline: none;
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  transform: rotateZ(90deg);

  &:hover{
    background: ${props => props.mousedown ? 'white' : 'red'};
  }

  &:active{
    
  background: ${props => props.isactive ? 'white' : 'black'};
  }
    
`

const Grid = styled.div`
`
