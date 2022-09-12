import {useState} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import Canvas from "../components/Canvas";
import styles from '../styles/Home.module.css'
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";


const nutriscoreToEmoji = {
    "A": '🍏', "B": '🍝', "C": '🌮', "D": '🍕', "E": '💩'
}
const canvasHeight = 300;

function ShowConfetti({show, width, height}) {
    return (<>{
        show ? (
            <Confetti
                numberOfPieces={300}
                recycle={false}
                width={width}
                height={height}
            />
        ) : null
    }</>)
}

export default function Home() {
    const [result, setResult] = useState(null);
    const {widthWindow, height} = useWindowSize();

    function onFinish(res) {
        setResult(res);
    }


    return (
        <>
            <h1 className={styles.title}>🍏 Nutriscore Challenge 🍕</h1>
            <div
                className="chartContainer"
            >
                <AutoSizer disableHeight>
                    {({width}) => (
                        <Canvas width={width} onFinish={onFinish} height={canvasHeight}/>
                    )}
                </AutoSizer>
            </div>
            <ShowConfetti key={result && result.label} show={result} height={height} width={widthWindow}/>
            {result && <h1 className={styles.description}> Your nutriscore
                is {result.label} {nutriscoreToEmoji[result.label]}!</h1>}

        </>
    )
}
