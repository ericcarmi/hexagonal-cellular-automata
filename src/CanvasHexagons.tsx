import { useEffect } from 'react';
import Complex from 'complex';

export const headerHeight = 100;
export const templateShiftX = 415;
export const templateShiftY = 400;
export const templateWidth = 0;
export const extraShift = 10

const SQRT_3 = Math.sqrt(3)

const hexSize = 3.0;
const numCols = 320
const numRows = 200
// const isHexagonNotDragon = true;

interface ICanvas {
  canvasRef: any;
  shouldReset: boolean;
  setShouldReset: React.Dispatch<React.SetStateAction<boolean>>;
  shouldStepOnce: boolean;
  setShouldStepOnce: React.Dispatch<React.SetStateAction<boolean>>;
  shouldIterate: boolean;
  rules: any;
  isCellular: boolean;
  color?: string;
}


export const Canvas = ({
  canvasRef,
  // color = '#00bb00',
  shouldReset,
  rules,
  shouldIterate,
  setShouldReset,
  shouldStepOnce,
  setShouldStepOnce,
  isCellular,
}: ICanvas
) => {

  useEffect(() => {
    if (shouldStepOnce) {
      checkNeighbors(rules, true, false, isCellular);
    }
    setShouldStepOnce(false);
  }, [shouldStepOnce, setShouldStepOnce, isCellular])


  useEffect(() => {
    if (shouldReset) {
      // only center
      hexagons = Array(numRows * numCols).fill(false).map((_, i) => i == numCols * numRows / 2 + numCols / 2);
      smoothHexagons = Array(numRows * numCols).fill(false).map((_, i) => i == numCols * numRows / 2 + numCols / 2 ? 1 : 0);

      // strip
      // hexagons = Array(numRows * numCols).fill(false).map((_, i) => i > numCols * numRows / 3 && i < numCols * numRows / 1.5);

      // random
      hexagons = Array.from({ length: numCols * numCols }, () => Math.random() > 0.53 ? true : false);
      smoothHexagons = Array.from({ length: numCols * numCols }, () => Math.random() > 0.53 ? 1 : 0);
      setShouldReset(false);
    }
  }, [shouldReset, setShouldReset])


  useEffect(() => {
    let frameCount = 0
    let animationFrameId: number

    const canvas: any = canvasRef.current
    const context = canvas.getContext('2d')

    const render = () => {
      checkNeighbors(rules, shouldIterate, shouldReset, isCellular);

      frameCount += 1;
      draw(context, frameCount, shouldReset, isCellular)
      animationFrameId = window.requestAnimationFrame(render)
    }


    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, canvasRef, checkNeighbors, rules, shouldIterate, shouldReset, isCellular])


  return (
    <canvas
      id={'canvas'}
      onMouseDown={(e) => {
        // console.log(e.clientX, e.clientY)
        // checkNeighbors();
      }}
      width={window.innerWidth}
      height={window.innerHeight}
      ref={canvasRef}
    />
  )
}


const hex_array: Complex[] = [];

const theta = Math.PI / 6

for (let i = 0; i < 6; i++) {
  const x = hexSize * Math.cos(2 * theta * i - Math.PI / 6) + 20;
  const y = hexSize * Math.sin(2 * theta * i - Math.PI / 6) + 50;
  hex_array.push(new Complex(x, y))

}

let hexagons: Array<boolean> = Array(numRows * numCols).fill(false).map((_, i) => i == 0 * numCols * numRows / 2 + numCols / 2);
// let hexagons: Array<boolean> = Array.from({length: numCols*numCols}, () => Math.random() > 0.5 ? true : false);

let smoothHexagons: Array<number> = Array(numRows * numCols).fill(0).map((_, i) => i == 0 * numCols * numRows / 2 + numCols / 2 ? 1 : 0);

const checkNeighbors = (rules: any, shouldIterate: boolean, shouldReset: boolean, isCellular: boolean) => {

  if (!shouldIterate) {
    return;
  }
  let nextActiveCells: Array<boolean> = [];
  let nextSmoothCells: Array<number> = [];

  let j = 0;
  let rowCount = 0;
  let total_sum = 0;

  for (let i = 0; i < numCols * numRows; i++) {
    total_sum += hexagons[i] ? 1 : 0;
  }

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
    let num_neighbors = 0;

    shifts.map((s, _) => {
      const a = s + i;
      // if (hexagons[i]) {
      //   console.log(i, a, rowCount)
      // }
      if (a > 0) {
        if (hexagons[a]) {
          neighbors += '1';
          num_neighbors += 1;
        }
        else {
          neighbors += '0';
        }
      }
    })

    let stayAlive = false;
    let smoothAlive = 0
    if (isCellular) {
      stayAlive = rules[neighbors as keyof typeof rules] === '1' ? true : false

    }
    else {
      if (total_sum > numRows * numCols / 2) {
        // stayAlive = num_neighbors == 3 || num_neighbors == 4 || num_neighbors == 5  ? true : false
        stayAlive = num_neighbors > 3 ? true : false
        smoothAlive = num_neighbors > 3 ? 1 : smoothHexagons[i] * 0.99
      }
      else {
        // stayAlive = num_neighbors == 4 ||num_neighbors == 5 ||num_neighbors == 6 ? true : false
        stayAlive = num_neighbors > 2 && num_neighbors < 7 ? true : false
        smoothAlive = num_neighbors > 2 && num_neighbors < 7 ? 1 : smoothHexagons[i] * 0.99

      }
    }

    if (i % numCols == numCols - 1) {
      rowCount += 1
    }
    nextActiveCells.push(stayAlive);
    nextSmoothCells.push(smoothAlive);

  };

  hexagons = nextActiveCells;
  smoothHexagons = nextSmoothCells;

}

const draw = (ctx: any, frameCount: any, shouldClear: boolean, isCellular: boolean) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "12px Arial";

  const fills = ['rgb(0,0,0)', 'rgb(200,200,200)']
  let parity = 0;
  let rowCount = 0;

  for (let i = 0; i < numCols * numRows; i++) {
    parity = 0
    ctx.beginPath();

    const x = rowCount * numRows + i;

    // ctx.fillStyle = x % 2 == 0 ? fills[0] : fills[1]
    // ctx.fillStyle = hexagons[i] ? fills[0] : fills[1]
    if (!isCellular) {
      const color = smoothHexagons[i] * 255
      ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
    }
    else {
      ctx.fillStyle = hexagons[i] ? fills[0] : fills[1]
    }



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

}

