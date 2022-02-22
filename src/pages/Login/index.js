import React,{useState,useContext} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import {Container,Title,Input,Button,ButtonText,SignUpButton,SignUpText} from './styles';
import {AuthContext} from '../../contexts/auth';

function Login(){


  const [login,setLogin] = useState(true);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [passworld,setPassworld] = useState('');
  const {signUp, singnIn,loadingAuth} = useContext(AuthContext);

  function toggleLogin() {
    setLogin(!login)
    setName('');
    setPassworld('');
    setEmail(''); 
  }

  async function handleSignin() {
    if(email === '' || passworld === ''){
      alert('Preencha todos os Campos');
      return;
    }

    //Fazer Login do usuario
    await singnIn(email,passworld)
  }

  async function handleSignUp(){
   
    if(name === '' || email === '' || passworld === ''){
      console.log("PREENCHA TODOS OS CAMPOS PARA CADASTRAR")
      return;
    }

    await signUp(email, passworld, name)

  }

  if(login){
    return(
      <Container>
        <Title>Rede
          <Text style={{color:'#e52256'}}>Social</Text>
        </Title>
        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={ (text) => setEmail(text) }
        />
         <Input
          placeholder="Senha"
          value={passworld}
          onChangeText={ (text) => setPassworld(text) }
        />
        <Button onPress={handleSignin}>
          {loadingAuth ? (
            <ActivityIndicator size='large' color='#fff'/>
          ):(
            <ButtonText>Acessar</ButtonText>
          )
          }
          
        </Button>
        <SignUpButton onPress={()=>toggleLogin()}>
          <SignUpText>Criar Conta</SignUpText>
        </SignUpButton>
      </Container>
    )
  }

  return(
    <Container>
      <Title>Rede
        <Text style={{color:'#e52256'}}>Social</Text>
      </Title>
      <Input
        placeholder="Nome"
        value={name}
          onChangeText={ (text) => setName(text) }
      />
      <Input
        placeholder="E-mail"
        value={email}
          onChangeText={ (text) => setEmail(text) }
      />
       <Input
        placeholder="Senha"
        value={passworld}
          onChangeText={ (text) => setPassworld(text) }
      />
      <Button onPress={handleSignUp}>
      {loadingAuth ? (
            <ActivityIndicator size='large' color='#fff'/>
          ):(
            <ButtonText>Cadastrar</ButtonText>
          )
          }
      </Button>
      <SignUpButton onPress={()=>toggleLogin()}>
        <SignUpText>Ja possuo uma conta</SignUpText>
      </SignUpButton>
    </Container>
  )
}

export default Login;
