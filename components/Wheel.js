import AutoSizer from "react-virtualized-auto-sizer";
import Canvas from "./Canvas";

export default function Wheel({size, onFinish, className, sectors, friction, angVelMin, fontSize}) {

    return <div className={className}><AutoSizer disableHeight>
        {({width}) => (
            <Canvas width={width} onFinish={onFinish} height={size} sectors={sectors} friction={friction}
                    angVelMin={angVelMin}
                    fontSize={fontSize}
            />
        )}
    </AutoSizer></div>
}
