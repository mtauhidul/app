import React from 'react'

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default (user) => {
    const listItemStyle = { padding: '0 16px' }
    return (
        <Card style={{ padding: 20 }}>
            <List style={{ padding: 0 }}>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Name: </b>
                            {' '}
                            <span>
                                {' '}
                                {user.name || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Address: </b>
                            {' '}
                            <span>
                                {' '}
                                {user?.address?.[0]?.val || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Email: </b>
                            {' '}
                            <span>
                                {' '}
                                {user?.email?.[0]?.val || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Phone: </b>
                            {' '}
                            <span>
                                {' '}
                                {user?.phone?.[0]?.val || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Role: </b>
                            {' '}
                            <span>
                                {' '}
                                {user.role || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
                <ListItem style={listItemStyle}>
                    <ListItemText primary={(
                        <>
                            <b> Specialty: </b>
                            {' '}
                            <span>
                                {' '}
                                {user?.specialty || '-'}
                                {' '}
                            </span>
                        </>
                    )}
                    />
                </ListItem>
            </List>
        </Card>
    )
}
