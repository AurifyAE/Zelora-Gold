import React from "react";
import { Box, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";

const NewsTicker = ({ newsItems = [] }) => {
  const items =
    newsItems.length > 0
      ? newsItems
      : [{ description: "Welcome to Zelora Gold Updates" }];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: "38px",
          md: "2.8vw",
        },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
        background:
          "linear-gradient(90deg, rgba(3, 10, 8, 0.85) 0%, rgba(6, 18, 14, 0.75) 50%, rgba(3, 10, 8, 0.85) 100%)",
        borderTop: "1.5px solid",
        borderImage:
          "linear-gradient(to right, rgba(229, 197, 131, 0.05) 0%, rgba(255 228 173 / 0.62) 50%, rgba(229, 197, 131, 0.05) 100%) 1",
        boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* LEFT BRAND SECTION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.6vw",
          pl: "2vw",
          pr: "1.5vw",
          height: "100%",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: "#E5C583", // Gold/Yellow touch
            fontSize: {
              xs: "12px",
              md: "1.1vw",
            },
            fontWeight: 600,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          Zelora Updates
        </Typography>
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.2)",
            fontSize: {
              xs: "14px",
              md: "1.2vw",
            },
            mx: "0.5vw",
            fontWeight: 300,
          }}
        >
          |
        </Typography>
      </Box>

      {/* NEWS TICKER */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Marquee
          speed={40}
          gradient={false}
          autoFill={true}
          loop={0}
          direction="left"
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.5vw",
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: "#EAEFF5",
                  fontSize: {
                    xs: "12px",
                    md: "1.15vw",
                  },
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  mx: "1.5vw",
                  lineHeight: "1",
                }}
              >
                {item?.description || ""}
              </Typography>
              <span
                style={{
                  color: "#4dbf00",
                  fontSize: "1.3vw",
                  opacity: 0.8,
                  marginRight: "1vw",
                }}
              >
                •
              </span>
            </Box>
          ))}
        </Marquee>
      </Box>
    </Box>
  );
};

export default NewsTicker;
