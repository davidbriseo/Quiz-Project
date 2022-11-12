import React from "react"
import {nanoid} from "nanoid"
import Answers from "./Answers"

export default function Quiz(props){
    
    const answers = props.item.answers.map(item =>
        <Answers 
            key={nanoid()}
            id={item.id}
            item={item}
            toggle={props.toggle}
        />
    )
    
    return(
        <div className="quiz">
            <p className="question">
                {props.item.question}
            </p>
            <div className="answers">
                {answers}
            </div>
        </div>
    )
}