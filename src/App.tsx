import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <>
      {/* Custom spinning cursor */}
      <CustomCursor imageSrc="/cursor.png" />

      {/* Main content - minimal off-white page */}
      <div className="min-h-screen bg-off-white">
        {/* Your content goes here */}
        {/* Page is intentionally blank for minimal aesthetic */}
      </div>
    </>
  );
}

export default App;
