import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useSchoolContext } from '../../Context/SchoolProvider';

const options = ["Cash", "Cheque"];

export default function NatureOfPaymentSelect(props) {
    const { fetchDocumentData, updateLrById, objectCodes } = useSchoolContext();
    const { value, rowId, handleInputChange, name } = props
    const [selectedCode, setSelectedCode] = useState(value);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
    };

    function getStyles(name) {
        return {
            fontWeight: "600",
            color:
                objectCodes.indexOf(name) === -1
                    ? null
                    : "#176AF6"
        };
    }

    const updateLrByIdNature = async (value) => {
        try {
            const response = await updateLrById("natureOfPayment", rowId, value);
            if (response) {
                console.log(`LR with id: ${rowId} is updated`);
            } else {
                console.log("LR not updated");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const handleChangeMonth = (event) => {
        const {
            target: { value },
        } = event;

        setSelectedCode(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        // updates the row state in RecordsRow
        // mainly used in addFields feature where a new object is inserted
        // with the id == 3
        handleInputChange("natureOfPayment", rowId, event);

        // Only applies if it's not the new row
        if (rowId !== 3) {
            updateLrByIdNature(value);
        }
    };

    return (
        <FormControl
            sx={{
                minWidth: 90,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: "flex-start"
            }}>
            <Select
                name={name}
                displayEmpty
                value={selectedCode}
                onChange={handleChangeMonth}
                MenuProps={MenuProps}
                sx={{
                    "& .MuiSelect-select": {
                        padding: '10px', // Adjust input padding
                        backgroundColor: 'white', // Set input background color
                        fontWeight: '600', // Set input font weight
                        fontSize: 13,
                        maxWidth: 90,
                        minWidth: 40
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 0 }
                }}
                inputProps={{ 'aria-label': 'Without label' }}
            >
                {options.map((item) => (
                    <MenuItem
                        key={`${item}-${rowId}`}
                        value={item}
                        style={getStyles(item)}
                    >
                        <Typography variant="inherit" noWrap>
                            {item}
                        </Typography>

                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}