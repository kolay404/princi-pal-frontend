import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu } from '@mui/material';

function People(props) {
    const [member, setMember] = useState('');
    const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleDropdownOpen = (event, index) => {
        setDropdownAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleDeleteOpen = (event, index) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleMenuClose = () => {
        setDropdownAnchorEl(null);
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = () => {
        // Implement delete functionality here
        console.log("Delete button clicked for row at index:", selectedIndex);
        // Close the menu after delete
        handleMenuClose();
    };

    const handleRoleChange = (newRole) => {
        // Implement role change functionality here
        console.log(`Role changed to ${newRole} for row at index:`, selectedIndex);
        // Close the menu after role change
        handleMenuClose();
    };

    const rows = [
        { name: 'Deriel Magallanes', email: 'derielgwapsmagallanes@cit.edu', role: 'Member', lastActivity: 'Nov 2' },
        { name: 'Ellain J', email: 'ellaine@cit.edu', role: 'Member', lastActivity: 'Dec 3' },
        { name: 'Janicka Ngeps', email: 'janickangepert@cit.edu', role: 'Owner' },
        { name: 'Brian Despi', email: 'briandespirads@cit.edu', role: 'Member' },
        { name: 'Luff D', email: 'luffyd@cit.edu', role: 'Member' },
    ];

    return (
        <Container className="test" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}
                    sx={{
                        display: 'flex',
                    }}>
                    <TextField
                        sx={{ margin: '11px', marginTop: '-5px', height: '20px', width: '40%' }}
                        id="search"
                        label="Search by name or email"
                        variant="outlined"
                        className="searchTextField"
                    />
                    <TextField
                        sx={{ margin: '5px', marginTop: '-5px', marginLeft: '50px' , width: '30%' }}
                        id="invite"
                        label="Invite by email"
                        variant="outlined"
                        className="inviteTextField"
                    />
                    <FormControl sx={{ minWidth: 120 }} size="53px">
                        <InputLabel sx={{ margin: '5px', marginTop: '-5px'}} id="demo-select-small-label">Member</InputLabel>
                        <Select
                            sx={{ margin: '-5px', marginTop: '-5px' }}
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={member}
                            label="Member"
                            onChange={(event) => setMember(event.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem>Member</MenuItem>
                            <MenuItem>Guess</MenuItem>
                            <MenuItem>Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        sx={{ margin: '5px', marginTop: '-5px', width: '10%'}}
                        variant="contained"
                        className="inviteButton"
                    >
                        Invite
                    </Button>
                </Grid>
                <Grid item xs={5} md={12} lg={12} sx={{ display: 'flex', margin: '5px', marginTop: '-5px' }}>
                <TextField
                        sx={{ margin: '20px', marginTop: '-5px', marginLeft: '6px' , width: '30%' }}
                        id="invite"
                        label="School Filter"
                        variant="outlined"
                        className="schoolFilter"
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sx={{ margin: '5px', marginTop: '-5px' }}>
                    <TableContainer component={Paper} sx={{ padding: '10px', paddingBottom: '30px' }}>
                        <Table md={{ display: 'flex', height: '100%', width: '100%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Last Activity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item>
                                                    <Avatar sx={{ bgcolor: blue[900] }}>{row.name.charAt(0)}</Avatar>
                                                </Grid>
                                                <Grid item>{row.name}</Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>
                                            {/* Role with dropdown arrow */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span>{row.role}</span>
                                                <ArrowDropDownIcon onClick={(event) => handleDropdownOpen(event, index)} />
                                            </div>
                                            {/* Dropdown menu for role options */}
                                            <Menu
                                                id={`menu-dropdown-${index}`}
                                                anchorEl={dropdownAnchorEl}
                                                open={Boolean(dropdownAnchorEl && selectedIndex === index)}
                                                onClose={handleMenuClose}
                                            >
                                                {/* Role options */}
                                                <MenuItem onClick={() => handleRoleChange("ADMIN")}>ADMIN</MenuItem>
                                                <MenuItem onClick={() => handleRoleChange("OWNER")}>OWNER</MenuItem>
                                                <MenuItem onClick={() => handleRoleChange("ADAS")}>ADAS</MenuItem>
                                                <MenuItem onClick={() => handleRoleChange("ADOF")}>ADOF</MenuItem>
                                            </Menu>
                                        </TableCell>
                                        <TableCell>{row.lastActivity}</TableCell>
                                        <TableCell>
                                            {/* Delete button */}
                                            <Button
                                                aria-controls={`menu-delete-${index}`}
                                                aria-haspopup="true"
                                                onClick={(event) => handleDeleteOpen(event, index)}
                                            >
                                                <MoreHorizIcon />
                                            </Button>
                                            {/* Delete menu */}
                                            <Menu
                                                id={`menu-delete-${index}`}
                                                anchorEl={deleteAnchorEl}
                                                open={Boolean(deleteAnchorEl && selectedIndex === index)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}

export default People;
