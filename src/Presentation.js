import React from "react"
import "./style.css"

export default function Presentation(props){
    return (
        <div className="presentation">
            <h1>Quizzical</h1>
            <p>How much dou you know about literature?</p>
            <button className="pres-btn" onClick={props.startQuiz}>Start quiz</button>
        </div>
    )
}