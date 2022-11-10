import React from "react"
import "./style.css"

export default function Answers(props){
    
    const selectStyle = {
        backgroundColor: 
        props.item.selected && props.item.green === undefined? "#D6DBF5" 
        : props.item.green? "#94D7A2"
        : !props.item.green && props.item.selected ? "#F8BCBC"
        : "transparent",

        opacity: props.item.opacity
    }
    
    return (
        <p 
            className="ans" 
            style={selectStyle}
            onClick={()=>props.toggle(props.id)}
        >
            {props.item.ans}
        </p>
    )
}