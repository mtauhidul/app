import React from 'react';

import {
    ResponsiveContainer, LineChart, CartesianGrid,
    XAxis, YAxis, Tooltip, Legend, Line,
} from 'recharts';

const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`

export default ({
    type, color, data: dataRaw = [], units = '',
}) => {
    const data = dataRaw.map((item) => {
        const result = { ...item }

        if (result.value) {
            result.value = Math.round((item.value || 0) * 10) / 10;
        }

        if (result.data) {
            result.data = Math.round((item.data || 0) * 10) / 10;
        }

        return result;
    });

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    padding={{
                        top: 100,
                        left: 25,
                        right: 25,
                    }}
                />
                <YAxis
                    label={units ? { value: units, angle: -90, position: 'insideLeft' } : null}
                    domain={['auto', 'auto']}
                />
                <Tooltip />
                <Legend />
                {
                    Object.keys(data[0] || {}).filter((key) => key !== 'date').map((key, idx) => (
                        <Line
                            key={`data-chart-line-${key}`}
                            strokeWidth={2}
                            isAnimationActive={false}
                            type="linear"
                            dataKey={key}
                            name={
                                `${capitalize(type || key)}`
                            }
                            stroke={color[idx] || color}
                        />
                    ))
                }

            </LineChart>
        </ResponsiveContainer>
    )
}
