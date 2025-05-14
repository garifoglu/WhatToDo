import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { differenceInDays, parseISO, format } from 'date-fns';

const DeadlineDisplay = ({ dueDate }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [color, setColor] = useState('inherit');

    useEffect(() => {
        const updateDeadline = () => {
            if (!dueDate) return;

            const due = parseISO(dueDate);
            const now = new Date();
            const daysLeft = differenceInDays(due, now);

            // Set color based on days remaining
            if (daysLeft < 0) {
                setColor('error.main');
                setTimeLeft('Overdue');
            } else if (daysLeft === 0) {
                setColor('warning.main');
                setTimeLeft('Due today');
            } else if (daysLeft <= 3) {
                setColor('warning.main');
                setTimeLeft(`${daysLeft} day${daysLeft === 1 ? '' : 's'} left`);
            } else {
                setColor('success.main');
                setTimeLeft(`${daysLeft} days left`);
            }
        };

        updateDeadline();
        const timer = setInterval(updateDeadline, 1000 * 60 * 60); // Update every hour

        return () => clearInterval(timer);
    }, [dueDate]);

    if (!dueDate) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color={color}>
                {timeLeft}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Due: {format(parseISO(dueDate), 'MMM d, yyyy')}
            </Typography>
        </Box>
    );
};

export default DeadlineDisplay; 