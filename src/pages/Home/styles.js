import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
    background:#36393f;
    flex:1;
`;


export const ButtonPost = styled.TouchableOpacity`
    position:absolute;
    bottom:5%;
    right:6%;
    width:60px;
    height:60px;
    background: #202225;
    border-radius:30px;
    justify-content:center;
    align-items:center;
    z-index:999;
`;

export const ListPost = styled.FlatList`
    background:#f1f1f1;
    flex:1;
`;