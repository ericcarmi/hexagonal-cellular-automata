import React, { useState, useEffect } from 'react';
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

function numToString(num: number, radix: number, length: number) {
  const numString = num.toString(radix);
  return numString.length === length ?
    numString :
    padStart(numString, length - numString.length, "0")
}


// can't pass in 'key' as prop because it is a 'keyword', but it doens't give that error - annoying
const Hex7 = ({ i, j, mkey, rules, setRules, isSelected, setIsSelected }: {
  i: number, j: number, mkey: number, isSelected: boolean, setIsSelected: (val: any) => void, rules: any, setRules: (val: any) => void
}
) => {
  const hexsize = 25;

  const binString = numToString(parseInt(mkey.toString(), 10), 2, 7)



  return (
    <div key={'a' + mkey.toString()} style={{ position: 'absolute', top: 20 + j * 115, left: 30 + i * 105 }}>
      <div key={'b' + mkey.toString()} style={{ position: 'absolute', fontFamily: 'monospace', fontSize: 16, color: 'black', top: 65, left: -10 }}> {binString} </div>
      <div key={'c' + mkey.toString()} style={{ position: 'absolute', top: 25, left: 10 }}>
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
            top: -hexsize * 2 / 3,
          }}
          key={'e' + mkey.toString()}
        />
        <Hexagon
          hexsize={hexsize}
          style={{
            background: binString[4] === '1' ? 'white' : 'black',
            left: 0,
            top: hexsize * 2 / 3,
          }}
          key={'f' + mkey.toString()}
        />
        <Hexagon
          hexsize={hexsize}
          style={{
            background: binString[5] === '1' ? 'white' : 'black',
            left: -hexsize / 1.25,
            top: hexsize / 3,
          }}
          key={'g' + mkey.toString()}
        />
        <Hexagon
          hexsize={hexsize}
          style={{
            background: binString[3] === '1' ? 'white' : 'black',
            left: hexsize / 1.25,
            top: hexsize / 3,
          }}
          key={'h' + mkey.toString()}
        />
        <Hexagon
          hexsize={hexsize}
          style={{
            background: binString[6] === '1' ? 'white' : 'black',
            left: -hexsize / 1.25,
            top: -hexsize / 3,
          }}
          key={5}
        />
        <Hexagon
          hexsize={hexsize}
          style={{
            background: binString[2] === '1' ? 'white' : 'black',
            left: hexsize / 1.25,
            top: -hexsize / 3,
          }}
          key={'i' + mkey.toString()}
        />
      </div>

      <Hexagon
        onClick={() => {
          setIsSelected((prev: any) => prev.map((item: any, index: any) => index === mkey ? !item : item));
        }}
        key={'j' + mkey.toString()}
        hexsize={hexsize}
        style={{
          background: isSelected ? 'white' : 'black',
          left: hexsize * 2 - 5,
          top: -10,
          cursor: 'pointer',
        }}
      />
    </div>
  );
};


interface IRules {
  rules: any,
  setRules: any,
  shouldUseRuleA: boolean,
}


export const Rules = ({ rules, setRules, shouldUseRuleA, }: IRules) => {

  const [isSelected, setIsSelected] = useState([...Array(128)].map((itm, idx) => rules[numToString(parseInt(idx.toString(), 10), 2, 7)] === '1' ? true : false));


  const [ruleA, setRuleA] = useState(
    {
      "0000000": "0", "0000001": "1", "0000010": "1", "0000011": "0", "0000100": "1", "0000101": "0", "0000110": "0", "0000111": "0",
      "0001000": "1", "0001001": "0", "0001010": "0", "0001011": "0", "0001100": "0", "0001101": "0", "0001110": "0", "0001111": "0",
      "0010000": "1", "0010001": "0", "0010010": "0", "0010011": "0", "0010100": "0", "0010101": "0", "0010110": "0", "0010111": "0",
      "0011000": "0", "0011001": "0", "0011010": "0", "0011011": "0", "0011100": "0", "0011101": "0", "0011110": "0", "0011111": "0",
      "0100000": "1", "0100001": "0", "0100010": "0", "0100011": "0", "0100100": "0", "0100101": "0", "0100110": "0", "0100111": "0",
      "0101000": "0", "0101001": "0", "0101010": "0", "0101011": "0", "0101100": "0", "0101101": "0", "0101110": "0", "0101111": "0",
      "0110000": "0", "0110001": "0", "0110010": "0", "0110011": "0", "0110100": "0", "0110101": "0", "0110110": "0", "0110111": "0",
      "0111000": "0", "0111001": "0", "0111010": "0", "0111011": "0", "0111100": "0", "0111101": "0", "0111110": "0", "0111111": "0",
      "1000000": "0", "1000001": "0", "1000010": "0", "1000011": "0", "1000100": "0", "1000101": "0", "1000110": "0", "1000111": "0",
      "1001000": "0", "1001001": "0", "1001010": "0", "1001011": "0", "1001100": "0", "1001101": "0", "1001110": "0", "1001111": "0",
      "1010000": "0", "1010001": "0", "1010010": "0", "1010011": "0", "1010100": "0", "1010101": "0", "1010110": "0", "1010111": "0",
      "1011000": "0", "1011001": "0", "1011010": "0", "1011011": "0", "1011100": "0", "1011101": "0", "1011110": "0", "1011111": "0",
      "1100000": "0", "1100001": "0", "1100010": "0", "1100011": "0", "1100100": "0", "1100101": "0", "1100110": "0", "1100111": "0",
      "1101000": "0", "1101001": "0", "1101010": "0", "1101011": "0", "1101100": "0", "1101101": "0", "1101110": "0", "1101111": "0",
      "1110000": "0", "1110001": "0", "1110010": "0", "1110011": "0", "1110100": "0", "1110101": "0", "1110110": "0", "1110111": "0",
      "1111000": "0", "1111001": "0", "1111010": "0", "1111011": "0", "1111100": "0", "1111101": "0", "1111110": "0", "1111111": "0",
    });
  const [ruleB, setRuleB] = useState(
    {
      "0000000": "0", "0000001": "1", "0000010": "1", "0000011": "0", "0000100": "1", "0000101": "0", "0000110": "0", "0000111": "0",
      "0001000": "1", "0001001": "0", "0001010": "0", "0001011": "0", "0001100": "0", "0001101": "0", "0001110": "0", "0001111": "0",
      "0010000": "1", "0010001": "0", "0010010": "0", "0010011": "0", "0010100": "0", "0010101": "0", "0010110": "0", "0010111": "0",
      "0011000": "0", "0011001": "0", "0011010": "0", "0011011": "0", "0011100": "0", "0011101": "0", "0011110": "0", "0011111": "0",
      "0100000": "1", "0100001": "0", "0100010": "0", "0100011": "0", "0100100": "0", "0100101": "0", "0100110": "0", "0100111": "0",
      "0101000": "0", "0101001": "0", "0101010": "0", "0101011": "0", "0101100": "0", "0101101": "0", "0101110": "0", "0101111": "0",
      "0110000": "0", "0110001": "0", "0110010": "0", "0110011": "0", "0110100": "0", "0110101": "0", "0110110": "0", "0110111": "0",
      "0111000": "0", "0111001": "0", "0111010": "0", "0111011": "0", "0111100": "0", "0111101": "0", "0111110": "0", "0111111": "0",
      "1000000": "0", "1000001": "1", "1000010": "1", "1000011": "1", "1000100": "1", "1000101": "1", "1000110": "1", "1000111": "1",
      "1001000": "1", "1001001": "1", "1001010": "1", "1001011": "1", "1001100": "1", "1001101": "1", "1001110": "1", "1001111": "1",
      "1010000": "1", "1010001": "1", "1010010": "1", "1010011": "1", "1010100": "1", "1010101": "1", "1010110": "1", "1010111": "1",
      "1011000": "1", "1011001": "1", "1011010": "1", "1011011": "1", "1011100": "1", "1011101": "1", "1011110": "1", "1011111": "1",
      "1100000": "1", "1100001": "1", "1100010": "1", "1100011": "1", "1100100": "1", "1100101": "1", "1100110": "1", "1100111": "1",
      "1101000": "1", "1101001": "1", "1101010": "1", "1101011": "1", "1101100": "1", "1101101": "1", "1101110": "1", "1101111": "1",
      "1110000": "1", "1110001": "1", "1110010": "1", "1110011": "1", "1110100": "1", "1110101": "1", "1110110": "1", "1110111": "1",
      "1111000": "1", "1111001": "1", "1111010": "1", "1111011": "1", "1111100": "1", "1111101": "1", "1111110": "1", "1111111": "1",
    });

  useEffect(() => {
    let i = 0;
    let r = rules;
    for (const x of isSelected) {
      r[numToString(parseInt(i.toString(), 10), 2, 7)] = x === true ? '1' : '0'
      i += 1;
    }

    setRules(r);
    // console.log(rules);

  }, [isSelected, rules, setRules])


  useEffect(() => {
    if(shouldUseRuleA) {
      setRules(ruleA);
      setIsSelected([...Array(128)].map((itm, idx) => ruleA[numToString(parseInt(idx.toString(), 10), 2, 7) as keyof typeof ruleA] === '1' ? true : false));
    }
    else{
      setRules(ruleB);
      setIsSelected([...Array(128)].map((itm, idx) => ruleB[numToString(parseInt(idx.toString(), 10), 2, 7) as keyof typeof ruleB] === '1' ? true : false));
    }
    console.log('A', ruleA, 'B', ruleB);
  },[shouldUseRuleA, setRules, rules, setIsSelected])

  // console.log(rules, isSelected);



  return (
    <div style={{ width: '100%', height: '100%' }}>
      {[...Array(16)].map((y, i) =>
        [...Array(8)].map((x, j) =>
          <>
            <div
              style={{ position: 'absolute', left: i * 105, top: j * 115, width: 105, height: 115, border: '1px solid rgb(0,0,100)', }}>
            </div>
            <Hex7
              rules={rules}
              setRules={setRules}
              mkey={i * 8 + j}
              key={i * 8 + j}
              i={i}
              j={j}
              isSelected={isSelected[i * 8 + j]}
              setIsSelected={setIsSelected}
            />
          </>
        )
      )

      }

    </div>
  );
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
  transition: background 0.2s, top 0.3s, left 0.3s;
  transition-delay: left 0.3s, top 0.3s;
  justify-content: center;
  align-content: center;
  vertical-align: middle;
  // line-height: 50px;
`;

