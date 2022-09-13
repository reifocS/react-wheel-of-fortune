import {useState} from "react";
import styles from '../styles/Home.module.css'
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Wheel from "../components/Wheel";


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

const colors = ["#00823f", "#86bc2b", "#fecc00", "#ee8200", "#e73c09"];
const texts = ["A", "B", "C", "D", "E"];
const sectors = colors.map((c, i) => ({color: c, label: texts[i]}));
const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
const angVelMin = 0.002; // Below that number will be treated as a stopconst
const fontSize = '1rem';


export default function Home() {
    const [result, setResult] = useState(null);
    const {widthWindow, height} = useWindowSize();

    function onFinish(res) {
        setResult(res);
    }

    return (
        <>
            <h1 className={styles.title}>Nutriscore Challenge 🍏 🍕</h1>
            <Wheel size={canvasHeight}
                   friction={friction}
                   angVelMin={angVelMin}
                   fontSize={fontSize}
                   spinFontSize={'1rem'}
                   centerText={"SPIN"}
                   changeTextCenter={true}
                   spinSize={70}
                   sectors={sectors} className={"chartContainer"} onFinish={onFinish}/>
            <ShowConfetti key={result && result.label} show={result} height={height} width={widthWindow}/>
            {result && <h1 className={styles.description}> Your nutriscore
                is {result.label} {nutriscoreToEmoji[result.label]}!</h1>}

        </>
    )
}
