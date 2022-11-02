import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { DateTime } from 'luxon';

import DoneAllIcon from '@material-ui/icons/DoneAll';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiBadge-badge': {
            minWidth: 10,
            height: 10,
            padding: 0,
        },
    },
}));

export default ({
    data,
    fhir_SetPatientNotificationAsRead = () => { },
}) => {
    const classes = useStyles();

    const viewed = [];
    const pending = [];

    data.forEach((item) => {
        if (item.viewed) {
            viewed.push(item);
        }
        else {
            pending.push(item);
        }
    })

    return (
        <Card>
            {
                [
                    { title: 'New notifications', list: pending },
                    { title: 'Viewed notifications', list: viewed },
                ]
                    .map(({ list, title }) => (
                        <div key={`notification-${title}`} style={{ display: list.length ? 'flex' : 'none', flexDirection: 'column', paddingTop: 10 }}>
                            {/* <h3 style={{ margin: "0 auto" }} > {title} </h3> */}
                            <List className={classes.root}>
                                {
                                    list
                                        .sort((a, b) => {
                                            if (a.viewed && b.viewed) {
                                                return DateTime.fromISO(b.viewed).toMillis() - DateTime.fromISO(a.viewed).toMillis()
                                            }
                                            return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis()
                                        })
                                        .map(({
                                            id, idx, label, date, viewed, icon,
                                        }) => {
                                            const RandomIcon = icon || (() => <> * </>)

                                            return (
                                                <ListItem
                                                    key={`notification-${id}`}
                                                >
                                                    <ListItemAvatar>
                                                        <Badge
                                                            overlap="rectangular"
                                                            invisible={!!viewed}
                                                            color="primary"
                                                            badgeContent="&nbsp;"
                                                        >
                                                            <Avatar style={{ width: 50, height: 50 }}>
                                                                <RandomIcon />
                                                            </Avatar>
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={label}
                                                        secondary={DateTime.fromISO(date).toFormat('MMM dd, yyyy')}
                                                    />
                                                    {
                                                        !viewed ? (
                                                            <ListItemIcon>
                                                                <Button
                                                                    style={{ fontSize: '0.8em', padding: '0 5px', textTransform: 'capitalize' }}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => fhir_SetPatientNotificationAsRead(id)}
                                                                >
                                                                    Mark as viewed
                                                                </Button>
                                                            </ListItemIcon>
                                                        )
                                                            : (
                                                                <Button
                                                                    data-rh={DateTime.fromISO(viewed).toFormat('MMM dd, yyyy')}
                                                                    disableRipple
                                                                    style={{
                                                                        color: 'rgba(0,0,0,0.5)', fontSize: '0.8em', padding: '0 5px', textTransform: 'capitalize',
                                                                    }}
                                                                    startIcon={<DoneAllIcon style={{ width: 18, height: 18 }} />}
                                                                >
                                                                    Viewed
                                                                </Button>
                                                            )
                                                    }
                                                </ListItem>
                                            )
                                        })
                                }
                            </List>
                            <Divider />
                        </div>
                    ))
            }
        </Card>
    )
}
