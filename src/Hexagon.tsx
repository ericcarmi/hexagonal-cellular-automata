import styled from 'styled-components';
import {useState, useEffect} from 'react';
import * as dragons from "./polygons";

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
// why are new shifts weird...annoying, jumps around, probably cuz of the grid layout? idk
        // 0,0,0,0,0,0 ->  
/*
 0010000 -> dl when 653
*/
const rules = 
{
"0000000" : "0" ,"0000001" : "1" ,"0000010"  : "1" ,"0000011" : "0" ,"0000100" : "1" ,"0000101" : "0" ,"0000110" : "0" ,"0000111" : "0" ,
"0001000" : "1" ,"0001001" : "0" ,"0001010"  : "0" ,"0001011" : "0" ,"0001100" : "0" ,"0001101" : "0" ,"0001110" : "0" ,"0001111" : "0" ,
"0010000" : "1" ,"0010001" : "0" ,"0010010"  : "0" ,"0010011" : "0" ,"0010100" : "0" ,"0010101" : "0" ,"0010110" : "0" ,"0010111" : "0" ,
"0011000" : "0" ,"0011001" : "0" ,"0011010"  : "0" ,"0011011" : "0" ,"0011100" : "0" ,"0011101" : "0" ,"0011110" : "0" ,"0011111" : "0" ,
"0100000" : "1" ,"0100001" : "0" ,"0100010"  : "0" ,"0100011" : "0" ,"0100100" : "0" ,"0100101" : "0" ,"0100110" : "0" ,"0100111" : "0" ,
"0101000" : "0" ,"0101001" : "0" ,"0101010"  : "0" ,"0101011" : "0" ,"0101100" : "0" ,"0101101" : "0" ,"0101110" : "0" ,"0101111" : "0" ,
"0110000" : "0" ,"0110001" : "0" ,"0110010"  : "0" ,"0110011" : "0" ,"0110100" : "0" ,"0110101" : "0" ,"0110110" : "0" ,"0110111" : "0" ,
"0111000" : "0" ,"0111001" : "0" ,"0111010"  : "0" ,"0111011" : "0" ,"0111100" : "0" ,"0111101" : "0" ,"0111110" : "0" ,"0111111" : "0" ,
"1000000" : "1" ,"1000001" : "0" ,"1000010"  : "0" ,"1000011" : "0" ,"1000100" : "0" ,"1000101" : "0" ,"1000110" : "0" ,"1000111" : "0" ,
"1001000" : "0" ,"1001001" : "0" ,"1001010"  : "0" ,"1001011" : "0" ,"1001100" : "0" ,"1001101" : "0" ,"1001110" : "0" ,"1001111" : "0" ,
"1010000" : "0" ,"1010001" : "0" ,"1010010"  : "0" ,"1010011" : "0" ,"1010100" : "0" ,"1010101" : "0" ,"1010110" : "0" ,"1010111" : "0" ,
"1011000" : "0" ,"1011001" : "0" ,"1011010"  : "0" ,"1011011" : "0" ,"1011100" : "0" ,"1011101" : "0" ,"1011110" : "0" ,"1011111" : "0" ,
"1100000" : "0" ,"1100001" : "0" ,"1100010"  : "0" ,"1100011" : "0" ,"1100100" : "0" ,"1100101" : "0" ,"1100110" : "0" ,"1100111" : "0" ,
"1101000" : "0" ,"1101001" : "0" ,"1101010"  : "0" ,"1101011" : "0" ,"1101100" : "0" ,"1101101" : "0" ,"1101110" : "0" ,"1101111" : "0" ,
"1110000" : "0" ,"1110001" : "0" ,"1110010"  : "0" ,"1110011" : "0" ,"1110100" : "0" ,"1110101" : "0" ,"1110110" : "0" ,"1110111" : "0" ,
"1111000" : "0" ,"1111001" : "0" ,"1111010"  : "0" ,"1111011" : "0" ,"1111100" : "0" ,"1111101" : "0" ,"1111110" : "0" ,"1111111" : "0" ,
}



interface IHexagons {
  isMouseDown? : boolean,
  numrows: number;
  numcols: number;
  hexsize: number;
  updateInterval: number;
}






export const Hexagons = ({isMouseDown, numrows, numcols, updateInterval, hexsize}:IHexagons) => {
  
  // const numrows = 20;
  // const numcols = 20;
  const [numhex, setNumHex]  = useState(numcols * numrows);

  const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
  const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));
  const [allCells, setAllCells] = useState([...Array(numhex)].map((_,i) => i));
  const [boundaryCells, setBoundaryCells] = useState(Array(0));
  const [interiorCells, setInteriorCells] = useState(Array(0));
  const [shouldIterate, setShouldIterate] = useState(false);
  const [shouldInit, setShouldInit] = useState(true);

  // rename to updateCell
  const updateColor = (id:number, newcolor:string) => {
    const r = backgroundColor;
    r[id] = newcolor;
    setBackgroundColor([...r]); 
    const q = isActive;
    q[id] = r[id] === 'white' ? true : false;
    setActive([...q]);
    // setActive(prev => [...prev.filter(i => i === q[id])]); // not workin, could be faster? idk
   
  }
  const updateAll = (active: Array<number>, dead: Array<number>) => {
    const q = isActive;
    const r = backgroundColor;
    active.map(i => {
      if(i > 0)
        q[i] = true;
        r[i] = 'white';
    });
    dead.map(i => {
      if(i > 0)
        q[i] = false;
        r[i] = 'black';
    });
    setBackgroundColor([...r]); 
    setActive([...q]);
   
  }

  const updateBoundary = (shift: boolean) => {
    const q = isActive;
    const r = backgroundColor;

    if(shift) {
      if(q[0] === false){
        boundaryCells.map(i => {
            q[i] = true;
            r[i] = 'white';
        })
      }
      else{
        boundaryCells.map(i => {
            q[i] = false;
            r[i] = 'black';
        })
      
      }
    }
    else{
        interiorCells.map(i => {
            q[i] = true;
            r[i] = 'white';
        })
    }
    setBackgroundColor([...r]); 
    setActive([...q]);

    
  };
  
  const resetAll = () => {
    const r = Array(numhex).fill('black');
    setBackgroundColor([...r]);
    const q = Array(numhex).fill(false);
    setActive([...q]);
  }


  function initCells() {
      setNumHex(numcols*numrows);
      setAllCells([...Array(numcols*numrows)].map((_,i) => i));
      // console.log(numrows,numcols,numhex);
  
      let b = [];
      for(let i = 0; i < numrows; i++){
        b.push(i * numrows);
        b.push(numrows - 2 + i * numrows+1);
      }
      for(let i = 0; i < Math.round(numcols/2); i++){
        b.push(i * 2);
        b.push(i * 2 + 1);
        b.push(i * 2 + numrows * numcols - numrows + 1);
        b.push(i * 2 + numrows * numcols - numrows);
      }

      setBoundaryCells(b);
      // console.log(boundaryCells, interiorCells);
    

      setInteriorCells(allCells.filter(i => !boundaryCells.includes(i)));
      // console.log(boundaryCells, interiorCells);

  
  };

  useEffect(() => {
    
    if(shouldInit){
      initCells();
      setShouldInit(false);
    }
  },[setShouldInit, shouldInit])


  const update = () => {
      let nextActiveCells: Array<number> = [];
      let nextDeadCells: Array<number> = [];
      interiorCells.map((i) => {
        // const shifts = [-2] // format: up, ur, dr, dn, dl, dr, needs to communicate properly with format of rule
        // is this fixed with recognizing it as a symmetry? many formats are possible
        // can format be learned with a different program? some use of logic and statistics (if data can be got)
        // now doing the correct format of regular hexagon...
      const shifts = [-1]
      const x = Math.floor(i/2)%numrows;
        if(x < (numrows/2)) { // even (0)
          // it always uses numrows even when numrows != numcols
          // shifts.push(-1, 1, 2, -numrows+1, -numrows-1);
          shifts.push(numrows-1,numrows, 1, -numrows, -numrows-1);
        }
        else { // odd (1) ...it's different now with regular tiling, this is the condition for second half of the rows
          // shifts.push(numrows-1, numrows+1, 2, 1, -1);
          shifts.push(numrows,numrows+1, 1, -numrows+1, -numrows);
        }
        // console.log(shifts.map((k) => i + k));
      // console.log(i,Math.floor(i/2)%numrows);

        let neighbors = isActive[i] ? '1' : '0';

        shifts.map((s,index) => {
          const a = s + i;
          if(a>0) {
          if(isActive[a]){
            neighbors += '1';
          }
          else{
            neighbors += '0';
          }
        }
        })
          const stayAlive = rules[neighbors as keyof typeof rules] === '1' ? true : false
          if(stayAlive){
            nextActiveCells.push(i);
          }
          else{
            nextDeadCells.push(i);
          }

      })

      // rule to always set boundary to dead? should call a function on both, or fxn pointer since there will be multiple
    //   boundaryCells.map((i) => {
    //   nextDeadCells.push(i);
    // })
    // still able to propagate away from boundary or reflect

      updateAll(nextActiveCells,nextDeadCells);


      // console.log(activeCells);
    // console.log('completed update function')
  }        

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let x = numcols*numrows/2 + numrows - 2;
  //     updateColor(x, 'white');
  //   },updateInterval);
  //   return () => clearInterval(interval);
  // },[updateColor,])

  // or you don't need to pass row,col? just figure it out by the number in activeCell? just even or odd
  useEffect(() => {
    if(shouldIterate){
    const interval = setInterval(() => {
      update();
        
    },updateInterval);
    return () => clearInterval(interval);
    }
  },[shouldIterate, resetAll])
  

  // when setting left position, use ceil() to create tiny border around hexagons, round/floor to have no border
  return(
      <Grid>
        {[...Array(numcols)].map((x, i) =>
          [...Array(numrows)].map((y, j) => 
          <Hexagon key={i*numrows+j} 
            hexsize={hexsize}
            isactive={isActive[i*numrows+j]}
            // background={backgroundColor[i*numcols+j]}
            style={{background:backgroundColor[i*numrows+j], 
                    left:100+i*hexsize*3/4  + (hexsize/2) * i%2, 
                    top:150 + hexsize/2/Math.sqrt(3)*(i%2) + hexsize/Math.sqrt(3) * ((j))
                  }}
            onMouseDown={(e) => {
                  if(e.shiftKey){
                      updateColor(i*numrows+j, 'black');
                    }
                    else {
                      updateColor(i*numrows+j, 'white');
                    }
                  } }
            onMouseEnter={(e) => { 
                  if(isMouseDown){
                    if(e.shiftKey){
                      updateColor(i*numrows+j, 'black');
              
                    }
                    else {
                      updateColor(i*numrows+j, 'white');
                    }
                  }
            }}

          >
            {((i*numrows+j))}<br/>{}{Math.floor((i*numrows+j)/2) % numrows < (numrows/2) ? '0' : '1'}
          </Hexagon>
  
      ))}
      <ResetButton onClick={resetAll}/>
      <StartButton isIterating={shouldIterate} onClick={() => setShouldIterate(!shouldIterate)}/>
      <NextButton onClick={() => update()} isIterating={shouldIterate} />
      <BoundaryButton onClick={(e) => updateBoundary(e.shiftKey ? false : true)} isIterating={shouldIterate} />
      </Grid>
  );
}



const Hexagon = styled.div.attrs((props : {hexsize: number, top : number, left : number, background : string, mousedown : boolean, isactive : boolean}) => props)`
  position: absolute;
  width: ${props => props.hexsize}px;
  background: ${props => props.background};
  height: ${props => props.hexsize/Math.sqrt(3)}px;
  font-size:${props => props.hexsize/4}px;
  border: none;
  outline: none;
  color: ${props => props.isactive ? 'black' : 'white'};
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  // transform: rotateZ(0deg);
  user-select: none;
transition: background 0.5s;
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
    background: ${p => p.isIterating ? 'rgb(0,220,0)' : 'rgb(220,110,0)'};
  }  


`
const NextButton = styled.div<{isIterating: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: ${p => p.isIterating ? 'rgb(150,0,150)' : 'rgb(150,0,150)'};
  transition: background 0.1s;
  position: absolute;
  left: 65%;
  top: 1%;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(190,0,190)' : 'rgb(190,0,190)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(220,0,220)' : 'rgb(220,0,220)'};
  }  


`
const BoundaryButton = styled.div<{isIterating: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: ${p => p.isIterating ? 'rgb(0,0,150)' : 'rgb(0,0,150)'};
  transition: background 0.1s;
  position: absolute;
  left: 75%;
  top: 1%;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(0,0,180)' : 'rgb(0,0,180)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(0,0,220)' : 'rgb(0,0,220)'};
  }  


`


const Dragon = styled.div.attrs((props : {hexsize: number, top : number, left : number, background : string, mousedown : boolean, isactive : boolean}) => props)`


  position: absolute;
  width: ${props => props.hexsize}px;
  background: ${props => props.background};
  height: ${props => props.hexsize}px;
  font-size:8px;
  border: none;
  outline: none;
  color: ${props => props.isactive ? 'black' : 'white'};
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  // transform: rotateZ(0deg);
  user-select: none;
  transition: background 0.5s;
  justify-content: center;
  align-content: center;
  vertical-align: middle;


  user-select: none;
  cursor: pointer;
  clip-path:${dragons.dragon_polygon};
    
  transition: transform 0.5s, filter 0.4s;
  // transform: rotateX(60deg) rotateZ(-45deg);  
 

  &:hover {
    filter: hue-rotate(90deg);
    // transform: rotate3d(360, 120, -90, 60deg) rotateZ(-45deg) translateZ(10px);
    
  }
  // filter: hue-rotate will change the background color, but setting it won't...because of style={} in the wrapper? then positions don't get set
  &:active {
    filter: hue-rotate(-90deg);
  }
    
`;

