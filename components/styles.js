import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "blue",
    color: "white",
  },
  cameraButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    flex: 1,
    alignSelf: "stretch",
  },
  allSelfies: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  selfie: {
    marginTop: 10,
    borderRadius: 0,
    resizeMode: "contain",
    height: undefined,
    width: "95%",
    aspectRatio: 4 / 3,
  },
  aboutText: {
    fontSize: 16,
    padding: 16,
    paddingBottom: 0,
  },
});
