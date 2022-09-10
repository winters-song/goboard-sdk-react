export const themeConfig = {
  theme: "light",
  style:{
    borderColor: "#9E6E3A",
    bgColor: "transparent"
  },
  svgBoardImg: require('./board.png').default,
  sizeSettings: {
    9: {
      PIECE_RADIUS: 27,
      UNIT_LENGTH: 60,
      fontSize: 22,
      markerSize: 30,
    },
    13: {
      PIECE_RADIUS: 19,
      UNIT_LENGTH: 40,
      fontSize: 16,
      markerSize: 26,
    },
    19: {
      PIECE_RADIUS: 13,
      UNIT_LENGTH: 27,
      fontSize: 14,
      markerSize: 22,
    }
  }
}