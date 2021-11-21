import React, { useState, useEffect } from "react"
import "./App.css"

const App = () => {
  const [currentBoob, setCurrentBoob] = useState(0)
  const [feeding, setFeeding] = useState(false)
  const [startDate, setStartDate] = useState(Date)
  const [timer, setTimer] = useState("0")
  const [stateInterval, setStateInterval] = useState()
  const [data, setData] = useState([])

  useEffect(() => {
    if (window.localStorage.getItem("data")) {
      setData(JSON.parse(window.localStorage.getItem("data")))
    } else {
      window.localStorage.setItem("data", "[]")
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(data))
  }, [data])

  const clickOn = (boobNumber) => {
    const startTime = Date.now()

    const interval = () => {
      const elapsedTime = Date.now() - startTime
      setTimer((elapsedTime / 1000).toFixed(2))
    }

    if (!feeding) {
      // Entry function
      setTimer("0")
      setFeeding(true)
      setStartDate(startTime)
      setStateInterval(setInterval(interval, 100))
      setCurrentBoob(boobNumber)
    } else {
      if (boobNumber === currentBoob) {
        // Exit function
        clearInterval(stateInterval)
        setCurrentBoob(0)

        const currentData = data
        const newData = [
          ...currentData,
          { boob: boobNumber, startDateTime: startDate, time: timer },
        ]

        setData(newData)

        setFeeding(false)
      } else {
        return
      }
    }
  }

  const dateFormat = {
    weekday: "short",
  }

  const timeFormat = {
    seconds: "long",
  }

  return (
    <div className="App">
      <div className="timer">{timer}</div>
      <div className="bobs">
        <button
          onClick={() => clickOn(1)}
          className={`bobLock ${
            currentBoob === 1 && feeding
              ? "feeding"
              : feeding
              ? "disabledBob"
              : "bob"
          }`}
        >
          L
        </button>
        <button
          onClick={() => clickOn(2)}
          className={`bobLock ${
            currentBoob === 2 && feeding
              ? "feeding"
              : feeding
              ? "disabledBob"
              : "bob"
          }`}
        >
          R
        </button>
      </div>
      <div className="dataContainer">
        <div className="columnHeaders">
          <div className="dataItemDateTime">DATE / TIME</div>
          <div className="dataItemDuration">DURATION</div>
          <div className="dataItemBoob">BOOB</div>
        </div>
        {data.map((item) => (
          <div className="dataItem" key={item.startDateTime}>
            <div className="dataItemDateTime">
              {new Date(parseInt(item.startDateTime)).toLocaleTimeString(
                "en-US",
                dateFormat
              )}
            </div>
            <div className="dataItemDuration">{`${Math.floor(
              parseInt(item.time) / 60
            )}:${
              Math.floor(parseInt(item.time)) -
              Math.floor(parseInt(item.time / 60)) * 60
            }s`}</div>
            <div className="dataItemBoob">
              {item.boob === 1 ? "L" : item.boob === 2 ? "R" : "Error"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
