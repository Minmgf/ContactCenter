'use client';
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
    return (
        <div className="relative h-[450px] w-[450px]">
            <Spline
                scene="https://prod.spline.design/Lta0f7XmSEKJ7uXR/scene.splinecode"
                className="absolute inset-0 size-full"
            />
        </div>
    );
};

export default SplineBackground;