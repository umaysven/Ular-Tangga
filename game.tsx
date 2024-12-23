'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import Board from './board'
import Dice from './dice'
import { soundManager } from './utils/sound'

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
}

const ladders = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,
}

const snakesAndLadders = { ...(snakes || {}), ...(ladders || {}) }

export default function Game() {
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [player1Position, setPlayer1Position] = useState(0)
  const [player2Position, setPlayer2Position] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [isMoving, setIsMoving] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const loadSounds = async () => {
      try {
        await soundManager.loadSound('roll', '/sounds/dice-roll.mp3')
        await soundManager.loadSound('move', '/sounds/move.mp3')
        await soundManager.loadSound('ladder', '/sounds/ladder.mp3')
        await soundManager.loadSound('snake', '/sounds/snake.mp3')
        await soundManager.loadSound('win', '/sounds/win.mp3')
      } catch (error) {
        console.error("Failed to load sounds:", error)
        setSoundEnabled(false)
      }
    }

    loadSounds()
  }, [])

  useEffect(() => {
    soundManager.setEnabled(soundEnabled)
  }, [soundEnabled])

  const rollDice = (player: number) => {
    if (gameOver || player !== currentPlayer || isMoving) return
    const newDiceValue = Math.floor(Math.random() * 6) + 1
    setDiceValue(newDiceValue)
    soundManager.playSound('roll')
    movePlayer(newDiceValue)
  }

  const movePlayer = async (spaces: number) => {
    setIsMoving(true)
    const currentPosition = currentPlayer === 1 ? player1Position : player2Position
    let newPosition = currentPosition
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 1; i <= spaces; i++) {
      newPosition++
      if (currentPlayer === 1) {
        setPlayer1Position(newPosition)
      } else {
        setPlayer2Position(newPosition)
      }
      soundManager.playSound('move')
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    if (newPosition in snakesAndLadders) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const finalPosition = snakesAndLadders[newPosition]
      if (newPosition in ladders) {
        setMessage(`${currentPlayer === 1 ? 'Player 1' : 'Player 2'} climbed a ladder!`)
        soundManager.playSound('ladder')
      } else {
        setMessage(`${currentPlayer === 1 ? 'Player 1' : 'Player 2'} hit a snake!`)
        soundManager.playSound('snake')
      }
      if (currentPlayer === 1) {
        setPlayer1Position(finalPosition)
      } else {
        setPlayer2Position(finalPosition)
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
      setMessage('')
    }

    if (newPosition >= 100) {
      setGameOver(true)
      setMessage(`Player ${currentPlayer} wins!`)
      soundManager.playSound('win')
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    }

    setIsMoving(false)
  }

  const resetGame = () => {
    setCurrentPlayer(1)
    setPlayer1Position(0)
    setPlayer2Position(0)
    setDiceValue(0)
    setGameOver(false)
    setMessage('')
    setIsMoving(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Snake and Ladder</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Board 
                player1Position={player1Position} 
                player2Position={player2Position}
                ladders={ladders || {}}
                snakes={snakes || {}}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <motion.div 
                    className={`text-lg ${currentPlayer === 1 ? 'font-bold' : ''}`}
                    animate={{ scale: currentPlayer === 1 ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Player 1: {player1Position}
                  </motion.div>
                  <motion.div 
                    className={`text-lg ${currentPlayer === 2 ? 'font-bold' : ''}`}
                    animate={{ scale: currentPlayer === 2 ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Player 2: {player2Position}
                  </motion.div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Dice value={diceValue} />
                  <div className="space-x-2">
                    <Button 
                      onClick={() => rollDice(1)} 
                      disabled={gameOver || currentPlayer !== 1 || isMoving}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Player 1 Roll
                    </Button>
                    <Button 
                      onClick={() => rollDice(2)} 
                      disabled={gameOver || currentPlayer !== 2 || isMoving}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Player 2 Roll
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <label htmlFor="sound-toggle" className="mr-2">Sound</label>
                  <Switch
                    id="sound-toggle"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
              <AnimatePresence>
                {message && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 text-center text-lg"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
              {gameOver && (
                <Button onClick={resetGame} className="mt-4 w-full">
                  Play Again
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

