import React,{useState,useContext,useCallback} from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import {Container,ButtonPost,ListPost} from './styles';
import Feather from 'react-native-vector-icons/Feather'
import {useNavigation,useFocusEffect} from '@react-navigation/native';//useFocusEffect se voce sair da tela e volta ele vai rechamar o item
import Header from '../../components/Header';
import {AuthContext} from '../../contexts/auth';
import firestore from '@react-native-firebase/firestore';
import PostsList from '../../components/PostsList';

function Home(){

  const navigation = useNavigation();
  const [posts,setPosts] = useState([]);
  const {user} = useContext(AuthContext);
  const [loading,setLoading] = useState(true);

  const [loadingRefresh,setLoadingRefresh] = useState(false);//vai ser o loading para recarregar os posts
  const [lastItem,setLastItem] = useState('');//armazenar o ultimo item renderizado 
  const [emptyList,setEmptyList] = useState(false);//lista vazia


  useFocusEffect(//usamos ele para quando o componente for montado e usuario entrar ou sair ele ira ser chamado 
    useCallback(() => {//nada mais é que um useEffect
      let isActive = true;

      function fetchPosts(){//criada a funcao
        firestore().collection('posts')//nela chamamos nosso post 
        .orderBy('created','desc')//posts ordenados pelo created em ordem decrecente
        .limit(5)//chama os 5 priemiros 
        .get()
        .then((snapshot) => {
          if(isActive){
            setPosts([]);
            const postList = [];

            snapshot.docs.map(u => {//aqui percorremos todos nossos documentos 
              postList.push({
                ...u.data(),
                id: u.id,//acrecentamos o id do post
              })
            })
            setPosts(postList);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);//passando o ultimo post
            setEmptyList(!!snapshot.empty);//saber se a lista esta vazia 
            setLoading(false);
          }
        })
      }

      fetchPosts();

      return () => {
        //console.log('desmontou')
        isActive = false; //ganhando performace  
      }
    },[])
  )

//puxar mais posts quando puxar sua lista para cima
   async function handleRefreshPosts(){
    setLoadingRefresh(true);

    firestore().collection('posts')//nela chamamos nosso post 
        .orderBy('created','desc')//posts ordenados pelo created em ordem decrecente
        .limit(5)//chama os 5 priemiros 
        .get()
        .then((snapshot) => {
            setPosts([]);
            const postList = [];

            snapshot.docs.map(u => {//aqui percorremos todos nossos documentos 
              postList.push({
                ...u.data(),
                id: u.id,//acrecentamos o id do post
              })
            })
            setPosts(postList);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);//passando o ultimo post
            setEmptyList(false);//saber se a lista esta vazia 
            setLoading(false);
          
        })

        setLoadingRefresh(false);

  }

//puxar mais posts ao chegar no final da lista 
async function getListPosts(){
  if(emptyList){
    //se buscou toda sua lista tiramos o loading
    setLoading(false);
    return null;
  }

  if(loading) return;
  firestore().collection('posts')
  .orderBy('created','desc')
  .limit(5)
  .startAfter(lastItem)//comeca a contar depois do ultimo
  .get()
  .then((snapshot) => {
    const postList = []
    snapshot.docs.map(u => {
      postList.push({
        ...u.data(),
        id: u.id,
      })
    })
    setEmptyList(!!snapshot.empty)
    setLastItem(snapshot.docs[snapshot.docs.length - 1])
    setPosts(oldPosts => [...oldPosts, ...postList])
    setLoading(false);
  })
}
  
  return(
    <Container>
      <Header/>
      {loading ?
       ( <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size='large' color='#e52245'/>
        </View>)
        :
        (<ListPost
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={ ({ item }) => ( 
            <PostsList
              data={item}
              userId={user?.uid}
            />
           )  }
           refreshing={loadingRefresh}//fazer o recarregamento nativo do flatlist
           onRefresh={handleRefreshPosts}//essa é a funcao que fara o recarregamento

           onEndReached={() => getListPosts()}
           onEndReachedThreshold={0.1}
        />
        )}
      <ButtonPost activeOpacity={0.8} onPress={() => navigation.navigate('NewPost')}>
        <Feather name='edit-2' color='#fff' size={25}/>
      </ButtonPost>   
    </Container>
  )
}

export default Home;