import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
// center, up, up-right, down-right, down, down-left, up-right
// cn, dn, dl, ul, up, ur, dr 
// or was it right before? think so, but relativistic frame was offset, whoops
// when you pick all off except down, it will move up
// cn, up, ur, dr, dn, dl, ul
// x1  x2  x3  x4  x5  x6  x7 -> y

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

function padStart(string: string, length: number, char: string) {
   // can be done via loop too:
     while (length-- > 0) {
       string = char + string;
     }
   return string;
}

function numToString(num: number, radix: number,length: number) {
  const numString = num.toString(radix);
  return numString.length === length ?
    numString :
    padStart(numString, length - numString.length, "0")
}


// can't pass in 'key' as prop because it is a 'keyword', but it doens't give that error - annoying
const Hex7 = ({i,j,mkey, rules, setRules, isSelected, setIsSelected} : {
  i: number, j: number, mkey:number, isSelected: boolean, setIsSelected: (val:any) => void, rules: any, setRules: (val:any) => void}
) => {
const hexsize = 25;

const binString = numToString(parseInt(mkey.toString(),10),2,7)


  
return(
  <div key={'a' + mkey.toString()} style={{position: 'absolute', top: 20 + j*115, left: 30 + i*105}}>
    <div key={'b' + mkey.toString()}  style={{position: 'absolute',fontFamily:'monospace', fontSize: 16, color: 'black', top: 65, left: -10}}> {binString} </div>
    <div key={'c' + mkey.toString()} style={{position: 'absolute', top: 25, left: 10}}>
    <Hexagon
      hexsize={hexsize}
      key={'d' + mkey.toString()} 
      style={{
        background: binString[0] === '1' ? 'white' : 'black',
        top: 0,
        left: 0,
      }}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[1] === '1' ? 'white' : 'black',
        left: 0,          
        top: -hexsize*2/3,
      }}
      key={'e' + mkey.toString()} 
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[4] === '1' ? 'white' : 'black',
        left: 0,          
        top: hexsize*2/3,
      }}
      key={'f' + mkey.toString()} 
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[5] === '1' ? 'white' : 'black',
        left: -hexsize/1.25,          
        top: hexsize/3,
      }}
      key={'g' + mkey.toString()} 
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[3] === '1' ? 'white' : 'black',
        left: hexsize/1.25,          
        top: hexsize/3,
      }}
      key={'h' + mkey.toString()} 
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[6] === '1' ? 'white' : 'black',
        left: -hexsize/1.25,          
        top: -hexsize/3,
      }}
          key={5}
      />
    <Hexagon
      hexsize={hexsize}
      style={{
        background: binString[2] === '1' ? 'white' : 'black',
        left: hexsize/1.25,          
        top: -hexsize/3,
      }}
      key={'i' + mkey.toString()} 
      />
    </div>

    <Hexagon
      onClick={() => {
          setIsSelected((prev:any) => prev.map((item:any, index:any) => index === mkey ? !item : item));
        }}
      key={'j' + mkey.toString()} 
      hexsize={hexsize}
      style={{
        background: isSelected ? 'white' : 'black',
        left: hexsize*2 - 5,          
        top: -10,
        cursor: 'pointer',
      }}
      />
  </div>
  );
};


interface IRules{
  rules: any,
  setRules: any,
}


export const Rules = ({rules, setRules}:IRules) => {

  const [isSelected, setIsSelected] = useState([...Array(128)].map((itm,idx) => rules[numToString(parseInt(idx.toString(),10),2,7)] === '1' ? true : false));

   useEffect(() => {
     let i = 0;
    let r = rules;
     for (const x of isSelected) {
       r[numToString(parseInt(i.toString(),10),2,7)] = x === true ? '1' : '0'
       i += 1;
     }

    setRules(r);
    // console.log(rules);
   
   },[isSelected, rules, setRules])

  console.log(rules, isSelected);
  


  return (
    <div style={{width: '100%', height:'100%'}}>
      {[...Array(16)].map((y,i) => 
      [...Array(8)].map((x,j) => 
        <>
          <div 
              style={{position: 'absolute', left:i*105, top: j*115, width: 105, height: 115,border: '1px solid rgb(0,0,100)',}}>
          </div>
          <Hex7 
            rules={rules}
            setRules={setRules}
            mkey={i*8+j}
            key={i*8+j}
            i={i}
            j={j}
            isSelected={isSelected[i*8+j]}
            setIsSelected={setIsSelected}
          />
        </>
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

