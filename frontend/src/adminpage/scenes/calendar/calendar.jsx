import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { formatDate } from "@fullcalendar/core";
import { jwtDecode } from "jwt-decode";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]); // Define todayAppointments state
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]); // Define tomorrowAppointments state

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const judgeId = decodedToken.userId;

      const response = await fetch("http://localhost:8081/api/getappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ judgeId }),
      });

      const data = await response.json();
      console.log("data", data);
      setCurrentEvents(
        data.map((appointment) => ({
          id: appointment.appointment_id,
          title: `Case ${appointment.case_id}`,
          start: appointment.date,
          allDay: true,
          description: appointment.note,
        }))
      );

      // Filter appointments for today
      const today = new Date();
      const todayAppointments = data.filter(
        (appointment) =>
          new Date(appointment.date).toDateString() === today.toDateString()
      );
      setTodayAppointments(todayAppointments);

      // Filter appointments for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowAppointments = data.filter(
        (appointment) =>
          new Date(appointment.date).toDateString() === tomorrow.toDateString()
      );
      setTomorrowAppointments(tomorrowAppointments);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Appointment Calendar" />
      <Box display="flex" justifyContent="space-evenly" gap="20px">
        <Box
          backgroundColor={colors.primary[400]}
          p={1}
          mb={2}
          borderRadius={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h5" color={colors.greenAccent[500]} mt={2}>
            Today's Appointments
          </Typography>
          {todayAppointments.length === 0 ? (
            <Typography variant="body1">No appointments today</Typography>
          ) : (
            <List>
              {todayAppointments.map((appointment) => (
                <ListItem
                  key={appointment.appointment_id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={`Case ${appointment.case_id}`}
                    secondary={formatDate(new Date(appointment.date), {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  />
                  <Typography>{appointment.note}</Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        {/* Display Tomorrow's Appointments */}
        <Box
          backgroundColor={colors.primary[400]}
          p={1}
          mb={2}
          borderRadius={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h5" color={colors.greenAccent[500]} mt={2}>
            Tomorrow's Appointments
          </Typography>
          {tomorrowAppointments.length === 0 ? (
            <Typography variant="body1">No appointments tomorrow</Typography>
          ) : (
            <List>
              {tomorrowAppointments.map((appointment) => (
                <ListItem
                  key={appointment.appointment_id}
                  sx={{
                    margin: "10px 0",
                    borderRadius: "2px",
                    display: "flex", // Set display to flex
                    borderBottom: "10px solid",
                    borderColor: `${colors.blueAccent[400]}`,
                    borderBottomColor: `${colors.blueAccent[400]}`,
                    borderBottomWidth: "5px",
                  }}
                >
                  <ListItemText
                    primary={`Case ${appointment.case_id}`}
                    secondary={formatDate(new Date(appointment.date), {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  />
                  <Typography sx={{ marginLeft: "10px" }}>
                    {appointment.note}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
      <Typography
        variant="h3"
        color={colors.greenAccent[900]}
        m={1}
        alignItems={"center"}
      >
        Appointment Calendar{" "}
      </Typography>
      <Box sx={{ mb: "30px" }} display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 30%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
                <Typography>
                  {event.description} {/* Display description */}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={false} // Disable editing
            selectable={false} // Disable selection
            events={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
