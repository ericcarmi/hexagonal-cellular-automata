import styled from 'styled-components';
import './App.css';
import {useState, useEffect} from 'react';
import {Hexagons} from './Hexagon';



function App() {
  const [isMouseDown, setMouseDown] = useState(false);
  const [numRows, setNumRows] = useState(100);
  const [numCols, setNumCols] = useState(60);
  const hexsize = 15;
  const updateInterval = 10;

  return (
    <div className="App" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
      <header className="App-header">
    <Hexagons hexsize={hexsize} updateInterval={updateInterval} isMouseDown={isMouseDown} numrows={numRows} numcols={numCols}/>
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
     </header>

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


export default App;
