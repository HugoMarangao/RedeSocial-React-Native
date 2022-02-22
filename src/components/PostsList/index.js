import React,{useState} from 'react';
import { View } from 'react-native';
import { Container, Name,Avatar ,Header,ContentView,Content,Actions,LikeButton,Like,TimePost,ImagePost} from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ptBR } from 'date-fns/locale';
import { formatDistance} from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
export default function PostsList({ data, userId }) {

    const [likePost, setLikePost] = useState(data?.likes)
    const navigation = useNavigation();

    function formatTimePost(){//formatando a data do nosso post 
        //console.log(new Date(data.created.seconds * 1000))
        const datePost = new Date(data.created.seconds * 1000);
        
        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

    async function handleLikePost(id, likes){
        const docId = `${userId}_${id}`;
    
        //Checar se o post jÃ¡ foi curtido
        const doc = await firestore().collection('likes')
        .doc(docId).get();
    
        if(doc.exists){
          //Que dizer que jÃ¡ curtiu esse post, entao precisamos remover o like
          await firestore().collection('posts')
          .doc(id).update({
            likes: likes - 1
          })
    
          await firestore().collection('likes').doc(docId)
          .delete()
          .then(() => {
            setLikePost(likes - 1)
          })
    
          return;
    
        }
    
    
        // Precisamos dar o like no post
        await firestore().collection('likes')
        .doc(docId).set({
          postId: id,
          userId: userId
        })
    
        await firestore().collection('posts')
        .doc(id).update({
          likes: likes + 1
        })
        .then(()=>{
          setLikePost(likes + 1)
        })
    
    
      }

 return (
   <Container>
       <Header onPress={() => navigation.navigate("PostsUser", {title: data.autor, userId: data.userId})}>
          {data.avatarUrl ? (
               <Avatar
               source={{ uri: data.avatarUrl}}
            />
          ) :
            <Avatar
            source={require('../../assets/avatar.png')}
            />
          }
           <Name numberOfLines={1}>{data?.autor}</Name>
       </Header>
       <ImagePost source={{ uri: data.ImageUrl}}/>
       <ContentView> 
           <Content>{data?.content}</Content>
       </ContentView>
       <Actions>
           <LikeButton onPress={() => handleLikePost(data.id,likePost)}>
               <Like>{likePost === 0 ? '' : likePost}</Like>
               <MaterialCommunityIcons name={likePost === 0 ? 'heart-plus-outline' : 'cards-heart'} size={20} color='#e52246'/>
           </LikeButton>
           <TimePost>{formatTimePost()}</TimePost>
       </Actions>
   </Container>
  );
}