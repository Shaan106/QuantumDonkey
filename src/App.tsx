import "./App.css";
import BoidsBackground from "./components/BoidsBackground";

function App() {
  const scrollToDonkey = () => {
    const element = document.getElementById("donkey-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <BoidsBackground />
      <div className="container">
        {/* Hero Section */}
        <section className="section">
          <div className="content">
            <h1>
              Quantum{" "}
              <span className="donkey-link" onClick={scrollToDonkey}>
                Donkey
              </span>
            </h1>
            <p>A minimal and interesting website.</p>
          </div>
        </section>

        {/* Donkey Section */}
        <section id="donkey-section" className="section">
          <div className="content">
            <h1>The Donkey</h1>
            <p>Kind of like eeyore.</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
