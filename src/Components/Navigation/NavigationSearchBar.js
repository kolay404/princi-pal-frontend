import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigationContext } from "../../Context/NavigationProvider";

const POSITIONS = ["ADAS", "ADOF"];

const NavigationSearchBar = () => {
  const { currentUser } = useNavigationContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [openApplicationInbox, setOpenApplicationInbox] = useState(false);
  const [select, setSelect] = useState("ADAS");
  const [appliedSchools, setAppliedSchools] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const getSchools = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`, {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
          }
        });
        console.log(response.data)
        setSchools(response.data);
      } catch (e) {
        console.error("There was an error ", e);
      }
    }

    // Fetch school data from the API when the component mounts
    getSchools();
  }, []);

  useEffect(() => {
    localStorage.setItem('appliedSchools', JSON.stringify(appliedSchools));
  }, [appliedSchools]);

  const handleApplySchool = async () => {
    try {
      // Ensure selectedSchool has the required ID or value for the API request
      const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/apply`, {
        userId: currentUser.id, // Replace with appropriate user ID
        schoolId: selectedSchool.id // Assuming selectedSchool has an 'id' property
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });
      console.log("Application submitted successfully.");
      console.log("Response data:", response.data);
      // Update appliedSchools state if needed
      setAppliedSchools([...appliedSchools, selectedSchool.fullName]); // Add school to applied list
      handleClose(); // Close the dialog
    } catch (error) {
      console.error("Error applying to school:", error);
    }
  };

  const handleClickOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
    localStorage.setItem('dialogStatus', JSON.stringify({ open: true, school: school }));
  };

  const handleRemoveSchool = async (assocId, schoolToRemove) => {
    try {
      // Assuming you have access to the current user's ID and the school ID
      await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/${currentUser.id}/${selectedSchool.id}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });
      console.log("Association removed successfully.");

      // Update appliedSchools state if needed
      const updatedSchools = appliedSchools.filter(
        (school) => school !== schoolToRemove
      );
      setAppliedSchools(updatedSchools);
    } catch (error) {
      console.error("Error removing school:", error);
    }
  };

  const handleClose = (approved) => {
    setOpen(false);
    localStorage.setItem('dialogStatus', JSON.stringify({ open: false, school: null }));
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredSchools = schools.filter((school) =>
    school.fullName && school.fullName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box style={{ width: "400px", position: "relative" }}>
      <Box component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
        <InputBase
          name="school-search-input"
          sx={{ ml: 1, flex: 1, textAlign: "right" }}
          placeholder=""
          value={query}
          onChange={handleInputChange}
          inputProps={{ style: { textAlign: "right" } }}
        />
        <IconButton color="inherit" type="button" sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {query && (
        <ul style={{
          listStyleType: "none", padding: 0, position: "absolute", width: "100%",
          maxHeight: "600px", overflowY: "auto", backgroundColor: "#fff",
          border: "1px solid #ccc", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
          color: "#424242", textAlign: "start", zIndex: 999,
        }}>
          <li
            style={{
              textAlign: "end", padding: "8px 16px", borderBottom: "1px solid #ccc",
              textDecoration: "underline", cursor: "pointer",
            }}
            onClick={() => setOpenApplicationInbox(true)}
          >
            Application Inbox
          </li>
          <Dialog open={openApplicationInbox} onClose={() => setOpenApplicationInbox(false)}>
            <DialogTitle>{"Application Inbox"}</DialogTitle>
            {appliedSchools.length ? (
              appliedSchools.map((school, index) => (
                !school.approved && (
                  <DialogContent key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <Avatar>C</Avatar>
                    <DialogContentText>
                      <span style={{ fontWeight: "bold" }}>{school.fullName}</span>
                      <br />
                      Your application is currently under review.
                    </DialogContentText>
                    <DialogActions>
                      <Button onClick={() => handleRemoveSchool(school.assocId, school.fullName)} autoFocus>
                        Cancel
                      </Button>
                    </DialogActions>
                  </DialogContent>
                )
              ))
            ) : (
              <DialogContent>
                <DialogContentText>No applied schools</DialogContentText>
              </DialogContent>
            )}
          </Dialog>
          {filteredSchools.map((school, index) => (
            <li key={index} style={{ padding: "8px 16px", borderBottom: "1px solid #ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}
              onClick={() => handleClickOpen(school)}
            >
              <Avatar>C</Avatar>
              {school.fullName}
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Selected School"}</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
          <Avatar>C</Avatar>
          <DialogContentText>
            <span style={{ fontWeight: "bold" }}>{selectedSchool.fullName}</span>
            <br />
            Provide information to request access to this organization.
          </DialogContentText>
          <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
            <Select value={select} onChange={(e) => setSelect(e.target.value)} autoWidth variant="standard">
              {POSITIONS.map((position, index) => (
                <MenuItem key={index} value={position}>{position}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleApplySchool} autoFocus>
              Apply
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NavigationSearchBar;

