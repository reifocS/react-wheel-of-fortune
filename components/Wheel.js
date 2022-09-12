import AutoSizer from "react-virtualized-auto-sizer";
import Canvas from "./Canvas";

export default function Wheel({
                                  changeTextCenter,
                                  size,
                                  spinFontSize,
                                  onFinish,
                                  className,
                                  sectors,
                                  friction,
                                  angVelMin,
                                  fontSize,
                                  centerText,
                                  runOnlyOnce
                              }) {

    return <div className={className}><AutoSizer disableHeight>
        {({width}) => (
            <Canvas width={width} onFinish={onFinish} height={size} sectors={sectors} friction={friction}
                    angVelMin={angVelMin}
                    fontSize={fontSize}
                    centerText={centerText}
                    runOnlyOnce={runOnlyOnce}
                    spinFontSize={spinFontSize}
                    changeTextCenter={changeTextCenter}
            />
        )}
    </AutoSizer></div>
}
