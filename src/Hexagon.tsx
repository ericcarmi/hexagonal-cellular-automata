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
  const [activeCells, setActiveCells] = useState<number[]>([]);
  const [shouldIterate, setShouldIterate] = useState(false);

  const updateColor = (id:number, newcolor:string) => {
    const r = backgroundColor;
    r[id] = newcolor;
    setBackgroundColor({...r}); 
    const q = isActive;
    q[id] = r[id] === 'white' ? true : false;
    setActive({...q});


    if(q[id] && !activeCells.includes(id)) { // if q is true, add this cell to the list
      // console.log('add');
      setActiveCells(old => [...old, id]);
    }
    else if(!q[id] && activeCells.includes(id)) {
      // console.log('remove');
      setActiveCells(old => [...old.filter(i => i !== id)]);
    }

    // console.log(newcolor, id, activeCells);
    
  }
  
  const resetAll = () => {
    const r = Array(numhex).fill('black');
    setBackgroundColor({...r});
    const q = Array(numhex).fill(false);
    setActive({...q});
    setActiveCells([]);
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

    // numbers will need to be updated later relative to numrows/numcols
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
    // console.log(neighborsToCheck);
    activeCells.map((i) => {
      console.log(i);
      if(i >= 0) {
        // console.log(isActive[i]);
        // go through all activeCells, check shifts in neighborsToCheck
        
      }
    })
    
    
  }

  // or you don't need to pass row,col? just figure it out by the number in activeCell? just even or odd
  useEffect(() => {
    if(shouldIterate){
    const interval = setInterval(() => {

      const nextActiveCells: Array<number> = [];
      const nextDeadCells: Array<number> = [];
      activeCells.map((i) => {
        const shifts = [-2] // format: up, ur, dr, dn, dl, dr, needs to communicate properly with format of rule
        // is this fixed with recognizing it as a symmetry? many formats are possible
        // can format be learned with a different program? some use of logic and statistics (if data can be got)
        if( i % 2 === 0 ) { // even
          // u-r : -1
          // u-l : -21
          // d-l : -19
          // d-r : +1
          shifts.push(-1, 1, 2, -19, -21);
        }
        else { // odd
          // u-r : +19
          // u-l : -1
          // d-l : +1
          // d-r : +21
          shifts.push(19, 21, 2, 1, -1);
        }
        // check if shifts are positive and smaller than max

        let stayAlive = 0;

        shifts.map((s) => {
          const a = s + i;
          if(a > 0 && a < numrows*numcols && isActive[a]){
            stayAlive += 1;
          }

        })
        console.log(stayAlive);
        // apply the rule
        if(stayAlive !== 3) { // vary this based on index for different boundary conditions, maybe boundaries could stay alive with less (reflective?)
          // updateColor(i, 'black');
            nextDeadCells.push(i);
        }
        else {
          // updateColor(i, 'white');
            nextActiveCells.push(i);
        }
        // console.log(i,shifts);

      })
      nextActiveCells.map((i) => {
          updateColor(i,'white');
      })
      nextDeadCells.map((i) => {
          updateColor(i,'black');
      })
        
        
    },1000);
    return () => clearInterval(interval);
    }
  },[activeCells, isActive, shouldIterate])
  

  return(
      <Grid>
        {[...Array(numrows)].map((x, i) =>
          [...Array(numcols)].map((y, j) => 
          <Hexagon key={i*numcols+j} 
            isactive={isActive[i*numcols+j]}
            background={backgroundColor[i*numcols+j]}
            style={{left:100+i*72 + 36 * (j%2), top:200 + 25*(j+1)}}
            onMouseDown={(e) => {
                  if(e.shiftKey){
                      updateColor(i*numcols+j, 'black');
                    }
                    else {
                      updateColor(i*numcols+j, 'white');
                    }
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
      <StartButton onClick={() => setShouldIterate(!shouldIterate)}/>
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
const StartButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: rgb(0,150,0);
  transition: background 0.1s;
  position: absolute;
  left: 60%;
  top: 1%;
  cursor: pointer;
  &:hover{
    background: rgb(0,225,0);
  }  
  &:active{
    background: rgb(0,255,0);
  }  


`
