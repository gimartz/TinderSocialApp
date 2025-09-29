import React from 'react';
import {View, Text, Pressable} from 'react-native';
import  FontAwesomeIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';

const PageHeader= ({title,show,action}) => {
  const navigation = useNavigation()
  return (
    <View
      style={{position: 'relative',top: 14,marginBottom:40,zIndex: 1,justifyContent: 'space-between',alignContent:'center',marginLeft:1, alignItems: 'center',flexDirection:'row'}}>
     
     <Pressable  style={{top:5,marginLeft:8 }} onPress={() => navigation.goBack()}>
      <View w='38' h='38' style={{ alignContent:'center',alignItems:'center',justifyContent:'center'}} borderRadius={12} backgroundColor={'#FFFFFF'}>
      <FontAwesomeIcon  size={18}  name={'arrow-left'} />
      </View></Pressable> 
      <View style={{alignItems:'center',justifyContent:'flex-start',marginLeft:10}}>
      <Text  style={{ color:'black',fontFamily:'Inter-Bold',fontSize:18,fontWeight:'600'}}>{title}</Text></View>
   
        <View width={30}  />
      

    </View>
    
  );
};

export default PageHeader;