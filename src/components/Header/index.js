import React from 'react';
import { Text, View } from 'react-native';

export default function Header() {
 return (
   <View style={{width:'100%',height:60,backgroundColor:'#36393f',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'white'}}>
      <Text style={{color:'#fff',fontSize:35}}>Rede<Text style={{color:'#e52256'}}>Social</Text></Text>
   </View>
  );
}