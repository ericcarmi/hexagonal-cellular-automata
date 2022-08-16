import styled from 'styled-components';
import './App.css';

const hexsize = 100;
const colors = ['rgba(150,0,0,0.9)','rgba(0,150,0,0.9)']

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {[...Array(20)].map((x, i) =>
          [...Array(5)].map((y,j) => 
          <Hexagon left={i*50 - (j%2) * 25} top={75*(j+1)} background={colors[j%2]}/>
    ))}
     </header>

    </div>
  );
}

const Hexagon = styled.button.attrs((props : {top : number, left : number, background : string}) => props)`
  position: absolute;
  width: ${hexsize}px;
  height: 50px;
  background: ${props => props.background};
  border: none;
  outline: none;
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
transform: rotateZ(90deg);
  &:active {
    filter: hue-rotate(30deg);
  }
`


export default App;
