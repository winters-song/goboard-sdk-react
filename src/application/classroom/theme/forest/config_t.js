
export const themeConfig = {
  "theme": "light",
  "style":{
    borderColor: "#9d6338",
    bgColor: "transparent"
  },
  "svgBoardImg": require('./board_t.png').default,
  "sizeSettings": {
    9: {
      PIECE_RADIUS: 30,
      UNIT_LENGTH: 65,
      fontSize: 20,
      markerSize: 30,
    },
    13: {
      PIECE_RADIUS: 20,
      UNIT_LENGTH: 46.4,
      fontSize: 16,
      markerSize: 26,
    },
    19: {
      PIECE_RADIUS: 15,
      UNIT_LENGTH: 31,
      fontSize: 14,
      markerSize: 22,
    }
  }
}