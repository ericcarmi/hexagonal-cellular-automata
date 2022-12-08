import styled from 'styled-components';
import {useState, useEffect} from 'react';

const hexsize = 50;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']

const rules = 
{
  "000000" : "1",
  "000001" : "1",
  "000010" : "0",
  "000011" : "0",
  "000100" : "0",
  "000101" : "0",
  "000110" : "0",
  "000111" : "0",
  "001000" : "0",
  "001001" : "0",
  "001010" : "0",
  "001011" : "0",
  "001100" : "0",
  "001101" : "0",
  "001110" : "0",
  "001111" : "0",
  "010000" : "0",
  "010001" : "0",
  "010010" : "0",
  "010011" : "0",
  "010100" : "0",
  "010101" : "0",
  "010110" : "0",
  "010111" : "0",
  "011000" : "0",
  "011001" : "0",
  "011010" : "0",
  "011011" : "0",
  "011100" : "0",
  "011101" : "0",
  "011110" : "0",
  "011111" : "0",
  "100000" : "0",
  "100001" : "0",
  "100010" : "0",
  "100011" : "0",
  "100100" : "1",
  "100101" : "0",
  "100110" : "0",
  "100111" : "0",
  "101000" : "0",
  "101001" : "0",
  "101010" : "0",
  "101011" : "0",
  "101100" : "0",
  "101101" : "0",
  "101110" : "0",
  "101111" : "0",
  "110000" : "0",
  "110001" : "0",
  "110010" : "0",
  "110011" : "0",
  "110100" : "0",
  "110101" : "0",
  "110110" : "0",
  "110111" : "0",
  "111000" : "0",
  "111001" : "0",
  "111010" : "0",
  "111011" : "0",
  "111100" : "0",
  "111101" : "0",
  "111110" : "0",
  "111111" : "0",
}



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
    console.log(id,activeCells );

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
        let neighbors = '';

        shifts.map((s,index) => {
          const a = s + i;
          if(a > 0 && a < numrows*numcols && isActive[a]){
            stayAlive += 2**index;
              neighbors += '1';
          }
          else{
            neighbors += '0';
          }
          // console.log(stayAlive, neighbors);
          if(rules[neighbors as keyof typeof rules] == '0') { 
              nextDeadCells.push(a);
          }
          else {
              nextActiveCells.push(a);
          }

        })

      })
      nextActiveCells.map((i) => {
          if(i > 0)
          updateColor(i,'white');
      })
      nextDeadCells.map((i) => {
          if(i > 0)
          updateColor(i,'black');
      })

        // nextActiveCells=[];
        // nextDeadCells=[];

      // console.log(activeCells);
        
        
    },100);
    return () => clearInterval(interval);
    }
  },[activeCells, isActive, shouldIterate, updateColor])
  

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
