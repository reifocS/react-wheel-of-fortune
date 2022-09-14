import {useEffect, useRef, useState} from "react";

const rand = (m, M) => Math.random() * (M - m) + m;

export default function Canvas({
                                   width,
                                   height,
                                   onFinish,
                                   runOnlyOnce,
                                   sectors,
                                   friction,
                                   angVelMin,
                                   fontSize,
                                   textAlign = "right",
                                   innerFontColor = "white",
                                   centerText,
                                   spinFontSize,
                                   fontFamily = "arial",
                                   fontColor = "white",
                                   changeTextCenter = true,
                                   spinSize = 50,
                               }) {
    const canvasRef = useRef(null);
    const spinRef = useRef(null);
    const angleRef = useRef(0);
    const angleVelRef = useRef(0);
    const angVelMaxRef = useRef(0);
    const isAcceleratingRef = useRef(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasRunOnce, setHasRunOne] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const scale = window.devicePixelRatio;
        const dia = Math.min(height, width);
        canvas.width = Math.floor(dia * scale);
        canvas.height = Math.floor(dia * scale);
        canvas.style.width = `${dia}px`;
        canvas.style.height = `${dia}px`;

        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);

        const tot = sectors.length;
        const elSpin = spinRef.current;
        const rad = dia / 2;
        const PI = Math.PI;
        const TAU = 2 * PI;
        const arc = TAU / sectors.length;

        let raf;
        //* Get index of current sector */
        const getIndex = () =>
            Math.floor(tot - (angleRef.current / TAU) * tot) % tot;

        //* Draw sectors and prizes texts to canvas */
        const drawSector = (sector, i) => {
            const ang = arc * i;
            ctx.save();
            // COLOR
            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, ang, ang + arc);
            ctx.lineTo(rad, rad);
            ctx.fill();
            // TEXT
            ctx.translate(rad, rad);
            ctx.rotate(ang + arc / 2);
            ctx.textAlign = textAlign;
            ctx.fillStyle = fontColor;
            ctx.font = `bold ${fontSize} ${fontFamily}`;
            ctx.fillText(sector.label, rad - 10, 10);
            //
            ctx.restore();
        };

        //* CSS rotate CANVAS Element */
        const rotate = () => {
            const sector = sectors[getIndex()];
            ctx.canvas.style.transform = `translate(-50%, -50%) rotate(${
                angleRef.current - PI / 2
            }rad)`;
            if (changeTextCenter) {
                elSpin.textContent = !angleVelRef.current ? centerText : sector.label;
                elSpin.style.fontSize = spinFontSize;
            }
            elSpin.style.height = spinSize + "px";
            elSpin.style.width = spinSize + "px";
            elSpin.style.color = innerFontColor;
            elSpin.style.background = sector.color;
        };

        const frame = () => {
            if (!isSpinning) return;

            if (angleVelRef.current >= angVelMaxRef.current)
                isAcceleratingRef.current = false;

            // Accelerate
            if (isAcceleratingRef.current) {
                angleVelRef.current ||= angVelMin; // Initial velocity kick
                angleVelRef.current *= 1.06; // Accelerate
            }

            // Decelerate
            else {
                isAcceleratingRef.current = false;
                angleVelRef.current *= friction; // Decelerate by friction

                // SPIN END:
                if (angleVelRef.current < angVelMin) {
                    setIsSpinning(false);
                    angleVelRef.current = 0;
                    onFinish(sectors[getIndex()]);
                }
            }

            angleRef.current += angleVelRef.current; // Update angle
            angleRef.current %= TAU; // Normalize angle
            rotate(); // CSS rotate!
        };

        const engine = () => {
            frame();
            raf = requestAnimationFrame(engine);
        };

        // INIT!
        sectors.forEach(drawSector);
        rotate(); // Initial rotation
        engine(); // Start engine!

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [width, height, isSpinning, onFinish, sectors, fontSize, angVelMin, friction, centerText, spinFontSize, changeTextCenter, spinSize, fontFamily, textAlign, fontColor, innerFontColor, runOnlyOnce]);

    return (
        <>
            <div
                style={{
                    width,
                    height: Math.min(height, width),
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <canvas id="wheel" ref={canvasRef}/>
                <button
                    id="spin"
                    ref={spinRef}
                    style={{
                        cursor: runOnlyOnce && hasRunOnce ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isSpinning || (runOnlyOnce && hasRunOnce)}
                    onClick={() => {
                        setIsSpinning(true);
                        setHasRunOne(true);
                        angVelMaxRef.current = rand(0.15, 0.7);
                        isAcceleratingRef.current = true;
                    }}
                >
                    {centerText}
                </button>
            </div>
        </>
    );
}
