/*import React from "react";
import S3 from "react-aws-s3";
import { Button, TextField, Typography } from "@mui/material";
import { API, graphqlOperation } from "aws-amplify";
import { updateBar } from "../../graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const S3_BUCKET = "barfly-pics";
const REGION = "est-2us-w";
const ACCESS_KEY = "AKIA33JESCSVFLWNP6VN";
const SECRET_ACCESS_KEY = "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";

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
};

const UploadImageToS3WithReactS3 = () => {

    const getBar = async () => {
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

    

    const fileInput = React.useRef();

    async function updateUserImg(location) {
        const bar  = await getBar()
        const res = API.graphql(
            graphqlOperation(updateBar, {
                input: {
                    id: bar.id,
                    profileImg: JSON.stringify({img: location}),
                    _version: bar.__version
                    
                },
            })
        );

        const userResponse = await res;
        console.log(userResponse)
    }
    const handleClick = async (event) => {
        event.preventDefault();
        if (fileInput.current) {
            const bar  = await getBar()
            console.log(fileInput.current.files);
            let file = fileInput.current.files[0];
            const newFileName = bar.id;

            const config = {
                bucketName: S3_BUCKET,
                dirName: "bar_profile",
                region: REGION,
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            };
            const ReactS3Client = new S3(config);
            ReactS3Client.uploadFile(file, newFileName).then((data) => {
                console.log(data);
                if (data.status === 204) {
                    console.log("success");
                    updateUserImg(data.location)
                
                } else {
                    console.log("fail");
                }
            });
        }
    };
    return (
        <>
            <form className="upload-steps" onSubmit={handleClick}>
                <Typography >
                    Upload Profile Photo:
                    <input type="file" ref={fileInput} accept=".jpeg,.png" />
                </Typography>
                <br />
                <Button type="submit">Upload</Button>
            </form>
        </>
    );
};
*/
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, View } from "../../../components/Themed";
import {RNS3} from 'react-native-aws3';

import {launchImageLibrary} from 'react-native-image-picker';

const UploadImageToS3WithReactS3 = () => {
  const [filePath, setFilePath] = useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const chooseFile = () => {
    let options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      setUploadSuccessMessage('');
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response);
    });
  };

  const uploadFile = () => {
    if (Object.keys(filePath).length == 0) {
      alert('Please select image first');
      return;
    }
    RNS3.put(
      {
        // `uri` can also be a file system path (i.e. file://)
        uri: filePath.uri,
        name: filePath.fileName,
        type: filePath.type,
      },
      {
        keyPrefix: 'HEREEEE', // Ex. myuploads/
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
        console.log(response.body);
        setFilePath('');
        let {
          bucket,
          etag,
          key,
          location
        } = response.body.postResponse;
        setUploadSuccessMessage(
          `Uploaded Successfully: 
          \n1. bucket => ${bucket}
          \n2. etag => ${etag}
          \n3. key => ${key}
          \n4. location => ${location}`,
        );
        /**
         * {
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://bucket.s3.amazonaws.com/**.png"
         *   }
         * }
         */
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        How to Upload any File or Image to AWS S3 Bucket{'\n'}
        from React Native App
      </Text>
      <View style={styles.container}>
        {filePath.uri ? (
          <>
            <Image
              source={{uri: filePath.uri}}
              style={styles.imageStyle}
            />
            <Text style={styles.textStyle}>
              {filePath.uri}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyleGreen}
              onPress={uploadFile}>
              <Text style={styles.textStyleWhite}>
                Upload Image
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
        {uploadSuccessMessage ? (
          <Text style={styles.textStyleGreen}>
            {uploadSuccessMessage}
          </Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={chooseFile}>
          <Text style={styles.textStyleWhite}>
            Choose Image
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{textAlign: 'center'}}>
        www.aboutreact.com
      </Text>
    </View>
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
