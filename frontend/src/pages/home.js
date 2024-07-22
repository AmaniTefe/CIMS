import React, { useEffect, useContext  ,useState } from "react";
import Slider from "../components/slider";
import HomeCard from "../components/card";
import {  Row, Col } from "react-bootstrap";
import Footer from "../components/Footer";
import Topbar from "../components/Navbar";
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext , tokens} from '../theme';
import {useTheme, } from "@mui/material";
const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const Images = [
    "https://www.thereporterethiopia.com/wp-content/uploads/2018/06/House-awakens.gif",
    "https://t3.ftcdn.net/jpg/02/90/60/12/360_F_290601202_Q6e785uvhWCxqCYPFTvoAAYjFN0m9cZP.jpg",
    "https://www.icrc.org/sites/default/files/styles/document_photo_gallery_detail_file/public/document/image_list/ethiopia-international-humanitarian-law-moot-court-competition-winners-02.jpg?itok=K8jfvEOc",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Haile_Selassie_and_group.jpg",
    // Add more image URLs as needed
  ];

  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      // Define the thresholds for each layer
      const firstLayerThreshold = 500; // Adjust as needed
      const secondLayerThreshold = 1000; // Adjust as needed

      // Move cardData inside the useEffect callback
      const cardData = [
        {
          title:
            "በወልቂጤ አካባቢ ከፍተኛ ፍርድ ቤት አቤቱታ መመርመር መስማትና መወሰን ዋና የስራሂደት የሚሰጡ ዋና ዋና አገልግሎቶች",
          text: (
            <>
              1. የወንጀልና የፍ/ብሔር ክሶችን ተቀብሎ ሰምቶመወሰን ወይም ማደራደር፤ <br />
              2. የአመክሮ ጉዳይ አጣርቶ መወሰን፤ <br />
              3. የክስ ይዛወር ጥያቄ አጣርቶ መወሰን፤ <br />
              4. የዋስትና ጥያቄ አጣርቶ መወሰንና ዋስ ልሁን ጥያቄን ማስተናገድ፤ <br />
              5. በሌለበት የተወሰነ እንዲነሳ የሚቀርብ ጥያቄ አጣርቶ መወሰን፤ <br />
              6. የወንጀልና የፍ/ብሄር የይግባኝ አቤቱታዎችን አጣርቶ መወሰን፤ <br />
              7. የይግባኝ ማስፈቀጃ ጥያቄዎችን መርምሮ ትዕዛዝ መስጠት፤ <br />
              8. ከውሳኔ በኋላ ጉዳይ እንደገና እንዲታይ የሚቀርብ ጥያቄን መርምሮ ትዕዛዝ መስጠት፤ <br />
              9. የፍ/ብሔር ውሳኔዎችን ማስፈፀም 10. የውሳኔና ሌሎች ግልባጭ ለባለ ጉዳዮች መስጠት፤ <br />
              11. ለባለ ጉዳዮች የተሟላ መረጃ መስጠት፤ <br />
              12. ከተገልጋዮች የሚቀርቡ ቅሬታዎችን ተቀብሎ ማስተናገድ፤
            </>
          ),
          imageUrl:
            "https://static.euronews.com/articles/580709/900x506_580709.jpg",
        },
        {
          title: "የስነምግባር መርሆች",
          text: (
            <>
              ➢ቅንነት
              <br />
              ➢ታማኝነት
              <br />
              ➢ግልፅነት
              <br />
              ➢ሚስጥር ጠባቂነት
              <br />
              ➢ሀቀኝነት
              <br />
              ➢ተጠያቂነት
              <br />
              ➢የህዝብን ጥቅም ማስቀደም
              <br />
              ➢ስልጣንን በአግባቡ መጠቀም
              <br />
              ➢አለማዳላት
              <br />
              ➢ህግን ማክበር
              <br />
              ➢ለህዝብ ጥያቄ ተገቢውን ምላሽ መስጠት
              <br />
              ➢አርአያ መሆን
            </>
          ),
          imageUrl:
            "https://ethiopianmonitor.com/wp-content/uploads/2020/12/court-800x445.jpg",
        },
        {
          title:
            "የሃራጌ ዞን ፍትህ መምሪያ የመ/ስ/ማ/ፈውም/ህ/ወ/የስራ ሂደት የሚሰጠውን አገልግሎት ለማግኘት በሚመጡበት ወቅት ማሟላት የሚጠበቅቦት ቅድመ ሁኔታዎ",
          text: (
            <>
              <h5> የ2 ደረጃ ጥብቅና ፍቃድ ለማግኘት የሚያስፈልጉ ቅድመ ሁኔታዎች</h5>
              “በህግ ዲግሪ በሞያው ቢያንስ 1 ዓመት
              <br />
              - በህግ ዲፕሎማና በሞያው ቢያንስ 2 ዓመት
              <br />
              - በህግ ሰርተፍኬትና በሞያው ቢያንስ 4 ዓመት
              <br />
              <h5> ለውክልና፦</h5>
              ባለጉዳይ ወይም ህጋዊ ወኪል በአካል መቅረብ ይኖርበታል ፤የወካይ መታወቂያ ዋናውና ፎቶ ኮፒ ፤በህግ
              አግባብ የተዚጀ የውክልና ስልጣን መስጫ ሰነድ ብዛት 3 ኮፒ፣ በውክ ልናው ላይ በስም ወይም በመለያ ቁጥር
              ተጠቅሶ የሚቀመጥ ንብረት ካለ የንብረቱ ማስረጃ፤ የቅርብ ጊዜ ግብር የተከፈለበት ደረሰኝ ፤ የዝምድና
              ሃረግ ወይም የጋብቻ ሁኔታ የተገለፀ ነገር ካለማስረጃ ማቅረብ ይኖርበታል፡፡
              <h5>ውክልና ለመሻር፦</h5>
              የወካይ ወይም እንዲሽር ስልጣን የተሰጠው አካል መታወቂያ፤ ቀድሞ ተሰጠውን የውክልና ማስረጃ እና የውክልና
              ይሻርልኝ ማመልከቻ ይዞ መቅረብ አለበት፡፡ መስተናገድ የሚችለው ውክልናው በተሰጠበት ቦታ ነው፡፡ ለተለያዩ
              ውሎች፦ ተዋዋይ ወገኖች በአካል መቅረብ አለባቸው፤ ከ3 ያላነሱ ምስክሮች በህግ አግባብ የተዘጋጀ የውል
              ሰነድ ብዛት 3፤ በውል ሰነዱ በደጋፊነት ወይም በአስረጂነት ለሚጠቅሱና ማስረጃ ለሚያስፈልጋቸው ሁሉ
              የንብረቱ ዋና ማስረጃና ኮፒው መቅረብ ይኖርበታል፡፡ የውል ስ የውል ሰጪ የጋብቻ ሁኔታና ጋብቻ ከሌለ
              ጋብቻ አለመኖሩን የሚገልፅ 6 ወር ያላለፈው ማስረጃና የውል ሰጪ፤ የውል ተቀባይና የምስክሮች ለዘመኑ
              የሚያገለግልና የታደሰ መታወቂያ ከነ ኮፒው ይዘው መቅረብ ይኖርባቸዋል፡፡,
            </>
          ),
          imageUrl:
            "https://www.icrc.org/sites/default/files/styles/document_photo_gallery_detail_file/public/document/image_list/ethiopia-moot-court-ihl-2018-competition-01.jpg?itok=LF7epIOs",
        },

        {
          title:
            "በወልቂጤ ከተማ የመጀ/ደ/ፍ/ቤት ለመስተናገድ የሚቀርቡ ተገልጋዮች ማሟላት የሚገባቸው አገልግሎቶት ቅድመ ሁኔታዎች",
          text: (
            <>
              <h5>የወንጀል መደበኛ ክስ</h5>
              ➢ክሱ የወንጀል ስነስርዓት ህጉን የተከተለ መሆን አሰበት
              <br />
              ➢ፍ/ቤቱ ጉዳዩን ስማየት ስልጣን ያስሙ መሆን አስበት
              <br />
              ➢ክሱ የመንግስት አና የድርጅት ከሆነ ቁጥር ቀን፣ የከሳሽ ፊርማና የተቋሙ ማህተም፤ በግል የሚቀርብ ከሆነ
              ቀንና ፊርማ ሲሰፍርበት ያስፈልጋል <br />
              ➢ማስረጃ ካስ በክሱ ላይ መጥቀስ አና የሰነድ ማስረጃዎችን ማያያዝ ያስፈልጋል
              <br />
              ➢ክሱ ስተከሳሾች ሲደርስ በሚችል መልኩ በበቂ ኮፒ መቅረብ አለበት
              <br />
              <h5>የፍትሐብሔር መደበኛ ክስ</h5>
              ➢ክሱ የፍ/ብሔር/ሥ/ሥ ህጉን የተከተስ መሆን አስበት
              <br />
              ➢ፍ/ቤቱ ጉዳዩን ስማየት ስልጣን እንዳሰሙ ማመልከት አሰበት
              <br />
              ➢ከሳሽ ግለሰብ ከሆነ ቀንና ፊርማ ሲሰፍርበት ይገባል
              <br />
              ➢ከሳሽ መንግስት/ ድርጅት ከሆነ ቀን ቁጥር አና ማህተም ሲኖረው ይገባል <br />
              ➢ማስረጃ ካስ በተሰየ ሠረቀት መጥቀስ አና የሰነድ ማስረጃዎች ማያያዝ እንዲሁም ክሱን በቃስ መሃሳ
              ማረጋገጥ ያስፈልጋል
              <br />
              ➢ከፍርድ በፊት ንብረት እንዲታገድልኝ በማስት የሚቀርቡ አቤቱታዎች በመሐሳ ቃል በተደገፈ ስዩ ማመልከቻ
              የፍ/ብ/ሥ/ሥ/ሕ/ቁ 154 ስር የተዘረዘሩት ሁኔታዎች ተሟልተው መገኘታቸውን ማረጋገጥ ያስፈልጋል
              <br />
              ➢በአፈፃፀም ክስ መነሻነት ንብረት እንዲከበር የሚቀርቡ ማመልከቻዎች የፍ/ብ/ሥ/ሥ/ሕ/ቁ 379 ስር
              በተመለከቱት ሁኔታዎች መሰረት ተዘጋጅተው መቅረብ አስባቸው
              <br />
            </>
          ),
          imageUrl: "https://www.101lasttribes.com/images/gurage.jpg",
        },
      ];

      const visibleCards = cardData.map((card, index) => {
        const cardTop = index * 300; // Adjust the distance between cards
        const cardBottom = cardTop + 300; // Adjust the height of each card

        if (scrollY > cardTop - firstLayerThreshold && scrollY < cardBottom) {
          return { ...card, layer: 1 };
        } else if (
          scrollY > cardTop - secondLayerThreshold &&
          scrollY < cardBottom
        ) {
          return { ...card, layer: 2 };
        } else {
          return { ...card, layer: 0 };
        }
      });

      setVisibleCards(visibleCards);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on mount

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array because we only want to run this effect once on mount

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
    <Topbar/>
      <Slider images={Images} />
      <div  >
        <Box margin='0px' backgroundColor={colors.primary[800]} >
          <Row>
            {visibleCards.map((card, index) => (
              <Col
                key={index}
                lg={4}
                md={6}
                style={{
                  marginBottom: "2rem", // Adjust the margin-bottom as needed
                  marginRight: "3rem",
                  marginLeft: '3rem',
                  paddingTop: "50px",
                  paddingLeft: "10rem",
                  paddingRight:'0rem'
                 
                }}
              >
                <HomeCard {...card} />
              </Col>
            ))}
          </Row>
        </Box>
      </div>
      <Footer />
    
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Home;

