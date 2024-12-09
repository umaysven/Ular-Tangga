import React from 'react'
import { motion } from 'framer-motion'

interface DiceProps {
  value: number
}

export default function Dice({ value }: DiceProps) {
  const dots = []
  for (let i = 0; i < value; i++) {
    dots.push(<div key={i} className="w-2 h-2 bg-black rounded-full"></div>)
  }

  return (
    <motion.div 
      className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
      animate={{ rotateX: [0, 360, 720, 1080, 0] }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-3 gap-1">{dots}</div>
    </motion.div>
  )
}

