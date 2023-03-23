import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
  cameraButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    marginBottom: 50,
  },
  cameraButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selfie: {
    marginTop: 10,
    borderRadius: 0,
    resizeMode: 'contain',
    height: undefined,
    width: '95%',
    aspectRatio: 4 / 3,
  },
  aboutText: {
    fontSize: 16,
    padding: 16,
    paddingBottom: 0,
  },
  message: {
    padding: 20,
    fontSize: 20,
  },
  imageContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  containedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});
