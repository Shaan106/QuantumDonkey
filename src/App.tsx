import { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const start = new Date(2026, 1, 21); // Feb 21, 2026
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 15);

    const now = new Date();
    if (now >= end) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let years = end.getFullYear() - now.getFullYear();
    let months = end.getMonth() - now.getMonth();
    let days = end.getDate() - now.getDate();
    let hours = end.getHours() - now.getHours();
    let minutes = end.getMinutes() - now.getMinutes();
    let seconds = end.getSeconds() - now.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    return { years, months, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const people = useMemo(() => {
    const list = [
      {
        name: "Shaan",
        role: "Chief Warmonger",
        link: "https://en.wikipedia.org/wiki/Warmonger",
      },
      {
        name: "Ed",
        role: "Unpaid Therapist",
        link: "https://en.wikipedia.org/wiki/Therapy",
      },
      {
        name: "Mike",
        role: "Town Crier",
        link: "https://en.wikipedia.org/wiki/Town_crier",
      },
      {
        name: "Ben V",
        role: "Radical Environmentalist",
        link: "https://en.wikipedia.org/wiki/Radical_environmentalism",
      },
      {
        name: "Tate",
        role: "Gate",
        link: "https://en.wikipedia.org/wiki/Gate",
      },
      { name: "Malachy", role: "[tbd]", link: "#" },
      {
        name: "Miguel",
        role: "Jesse Pinkman",
        link: "https://en.wikipedia.org/wiki/Jesse_Pinkman",
      },
      {
        name: "Ishan",
        role: "(Puppet) Mayor",
        link: "https://en.wikipedia.org/wiki/Mayor",
      },
      {
        name: "Nick",
        role: "Troubadour",
        link: "https://en.wikipedia.org/wiki/Troubadour",
      },
      {
        name: "Mason",
        role: "Crypto Charlatan",
        link: "https://en.wikipedia.org/wiki/FTX",
      },
      { name: "Ben W", role: "[tbd]", link: "#" },
      {
        name: "Caden",
        role: "Plague Doctor",
        link: "https://en.wikipedia.org/wiki/Plague_doctor",
      },
      { name: "Andrew", role: "[tbd]", link: "#" },
      // { name: "[tbd]", role: "[tbd]", link: "#" },
      // { name: "[tbd]", role: "[tbd]", link: "#" },
      // { name: "[tbd]", role: "[tbd]", link: "#" },
    ];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, []);

  return (
    <>
      <div className="timer-container">
        <h1 className="title">The Compound</h1>
        <div className="timer-center">
          <div className="timer-line">
            <span className="timer-number">{timeLeft.years}</span>years{" "}
            <span className="timer-number">{timeLeft.months}</span>months{" "}
            <span className="timer-number">{timeLeft.days}</span>days
          </div>
          <div className="timer-line">
            <span className="timer-number">{timeLeft.hours}</span>hours{" "}
            <span className="timer-number">{timeLeft.minutes}</span>minutes{" "}
            <span className="timer-number">{timeLeft.seconds}</span>seconds
          </div>
        </div>
        <button
          className="scroll-arrow"
          onClick={() =>
            document
              .getElementById("people-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          ↓
        </button>
      </div>

      <div id="people-section" className="people-section">
        <div className="people-grid">
          {people.map((p) => (
            <div key={p.name} className="person-card">
              <div className="person-name">{p.name}</div>
              <a href={p.link} className="person-role">
                {p.role}
              </a>
            </div>
          ))}
        </div>
        <button
          className="scroll-arrow"
          onClick={() =>
            document
              .getElementById("updates-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          ↓
        </button>
      </div>

      <div id="updates-section" className="updates-section">
        <div className="updates-title">Compound Updates</div>
        <div className="updates-subtitle">[coming soon]</div>
      </div>
    </>
  );
}

export default App;
