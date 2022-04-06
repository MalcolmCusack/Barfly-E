
import React, {useState} from 'react';
// Import required components
import {
  StyleSheet,
  Image,
  Platform, 
  ScrollView
} from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from "../../../components/Themed";
import {RNS3} from 'react-native-aws3';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { updateBar } from '../../graphql/mutations';
import { API, graphqlOperation } from "aws-amplify";
import { getBar } from '../../graphql/queries';

const UploadImageToS3WithReactS3 = () => {
  const [filePath, setFilePath] = useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const [image, setImage] = useState(null);

  const getVersion = async () => {

    const bar = await getBarObj()
    try {
        const userRes = API.graphql(
            graphqlOperation(getBar, {
                id: bar.id
            })
        );

        const profile = await userRes;
        console.log(profile.data.getBar)
        return profile.data.getBar._version;
    } catch (err) {
        console.log(err);
    }
};

async function updateBarImg(location) {
  const version = await getVersion();
  const bar = await getBarObj();
  const res = API.graphql(
      graphqlOperation(updateBar, {
          input: {
              id: bar.id,
              profileImg: JSON.stringify({ img: location }),
              _version: version,
          },
      })
  );

  const barResponse = await res;
  return barResponse;
}

  const getBarObj = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("bar");
  
      if (jsonValue !== null) {
          return JSON.parse(jsonValue)
      } else {
          console.log("bar not found")
          return null
      }
    } catch (e) {
      // error reading value
    }
  };

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
      
    }
  };


  const uploadFile = async () => {
    const bar = await getBarObj()
    if (Object.keys(image).length == 0) {
      alert('Please select image first');
      return;
    }
    RNS3.put(
      {
        // `uri` can also be a file system path (i.e. file://)
        uri: image.uri, 
        name: bar.id,
        type:  "image/jpeg",
        //contentType: "image/jpeg"
      },
      {
        keyPrefix: 'bar_profile/', // Ex. myuploads/
        bucket: 'barfly-pics', // Ex. aboutreact
        region: 'us-west-2', // Ex. ap-south-1
        accessKey: 'AKIA33JESCSVFLWNP6VN',
        // Ex. AKIH73GS7S7C53M46OQ
        secretKey: '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',
        // Ex. Pt/2hdyro977ejd/h2u8n939nh89nfdnf8hd8f8fd
        successActionStatus: 201,
      },
    )
      .progress((progress) =>
        setUploadSuccessMessage(
          `Uploading: ${progress.loaded / progress.total} (${
            progress.percent
          }%)`,
        ),
      )
      .then((response) => {
        if (response.status !== 201)
          alert('Failed to upload image to S3');

        updateBarImg(response.body.postResponse.location)
        setFilePath('');
        setUploadSuccessMessage(
          `Uploaded Successfully`,
        );
    
      });
  };

  return (
    <ScrollView>
      <View>
        {image ? (
          <View>
            <Text style={styles.textStyle}>
              {filePath.uri}
            </Text>
            <Button
              onPress={uploadFile}>
            Upload
            </Button>
          </View>
        ) : null}
       
        <Button
          activeOpacity={0.5}
          onPress={pickImage}>
          Pick photo
        </Button>
        {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
        {uploadSuccessMessage ? (
          <Text style={styles.textStyleGreen}>
            {uploadSuccessMessage}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default UploadImageToS3WithReactS3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    height:300
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  textStyleGreen: {
    padding: 10,
    color: 'green',
  },
  textStyleWhite: {
    padding: 10,
    color: 'white',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    marginVertical: 10,
    width: '100%',
  },
  buttonStyleGreen: {
    alignItems: 'center',
    backgroundColor: 'green',
    marginVertical: 10,
    width: '100%',
  },
  imageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    margin: 5,
  },
});
