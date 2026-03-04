import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Map from "./Map";

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
        link: "https://en.wikipedia.org/wiki/The_Dictator",
      },
      {
        name: "Ed",
        role: "Unpaid Therapist",
        link: "https://en.wikipedia.org/wiki/Nihilism",
      },
      {
        name: "Mike",
        role: "Town Crier",
        link: "https://en.wikipedia.org/wiki/Town_crier",
      },
      {
        name: "Ben V",
        role: "Radical Environmentalist",
        link: "https://en.wikipedia.org/wiki/Ocean_sunfish",
      },
      {
        name: "Tate",
        role: "Gate",
        link: "/tate/gate.html",
      },
      { 
        name: "Malachy", 
        role: "Child Labor Union President", 
        link: "https://en.wikipedia.org/wiki/Child_labour#Potential_positives", 
      },
      {
        name: "Miguel",
        role: "Jesse Pinkman",
        link: "https://en.wikipedia.org/wiki/Jesse_Pinkman",
      },
      {
        name: "Ishan",
        role: "(Puppet) Mayor",
        link: "https://en.wikipedia.org/wiki/Puppet_ruler",
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
      {
        name: "Ben W",
        role: "Cow Tools Specialist",
        link: "https://en.wikipedia.org/wiki/Cow_tools",
      },
      {
        name: "Caden",
        role: "Plague Doctor",
        link: "https://en.wikipedia.org/wiki/Plague_doctor",
      },
      {
        name: "Andrew",
        role: "Bard",
        link: "https://www.youtube.com/watch?v=cRIfsFefatg",
      },
      {
        name: "Caleb",
        role: "Town Arsonist",
        link: "https://en.wikipedia.org/wiki/Gunpowder_Plot",
      },
      // { name: "[tbd]", role: "[tbd]", link: "#" },
      // { name: "[tbd]", role: "[tbd]", link: "#" },
    ];
    const ishanIndex = list.findIndex((p) => p.name === "Ishan");
    const [ishan] = list.splice(ishanIndex, 1);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    list.push(ishan);
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
        <div className="updates-title">Map</div>
        <div className="map-container">
          <Map people={people} />
        </div>
      </div>
    </>
  );
}

export default App;