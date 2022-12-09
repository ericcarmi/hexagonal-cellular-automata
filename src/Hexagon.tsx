import styled from 'styled-components';
import {useState, useEffect} from 'react';

const hexsize = 20;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']
const updateInterval = 1000;
// rule should have 7 bits, include the center...put this first
/*
to get it to oscillate, a set of bits need to be flipped
start with flower pattern - center hexagon is off, surrounding are on
0111111 -> 1

then off with single neighbor on
0000001 -> 1
0000010 -> 1
0000100 -> 1
0001000 -> 1
0010000 -> 1
0100000 -> 1

didn't do that but found a cool one...or maybe they will all be decent now they all cells are looped through
but why is that not right?

because it will keep propagating outward...which is what it does
when flower is formed, on cells have 2 neighbors, these need to go to zero, which happens, but single neighbors should not be on
a simple oscillation like that might not be possible with this rule set

how much more complex would the rules have to be?
there would have to be inter-rule dependence
multiple options for output rule depending on some parameters
parameters could be other rules or some other variable?

a general interface for connecting rules together could be complicated...maybe not
single neighor rules are powers of 2

64 32 16 08 04 02 01
cn up ur dr dn dl ul
1  0  0  1  0  1  0 = 74 -> 1 
1  0  0  0  1  0  1 = 69 -> 1
1  1  0  0  0  1  0 = 98 -> 1
1  0  1  0  0  0  1 = 81 -> 1
1  0  0  1  0  1  0 = 74 -> 1
1  0  1  0  1  0  0 = 84 -> 1

rule(2) -> (rule(74) && rule(69) && rule(98) && rule(81) && rule(74) && rule(84)) ? 1 : 0

would this work though? rules need to be updated...rules becomes part of the dynamics
the conditions should be for the next set of rules, rules(i+1) <- rules(i)

*/
const rules = 
{
"0000000" : "0",
"0000001" : "1",
"0000010" : "1",
"0000011" : "0",
"0000100" : "1",
"0000101" : "0",
"0000110" : "0",
"0000111" : "0",
"0001000" : "1",
"0001001" : "0",
"0001010" : "0",
"0001011" : "0",
"0001100" : "0",
"0001101" : "0",
"0001110" : "0",
"0001111" : "0",
"0010000" : "1",
"0010001" : "0",
"0010010" : "0",
"0010011" : "0",
"0010100" : "0",
"0010101" : "0",
"0010110" : "0",
"0010111" : "0",
"0011000" : "0",
"0011001" : "0",
"0011010" : "0",
"0011011" : "0",
"0011100" : "0",
"0011101" : "0",
"0011110" : "0",
"0011111" : "0",
"0100000" : "1",
"0100001" : "0",
"0100010" : "0",
"0100011" : "0",
"0100100" : "0",
"0100101" : "0",
"0100110" : "0",
"0100111" : "0",
"0101000" : "0",
"0101001" : "0",
"0101010" : "0",
"0101011" : "0",
"0101100" : "0",
"0101101" : "0",
"0101110" : "0",
"0101111" : "0",
"0110000" : "0",
"0110001" : "0",
"0110010" : "0",
"0110011" : "0",
"0110100" : "0",
"0110101" : "0",
"0110110" : "0",
"0110111" : "0",
"0111000" : "0",
"0111001" : "0",
"0111010" : "0",
"0111011" : "0",
"0111100" : "0",
"0111101" : "0",
"0111110" : "0",
"0111111" : "1",
"1000000" : "0",
"1000001" : "0",
"1000010" : "0",
"1000011" : "0",
"1000100" : "0",
"1000101" : "0",
"1000110" : "0",
"1000111" : "0",
"1001000" : "0",
"1001001" : "0",
"1001010" : "0",
"1001011" : "0",
"1001100" : "0",
"1001101" : "0",
"1001110" : "0",
"1001111" : "0",
"1010000" : "0",
"1010001" : "0",
"1010010" : "0",
"1010011" : "0",
"1010100" : "0",
"1010101" : "0",
"1010110" : "0",
"1010111" : "0",
"1011000" : "0",
"1011001" : "0",
"1011010" : "0",
"1011011" : "0",
"1011100" : "0",
"1011101" : "0",
"1011110" : "0",
"1011111" : "0",
"1100000" : "0",
"1100001" : "0",
"1100010" : "0",
"1100011" : "0",
"1100100" : "0",
"1100101" : "0",
"1100110" : "0",
"1100111" : "0",
"1101000" : "0",
"1101001" : "0",
"1101010" : "0",
"1101011" : "0",
"1101100" : "0",
"1101101" : "0",
"1101110" : "0",
"1101111" : "0",
"1110000" : "0",
"1110001" : "0",
"1110010" : "0",
"1110011" : "0",
"1110100" : "0",
"1110101" : "0",
"1110110" : "0",
"1110111" : "0",
"1111000" : "0",
"1111001" : "0",
"1111010" : "0",
"1111011" : "0",
"1111100" : "0",
"1111101" : "0",
"1111110" : "0",
"1111111" : "0",
}



interface IHexagons {
  isMouseDown? : boolean,
  numrows: number;
  numcols: number;
}

  
export const Hexagons = ({isMouseDown, numrows, numcols}:IHexagons) => {
  
  // const numrows = 20;
  // const numcols = 20;
  const [numhex, setNumHex]  = useState(numcols * numrows);

  const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
  const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));
  const [allCells, setAllCells] = useState([...Array(numhex)].map((_,i) => i));


  // maybe rename activeCells - these are the cells to iterate over, a list that is supposed to grow and shrink...currently not shrinking
  const [activeCells, setActiveCells] = useState<number[]>([]);
  const [shouldIterate, setShouldIterate] = useState(false);

  const updateColor = (id:number, newcolor:string) => {
    const r = backgroundColor;
    r[id] = newcolor;
    setBackgroundColor([...r]); 
    const q = isActive;
    q[id] = r[id] === 'white' ? true : false;
    setActive([...q]);


    const cells: Array<number> = [];
    q.map((val,i) => {
       if(val){
        cells.push(i);
      }
      }
    );
  setActiveCells(cells);
    // console.log(id,activeCells );

    // if(q[id] && !activeCells.includes(id)) { // if q is true, add this cell to the list
    //   console.log('add');
    //   setActiveCells([...activeCells, id]);
    // }
    // else if(!q[id] && activeCells.includes(id)) {
    //   console.log('remove');
    //   setActiveCells(activeCells.filter(i => i !== id));
    // }

    // console.log(newcolor, id, activeCells);
    
  }
  
  const resetAll = () => {
    const r = Array(numhex).fill('black');
    setBackgroundColor({...r});
    const q = Array(numhex).fill(false);
    setActive({...q});
    setActiveCells([]);
  }

  useEffect(() => {
    setNumHex(numcols*numrows);
    setAllCells([...Array(numcols*numrows)].map((_,i) => i));
    console.log(numrows,numcols,numhex);
  },[numcols,numrows, numhex, setNumHex, setAllCells, ])
  

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


  // or you don't need to pass row,col? just figure it out by the number in activeCell? just even or odd
  useEffect(() => {
    if(shouldIterate){
    const interval = setInterval(() => {

      let nextActiveCells: Array<number> = [];
      let nextDeadCells: Array<number> = [];
      allCells.map((i) => {
        const shifts = [-2] // format: up, ur, dr, dn, dl, dr, needs to communicate properly with format of rule
        // is this fixed with recognizing it as a symmetry? many formats are possible
        // can format be learned with a different program? some use of logic and statistics (if data can be got)
        if( i % 2 === 0 ) { // even
          // u-r : -1
          // u-l : -21
          // d-l : -19
          // d-r : +1
          shifts.push(-1, 1, 2, -numrows+1, -numrows-1);
        }
        else { // odd
          // u-r : +19
          // u-l : -1
          // d-l : +1
          // d-r : +21
          shifts.push(numrows-1, numrows+1, 2, 1, -1);
        }
        // check if shifts are positive and smaller than max

        // let stayAlive = 0;
        let neighbors = isActive[i] ? '1' : '0';

        shifts.map((s,index) => {
          const a = s + i;
          if(isActive[a]){
            // stayAlive += 2**(index);
            neighbors += '1';
          }
          else{
            neighbors += '0';
          }
        })
          const stayAlive = rules[neighbors as keyof typeof rules] === '1' ? true : false
          // console.log(neighbors, stayAlive, i);
          if(stayAlive){
            nextActiveCells.push(i);
          }
          else{
            nextDeadCells.push(i);
          }

          


      })

        // console.log(nextDeadCells)
        // console.log(nextActiveCells)

      nextActiveCells.map((i) => {
          if(i > 0){
          updateColor(i,'white');
            }
      })
      nextDeadCells.map((i) => {
          if(i > 0){
          updateColor(i,'black');
            }
      })

        // nextActiveCells=[];
        // nextDeadCells=[];

      // console.log(activeCells);
        
        
    },updateInterval);
    return () => clearInterval(interval);
    }
  },[shouldIterate, setAllCells])
  

  return(
      <Grid>
        {[...Array(numrows)].map((x, i) =>
          [...Array(numcols)].map((y, j) => 
          <Hexagon key={i*numcols+j} 
            isactive={isActive[i*numcols+j]}
            background={backgroundColor[i*numcols+j]}
            style={{left:100+i*Math.ceil(hexsize/Math.sqrt(2))*2  + Math.ceil(hexsize/Math.sqrt(2)) * (j%2), top:100 + hexsize/2*(j+1)}}
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
            {/*i*numcols+j}<br/>{j % 2 === 0 ? 'e' : 'o'*/}
          </Hexagon>
  
      ))}
      <ResetButton onClick={resetAll}/>
      <StartButton isIterating={shouldIterate} onClick={() => setShouldIterate(!shouldIterate)}/>
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
const StartButton = styled.div<{isIterating: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: ${p => p.isIterating ? 'rgb(0,150,0)' : 'rgb(150,50,0)'};
  transition: background 0.1s;
  position: absolute;
  left: 60%;
  top: 1%;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(0,180,0)' : 'rgb(180,80,0)'};
  }  

  &:active{
    ${p => p.isIterating ? 'rgb(0,220,0)' : 'rgb(220,110,0)'};
  }  


`
