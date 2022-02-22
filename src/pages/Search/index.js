import React,{useState,useEffect} from 'react';
import { View, Text } from 'react-native';
import {Container,AreaInput,Input,List} from './styles';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import SerchList from '../../components/SerchList';

function Search(){

  const [input,setInput] = useState('');
  const [users,setUsers] = useState([]);

  useEffect(()=>{
    if(input === '' || input === undefined){
      //se o input estiver vazio quero que pare 
      setUsers([]);
      return;
    }

    const subscriber = firestore().collection('users')
    .where('nome', '>=', input)
    .where('nome','<=',input + "\uf8ff")
    .onSnapshot(snapshot =>{
      const listUsers = [];

      snapshot.forEach(doc => {
        listUsers.push({
          ...doc.data(),
          id: doc.id,
        })
      })

      //console.log('lista de users: ', listUsers)
      setUsers(listUsers);

    })

    return () => subscriber();

  },[input])

  return(
    <Container>
      <AreaInput>
        <Feather name='search' size={25} color='#e52246'/>
        <Input 
          placeholder="Procurando alguem?"
          value={input}
          onChangeText={ (text) => setInput(text)}
          placeholderTextColor='#353840'
        />
      </AreaInput>
      <List
        data={users}
        renderItem={({item}) => <SerchList data={item}/>}
      />
    </Container>
  )
}

export default Search;