import  React, { Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import moment from 'moment';

import TaskPending from '../../images/task_pending.png'
import TaskWorkInProgress from '../../images/task_on_progress.png'
import TaskWaiting from '../../images/task_waiting.png'
import TaskIgnored from '../../images/task_ignored.png'
import TaskCompleted from '../../images/task_completed.png';
import CalIcon from '../../images/cal_icon.png';


import ViewIcon from '../../images/next_arrow.png';
import { Platform } from '@unimodules/core';
 
class AttendanceTableView extends Component{

    constructor(props){
        super(props); 
    }

    onTapItem = (item) => {
        this.props.onViewTaskDetails(item);
    }

    


    render(){

        const { attendance } = this.props;

        if(attendance.length > 0){
            return (
                <FlatList
                data={attendance}
                renderItem={
                    ({item}) =>{

                        return (
                                <List key={item.id} style={styles.listCard}> 
                                    <ListItem noBorder style={styles.listItem}>

                                        <ImageBackground source={CalIcon} style={styles.CalICon}>
                                            <Text style={styles.calDate}> {moment(item.date).format('Do')}</Text>
                                            <Text style={styles.calMonth}>{moment(item.date).format('MMM')}</Text>
                                        </ImageBackground>
                                        <View style={styles.checkinView}>
                                            {item.emp === null ? (<Text> N/A</Text>) :  (
                                                <View>
                                                <Text style={styles.checkIn}>
                                                Check In : { item.emp[0].check_in !== null && moment(item.emp[0].check_in).format('h:mm a')}
                                                </Text>
                                                <Text style={styles.checkOut}>
                                                Check Out: { item.emp[0].check_out !== null ? moment(item.emp[0].check_out).format('h:mm a') : 'Waiting!'}
                                                </Text>
                                            </View>
                                            )}
                                            
                                        </View>

                                    </ListItem>
                                </List>
                        );
 
                    } 
                }
                keyExtractor={(item, index) => index.toString()}
                />
               
        );

        }else{

            return(<View style={styles.nodata}><Text> No Data available! </Text></View>);
        }

    }

}


const styles = StyleSheet.create({

    
    content: {
        backgroundColor: '#C8C8C8'
    },
    viewIcon:{
        width: 30,
        height: 30,
        marginRight: Platform.OS === 'ios' ? 0 : 55
    },
    CalICon:{
        width: 128,
        height: 128,
        display: 'flex',
        paddingTop: 30,
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignContent: 'center'
    },
   
    calMonth:{
        fontSize: 20,
        fontWeight: 'bold',
        color:"#FFF"
    },
    calDate:{
        fontSize: 30,
        fontWeight: 'bold'
    },
 
    addressText: {
        fontSize: 13,
        color: '#929292',
    },
     

    listCard:{
        width: '100%',
        height: 140,
        marginTop: 10,
        borderWidth: 0,
        display: 'flex',
        flexDirection: 'column',

    },
    stickerGroup:{
        display: 'flex',
        flexDirection: 'row',
   },
	dateView: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#B6B6B6',
		borderRadius: 16,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
        width: 120,
        height: 30,
		marginTop: 5,
		marginLeft: 10,
	},
     
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
    , centerContent: {
        display: 'flex',
        flex:1 ,
        justifyContent: 'flex-start',
    },
    actionContent: {
    }
     ,
     titleView: {
         display: 'flex',
     },
     createdView: {
         display: 'flex',
     },
     addressView: {
         display: 'flex',
         alignItems: 'flex-start',
         textAlign: 'left'
     },
     nodata: {
         flex: 1,
        paddingTop: 200,
         display: 'flex',
         textAlign: 'center',
         justifyContent: 'center',
         alignItems: 'center',
         alignContent: 'center'
     },
     checkinView:{
         display: 'flex',
         height: 120,
         width: '70%',
         backgroundColor: '#FFF',
         borderBottomLeftRadius: 10,
         borderTopLeftRadius: 10,
         marginLeft: 10,
         paddingTop: 20,
         paddingBottom: 20,
         flexDirection: 'column',
         justifyContent: 'center',
     },
     checkIn:{
         fontSize: 16,
         fontWeight: 'bold',
         margin: 10,
     },
     checkOut:{
        fontSize: 16,
        margin: 10,
        fontWeight: 'bold',
    }
    
});


export default AttendanceTableView;
