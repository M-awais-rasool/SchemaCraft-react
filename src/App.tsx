import { HashRouter as Router, Routes, Route } from 'react-router-dom'

// Test if we can import components one by one
function TestComponent() {
  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        ✅ Components Loading Successfully!
      </div>
    </div>
  )
}

function App() {
  try {
    return (
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<TestComponent />} />
          </Routes>
        </div>
      </Router>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center">
        <div className="text-white text-2xl">
          ❌ Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    )
  }
}

export default App
