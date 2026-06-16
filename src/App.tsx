import { ResumeProvider } from "./context/ResumeContext";
import { Builder } from "./pages/Builder";

function App() {
  return (
    <ResumeProvider>
      <Builder />
    </ResumeProvider>
  );
}

export default App;
