import styled from 'styled-components';
import * as dragons from "./polygons";

interface IHexagons {
  isMouseDown?: boolean,
  numRows: number;
  numCols: number;
  hexsize: number;
  backgroundColor: Array<string>;
  isActive: Array<boolean>;
  updateColor: (n: number, s: string) => void;
  isHexagons: boolean;
}

export const Hexagons = ({
  isMouseDown, numRows, numCols, updateColor, hexsize, backgroundColor, isActive, isHexagons,

}: IHexagons) => {

  const columnArray = [...Array(numCols)].map((_, i) => i);
  const rowArray = [...Array(numRows)].map((_, i) => i);

  // left={20+i*hexsize/1.625}
  // top={150 +  hexsize/1.625 * j} //+ hexsize/2*(i%2)

  // console.log(hexsize);

  // when setting left position, use ceil() to create tiny border around hexagons, round/floor to have no border

  if(isHexagons){
  return (
    <Grid>
      {columnArray.map((x, i) =>
        rowArray.map((y, j) =>
          <Hexagon
            key={i * numRows + j}
            hexsize={hexsize}
            left={i*hexsize*0.75  + (hexsize/2) * i%2}
            style={{top:35 + hexsize/2/Math.sqrt(3)*(i%2) + hexsize/Math.sqrt(3) * ((j)) }}
            background={isActive[i * numRows + j] ? 'white' : 'black'}
            onMouseDown={(e) => {
              if (e.shiftKey) {
                updateColor(i * numRows + j, 'black');
              }
              else {
                updateColor(i * numRows + j, 'white');
              }
            }}
            onMouseEnter={(e) => {
              if (isMouseDown) {
                if (e.shiftKey) {
                  updateColor(i * numRows + j, 'black');
                }
                else {
                  updateColor(i * numRows + j, 'white');
                }
              }
            }}

          >
            {/*j}<br/>{}{Math.floor((i*numRows+j)/2) % numRows < (numRows/2) ? '0' : '1'*/}
          </Hexagon>

        ))}
    </Grid>
  );}

  else{
  return (
    <Grid>
      {columnArray.map((x, i) =>
        rowArray.map((y, j) =>
          <Dragon
            key={i * numRows + j}
            hexsize={hexsize}
            left={i * hexsize / 1.625}
            style={{ top: 35 + hexsize * j / 1.625 }}
            background={isActive[i * numRows + j] ? 'white' : 'black'}
            onMouseDown={(e) => {
              if (e.shiftKey) {
                updateColor(i * numRows + j, 'black');
              }
              else {
                updateColor(i * numRows + j, 'white');
              }
            }}
            onMouseEnter={(e) => {
              if (isMouseDown) {
                if (e.shiftKey) {
                  updateColor(i * numRows + j, 'black');
                }
                else {
                  updateColor(i * numRows + j, 'white');
                }
              }
            }}

          >
            {/*j}<br/>{}{Math.floor((i*numRows+j)/2) % numRows < (numRows/2) ? '0' : '1'*/}
          </Dragon>

        ))}
    </Grid>
    
  )}
}



const Hexagon = styled.div.attrs((props: { hexsize: number, top: number, left: number, background: string, mousedown: boolean, isactive: boolean }) => props)`
  position: absolute;
  width: ${props => props.hexsize}px;
  background: ${props => props.background};
  height: ${props => props.hexsize / Math.sqrt(3)}px;
  font-size:${props => props.hexsize / 4}px;
  border: none;
  outline: none;
  color: ${props => props.isactive ? 'black' : 'white'};
  top: calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);
  clip-path: polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%);
  // transform: rotateZ(0deg);
  user-select: none;
  transition: background 0s, top 0.3s, left 0.3s;
transition-delay: left 0.3s, top 0.3s;
  justify-content: center;
  align-content: center;
  vertical-align: middle;
  // line-height: 50px;
`

const HexagonBorder = styled.div.attrs((props: { top: number, left: number, background: string, mousedown: boolean, isactive: boolean }) => props)`
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
  background: rgb(80,80,80);
  width: 100%;
  height: 100%;
`


const Dragon = styled.div.attrs((props: { hexsize?: number, top?: number, left?: number, background?: string, mousedown?: boolean, isactive?: boolean }) => props)`
  position: absolute;
  width: ${props => props.hexsize}px;
  background: ${props => props.background};
  height: ${props => props.hexsize}px;
  font-size:8px;
  border: none;
  outline: none;
  // color: ${props => props.isactive ? 'black' : 'white'};
  top:  calc(${props => props.top} * 1px);
  left: calc(${props => props.left} * 1px);

  user-select: none;
  justify-content: center;
  align-content: center;
  vertical-align: middle;
// line-height:${props => props.hexsize}px; 


  user-select: none;
  cursor: pointer;
  clip-path:${dragons.dragon_polygon};
    
  // transition: transform 0.5s, filter 0.4s;
  // transform: rotateX(60deg) rotateZ(-45deg);  
 
//   transition: background 1s, top 0.3s, left 0.3s;
// transition-delay: left 0.3s, top 0.3s;

    
`;

