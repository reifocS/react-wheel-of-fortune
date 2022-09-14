import {useState} from "react";
import styles from '../styles/Home.module.css'
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
const fontSizes = ["0.5rem", "1rem", "1.5rem", '2rem', "2.5rem", "3rem"];

const frictions = [{type: "soft", value: 0.995}, {type: "mid", value: 0.991}, {type: "hard", value: 0.98}]

export default function Home() {
    const [friction, setFriction] = useState(FRICTION);
    const [angVelMin] = useState(ANGVELMIN);
    const [centerText, setCenter] = useState("SPIN");
    const [fontSize, setFontSize] = useState(FONTSIZE);
    const [spinFontSize, setSpinFontSize] = useState("1rem");
    const [spinSize, setSpinSize] = useState(50);
    const [wheelSize, setWheelSize] = useState(canvasHeight);
    const [changeTextCenter, setChangeTextCenter] = useState(true);
    const [responsiveC, setResponsiveC] = useState(true);
    const [runOnlyOnce, setRunOnlyOnce] = useState(true);
    const [sectors, setSectors] = useState(SECTORS);

    function onFinish(res) {
        alert(res.label);
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
                    alignItems: "center",
                    padding: 10,
                    gap: 2
                }}>
                    <label htmlFor={"friction"}>friction</label>
                    <select value={friction}
                            id={"friction"}
                            onChange={(e) => setFriction(e.target.value)}>
                        {frictions.map((f, i) => <option
                            value={f.value}
                            key={i}>{f.type}</option>)}
                    </select>
                    <label htmlFor={"fontSize"}>sectors font size</label>

                    <select value={fontSize}
                            id={"fontSize"}
                            onChange={(e) => setFontSize(e.target.value)}>
                        {fontSizes.map((f, i) => <option
                            value={f}
                            key={i}>{f}</option>)}
                    </select>

                    <label htmlFor={"spinFontSize"}>spinner font size</label>

                    <select id={"spinFontSize"} value={spinFontSize}
                            onChange={(e) => setSpinFontSize(e.target.value)}>
                        {fontSizes.map((f, i) => <option
                            value={f}
                            key={i}>{f}</option>)}
                    </select>
                    <label htmlFor={"wheelSize"}>Wheel radius</label>
                    <input min={100}
                           max={1000}
                           placeholder={"wheel size"}
                           type={"range"}
                           value={wheelSize}
                           onChange={(e) => setWheelSize(+e.target.value)}/>
                    <label htmlFor={"spinSize"}>Center radius</label>
                    <input min={50}
                           max={wheelSize}
                           id={"spinSize"}
                           placeholder={"spin size"}
                           type={"range"}
                           value={spinSize}
                           onChange={(e) => setSpinSize(+e.target.value)}/>
                    <label htmlFor={"textCenter"}>Center Text</label>
                    <input placeholder={"center text"}
                           id={"textCenter"}
                           type={"text"} value={centerText}
                           onChange={(e) => setCenter(e.target.value)}/>
                    <label htmlFor={"changeTextCenter"}>Change text center on spin</label>
                    <input id={"changeTextCenter"} placeholder={"change text"} type={"checkbox"} checked={changeTextCenter}
                           onChange={(e) => setChangeTextCenter(e.target.checked)}/>
                    <label htmlFor={"responsiveWheel"}>Responsive wheel</label>
                    <input id={"responsiveWheel"} placeholder={"responsive container"} type={"checkbox"} checked={responsiveC}
                           onChange={(e) => setResponsiveC(e.target.checked)}/>
                    <label htmlFor={"runOnlyOnce"}>Run only once</label>
                    <input id={"runOnlyOnce"} placeholder={"responsive container"} type={"checkbox"} checked={runOnlyOnce}
                           onChange={(e) => setRunOnlyOnce(e.target.checked)}/>
                    <ul style={{backgroundColor: "gray",
                        listStyle: "none",
                        borderRadius: 6, padding: 4}}>
                        <label htmlFor={sectors[0].label + '0'}>Sectors</label>
                        {sectors.map((s, i) => <li key={s.id}><input
                            id={s.label+i}
                            style={{maxWidth: 100}}
                            onChange={(e) => updateSector(e.target.value, s.id)}
                            value={s.label}/>
                            <button disabled={sectors.length === 1} onClick={() => deleteSector(s.id)}>X</button>
                        </li>)}
                        <li>
                            <form style={{display: "inline"}} onSubmit={(e) => addSector(e)}>
                                <input style={{maxWidth: 100}} required name="newSector"/>
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
                           spinFontSize={spinFontSize}
                           fixedContainerWidth={responsiveC ? undefined : wheelSize}
                           centerText={centerText}
                           changeTextCenter={changeTextCenter}
                           spinSize={spinSize}
                           runOnlyOnce={runOnlyOnce}
                           sectors={sectors} onFinish={onFinish}/>
                </div>

            </div>
        </>
    )
}