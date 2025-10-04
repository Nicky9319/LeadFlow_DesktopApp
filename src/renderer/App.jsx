import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './Features/main/components/mainPage'
// import AuthPage from './Features/auth/components/authPage'



function App() {
  // Example function to determine which route to show


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage />}
        />
      </Routes>
    </Router>
  )
}

export default App
