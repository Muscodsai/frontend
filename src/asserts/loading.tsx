/**
 * Returns an element of a loading icon along with a text message, centered at the parent layout.
 *
 * @param message the message that is being shown to the user while loading
 * @param scale the scale of the loading icon
 * @param color the color of the dots
 * @param n the number of dots
 */
export function Loading ({ message = "Loading...", scale = 1.0, color = "#000",  n = 12 }: { message?: string; scale?: number; color?: string; n?: number}) {
    return (
        <div className="flex items-center justify-center w-full h-full flex-col">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${100*scale} ${100*scale}`}
                width={`${100*scale}`}
                height={`${100*scale}`}
            >
                {
                    [...Array(n)].map((_, index) => {
                    const angle = - (index * 360/n) * (Math.PI / 180);
                    const radius = 30 * scale;
                    const x = 50 * scale + radius * Math.cos(angle);
                    const y = 50 * scale + radius * Math.sin(angle);

                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r={`${4.5*scale}`}
                            fill={color}
                        >
                            <animate
                                attributeName="fill-opacity"
                                values="1;0"
                                dur={`${(n * 0.1)}s`}
                                begin={`${-(index * 0.1)}s`}
                                repeatCount="indefinite"
                            />
                        </circle>
                    );
                })}
            </svg>
            { message? <h1>{message}</h1> : null }
        </div>
    );
}

export function LGBTLoading ({ message = "Loading...", scale = 1.0 }: { message?: string; scale?: number; }) {
    return (
        <div className="flex items-center justify-center w-full h-full flex-col">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${100*scale} ${100*scale}`}
                width={`${100*scale}`}
                height={`${100*scale}`}
            >
                {
                    [...Array(7)].map((_, index) => {
                        const angle = - (index * 360/7) * (Math.PI / 180);
                        const radius = 30 * scale;
                        const x = 50 * scale + radius * Math.cos(angle);
                        const y = 50 * scale + radius * Math.sin(angle);

                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r={`${5.5 * scale}`}
                            >
                                <animate
                                    attributeName="fill"
                                    values="#f00;#f80;#ff0;#0f0;#0ff;#00f;#80f"
                                    dur="1.4s"
                                    begin={`${-(index * 0.2)}s`}
                                    repeatCount="indefinite"
                                />
                            </circle>
                        );
                    })}
            </svg>
            { message? <h1>{message}</h1> : null }
        </div>
    );
}

LGBTLoading({});  // suppress Unused Method warning.