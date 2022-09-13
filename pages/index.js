import {useState} from "react";
import styles from '../styles/Home.module.css'
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Wheel from "../components/Wheel";

function guidGenerator() {
    let S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const colors = ["#00823f", "#86bc2b", "#fecc00", "#ee8200", "#e73c09"];
const texts = ["Nutri A", "Nutri B", "Nutri C", "Nutri D", "Nutri E"];
const SECTORS = colors.map((c, i) => ({color: c, label: texts[i], id: guidGenerator()}));
const FRICTION = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
const ANGVELMIN = 0.002; // Below that number will be treated as a stopconst
const FONTSIZE = '1.5rem';
const fontSizes = ["1rem", "1.5rem", '2rem', "2.5rem", "3rem"];

const frictions = [{type: "soft", value: 0.995}, {type: "mid", value: 0.991}, {type: "hard", value: 0.98}]

export default function Home() {
    const [result, setResult] = useState(null);
    const {widthWindow, height} = useWindowSize();
    const [friction, setFriction] = useState(FRICTION);
    const [angVelMin] = useState(ANGVELMIN);
    const [centerText, setCenter] = useState("SPIN");
    const [fontSize, setFontSize] = useState(FONTSIZE);
    const [spinSize, setSpinSize] = useState(50);
    const [wheelSize, setWheelSize] = useState(canvasHeight);
    const [changeTextCenter, setChangeTextCenter] = useState(true);
    const [responsiveC, setResponsiveC] = useState(true);
    const [runOnlyOnce, setRunOnlyOnce] = useState(true);
    const [sectors, setSectors] = useState(SECTORS);

    function onFinish(res) {
        setResult(res);
    }

    function updateSector(label, id) {
        setSectors(prev => prev.map(s => s.id === id ? ({...s, label}) : s));
    }

    function deleteSector(id) {
        setSectors(prev => prev.filter(s => s.id !== id));
    }

    function addSector(e) {
        e.preventDefault();
        setSectors(prev => [...prev, {
            label: e.target.newSector.value,
            id: guidGenerator(),
            color: getRandomColor()
        }])
    }

    return (
        <>
            <h1 className={styles.title}>React awesome wheel!</h1>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {/*<input placeholder={"friction"} type={"number"} value={friction}
                       onChange={(e) => setFriction(e.target.value)}/>
                <input placeholder={"angle Velocity Min"} type={"number"} value={angVelMin}
                       onChange={(e) => setAngVelMin(e.target.value)}/>*/}
                    <select value={friction}
                            onChange={(e) => setFriction(e.target.value)}>
                        {frictions.map((f, i) => <option
                            value={f.value}
                            key={i}>{f.type}</option>)}
                    </select>
                    <select value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}>
                        {fontSizes.map((f, i) => <option
                            value={f}
                            key={i}>{f}</option>)}
                    </select>
                    <input min={100} placeholder={"wheel size"} type={"number"} value={wheelSize}
                           onChange={(e) => setWheelSize(+e.target.value)}/>
                    <input min={50} max={wheelSize} placeholder={"spin size"} type={"number"} value={spinSize}
                           onChange={(e) => setSpinSize(+e.target.value)}/>
                    <input placeholder={"center text"} type={"text"} value={centerText}
                           onChange={(e) => setCenter(e.target.value)}/>
                    <input placeholder={"change text"} type={"checkbox"} checked={changeTextCenter}
                           onChange={(e) => setChangeTextCenter(e.target.checked)}/>
                    <input placeholder={"responsive container"} type={"checkbox"} checked={responsiveC}
                           onChange={(e) => setResponsiveC(e.target.checked)}/>
                    <input placeholder={"responsive container"} type={"checkbox"} checked={runOnlyOnce}
                           onChange={(e) => setRunOnlyOnce(e.target.checked)}/>
                    <ul>
                        {sectors.map(s => <li key={s.id}><input
                            onChange={(e) => updateSector(e.target.value, s.id)}
                            value={s.label}/>
                            <button disabled={sectors.length === 1} onClick={() => deleteSector(s.id)}>X</button>
                        </li>)}
                        <li>
                            <form style={{display: "inline"}} onSubmit={(e) => addSector(e)}>
                                <input required name="newSector"/>
                                <button>+</button>
                            </form>
                        </li>
                    </ul>
                </div>
                <div style={{flexGrow: 1}}>
                    <Wheel size={wheelSize}
                           friction={friction}
                           angVelMin={angVelMin}
                           fontSize={fontSize}
                           spinFontSize={'1rem'}
                           fixedContainerWidth={responsiveC ? undefined : wheelSize}
                           centerText={centerText}
                           changeTextCenter={changeTextCenter}
                           spinSize={spinSize}
                           runOnlyOnce={runOnlyOnce}
                           sectors={sectors} onFinish={onFinish}/>
                </div>
                <ShowConfetti key={result && result.label} show={result} height={height} width={widthWindow}/>

            </div>
            {result && <h1 className={styles.description}> Your won
                a {result.label} {nutriscoreToEmoji[result.label]}!</h1>}
        </>
    )
}
