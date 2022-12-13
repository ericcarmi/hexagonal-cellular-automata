import styled from 'styled-components';
import './App.css';
import {useState, useEffect} from 'react';
import {Hexagons} from './Hexagon';
import {rules, Rules} from './rules';


function App() {
  const [isMouseDown, setMouseDown] = useState(false);
  const [numRows, setNumRows] = useState(40);
  const [numCols, setNumCols] = useState(80);
  const hexsize = 2**5;
  const updateInterval = 100;


  // const numrows = 20;
  // const numcols = 20;
  const [numhex, setNumHex]  = useState(numCols * numRows);

  const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
  const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));
  const [allCells, setAllCells] = useState([...Array(numhex)].map((_,i) => i));
  const [boundaryCells, setBoundaryCells] = useState(Array(0));
  const [interiorCells, setInteriorCells] = useState(Array(0));
  const [shouldIterate, setShouldIterate] = useState(false);
  const [shouldInit, setShouldInit] = useState(true);

  // rename to updateCell
  const updateColor = (id:number, newcolor:string) => {
    // const r = backgroundColor;
    // r[id] = newcolor;
    // setBackgroundColor([...r]); 
    // setBackgroundColor(prev => prev.map((item, index) => index === id ? newcolor : item))
    // const q = isActive;
    // q[id] = r[id] === 'white' ? true : false;
    const b = newcolor === 'white' ? true : false;
    setActive(prev => prev.map((item, index) => index === id ? b : item));
   
  }

  // don't store two arrays, get rid of background color
  const updateAll = (active: Array<number>, dead: Array<number>) => {
    const q = isActive;
    // const r = backgroundColor;
    active.map(i => {
      if(i > 0)
        q[i] = true;
        // r[i] = 'white';
    });
    dead.map(i => {
      if(i > 0)
        q[i] = false;
        // r[i] = 'black';
    });
    // setBackgroundColor([...r]); 
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
      setNumHex(numCols*numRows);
      setAllCells([...Array(numCols*numRows)].map((_,i) => i));
      // console.log(numrows,numcols,numhex);
  
      let b = [];
      for(let i = 0; i < numCols; i++){
        b.push(i * numRows);
        b.push(numRows - 2 + i * numRows+1);
      }
      for(let i = 0; i < Math.round(numRows/2); i++){
        b.push(i * 2);
        b.push(i * 2 + 1);
        b.push(i * 2 + numRows * numCols - numRows + 1);
        b.push(i * 2 + numRows * numCols - numRows);
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
      const x = Math.floor(i/2)%numRows;
        if(x < (numRows/2)) { // even (0)
          // it always uses numrows even when numrows != numcols
          // shifts.push(-1, 1, 2, -numrows+1, -numrows-1); // same width and height
          // shifts.push(numRows-1,numRows, 1, -numRows, -numRows-1); // regular hexagon
          shifts.push(numRows-1,numRows, 1, -numRows+1, -numRows); // dragon  rectangular tiling
        
        }
        else { // odd (1) ...it's different now with regular tiling, this is the condition for second half of the rows
          // shifts.push(numRows-1, numRows+1, 2, 1, -1); //same width and height
          // shifts.push(numRows,numRows+1, 1, -numRows+1, -numRows); // regular hexagon
          shifts.push(numRows-1,numRows, 1, -numRows+1, -numRows); // dragon rect tiling
        }
        // console.log(shifts.map((k) => i + k));
      // console.log(i,Math.floor(i/2)%numRows);

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
      boundaryCells.map((i) => {
      nextDeadCells.push(i);
    })
    // still able to propagate away from boundary or reflect

      updateAll(nextActiveCells,nextDeadCells);


      // console.log(activeCells);
    // console.log('completed update function')
  }        

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let x = numCols*numRows/2 - 1 - numRows;
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



  return (
    <div className="App" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
    <Hexagons hexsize={hexsize} isMouseDown={isMouseDown} numRows={numRows} numCols={numCols}
        isActive={isActive}
        backgroundColor={backgroundColor}
        updateColor={updateColor}
        />
      <RowsInput
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if(e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))){
              setNumCols(Number(e.currentTarget.value));
              setNumRows(Number(e.currentTarget.value));
            }
          }}
          />
    <Rows> rows </Rows>
      <ColsInput
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if(e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))){
              setNumCols(Number(e.currentTarget.value));
              setNumRows(Number(e.currentTarget.value));
            }
          }}
          />
    <Cols> cols </Cols>
      <IntervalInput/>
    <Interval onChange = {event => console.log(event.target)}> interval </Interval>

      <ResetButton onClick={resetAll}/>
      <StartButton isIterating={shouldIterate} onClick={() => setShouldIterate(!shouldIterate)}/>
      <NextButton onClick={() => update()} isIterating={shouldIterate} />
      <BoundaryButton onClick={(e) => updateBoundary(e.shiftKey ? false : true)} isIterating={shouldIterate} />
      <Rules/>

    </div>
  );
}


// number of rows
const RowsInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 10px;
  background: black;
  color: white;
`
const Rows = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 0px;
  color: white;
`

// number of columns
const ColsInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 50px;
  background: black;
  color: white;
`

const Cols = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 40px;
  color: white;
`

// update interal
const IntervalInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 90px;
  background: black;
  color: white;
`
const Interval = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 220px;
  top: 80px;
  color: white;
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

export default App;
