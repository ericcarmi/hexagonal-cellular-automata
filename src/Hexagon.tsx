import styled from 'styled-components';
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

interface IHexagons {
  isMouseDown? : boolean,
  numRows: number;
  numCols: number;
  hexsize: number;
  backgroundColor: Array<string>; 
  isActive: Array<boolean>;
  updateColor: (n: number, s: string) => void;
}

export const Hexagons = ({
  isMouseDown, numRows, numCols, updateColor, hexsize,  backgroundColor, isActive,

  }:IHexagons) => {

  const columnArray = [...Array(numCols)].map((_,i) => i);
  const rowArray = [...Array(numRows)].map((_,i) => i);
  
                    // left={20+i*hexsize/1.625}
                    // top={150 +  hexsize/1.625 * j} //+ hexsize/2*(i%2)
  
  // console.log(hexsize);

  // when setting left position, use ceil() to create tiny border around hexagons, round/floor to have no border
  return(
      <Grid>
        {columnArray.map((x, i) =>
          rowArray.map((y, j) => 
          <Dragon 
            key={i*numRows+j} 
            hexsize={hexsize}
            left={20 + i*hexsize/1.625}
            style={{top:150 + hexsize*j/1.625}}
            background={isActive[i*numRows + j] ? 'white' : 'black'}
            onMouseDown={(e) => {
                  if(e.shiftKey){
                        updateColor(i*numRows+j, 'black');
                    }
                    else {
                        updateColor(i*numRows+j, 'white');
                    }
                  } }
            onMouseEnter={(e) => { 
                  if(isMouseDown){
                    if(e.shiftKey){
                        updateColor(i*numRows+j, 'black');
                    }
                    else {
                        updateColor(i*numRows+j, 'white');
                    }
                  }
            }}

          >
         {/*j}<br/>{}{Math.floor((i*numRows+j)/2) % numRows < (numRows/2) ? '0' : '1'*/}
          </Dragon>
  
      ))}
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
  transition: background 1s, top 0.3s, left 0.3s;
transition-delay: left 0.3s, top 0.3s;
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
  background: rgb(80,80,80);
  width: 100%;
  height: 100%;
`


const Dragon = styled.div.attrs((props : {hexsize?: number, top?: number, left?: number, background?: string, mousedown?: boolean, isactive?: boolean}) => props)`
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

