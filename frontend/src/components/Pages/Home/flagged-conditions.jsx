import React from 'react'
import PropTypes from 'prop-types';
import FlaggedCondition from './flagged-condition.jsx'

const FlaggedConditions = ({ data = [] }) => {
    const slicedItems = data.slice(0, 2);
    const moreItems = data.slice(2);
    const diff = data.length - slicedItems.length;

    const items = slicedItems
        .map((title) => <FlaggedCondition key={`patient-cond-${title}`} title={title} />)

    if (diff > 0) {
        items.push(
            <FlaggedCondition
                dataRh={moreItems.join(', ')}
                key="patient-cond-plus"
                title={`+${diff} Flag${diff !== 1 ? 's' : ''}`}
            />,
        )
    }

    return items;
}

FlaggedConditions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),
}

FlaggedConditions.defaultProps = {
    data: [],
}

export default FlaggedConditions
