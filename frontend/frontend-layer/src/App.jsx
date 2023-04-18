import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const width = 900;
  const height = 600;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  d3.json('https://cdn.jsdeliver.net/npm/world-atlas@2/countries-110m.json')
}

export default App
