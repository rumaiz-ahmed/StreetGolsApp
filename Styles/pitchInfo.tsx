import { StyleSheet } from "react-native";

const pitchInfo = StyleSheet.create({
  image: {
    height: 300,
    width: "90%",
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: "5%",
    marginRight: "5%",
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cardImage: {
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    borderRadius: 10,
    marginRight: 10,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
  },
  button: {
    marginBottom: 20,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  playerName: {
    fontSize: 16,
    color: "white",
  },
  buttonIcon: {
    padding: 5,
  },
  playerListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerRatioText: {
    fontSize: 16,
    color: "yellow",
  },
  timeLabelContainer: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "yellow",
  },
  timeDetailItem: {
    flexDirection: "column",
  },
  timeText: {
    fontSize: 16,
  },
  middleContainer: {
    alignItems: "center",
  },
  middleText: {
    fontSize: 16,
    color: "yellow",
  },
  middleTimeText: {
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addressContainer: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  openMapsButton: {
    marginLeft: 10,
    borderRadius: 10,
  },
  gameDetailsContainer: {
    marginBottom: 10,
  },
  gameDetailItem: {
    flexDirection: "column",
    marginBottom: 10,
    marginTop: 10,
  },
  gameDetailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "yellow",
  },
  gameDetailText: {
    fontSize: 16,
    color: "white",
  },
});

export default pitchInfo;
