import React,{ useState, useLayoutEffect,useContext }  from 'react';
import { View, Text, Image,Platform  } from 'react-native';
import {Container,Input,Button,ButtonText,Foto} from './styles';
import {useNavigation} from '@react-navigation/native';
import  firestore  from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../../contexts/auth';
import {launchImageLibrary} from 'react-native-image-picker'; 
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
function NewPost(){

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState("");
  const [image,setImage] = useState(null);

  useLayoutEffect(() => {

    const options = navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => handlePost() }>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      )
    })

  }, [navigation, post, image]);

  const uploadFile = () =>{
    const options = {
      noData:true,
      mediaType:'photo'
    };

    ImagePicker.launchImageLibrary(options, response => {
      if(response.didCancel){
        console.log('cancelou!');
      }else if(response.error){
        console.log('houve um erro');
      }else{
       //subir para o firebase
       uploadFileFirebase(response)
       .then(()=>{
        console.log('deu certo');
       })

       setImage(response.uri);

      }
    })
  }

  const getFileLocalPath = (response) => {
    return response.uri;//extrair e retornar a url da foto
  }

   const uploadFileFirebase = async (response) => {
      const fileSource = await getFileLocalPath(response);//pegamos a url
      const storagRef = await storage().ref('posts').child(user?.uid).child(post);

    return await storagRef.putFile(fileSource);//adc imagem
   
  }



  async function handlePost(){
    if(post === ''){
      console.log("Seu post contem conteudo invalido.");
      return;
    }

    let avatarUrl = null;

    try{
      let response = await storage().ref('users').child(user?.uid).getDownloadURL();
      avatarUrl = response;

    }catch(err){
      avatarUrl = null;
    }

    let ImageUrl = null;

    try{
      let response = await storage().ref('posts').child(user?.uid).child(post).getDownloadURL();
      ImageUrl = response;

    }catch(err){
      ImageUrl = null;
      console.log('error: '+ err);
    }



    await firestore().collection('posts')
    .add({
      created: new Date(),
      content: post,
      autor: user?.nome,
      userId: user?.uid,
      likes: 0,
      avatarUrl,
      ImageUrl
    })
    .then( () => {
      setPost('')
      console.log("POST CRIADO COM SUCESSO")
    })
    .catch((error)=>{
      console.log("ERRO AO CRIAR O POST ", error)
    })

    navigation.goBack();

  }

  

 

  return(
    <Container>
      <Input
        placeholder='O que está acontecendo?'
        value={post}
        onChangeText={ (text) => setPost(text)}
        autoCorrect={false}
        multiline={true}
        placeholderTextColor='#ddd'
        maxLength={300}
      />
      { image ? (
        <Foto onPress={ () => uploadFile() }>
          <Image
            style={{width:'100%',height:'100%'}}
            source={{ uri: image }}
          />
        </Foto>
      ) : (
        <Foto onPress={ () => uploadFile() }>
          <Feather name='image' color='#fff' size={55}/>
        </Foto>
      )}
    </Container>
  )
}

export default NewPost;