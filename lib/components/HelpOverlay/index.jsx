import React from 'react';
import PropTypes from 'prop-types';

import Text from 'react-svg-text';

import './style.less'

const drawRect = ({
    x: xRaw, y: yRaw, width: widthRaw, height: heightRaw,
}, r = 0) => {
    const width = widthRaw - 2 * r;
    const height = heightRaw - 2 * r;
    const x = xRaw + r;
    const y = yRaw;
    return `M${x},${y} h${width} a${r},${r} 0 0 1 ${r},${r} v${height} a${r},${r} 0 0 1 -${r},${r} h-${width} a${r},${r} 0 0 1 -${r},-${r} v-${height} a${r},${r} 0 0 1 ${r},-${r} z`;
}

const HelpOverlay = ({
    ui: {
        clientWidth,
        clientHeight,
    },
    fhir,
    tutorial: {
        open = false,
        index,
    },
    tutorial_SetClose,
    tutorial_Back,
    tutorial_Next,
    tutorial_Reset,

    time = 3000,
}) => {
    const backgroundColor = (alpha = 0.9) => `rgba(35,35,35,${alpha})`;

    const [paths, setPaths] = React.useState([]);
    const [focusedItem, setFocusedItem] = React.useState(null);
    const [help, setHelp] = React.useState(null);
    const [timers, setTimers] = React.useState([]);
    const [maxIndex, setMaxIndex] = React.useState([]);
    const [textRect, setTextRect] = React.useState({});

    React.useEffect(() => {
        const leftSidebar = document.getElementById('left-sidebar')
        const rightContent = document.getElementById('right-content')

        if (leftSidebar && leftSidebar.scrollTop >= 0) {
            leftSidebar.scrollTop = 0;
        }

        if (rightContent && rightContent.scrollTop >= 0) {
            rightContent.scrollTop = 0;
        }

        if (fhir.smart.status === 'ready') {
            const tutorials = document.querySelectorAll(`[data-tutorial='${index}']`);

            const newPaths = [];

            tutorials.forEach((t) => {
                let radius = 4;
                const bounds = t.getBoundingClientRect();

                if (t.getAttribute('data-tutorial-radius') === 'full') {
                    radius = bounds.width / 2
                }

                if (t.getAttribute('data-tutorial-invert') === 'true') {
                    t.style.background = backgroundColor(0.77);
                    t.style.color = '#FFF';
                    t.style.borderRadius = 0;
                    radius = 0;
                }

                newPaths.push(
                    {
                        d: drawRect(bounds, radius),
                        bounds,
                        attributes: {
                            'data-tutorial-key': t.getAttribute('data-tutorial-key'),
                            'data-tutorial-origin': t.getAttribute('data-tutorial-origin'),
                            'data-tutorial-label-position': t.getAttribute('data-tutorial-label-position'),
                        },
                    },
                )
            })

            setPaths(newPaths);
        }
    }, [fhir.smart.status, clientWidth, clientHeight, index, open])

    React.useEffect(() => {
        const mapping = {
            search: 'Quickly find patients',
            filter: 'Filter by condition',
            sort: 'Sort by risk level and LOS',
            qr: 'Launch mobile application',
            user: 'Profile',
            bell: 'Alerts',

            patients: ['Click each tab to display patients', 'At-Risk versus Symptomatic for', 'various conditions'],
            patient: ['Labels indicate conditions for', 'patients at risk for'],

            'patient-summary': ['Shows corresponding', 'patients selected on', 'left'],
            flagged: ['Summary of', 'patient care', 'bundles and risk', 'factors for conditions'],

            'flagged-details': ['Click arrow for more', 'detailed explanation for', 'each condition'],
            care: ['Condition', 'Specific Clinical', 'guidelines'],

            'select-patient-continue': ['Exit tutorial and', 'select a patient to view more'],
            'select-patient': ['Select patient, indicating', ' not patient is selected'],
        }

        if (focusedItem) {
            const key = focusedItem.getAttribute('data-tutorial-key');
            const origin = focusedItem.getAttribute('data-tutorial-origin') || 'bottom';
            const labelPosition = focusedItem.getAttribute('data-tutorial-label-position') || 'center';

            const text = mapping[key];

            if (text) {
                const bounds = focusedItem.getBoundingClientRect();

                let lineOrigin = `${bounds.x + bounds.width / 2}, ${bounds.y + bounds.height + 20} v10`;

                if (origin === 'right') {
                    lineOrigin = `${bounds.x + bounds.width + 20}, ${bounds.y + bounds.height / 2} h10`
                }

                if (origin === 'left') {
                    lineOrigin = `${bounds.x - 20}, ${bounds.y + bounds.height / 2} h-10`
                }

                if (origin === 'top') {
                    lineOrigin = `${bounds.x + bounds.width / 2}, ${bounds.y - 20}`;
                }

                let textX;
                let textY;
                let textAnchor;
                let lineTarget;

                if (labelPosition === 'center' && origin === 'bottom') {
                    textX = clientWidth / 2;
                    textY = clientHeight / 2;
                    textAnchor = 'middle'
                    lineTarget = `C ${bounds.x + bounds.width / 2}, ${bounds.y + bounds.height + 100} ${clientWidth / 2},${clientHeight / 2 - 100} ${clientWidth / 2},${clientHeight / 2 - 30}`
                }

                if (labelPosition === 'center' && origin === 'right') {
                    textX = clientWidth / 2;
                    textY = clientHeight / 2;
                    textAnchor = 'middle'
                    lineTarget = `C ${bounds.x + bounds.width + 200}, ${bounds.y} ${clientWidth / 2},${clientHeight / 2 - 100} ${clientWidth / 2},${clientHeight / 2 - 30}`
                }

                if (labelPosition === 'left') {
                    textX = 15;

                    const diff = ((bounds.x + 180) - textX) / 2

                    textY = bounds.y;
                    textAnchor = 'start'
                    lineTarget = `C ${bounds.x - 20 - diff}, ${bounds.y + bounds.height / 2} ${textX + 180 + diff},${textY} ${textX + 180},${textY}`
                }

                if (labelPosition === 'right') {
                    textX = clientWidth - 15;

                    const diff = (textX - (bounds.x + 180)) / 2

                    textY = bounds.y;
                    textAnchor = 'end'

                    lineTarget = `C ${bounds.x + bounds.width + 100}, ${bounds.y + bounds.height / 2} ${textX - 180 - diff},${textY} ${textX - 180},${textY}`;
                }

                const v = (
                    <g>
                        <path
                            shapeRendering="optimizeQuality"
                            markerStart="url(#arrowhead)"
                            strokeLinecap="round"
                            fill="transparent"
                            stroke="#FFF"
                            strokeWidth="5px"
                            d={`M ${lineOrigin} ${lineTarget}`}
                        />
                        <Text id="tutorial-text" x={textX} y={textY} textAnchor={textAnchor} width={100} verticalAnchor="start">
                            {
                                Array.isArray(text)
                                    ? text.join(' ')
                                    : text
                            }
                        </Text>
                    </g>
                )

                return setHelp(v)
            }
        }
        setHelp(null)
    }, [
        focusedItem, clientWidth, clientHeight, open,
    ])

    React.useEffect(() => {
        if (open) {
            if (timers.length) {
                timers.forEach((id) => clearTimeout(id));
                setTimers([]);
            }

            const tutorials = Array.from(document.querySelectorAll(`[data-tutorial='${index}']`));

            const sortedTutorials = tutorials
                .filter((item) => !!item.getAttribute('data-tutorial-key') && !!item.getAttribute('data-tutorial-order'))
                .sort((a, b) => (+(a.getAttribute('data-tutorial-order')) || 0) - (+(b.getAttribute('data-tutorial-order')) || 0))

            togglePlayback({})
        }
    }, [open, index])

    React.useEffect(() => {
        setMaxIndex(Array.from(document.querySelectorAll('[data-tutorial]')).reduce((reduced, el) => Math.max(reduced, +el.getAttribute('data-tutorial')), 0))
    })

    const togglePlayback = ({ newIndex = null }) => {
        if (timers.length) {
            timers.forEach((id) => clearTimeout(id));
            setTimers([]);
            setFocusedItem(null);
        }
        else {
            const tutorials = Array.from(document.querySelectorAll(`[data-tutorial='${newIndex || index}']`));

            const sortedTutorials = tutorials
                .filter((item) => !!item.getAttribute('data-tutorial-key') && !!item.getAttribute('data-tutorial-order'))
                .sort((a, b) => (+(a.getAttribute('data-tutorial-order')) || 0) - (+(b.getAttribute('data-tutorial-order')) || 0))

            const newTimers = sortedTutorials
                .reduce((reduced, item, idx) => {
                    const localTimers = [
                        setTimeout(() => {
                            setFocusedItem(item);
                        }, idx * time),
                    ]

                    if (idx + 1 >= sortedTutorials.length) {
                        localTimers.push(
                            setTimeout(() => {
                                tutorial_Next();
                                setTimers([]);
                                setFocusedItem(null);
                                togglePlayback({ newIndex: (newIndex || index) + 1 });
                            }, (idx + 1) * time),
                        )

                        if ((newIndex || index) >= 4) {
                            localTimers.push(
                                setTimeout(() => tutorial_Reset(), (idx + 1) * time),
                            )
                        }
                    }

                    return [...reduced, ...localTimers];
                }, []);

            // .map((item, idx) => {
            //     return setTimeout(() => {
            //         setFocusedItem(item)

            //         if (idx + 1 >= sortedTutorials.length) {
            //             setTimeout(() => {
            //                 tutorial_Next();
            //                 setTimers([]);
            //                 setFocusedItem(null);
            //                 togglePlayback({ newIndex: (newIndex || index) + 1 });
            //             }, time)

            //             if ((newIndex || index) >= 4) {
            //                 setTimeout(() => tutorial_Reset(), time)
            //             }
            //         }
            //     }, idx * time)
            // })

            setTimers(newTimers)
        }
    }

    if (open) {
        return (
            <svg
                className="overlay"
                style={{
                    position: 'absolute', width: '100%', height: '100%', zIndex: 100,
                }}
            >
                <defs>
                    <marker id="arrowhead" viewBox="0 -1 10 10" refX="3" refY="3" markerWidth="6" markerHeight="5" orient="auto-start-reverse">
                        <path strokeWidth="2px" strokeLinejoin="round" strokeLinecap="round" d="M 0 0 L 5 3 L 0 6" stroke="#fff" fill="transparent" />
                    </marker>
                </defs>
                <path
                    shapeRendering="crispEdges"
                    fillRule="evenodd"
                    d={`M0 0 H${clientWidth} V${clientHeight} H-${clientWidth} Z M${428.75 + 385} ${99.875 + 70} ${paths.map(({ d }) => d).join('\n')}`}
                    fill={backgroundColor()}
                />

                {
                    paths.map(({ d: p, attributes }) => (
                        <path
                            data-tutorial-key={attributes['data-tutorial-key']}
                            data-tutorial-origin={attributes['data-tutorial-origin']}
                            data-tutorial-label-position={attributes['data-tutorial-label-position']}
                            className="touchbox"
                            onMouseEnter={({ currentTarget }) => {
                                if (!timers.length /* && currentTarget.getAttribute("data-tutorial-order") */) {
                                    setFocusedItem(currentTarget)
                                }
                            }}
                            onTouchStart={({ currentTarget }) => {
                                if (!timers.length && currentTarget.getAttribute('data-tutorial-order')) {
                                    setFocusedItem(currentTarget)
                                }
                            }}
                            onMouseLeave={({ currentTarget }) => {
                                if (!timers.length && currentTarget.getAttribute('data-tutorial-order')) {
                                // setFocusedItem(null)
                                }
                            }}
                            d={p}
                        />
                    ))
                }

                {help}

                <g className="controls" onClick={togglePlayback}>
                    <rect fill="transparent" stroke="transparent" strokeWidth={2} x={clientWidth - 500} y={clientHeight - 80} width={40} height={40} />
                    {
                        timers.length
                            ? <rect data-rh="Stop" fill="#FFF" x={clientWidth - 490} y={clientHeight - 75} width={30} height={30} /> : <path data-rh="Play" fill="#FFF" d={`M ${clientWidth - 490} ${clientHeight - 75} v30 l25,-15 z`} />
                    }

                </g>

                <g
                    className="controls"
                    onClick={() => {
                        tutorial_Reset()
                    }}
                >
                    <rect fill="transparent" stroke="transparent" strokeWidth={2} x={15} y={clientHeight - 100} width={200} height={75} />
                    <text fill="#FFF" x={15} y={clientHeight - 50}> Exit </text>
                </g>

                {
                    index > 1
                && (
                    <g
                        className="controls"
                        onClick={() => {
                            timers.forEach((id) => clearTimeout(id));
                            setTimers([]);
                            setFocusedItem(null);
                            tutorial_Back();
                        }}
                    >
                        <rect fill="transparent" stroke="transparent" strokeWidth={2} x={clientWidth - 15 - 400} y={clientHeight - 100} width={200} height={75} />
                        <text fill="#FFF" textAnchor="end" x={clientWidth - 215} y={clientHeight - 50}> Back </text>
                    </g>
                )
                }

                {
                    index < maxIndex
                && (
                    <g
                        className="controls"
                        onClick={() => {
                            timers.forEach((id) => clearTimeout(id));
                            setTimers([]);
                            setFocusedItem(null);
                            tutorial_Next();
                        }}
                    >
                        <rect fill="transparent" stroke="transparent" strokeWidth={2} x={clientWidth - 15 - 200} y={clientHeight - 100} width={200} height={75} />
                        <text fill="#FFF" textAnchor="end" x={clientWidth - 15} y={clientHeight - 50}> Next Section </text>
                    </g>
                )
                }
            </svg>
        )
    }

    return null;
}

HelpOverlay.propTypes = {
    fhir: PropTypes.any.isRequired,
    ui: PropTypes.any.isRequired,
}

HelpOverlay.defaultProps = {

}

export default HelpOverlay
