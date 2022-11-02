import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

export default ({ units, data, type }) => {
    const listItemStyle = { padding: '0 16px' };

    return (
        <>
            {
                type
            && (
                <h4>
                    {' '}
                    {type}
                    {' '}
                </h4>
            )
            }
            {
                data.length
                    ? (
                        <List>
                            {
                                data.map((item, idx) => (
                                    <ListItem
                                        style={listItemStyle}
                                        key={`data-list-item-${idx}-${item.value}`}
                                    >
                                        <ListItemText
                                            primary={`${Object.keys(item)
                                                .filter((key) => key !== 'date')
                                                .map((key) => item[key])
                                                .join('/')
                                            } ${units}`}
                                            secondary={item.date}
                                        />
                                    </ListItem>
                                ))
                            }
                        </List>
                    )
                    : <h4> No data available </h4>
            }
            <br />
            <Divider />
            <br />
        </>
    )
}
