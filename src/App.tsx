import './App.css'
import { Toaster } from '@/components/ui/toaster'
import AppRoutes from '@/routes'


function App() {

  return (
    <>
      <div className="flex ">
        <div className="flex-grow">
          <AppRoutes />
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default App
