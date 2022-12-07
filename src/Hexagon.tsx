import styled from 'styled-components';
import {useState, useEffect} from 'react';

const hexsize = 50;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']


interface IHexagons {
  isMouseDown? : boolean,
  numrows: number;
}

  
export const Hexagons = ({isMouseDown, numrows}:IHexagons) => {
  
  // const numrows = 20;
  const numcols = 20;
  const numhex = numcols * numrows;

  const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
  const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));
  const [activeCells, setActiveCells] = useState([]);

  const updateColor = (id:number, newcolor:string) => {
    const r = backgroundColor;
    r[id] = newcolor;
    setBackgroundColor({...r}); // need to use ({...r})
    const q = isActive;
    q[id] = newcolor == 'white' ? true : false;
    setActive({...q});
    
  }
  
  const resetAll = () => {
    const r = Array(numhex).fill('black');
    setBackgroundColor({...r});
    const q = Array(numhex).fill(false);
    setActive({...q});
  }
  

  /*
  instead of using hexagon divs as inputs, use the keys?
  check if not negative
  with it not rotated anymore, down is +2, up is -2
  up-left is ... columns looks repeated/upsampled, 0, 0, 1, 1, ...
  maybe just give each a unique id

  up-left is -21 with 20 rows, except for second row which is -20
  dn-left is +20 or +19
  dn-right is +21 or +20
  up-right is -20 or -19
  
  traversing a column will return a constant for the last digit: 19, 59, 99, 139...just a constant offset
  ---
  it isn't first row/col...it alternates between +20 and +21 when going dn-right
  switched back to numbering the same way colors are done, i*numcols + j
  dn-right is +1 if even, +21 if odd
  dn-left is +1 if odd, -19 if even
  
  */

  const checkNeighbors = (row: number, col: number) => {
    // use i for rows, j for columns?  no it's the other way around
    // up is always -2, down is always +2
    const id = col*numcols + row // the unique id/key
    const shifts = [2,-2]
    
    if( row % 2 === 0 ) { // even
      // u-r : -1
      // u-l : -21
      // d-l : -19
      // d-r : +1
      shifts.push(-1, -21, -19, 1)
    }
    else { // odd
      // u-r : +19
      // u-l : -1
      // d-l : +1
      // d-r : +21
      shifts.push(19, -1, 1, 21)
    }

    const neighborsToCheck = shifts.map((i) => i + id)
    console.log(neighborsToCheck);
    neighborsToCheck.map((i) => {
      if(i >= 0) {
        console.log(isActive[i]);
        
      }
    })
    
    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // checkNeighbors;
    },100);
    return () => clearInterval(interval);
  },[])
  

  return(
      <Grid>
        {[...Array(numrows)].map((x, i) =>
          [...Array(numcols)].map((y, j) => 
          <Hexagon key={i*numcols+j} 
            isactive={isActive[i*numcols+j]}
            background={backgroundColor[i*numcols+j]}
            style={{left:650+i*72 + 36 * (j%2), top:200 + 25*(j+1)}}
            onMouseDown={(e) => {
                  if(e.shiftKey){
                      updateColor(i*numcols+j, 'black');
                    }
                    else {
                      updateColor(i*numcols+j, 'white');
                    }
              checkNeighbors(j,i)
                  } }
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

          >
            {i*numcols+j}<br/>{j % 2 === 0 ? 'e' : 'o'}
          </Hexagon>
  
      ))}
      <ResetButton onClick={resetAll}/>
      </Grid>
  );
}



const Hexagon = styled.div.attrs((props : {top : number, left : number, background : string, mousedown : boolean, isactive : boolean}) => props)`
  position: absolute;
  width: ${hexsize}px;
  background: ${props => props.background};
  height: ${hexsize}px;
  font-size:16px;
  border: none;
  outline: none;
  color: ${props => props.isactive ? 'black' : 'white'};
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  transform: rotateZ(0deg);
  user-select: none;
  justify-content: center;
  align-content: center;
  vertical-align: middle;
  // line-height: 50px;
`

const HexagonBorder = styled.div.attrs((props : {top : number, left : number, background : string, mousedown : boolean, isactive : boolean}) => props)`
  position: absolute;
  width: 105%
  background: ${props => props.background};
  height: 105%;
  border: none;
  outline: none;
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  transform: rotateZ(0deg);    
`

const Grid = styled.div`
  position: absolute;
  background: gray;
  width: 100%;
  height: 100%;
`

const ResetButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: rgb(150,0,0);
  transition: background 0.1s;
  position: absolute;
  left: 70%;
  top: 1%;
  cursor: pointer;
  &:hover{
    background: rgb(225,0,0);
  }  
  &:active{
    background: rgb(255,0,0);
  }  


`
