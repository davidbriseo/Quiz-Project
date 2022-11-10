import React from "react"
import Presentation from "./Presentation"
import Quiz from "./Quiz"
import {nanoid} from "nanoid"
// import {he} from "he"
import "./style.css"

export default function App(){
    
    const [displayQuiz, setDisplayQuiz] = React.useState(false)
    
    function startQuiz(){
        setDisplayQuiz(true)
    }
    
    const [quiz, setQuiz] = React.useState([])
    
    function getQA(){
        fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=medium&type=multiple")
        // "https://opentdb.com/api.php?amount=5&category=10&type=multiple"
        
            .then(res => res.json())
            .then(data => setQuiz(data.results))
    }
    
    React.useEffect(()=>{
        getQA()
    }, [])
    
    const entities = {
        "&#039;": "'",
        "&quot;": '"',
        "&ntilde;": "ñ",
        "&eacute;": "é",
        "&aacute;": "á",
        "&amp;": "&",
        "&uuml;": "ü",
        "&rsquo;": "’",
        "&euml;": "ë"
        }
        
    const questionsDecoded = quiz.map(item =>
        item.question.replace(/&#?\w+;/g, match => entities[match])
    )
    
    const correctDecoded = quiz.map(item =>{
        return {
            ans: item.correct_answer.replace(/&#?\w+;/g, match => entities[match]), 
            correct: true, 
            selected: false, 
            id: nanoid()
        }
    })
    
    const incorrectDecoded = quiz.map(item =>
        item.incorrect_answers.map(string =>
            string.replace(/&#?\w+;/g, match => entities[match])
        )
    )
    
    const incorrectObj = incorrectDecoded.map(items => 
        items.map(item=>{
            return {
                ans: item,
                correct: false,
                selected: false,
                id: nanoid()
            }
        })
    )
    
    function randomNum(){
        return Math.floor(Math.random()*3)
    }
    
    for (const item of incorrectObj){
        item.splice(randomNum(), 0, correctDecoded[incorrectObj.indexOf(item)])
    }
    
    const allData = incorrectObj.map((item,index) => {
        return {answers: item, question: questionsDecoded[index]}
    })
    
    // console.log(quiz)

    // const allData = incorrectObj.map((item, index) => 
    // item.concat(correctDecoded[index])).map((item,index) => {
    //     return {answers: item, question: questionsDecoded[index]}
    // })
    
    const [quizQA, setQuizQA] = React.useState([])
    
    React.useEffect(()=>{
         setQuizQA(allData) 
    }, [quiz])

    function toggle(id){
        setQuizQA(prevQuizQA => prevQuizQA.map(qA =>{
           
            const newAns = [] 
            
            for (const el of qA.answers){
                if (el.selected){
                    if (id === el.id){ 
                        newAns.push({...el, selected: !el.selected}) 
                    }
                    else {return qA}
                } else {
                    if (id === el.id){
                        newAns.push({...el, selected: true})
                    } else {
                        newAns.push({...el, selected: false})
                    }
                }
            }
            
            return {...qA, answers: newAns}
        }))
    }
    
    const [points, setPoints] = React.useState(0)
    const [tally, setTally] = React.useState(false)
    
    function checkAnswers(){
        setQuizQA(prevQuizQA => prevQuizQA.map(qA => {
            return {
                ...qA,
                answers: qA.answers.map(ans => {
                   return ans.selected && ans.correct ? 
                   {...ans, green: true, opacity: 1}
                   : ans.selected && !ans.correct ? 
                   {...ans, green: false, opacity: 1}
                   : ans.correct ? 
                   {...ans, green: true, opacity: 1}
                   : {...ans, opacity: .5}
                })
            }
        }))
        
        quizQA.map(qa => qa.answers.map( ans =>{
            if (ans.correct && ans.selected){
                return setPoints(prevPoints => prevPoints += 1)
            }
        }))
        
        setTally(true)
    }
    
    function reset(){
        getQA()
        setPoints(0)
        setTally(false)
    }
    
    const questionAnswer = quizQA.map(item => 
        <Quiz
            key={nanoid()}
            item={item}
            toggle={toggle}
        />
    )
    
    return (
        <main className="app">
            {!displayQuiz && <Presentation startQuiz={startQuiz}/>}
            {displayQuiz && questionAnswer}
            {displayQuiz && !tally && 
                <button className="quiz-btn" onClick={checkAnswers}>
                    Check answers
                </button>
            }
            <div className="tally-reset">
                {tally && <p className="points">You scored {points}/5 correct answers</p>}
                {tally &&
                    <button className="reset-btn" onClick={reset}>
                        Play again
                    </button>
                }
            </div>
            {!displayQuiz && <div className="blob-1"></div>}
            {!displayQuiz && <div className="blob-2"></div>}
            {displayQuiz && <div className="blob-3"></div>}
            {displayQuiz && <div className="blob-4"></div>}
        </main>
    )
}