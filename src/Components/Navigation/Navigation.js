// React imports
import React, { useEffect, useState, useCallback } from "react";

// Material-UI imports
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Avatar from '@mui/material/Avatar';

// Custom imports
import { styling } from "./styling";
import { DisplayItems, ProfileTab } from "./DisplayItems";
import { useNavigationContext } from "../../Context/NavigationProvider";
import CustomizedSwitches from "./CustomizedSwitches";
import NavigationSearchBar from "./NavigationSearchBar";
import { useSchoolContext } from '../../Context/SchoolProvider';

// Static object testing
const User = {
  name: "Jay Nayon",
  email: "jay.nayonjr@cit.edu",
};

const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["width", "margin", "padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingLeft: 5,
  ...(open && {
    transition: theme.transitions.create(["width", "margin", "padding"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const [mobileMode, setMobileMode] = useState(false);

  const updateMobileMode = () => {
    const { innerWidth } = window;
    setMobileMode(innerWidth < 600);
  };

  useEffect(() => {
    updateMobileMode();

    const handleResize = () => {
      updateMobileMode();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    "& .MuiDrawer-paper": {
      position: mobileMode ? "absolute" : "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7.7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(7.7),
        },
      }),
    },
  };
});

export function transformSchoolText(input) {
  let words = input.split(' ');
  return words.map((word, index) => {
    if (index === words.length - 1) {
      return word.toUpperCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  }).join(' ');
}

const displayTitle = (selected) => {
  if (
    selected === "Dashboard" ||
    selected === "Settings" ||
    selected === "People" ||
    selected === "Logout"
  ) {
    return selected;
  }

  return (
    <>
      <span>School </span>
      <span style={{ color: "grey" }}>({transformSchoolText(selected || "None")})</span>
    </>
  );
};

export default function Navigation({ children }) {
  const { open, toggleDrawer, selected, navStyle, mobileMode, currentUser, userId } = useNavigationContext();
  const { currentDocument, jev } = useSchoolContext(); // Get current document state
  const [createdNotifications, setCreatedNotifications] = useState(new Set());
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(null);



  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = useCallback(async () => {
    if (!currentUser || !currentUser.id) {
        // If currentUser is not defined or doesn't have an id, don't attempt to fetch notifications
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`http://localhost:4000/notifications/user/${currentUser.id}`);
        
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setOptions(data);
        } else {
            throw new Error('Unexpected response type');
        }
        
        setError(null);
    } catch (error) {
        setError(error.message);
        console.error('Error fetching notifications:', error);
    } finally {
        setLoading(false);
    }
}, [currentUser]);

const createNotification = useCallback(async (userId, details) => {
  if (!currentUser || !currentUser.id) {
    console.warn('Current user is not defined');
    return;
  }

  const notification = {
    userId: currentUser.id,
    details,
  };

  try {
    const response = await fetch('http://localhost:4000/notifications/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    await response.json();
    fetchNotifications(); // Fetch updated notifications after creating a new one
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}, [currentUser, fetchNotifications]); // Ensure currentUser is included in dependencies


const handleClearOptions = async () => {
  if (!currentUser || !currentUser.id) {
    return;
  }
  try {
    const response = await fetch(`http://localhost:4000/notifications/user/${currentUser.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to clear notifications');

    // Clear options from UI after successful deletion
    setOptions([]);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

useEffect(() => {
  fetchNotifications(); // Fetch notifications when the component mounts
}, [fetchNotifications]); // Depend on fetchNotifications to ensure updates

useEffect(() => {
  fetchNotifications(); // Fetch notifications when the component mounts
}, [fetchNotifications]);

useEffect(() => {
  if (currentDocument) {
    const balance = (currentDocument.cashAdvance || 0) - (currentDocument.budget || 0); 

    // Create a unique key for the notification based on balance and document details
    const notificationKey = `balance-negative-${currentDocument.id || ''}-${balance}`;

    // Check if this notification has already been created
    if (balance < 0 && previousBalance !== null && previousBalance >= 0 && !createdNotifications.has(notificationKey)) {
      createNotification(
        userId, 
        `Alert: Your balance is negative!`
      );

      setCreatedNotifications(prev => new Set(prev).add(notificationKey));
    }

    setPreviousBalance(balance);
  }
}, [currentDocument, previousBalance, createNotification, userId, createdNotifications]);



useEffect(() => {
  if (!currentDocument || !currentDocument.month || !currentDocument.year) {
    return;
  }

  if (jev && currentUser && currentUser.id) {
    jev.forEach(row => {
      // Create a unique key for the notification based on UACS name, amount, and budget
      const notificationKey = `${row.uacsName}-${row.amount}-${row.budget}-${currentDocument.month}-${currentDocument.year}`;

      // Check if this notification has already been created
      if (!createdNotifications.has(notificationKey)) {
        if (row.amount > row.budget) {
          createNotification(
            currentUser.id,
            `Alert: UACS ${row.uacsName} exceeded budget in ${currentDocument.month} ${currentDocument.year}. Amount: ₱${row.amount}, Budget: ₱${row.budget}`
          );

          setCreatedNotifications(prev => new Set(prev).add(notificationKey));
        }
      }
    });
  }
}, [jev, currentUser, createNotification, currentDocument, createdNotifications]);

  const ITEM_HEIGHT = 48;

  const defaultTheme = createTheme({
    typography: {
      fontFamily: "Mulish",
    },
    navStyle: styling[navStyle],
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: (theme) => theme.navStyle.base,
              boxShadow: "none",
              borderRight: "none",
              display: mobileMode && !open ? "none" : null
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "75px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  color: (theme) => theme.navStyle.color,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Toolbar
              sx={{
                px: [0.5],
                width: "100%",
                display: "flex",
                ...(!open && { display: "none" }),
              }}
            >
              <ProfileTab userId={userId} />
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: (theme) => theme.navStyle.color,
                }}
              >
                <ChevronLeftIcon color="inherit" />
              </IconButton>
            </Toolbar>
          </Box>
          <List
            component="nav"
            sx={{
              marginRight: "5px",
              marginLeft: "5px",
              paddingTop: "5px",
              marginTop: "5px",
            }}
          >
            <DisplayItems />
          </List>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "100%",
              marginBottom: "20px",
            }}
          >
            <CustomizedSwitches />
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pl: 4 }}>
            <Grid container spacing={3}>
              <AppBar
                position="relative"
                open={open}
                sx={{
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  paddingTop: "5px",
                }}
              >
                <Toolbar
                  sx={{
                    pr: "24px",
                    color: "#C5C7CD",
                    pl: 1
                  }}
                >
                  <IconButton
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      display: !mobileMode ? "none" : null,
                      color: (theme) => theme.navStyle.color,
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{
                      flexGrow: 1,
                      textAlign: "left",
                      color: "#252733",
                      fontWeight: "bold",
                      width: '400px'
                    }}
                  >
                    {displayTitle(selected)}
                  </Typography>

                  {/* Search Bar */}
                  <NavigationSearchBar />
                  <Box>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <Badge badgeContent={options.length} color="secondary">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: ITEM_HEIGHT * 13,
                          width: '42ch',
                          position: 'fixed',
                        },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ paddingLeft: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Notifications
                        <DeleteOutlineIcon sx={{ ml: 25 }} onClick={handleClearOptions} />
                      </Typography>

                      <Tabs
                        value={0}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                      >
                        <Tab label="All" />
                      </Tabs>
                      {loading && <Typography sx={{ padding: '16px' }}>Loading...</Typography>}
                      {error && <Typography sx={{ padding: '16px', color: 'red' }}>Error: {error}</Typography>}
                      {options.flatMap((options, index) => (
                        index !== options.length - 1
                          ? [
                            <MenuItem key={options.id} onClick={handleMenuClose} sx={{ whiteSpace: 'normal' }}>
                              <Avatar sx={{ marginRight: '8px' }} />
                              {options.details}
                            </MenuItem>,
                            <Divider key={`divider-${index}`} />
                          ]
                          : [
                            <MenuItem key={options.id} onClick={handleMenuClose} sx={{ whiteSpace: 'normal' }}>
                              <Avatar sx={{ marginRight: '8px' }} />
                              {options.details}
                            </MenuItem>
                          ]
                      ))}
                    </Menu>
                  </Box>
                </Toolbar>
              </AppBar>
              {children}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
