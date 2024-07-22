// import "../style/card.css";

// export default function Card() {
//   <div className="team-cards">
//     {/* Cards here */}
//     {/* Card 1 */}
//     <div className="card">
//       <div className="card-img">
//         <img
//           src="https://media.geeksforgeeks.org/wp-content/uploads/20230824122630/business-office-business-woman-professional.jpg"
//           alt="User 1"
//         />
//       </div>
//       <div className="card-info">
//         <h2 className="card-name">Jane</h2>
//         <p className="card-role">CEO and Founder</p>
//         <p className="card-email">jane@example.com</p>
//       </div>
//     </div>

//     {/* Card 2 */}
//     <div className="card">
//       <div className="card-img">
//         <img
//           src="https://media.geeksforgeeks.org/wp-content/uploads/20230822183347/man-portrait-businessman-male.jpg"
//           alt="User 2"
//         />
//       </div>
//       <div className="card-info">
//         <h2 className="card-name">Miller</h2>
//         <p className="card-role">Co-Founder</p>
//         <p className="card-email">Miller@example.com</p>
//       </div>
//     </div>
//     {/* Card 3 */}
//     <div className="card">
//       <div className="card-img">
//         <img
//           src="https://media.geeksforgeeks.org/wp-content/uploads/20230824122630/business-office-business-woman-professional.jpg"
//           alt="User 3"
//         />
//       </div>
//       <div className="card-info">
//         <h2 className="card-name">Joe</h2>
//         <p className="card-role">Co-Founder</p>
//         <p className="card-email">Joe@example.com</p>
//       </div>
//     </div>
//   </div>;
// }

import React, {useContext} from "react";
import Card from "react-bootstrap/Card";
import "../style/card.css";
import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
 
export default function HomeCard({ title, text, buttonText, imageUrl }) {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const cardElement = document.getElementById("homeCard"); // Adjust the ID accordingly

      if (cardElement) {
        const cardTop = cardElement.offsetTop;
        const cardHeight = cardElement.clientHeight;

        if (scrollY > cardTop - window.innerHeight + cardHeight / 2) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
<ThemeProvider theme={theme}>
  <CssBaseline />
  <Card
      id="homeCard"
      className={`home-card ${isVisible ? "visible" : ""}`}
      style={{ width: "27rem", margin: "0 auto" , backgroundColor:colors.primary[700],color :colors.primary[200]}}
    >
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
</ThemeProvider>
</ColorModeContext.Provider>
  );
}
