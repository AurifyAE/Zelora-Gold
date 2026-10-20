import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

const OUNCE = 31.103;
const AED = 3.674;

const UNIT_MULTIPLIER = {
  GM: 1,
  KG: 1000,
  TTB: 116.64,
  TOLA: 11.664,
  OZ: 31.103,
};

const CommodityTable = ({ title, items }) => {
  const { goldData, silverData } = useSpotRate();

  // ✅ FIXED: Minted bars treated as gold
  const getSpot = (metal) => {
    const lower = metal?.toLowerCase() || "";

    if (lower.includes("gold") || lower.includes("minted")) {
      return goldData; // ✅ minted uses gold spot
    }

    if (lower.includes("silver")) return silverData;

    return null;
  };

  const purityFactor = (purity) => {
    if (!purity) return 1;
    const num = Number(purity);
    if (isNaN(num) || num <= 0) return 1;
    if (num <= 1) return num;
    if (num <= 100) return num / 100;
    if (num <= 1000) return num / 1000;
    if (num <= 10000) return num / 10000;
    return num / 10 ** Math.floor(Math.log10(num) + 1);
  };

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "—";

    const intLen = Math.floor(Math.abs(value)).toString().length;

    let decimals = 3;
    if (intLen >= 4) decimals = 0;
    else if (intLen === 3) decimals = 2;

    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const rows =
    items
      ?.map((item) => {
        const spot = getSpot(item.metal);
        // 🔥 IMPORTANT: fallback to goldData
        const effectiveSpot = spot || goldData;
        if (!effectiveSpot) return null;

        const spotBid = Number(effectiveSpot.bid);
        const spotAsk = Number(effectiveSpot.ask);

        // Check if live rates have loaded from the socket yet
        const liveRatesLoaded = spotBid > 0 && spotAsk > 0;

        const mult = UNIT_MULTIPLIER[item.weight] || 1;
        const pur = purityFactor(item.purity);
        const unitValue = Number(item.unit) || 1;

        const weightInGrams = mult * unitValue;
        const buyPremium = Number(item.buyPremium) || 0;
        const buyCharge = Number(item.buyCharge) || 0;
        const sellPremium = Number(item.sellPremium) || 0;
        const sellCharge = Number(item.sellCharge) || 0;

        const bid = liveRatesLoaded
          ? ((spotBid + buyPremium) / OUNCE) * AED * weightInGrams * pur + buyCharge
          : null;

        const ask = liveRatesLoaded
          ? ((spotAsk + sellPremium) / OUNCE) * AED * weightInGrams * pur + sellCharge
          : null;

        return {
          metal_name: item.metal_name,
          purity: item.purity,
          metal: item.metal,
          unit: `${unitValue} ${item.weight}`,
          bid,
          ask,
        };
      })
      .filter(Boolean) ?? [];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const PURITY_TO_KARAT = {
    9999: "24K", // 99.99%
    999.9: "24K", // 99.99%
    999: "24K", // 99.9%
    995: "24K", // Swiss bullion / investment gold

    958: "23K", // 95.8%
    950: "23K",

    920: "22K", // Some regional jewellery standards
    916: "22K", // Standard 22K
    900: "21.6K",

    875: "21K",

    833: "20K",

    750: "18K",

    708: "17K",

    700: "16.8K",
    666: "16K",

    625: "15K",

    585: "14K", // Standard 14K
    583: "14K", // Russian standard

    500: "12K",

    417: "10K",

    375: "9K",
  };

  const getPurityLabel = (purity) => {
    return PURITY_TO_KARAT[purity] || purity;
  };
  // ❌ No data → don't render section
  if (!rows.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "1.2vw",
        background: "rgba(6, 18, 14, 0.65)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0.8vw 2vw rgba(0, 0, 0, 0.4)",
        padding: ".3vw 1vw 0 1vw",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          padding: "1px", // border thickness
          borderRadius: "inherit",
          background: `
            linear-gradient(
              135deg,
              rgba(77, 191, 0, 0.3) 0%,
              rgba(229, 197, 131, 0.45) 50%,
              rgba(77, 191, 0, 0.2) 100%
            )
          `,
          WebkitMask: `
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0)
          `,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        },
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr",
          py: "0.8vw",
          px: "1.2vw",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "1.1vw",
            },
            fontWeight: 600,
            color: "#BAC8D9",
            letterSpacing: "0.05em",
            textAlign: "start",
          }}
        >
          COMMODITY
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "1.1vw",
            },
            fontWeight: 600,
            color: "#BAC8D9",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          UNIT
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "1.1vw",
            },
            fontWeight: 650,
            color: "#FFF8EB", // Yellow/Gold
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          ASK
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "1.1vw",
            },
            fontWeight: 650,
            color: "#DFFFD9", // Light Green
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          BID
        </Typography>
      </Box>

      {/* Rows Container */}
      <Box sx={{ mt: "0.5vw" }}>
        <Swiper
          direction="vertical"
          slidesPerView={5}
          loop={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          style={{
            height: isMobile ? "35vw" : "20vw",
            background: "transparent",
            overflow: "hidden",
          }}
        >
          {rows.map((row, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr",
                  alignItems: "center",
                  py: "0.7vw",
                  px: "1.2vw",
                  height: "100%",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      md: "1.5vw",
                    },
                    fontWeight: 600,
                    color: "#EAEFF5",
                    textAlign: "start",
                    lineHeight: "1.2",
                  }}
                >
                  {row.metal_name ? row.metal_name : row.metal}
                  {row.purity && (
                    <span
                      style={{
                        fontSize: "0.95vw",
                        fontWeight: 400,
                        color: "#8899A6",
                        marginLeft: "0.4vw",
                      }}
                    >
                      {getPurityLabel(row.purity)}
                    </span>
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      md: "1.15vw",
                    },
                    color: "#BAC8D9",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {row.unit}
                </Typography>

                {/* Column 3: ASK rate (Yellow/Gold) */}
                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      md: "1.5vw",
                    },
                    fontWeight: 700,
                    color: "#FFF0D3",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(row.ask)}
                </Typography>

                {/* Column 4: BID rate (Green) */}
                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      md: "1.5vw",
                    },
                    fontWeight: 700,
                    color: "#DFFFD9",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(row.bid)}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default CommodityTable;
