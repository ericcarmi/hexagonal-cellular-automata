import styled from 'styled-components';
import './App.css';
import {useState, useEffect} from 'react';
import {Hexagons} from './Hexagon';

const hexsize = 100;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']




function App() {
  const [isMouseDown, setMouseDown] = useState(false);
  const [numRows, setNumRows] = useState(20);
  const [numCols, setNumCols] = useState(20);

  return (
    <div className="App" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
      <header className="App-header">
    <Hexagons isMouseDown={isMouseDown} numrows={numRows}/>
      <RulesInput 
      />
    <Rules> rules </Rules>
      <RowsInput
          onChange={(e) => e.target.value}
          onKeyDown={(e) => {
            if(e.code === 'Enter' && !isNaN(Number(e.currentTarget.value))){
              // console.log(Number(e.currentTarget.value));
              setNumRows(Number(e.currentTarget.value));
            }
          }}
          />
    <Rows> rows </Rows>
      <ColsInput/>
    <Cols> cols </Cols>
      <IntervalInput/>
    <Interval onChange = {event => console.log(event.target)}> interval </Interval>
     </header>

    </div>
  );
}

// rules are entered as a list
const RulesInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 20px;
  background: black;
  color: white;
`
const Rules = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 10px;
  color: white;
`

// number of ros
const RowsInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 60px;
  background: black;
  color: white;
`
const Rows = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 50px;
  color: white;
`

// number of columns
const ColsInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 100px;
  background: black;
  color: white;
`

const Cols = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 90px;
  color: white;
`

// update interal
const IntervalInput = styled.input`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 100px;
  top: 140px;
  background: black;
  color: white;
`
const Interval = styled.div`
  position: absolute;
  width: 100px;
  height: 20px;
  right: 200px;
  top: 130px;
  color: white;
`


export default App;
