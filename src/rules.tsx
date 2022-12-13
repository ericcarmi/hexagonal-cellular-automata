import React, {useState} from 'react';
import styled from 'styled-components';
// center, up, up-right, down-right, down, down-left, up-right
// cn, dn, dl, ul, up, ur, dr 
// or was it right before? think so, but relativistic frame was offset, whoops
// when you pick all off except down, it will move up
// cn, up, ur, dr, dn, dl, ul
// x1  x2  x3  x4  x5  x6  x7 -> y
export const rules = 
{
"0000000" : "0" ,"0000001" : "1" ,"0000010"  : "0" ,"0000011" : "0" ,"0000100" : "1" ,"0000101" : "0" ,"0000110" : "0" ,"0000111" : "0" ,
"0001000" : "1" ,"0001001" : "0" ,"0001010"  : "0" ,"0001011" : "0" ,"0001100" : "0" ,"0001101" : "0" ,"0001110" : "0" ,"0001111" : "0" ,
"0010000" : "0" ,"0010001" : "0" ,"0010010"  : "0" ,"0010011" : "0" ,"0010100" : "0" ,"0010101" : "0" ,"0010110" : "0" ,"0010111" : "0" ,
"0011000" : "0" ,"0011001" : "0" ,"0011010"  : "0" ,"0011011" : "0" ,"0011100" : "0" ,"0011101" : "0" ,"0011110" : "0" ,"0011111" : "0" ,
"0100000" : "1" ,"0100001" : "0" ,"0100010"  : "0" ,"0100011" : "0" ,"0100100" : "0" ,"0100101" : "0" ,"0100110" : "0" ,"0100111" : "0" ,
"0101000" : "0" ,"0101001" : "0" ,"0101010"  : "0" ,"0101011" : "0" ,"0101100" : "0" ,"0101101" : "0" ,"0101110" : "0" ,"0101111" : "0" ,
"0110000" : "0" ,"0110001" : "0" ,"0110010"  : "0" ,"0110011" : "0" ,"0110100" : "0" ,"0110101" : "0" ,"0110110" : "0" ,"0110111" : "0" ,
"0111000" : "0" ,"0111001" : "0" ,"0111010"  : "0" ,"0111011" : "0" ,"0111100" : "0" ,"0111101" : "0" ,"0111110" : "0" ,"0111111" : "1" ,
"1000000" : "1" ,"1000001" : "0" ,"1000010"  : "0" ,"1000011" : "0" ,"1000100" : "0" ,"1000101" : "0" ,"1000110" : "0" ,"1000111" : "0" ,
"1001000" : "0" ,"1001001" : "0" ,"1001010"  : "0" ,"1001011" : "0" ,"1001100" : "0" ,"1001101" : "0" ,"1001110" : "0" ,"1001111" : "0" ,
"1010000" : "0" ,"1010001" : "0" ,"1010010"  : "0" ,"1010011" : "0" ,"1010100" : "0" ,"1010101" : "0" ,"1010110" : "0" ,"1010111" : "0" ,
"1011000" : "0" ,"1011001" : "0" ,"1011010"  : "0" ,"1011011" : "0" ,"1011100" : "0" ,"1011101" : "0" ,"1011110" : "0" ,"1011111" : "0" ,
"1100000" : "0" ,"1100001" : "0" ,"1100010"  : "0" ,"1100011" : "0" ,"1100100" : "0" ,"1100101" : "0" ,"1100110" : "0" ,"1100111" : "0" ,
"1101000" : "0" ,"1101001" : "0" ,"1101010"  : "0" ,"1101011" : "0" ,"1101100" : "0" ,"1101101" : "0" ,"1101110" : "0" ,"1101111" : "0" ,
"1110000" : "0" ,"1110001" : "0" ,"1110010"  : "0" ,"1110011" : "0" ,"1110100" : "0" ,"1110101" : "0" ,"1110110" : "0" ,"1110111" : "0" ,
"1111000" : "0" ,"1111001" : "0" ,"1111010"  : "0" ,"1111011" : "0" ,"1111100" : "0" ,"1111101" : "0" ,"1111110" : "1" ,"1111111" : "0" ,
}


/*

ideas for rule interfaces

visual one would be cool but it still is a lot to look at

what if this is where a language interface should start? API for settings rules
logical inference of what rules to set based on symbolic (english) instructions

e.g. "if up is on, output is on" --> look at every up-bit (2nd bit) and set appropriately
some logic is implied, like the converse/contrapositive? "if up is off (not on), output if off"
no, the inverse
if p then q
if !p then !q

other rules can be given more abstract names, like Sierpinski, just 4 bits on
they can also be named by the number they create, a 128-bit number...

---

it might be nice to have something like a search
describe the rule by which bits you want on

*/

interface IRules{
  
}


// can't pass in 'key' as prop because it is a 'keyword', but it doens't give that error - annoying
const Hex7 = ({i,j,mkey} : {i: number, j: number, mkey:number}) => {
const hexsize = 25;
const [isSelected, setIsSelected] = useState(Array(128).fill(false));

// console.log(mkey*8);
return(
  <div style={{position: 'absolute', top: 30 + j*115, left: 30 + i*105 }}>
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        top: 0,
        left: 0,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: -hexsize/1.25,          
        top: hexsize/3,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: 0,          
        top: hexsize*2/3,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: hexsize/1.25,          
        top: hexsize/3,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: -hexsize/1.25,          
        top: -hexsize/3,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: 0,          
        top: -hexsize*2/3,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: 'blue',
        left: hexsize/1.25,          
        top: -hexsize/3,
      }}
      />

    <Hexagon
      onClick={() => setIsSelected((prev) => prev.map((item, index) => index === mkey ? !item : item))}
      hexsize={hexsize}
      style={{
        background: isSelected[mkey] ? 'white' : 'black',
        left: hexsize*2,          
        top: 0,
        cursor: 'pointer',
      }}
      />
  </div>
  );
};


export const Rules = ({}:IRules) => {

  return (
    <div style={{width: '100%', height:'100%'}}>
      {[...Array(16)].map((y,i) => 
      [...Array(8)].map((x,j) => 
          <Hex7 
            mkey={i*16+j}
            key={i*16+j}
            i={i}
            j={j}
          />
        )
      )

      }

    </div>
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
  transition: background 0.2s, top 0.3s, left 0.3s;
  transition-delay: left 0.3s, top 0.3s;
  justify-content: center;
  align-content: center;
  vertical-align: middle;
  // line-height: 50px;
`;

