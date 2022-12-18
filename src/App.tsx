import styled from 'styled-components';
import './App.css';
import { useState, useEffect } from 'react';
import { Hexagons } from './Hexagon';
import { Rules } from './rules';


function App() {
  const [isMouseDown, setMouseDown] = useState(false);
  const [numRows, setNumRows] = useState(40);
  const [numCols, setNumCols] = useState(60);
  const [updateInterval, setUpdateInterval] = useState(100);
  const hexsize = 2 ** 5;


  const [rules, setRules] = useState(
    {
      "0000000": "0", "0000001": "1", "0000010": "1", "0000011": "0", "0000100": "1", "0000101": "0", "0000110": "0", "0000111": "0",
      "0001000": "1", "0001001": "0", "0001010": "0", "0001011": "0", "0001100": "0", "0001101": "0", "0001110": "0", "0001111": "0",
      "0010000": "1", "0010001": "0", "0010010": "0", "0010011": "0", "0010100": "0", "0010101": "0", "0010110": "0", "0010111": "0",
      "0011000": "0", "0011001": "0", "0011010": "0", "0011011": "0", "0011100": "0", "0011101": "0", "0011110": "0", "0011111": "0",
      "0100000": "1", "0100001": "0", "0100010": "0", "0100011": "0", "0100100": "0", "0100101": "0", "0100110": "0", "0100111": "0",
      "0101000": "0", "0101001": "0", "0101010": "0", "0101011": "0", "0101100": "0", "0101101": "0", "0101110": "0", "0101111": "0",
      "0110000": "0", "0110001": "0", "0110010": "0", "0110011": "0", "0110100": "0", "0110101": "0", "0110110": "0", "0110111": "0",
      "0111000": "0", "0111001": "0", "0111010": "0", "0111011": "0", "0111100": "0", "0111101": "0", "0111110": "0", "0111111": "0",
      "1000000": "1", "1000001": "0", "1000010": "0", "1000011": "0", "1000100": "0", "1000101": "0", "1000110": "0", "1000111": "0",
      "1001000": "0", "1001001": "0", "1001010": "0", "1001011": "0", "1001100": "0", "1001101": "0", "1001110": "0", "1001111": "0",
      "1010000": "0", "1010001": "0", "1010010": "0", "1010011": "0", "1010100": "0", "1010101": "0", "1010110": "0", "1010111": "0",
      "1011000": "0", "1011001": "0", "1011010": "0", "1011011": "0", "1011100": "0", "1011101": "0", "1011110": "0", "1011111": "0",
      "1100000": "0", "1100001": "0", "1100010": "0", "1100011": "0", "1100100": "0", "1100101": "0", "1100110": "0", "1100111": "0",
      "1101000": "0", "1101001": "0", "1101010": "0", "1101011": "0", "1101100": "0", "1101101": "0", "1101110": "0", "1101111": "0",
      "1110000": "0", "1110001": "0", "1110010": "0", "1110011": "0", "1110100": "0", "1110101": "0", "1110110": "0", "1110111": "0",
      "1111000": "0", "1111001": "0", "1111010": "0", "1111011": "0", "1111100": "0", "1111101": "0", "1111110": "0", "1111111": "0",
    });


  // const numrows = 20;
  // const numcols = 20;
  const [numhex, setNumHex] = useState(numCols * numRows);

  const [backgroundColor, setBackgroundColor] = useState<string[]>(Array(numhex).fill('black'));
  const [isActive, setActive] = useState<boolean[]>(Array(numhex).fill(false));
  const [allCells, setAllCells] = useState([...Array(numhex)].map((_, i) => i));
  const [boundaryCells, setBoundaryCells] = useState(Array(0));
  const [interiorCells, setInteriorCells] = useState(Array(0));
  const [shouldIterate, setShouldIterate] = useState(false);
  const [shouldInit, setShouldInit] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [isHexagonNotDragon, setIsHexagonNotDragon] = useState(true);

  // rename to updateCell
  const updateColor = (id: number, newcolor: string) => {
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
      if (i > 0)
        q[i] = true;
      // r[i] = 'white';
    });
    dead.map(i => {
      if (i > 0)
        q[i] = false;
      // r[i] = 'black';
    });
    // setBackgroundColor([...r]); 
    setActive([...q]);



  }

  const updateBoundary = (shift: boolean) => {
    const q = isActive;
    const r = backgroundColor;

    if (shift) {
      if (q[0] === false) {
        boundaryCells.map(i => {
          q[i] = true;
          r[i] = 'white';
        })
      }
      else {
        boundaryCells.map(i => {
          q[i] = false;
          r[i] = 'black';
        })

      }
    }
    else {
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
    setNumHex(numCols * numRows);
    setAllCells([...Array(numCols * numRows)].map((_, i) => i));
    // console.log(numrows,numcols,numhex);

    let b = [];
    for (let i = 0; i < numCols; i++) {
      b.push(i * numRows);
      b.push(numRows - 2 + i * numRows + 1);
    }
    for (let i = 0; i < Math.round(numRows / 2); i++) {
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

    if (shouldInit) {
      initCells();
      setShouldInit(false);
    }
  }, [setShouldInit, shouldInit])


  const update = () => {
    let nextActiveCells: Array<number> = [];
    let nextDeadCells: Array<number> = [];
    interiorCells.map((i) => {
      // const shifts = [-2] // format: up, ur, dr, dn, dl, dr, needs to communicate properly with format of rule
      // is this fixed with recognizing it as a symmetry? many formats are possible
      // can format be learned with a different program? some use of logic and statistics (if data can be got)
      // now doing the correct format of regular hexagon...
      const shifts = [-1]
      const x = Math.floor(i / 2) % numRows;
      if (x < (numRows / 2)) { // even (0)
        // it always uses numrows even when numrows != numcols
        // shifts.push(-1, 1, 2, -numrows+1, -numrows-1); // same width and height
        if (isHexagonNotDragon)
          shifts.push(numRows - 1, numRows, 1, -numRows, -numRows - 1); // regular hexagon
        else
          shifts.push(numRows - 1, numRows, 1, -numRows + 1, -numRows); // dragon  rectangular tiling

      }
      else { // odd (1) ...it's different now with regular tiling, this is the condition for second half of the rows
        // shifts.push(numRows-1, numRows+1, 2, 1, -1); //same width and height
        if (isHexagonNotDragon)
          shifts.push(numRows, numRows + 1, 1, -numRows + 1, -numRows); // regular hexagon
        else
          shifts.push(numRows - 1, numRows, 1, -numRows + 1, -numRows); // dragon rect tiling
      }
      // console.log(shifts.map((k) => i + k));
      // console.log(i,Math.floor(i/2)%numRows);

      let neighbors = isActive[i] ? '1' : '0';

      shifts.map((s, index) => {
        const a = s + i;
        if (a > 0) {
          if (isActive[a]) {
            neighbors += '1';
          }
          else {
            neighbors += '0';
          }
        }
      })
      const stayAlive = rules[neighbors as keyof typeof rules] === '1' ? true : false
      if (stayAlive) {
        nextActiveCells.push(i);
      }
      else {
        nextDeadCells.push(i);
      }

    })

    // rule to always set boundary to dead? should call a function on both, or fxn pointer since there will be multiple
    boundaryCells.map((i) => {
      nextDeadCells.push(i);
    })
    // still able to propagate away from boundary or reflect

    updateAll(nextActiveCells, nextDeadCells);


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
    if (shouldIterate) {
      const interval = setInterval(() => {
        update();

      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [shouldIterate, resetAll])

  useEffect(() => {
    // not handling pressing and holding yet...no it does, but it isn't a smooth update
    function handleKeyDown(e: any) {
      const k = e.key?.toLowerCase();
      switch (k) {
        case 'n': update(); break;
        case 'p': setShouldIterate((prev) => !prev); break;
        case 'b': updateBoundary(true); break;
        case 'i': updateBoundary(false); break;
        case 'r': setShowRules(prev => !prev); break;
        case 'c': e.shiftKey && resetAll(); break;
        default: break;
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [update]);



  return (
    <div className="App" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}
    >
      <Hexagons isHexagons={isHexagonNotDragon} hexsize={hexsize} isMouseDown={isMouseDown} numRows={numRows} numCols={numCols}
        isActive={isActive}
        backgroundColor={backgroundColor}
        updateColor={updateColor}
      />
      <Header isExpanded={false}>
        <RowsInput
          placeholder={numRows.toString()}
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))) {
              setNumCols(Number(e.currentTarget.value));
              setNumRows(Number(e.currentTarget.value));
            }
          }}
        />
        <Rows> rows </Rows>
        <ColsInput
          placeholder={numCols.toString()}
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))) {
              setNumCols(Number(e.currentTarget.value));
              setNumRows(Number(e.currentTarget.value));
            }
          }}
        />
        <Cols> cols </Cols>
        <IntervalInput
          placeholder={updateInterval.toString()}
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))) {
              if (Number(e.currentTarget.value) >= 10 && Number(e.currentTarget.value) <= 2000)
                setUpdateInterval(Number(e.currentTarget.value));
            }
          }}
        />
        <Interval> speed </Interval>

        <StartButton isIterating={shouldIterate} onClick={() => setShouldIterate(!shouldIterate)}>{shouldIterate ? 'pause' : 'start'}</StartButton>
        <NextButton onClick={() => update()} isIterating={shouldIterate}>next</NextButton>
        <ResetButton onClick={resetAll}>reset</ResetButton>
        <BoundaryButton onClick={(e) => updateBoundary(e.shiftKey ? false : true)} isIterating={shouldIterate}>border</BoundaryButton>
        <Button style={{left: 440}} onClick={() => setIsHexagonNotDragon((prev) => !prev)} isIterating={false}>{isHexagonNotDragon ? 'hexagons' : 'dragons'}</Button>
        <ShowRulesButton onClick={() => setShowRules((prev) => !prev)}>rules</ShowRulesButton>
      </Header>
      <div style={{ zIndex: showRules ? 1 : -1, width: '100%', height: '95%', top: '5%', background: 'gray', position: 'absolute' }}>
        <Rules rules={rules} setRules={setRules} />
      </div>

    </div>
  );
}


const ShowRulesButton = styled.div<{}>`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: rgb(100,0,100);
  transition: background 0.1s;
  position: absolute;
  left: 90%;
  top: 1%;
  cursor: pointer;

`;

const Header = styled.div<{ isExpanded: boolean }>`
  position: absolute;
  width: 100%;
  height: 30px;
  background: rgb(30,30,20);
`;

// number of rows
const RowsInput = styled.input`
  position: absolute;
  width: 30px;
  height: 20px;
  left: 35%;
  top: 5%;
  background: black;
  color: white;
`
const Rows = styled.div`
  position: absolute;
  width: max-content;
  height: 20px;
  left: calc(35% - 35px);
  top: 5%;
  color: white;
`

// number of columns
const ColsInput = styled.input`
  position: absolute;
  width: 30px;
  height: 20px;
  left: 40%;
  top: 5%;
  background: black;
  color: white;
`

const Cols = styled.div`
  position: absolute;
  width: max-content;
  height: 20px;
  left: calc(40% - 35px);
  top: 5%;
  color: white;
`

// update interal
const IntervalInput = styled.input`
  position: absolute;
  width: 30px;
  height: 20px;
  left: 45%;
  top: 5%;
  background: black;
  color: white;
`
const Interval = styled.div`
  position: absolute;
  width: max-content;
  height: 20px;
  left: calc(45% - 45px);
  top: 5%;
  color: white;
`


const StartButton = styled.div<{ isIterating: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: ${p => p.isIterating ? 'rgb(0,150,0)' : 'rgb(150,50,0)'};
  transition: background 0.1s;
  position: absolute;
  left: 0px;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(0,180,0)' : 'rgb(180,80,0)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(0,220,0)' : 'rgb(220,110,0)'};
  }  


`
const NextButton = styled.div<{ isIterating: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: ${p => p.isIterating ? 'rgb(150,0,150)' : 'rgb(150,0,150)'};
  transition: background 0.1s;
  position: absolute;
  left: 110px;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(190,0,190)' : 'rgb(190,0,190)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(220,0,220)' : 'rgb(220,0,220)'};
  }  


`

const ResetButton = styled.div`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: rgb(150,0,0);
  transition: background 0.1s;
  position: absolute;
  left: 220px;
  cursor: pointer;
  &:hover{
    background: rgb(225,0,0);
  }  
  &:active{
    background: rgb(255,0,0);
  }  


`

const BoundaryButton = styled.div<{ isIterating: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: ${p => p.isIterating ? 'rgb(0,0,150)' : 'rgb(0,0,150)'};
  transition: background 0.1s;
  position: absolute;
  left: 330px;
  cursor: pointer;

  &:hover{
    background: ${p => p.isIterating ? 'rgb(0,0,190)' : 'rgb(0,0,190)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(0,0,220)' : 'rgb(0,0,220)'};
  }  

`

const Button = styled.div<{ isIterating: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 20px;
  vertical-align: middle;
  line-height: 1.5em;
  background: ${p => p.isIterating ? 'rgb(0,0,150)' : 'rgb(0,0,150)'};
  transition: background 0.1s;
  position: absolute;
  left: 330px;
  cursor: pointer;
  color: rgb(202,202,202);

  &:hover{
    background: ${p => p.isIterating ? 'rgb(0,0,190)' : 'rgb(0,0,190)'};
  }  

  &:active{
    background: ${p => p.isIterating ? 'rgb(0,0,220)' : 'rgb(0,0,220)'};
  }  

`;

export default App;
