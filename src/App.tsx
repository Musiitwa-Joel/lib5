import { ThemeProvider } from '@/components/theme-provider';
import { Dashboard } from '@/components/dashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="nkumba-theme">
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;