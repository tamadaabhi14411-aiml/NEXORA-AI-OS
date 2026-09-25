import AppRouter from "./routes/AppRouter";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;