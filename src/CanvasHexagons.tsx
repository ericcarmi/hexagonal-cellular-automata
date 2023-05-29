import { useState, useEffect } from 'react';
import Complex from 'complex';
import styled from 'styled-components';
import * as dragons from "./polygons";

export const headerHeight = 100;
export const templateShiftX = 415;
export const templateShiftY = 400;
export const templateWidth = 0;
export const extraShift = 10

const SQRT_3 = Math.sqrt(3)


const hexSize = 20.0;
const numCols = 20
const numRows = 17
const isHexagonNotDragon = true;

const hex_array: Complex[] = [];

const theta = Math.PI / 6

for (let i = 0; i < 6; i++) {
  const x = hexSize * Math.cos(2 * theta * i - Math.PI / 6) + 100;
  const y = hexSize * Math.sin(2 * theta * i - Math.PI / 6) + 100;
  hex_array.push(new Complex(x, y))

}

let hexagons: Array<boolean> = Array(numRows * numCols).fill(false).map((_, i) => i == 211);

interface ICanvas {
  canvasRef: any;
  color?: string;
  shouldClear?: boolean;
  rules: any
}


export const Canvas = ({
  canvasRef,
  color = '#00bb00',
  shouldClear = false,
  rules,

}: ICanvas
) => {

  // const [hexagons, setHexagons] = useState<Array<boolean>>(Array.from({length: numCols*numCols}, () => Math.random() > 0.5 ? true : false))
  // const [hexagons, setHexagons] = useState<Array<boolean>>(Array(numRows * numCols).fill(false).map((v, i) => i == 24))

  const checkNeighbors = () => {
    let nextActiveCells: Array<boolean> = [];
    let nextDeadCells: Array<boolean> = [];

    let j = 0;
    let rowCount = 0;


    for (let i = 0; i < numCols * numRows; i++) {
      const shifts = []
      // order: ul, l, dl, ur, r, dr
      const x = rowCount * numCols + i;
      if (rowCount % 2 == 1) {
        shifts.push(-numCols, -numCols + 1, 1, numCols + 1, numCols, -1);
      }
      else {
        shifts.push(-numCols - 1, -numCols, 1, numCols, numCols - 1, -1);
      }


      let neighbors = hexagons[i] ? '1' : '0';
      shifts.map((s, _) => {
        const a = s + i;
        if (hexagons[i]) {

          console.log(i, a, rowCount)
        }
        if (a > 0) {
          if (hexagons[a]) {
            neighbors += '1';
          }
          else {
            neighbors += '0';
          }
        }
      })
      const stayAlive = rules[neighbors as keyof typeof rules] === '1' ? true : false

      if (i % numCols == numCols - 1) {
        rowCount += 1
      }
      nextActiveCells.push(stayAlive);

    };

    hexagons = nextActiveCells;

  }



  const draw = (ctx: any, frameCount: any, shouldClear: boolean) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "12px Arial";


    // update();

    const fills = ['#ff0000', '#0000ff']

    let parity = 0;
    let rowCount = 0;

    for (let i = 0; i < numCols * numRows; i++) {
      parity = 0
      ctx.beginPath();

      const x = rowCount * numRows + i;

      // ctx.fillStyle = x % 2 == 0 ? fills[0] : fills[1]
      ctx.fillStyle = hexagons[i] ? fills[0] : fills[1]
      const shift = rowCount % 2 == 0 ? hexSize * 0.0 : SQRT_3 / 2 * hexSize

      for (let k = 0; k < hex_array.length; k++) {
        ctx.lineTo(SQRT_3 * hexSize * (i % numCols) + hex_array[k].real + shift, 1.5 * hexSize * rowCount + hex_array[k].im);
      }
      ctx.lineTo(SQRT_3 * hexSize * (i % numCols) + hex_array[0].real + shift, 1.5 * hexSize * rowCount + hex_array[0].im);
      ctx.fill();


      if (i % numCols == numCols - 1) {
        rowCount += 1
      }


    }




    ctx.fillStyle = "#ffffff"
    rowCount = 0;
    for (let i = 0; i < numCols * numRows; i++) {
      const shift = rowCount % 2 == 0 ? hexSize * 0.0 : SQRT_3 / 2 * hexSize
      parity += 1
      ctx.fillText((i).toString(), SQRT_3 * hexSize * (i % numCols) + hex_array[4].real + shift, 1.5 * hexSize * rowCount + hex_array[4].im)
      if (i % numCols == numCols - 1) {
        rowCount += 1
      }



    }

  }

  useEffect(() => {

    let frameCount = 0
    let animationFrameId: number

    const canvas: any = canvasRef.current
    const context = canvas.getContext('2d')

    const render = () => {
      // checkNeighbors();

      frameCount += 1;
      draw(context, frameCount, shouldClear)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, canvasRef, checkNeighbors])

  useEffect(() => {
    // console.log(hexagons)

  }, [hexagons])



  return (
    <canvas
      id={'canvas'}
      onMouseDown={(e) => {
        // console.log(e.clientX, e.clientY)
        checkNeighbors();
      }}
      width={1920 - 50}
      height={1000}
      ref={canvasRef}
    />
  )
}





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

