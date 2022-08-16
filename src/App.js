/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import ImageEditor from '@react-native-community/image-editor';
import ImagePicker from 'react-native-image-crop-picker';

const {width, height} = Dimensions.get('window');

const Home = () => {
  // Foto
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoForDB, setPhotoForDB] = useState('');

  //Crop
  const [data, setData] = useState({
    photo: {
      uri: '',
      width: width,
      height: height,
    },

    measuredSize: null,
    croppedImageURI: null,
    cropError: null,
    photoCrop: null,
  });

  const offset = {
    x: width / 20,
    y: height / 5.5,
  };

  const transformData = useRef({
    offset: {
      x: offset.x,
      y: offset.y,
    },
    size: {
      width: 6400,
      height: 8400,
    },
  });

  // Foto
  const pickSingleWithCamera = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: height,
      height: width,
      mime: 'image/png',
    })
      .then(image => {
        console.log(image);
        setPhotoForDB({
          uri: image.path,
          width: width,
          height: height,
          mime: image.mime,
        });

        if (image) {
          crop(image);
        }
      })
      .catch(e => console.log(e));
  };

  //Crop
  const renderCroppedImage = () => {
    return (
      <View>
        <Image
          source={{uri: data.croppedImageURI}}
          style={[data.measuredSize]}
        />

        <TouchableOpacity
          style={styles.cropButtonTouchable}
          onPress={() => reset()}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>Try again</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const crop = async image => {
    try {
      let croppedImageURI = await ImageEditor.cropImage(
        image.path,
        transformData.current,
      );

      console.log(photoForDB.uri);

      if (croppedImageURI) {
        setData({
          ...data,
          photo: {uri: photoForDB.uri},
          croppedImageURI: croppedImageURI,
          measuredSize: {width: 360, height: 300},
        });
        setHasPhoto(true);
      }
    } catch (cropError) {
      setData({...data, cropError: cropError});
    }
  };

  const reset = () => {
    setData({...data, croppedImageURI: null, cropError: null});
    setHasPhoto(false);
  };

  return (
    <View style={styles.container}>
      {!hasPhoto && (
        <TouchableOpacity
          onPress={() => pickSingleWithCamera(false)}
          style={styles.button}>
          <Text style={styles.text}>Select Single Image With Camera</Text>
        </TouchableOpacity>
      )}

      {hasPhoto && renderCroppedImage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  cropButtonTouchable: {
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
  },
  cropButton: {
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
export default Home;
