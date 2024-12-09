import React from 'react'
import { motion } from 'framer-motion'

interface BoardProps {
  player1Position: number
  player2Position: number
  ladders: Record<number, number>
  snakes: Record<number, number>
}

export default function Board({ player1Position, player2Position, ladders, snakes }: BoardProps) {
  const renderSquare = (i: number) => {
    const isPlayer1Here = player1Position === i
    const isPlayer2Here = player2Position === i
    const row = Math.floor((100 - i) / 10)
    const col = row % 2 === 0 ? 9 - ((i - 1) % 10) : (i - 1) % 10
    const isEvenSquare = (row + col) % 2 === 0
    const bgColor = isEvenSquare ? 'bg-gray-200' : 'bg-white'

    return (
      <div key={i} className={`w-12 h-12 border border-gray-300 flex items-center justify-center relative ${bgColor}`}>
        <div className="text-xs font-semibold">{i}</div>
          {isPlayer1Here && (
            <motion.img
              src="images/p1.png"
              alt="Player 1"
              className="absolute w-8 h-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}

          {isPlayer2Here && (
            <motion.img
              src="images/p2.png"
              alt="Player 2"
              className="absolute w-8 h-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
      </div>
    )
  }

  const renderRow = (rowIndex: number) => {
    const squares = []
    const start = 100 - rowIndex * 10
    for (let i = 0; i < 10; i++) {
      const num = rowIndex % 2 === 0 ? start - i : start - 9 + i
      squares.push(renderSquare(num))
    }
    return (
      <div key={rowIndex} className="flex">
        {squares}
      </div>
    )
  }

  const getSquareCenter = (square: number) => {
    const row = Math.floor((100 - square) / 10)
    const col = row % 2 === 0 ? 9 - ((square - 1) % 10) : (square - 1) % 10
    return {
      x: col * 48 + 24,
      y: row * 48 + 24
    }
  }

  const renderLadders = () => {
    return Object.entries(ladders || {}).map(([start, end]) => {
      const startPos = getSquareCenter(parseInt(start))
      const endPos = getSquareCenter(end)

      return (
        <line
          key={`ladder-${start}-${end}`}
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke="green"
          strokeWidth="4"
        />
      )
    })
  }

  const renderSnakes = () => {
    return Object.entries(snakes || {}).map(([head, tail]) => {
      const headPos = getSquareCenter(parseInt(head))
      const tailPos = getSquareCenter(tail)

      // Calculate control points for the curve
      const midX = (headPos.x + tailPos.x) / 2
      const midY = (headPos.y + tailPos.y) / 2
      const controlX = midX + (headPos.y - tailPos.y) / 4
      const controlY = midY - (headPos.x - tailPos.x) / 4

      return (
        <path
          key={`snake-${head}-${tail}`}
          d={`M ${headPos.x} ${headPos.y} Q ${controlX} ${controlY} ${tailPos.x} ${tailPos.y}`}
          fill="none"
          stroke="red"
          strokeWidth="4"
        />
      )
    })
  }

  const rows = []
  for (let i = 0; i < 10; i++) {
    rows.push(renderRow(i))
  }

  return (
    <div className="relative" style={{ minWidth: '490px', maxWidth: '490px'}}>
      <div className="border-4 border-gray-400 rounded-lg overflow-hidden">{rows}</div>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {renderLadders()}
        {renderSnakes()}
      </svg>
    </div>
  )
}

