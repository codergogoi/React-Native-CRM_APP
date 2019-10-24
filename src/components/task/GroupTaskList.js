import  React, { Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import moment from 'moment';

import TaskPending from '../../images/task_pending.png'
import TaskWorkInProgress from '../../images/task_on_progress.png'
import TaskWaiting from '../../images/task_waiting.png'
import TaskIgnored from '../../images/task_ignored.png'
import TaskCompleted from '../../images/task_completed.png';


import ViewIcon from '../../images/next_arrow.png';
import { Platform } from '@unimodules/core';
 
class GroupTaskList extends Component{

    constructor(props){
        super(props); 
    }

    onTapItem = (item) => {
        this.props.onViewTaskDetails(item);
    }

    onTapStatus = (item) => {

        this.props.onStartTask(item);
    }

    onTapCompleteTask = (item) => {
        this.props.onCompleteTask(item);
    }


    onDisplayIcon = (status) => {

        switch(status){

            case 0: // waiting for Accept
            case 1: // accepted
                return <Thumbnail square source={TaskPending} style={styles.pendingIcon} />;
            case 2: // started || in Progress
                return <Thumbnail square source={TaskWaiting} style={styles.pendingIcon} />;
			case 3: // completed
                return <Thumbnail square source={TaskCompleted} style={styles.pendingIcon} />;
			case 4: // ignored / Aborted
                return <Thumbnail square source={TaskPending} style={styles.pendingIcon} />;
            default:
                return <Thumbnail square source={TaskPending} style={styles.pendingIcon} />;
        }
        
    }

    onDisplayDateSticker = (date) => {

        return (<View>
            <Text style={styles.dateText}>{moment(date).format('Do MMM YYYY')}</Text>
        </View>);

    }


    render(){

        const { group_task_clents } = this.props;

        return (
                <FlatList
                data={group_task_clents}
                renderItem={
                    ({item}) =>{
                        return (
                                <List key={item.id} style={styles.listCard}>
                                    <ListItem noBorder style={styles.listItem}>
                                    {this.onDisplayIcon(item.status)}
                                    
                                    <TouchableOpacity onPress={()=> this.onTapItem(item)} style={styles.centerContent}>
                                        <Text style={styles.clientText} numberOfLines={2}>{item.client_name}</Text>
                                        <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
                                    </TouchableOpacity>
                                    
                                     {item.status < 2 && (<TouchableOpacity onPress={()=> this.onTapStatus(item)}>
                                            <View style={styles.actionBtn}>
                                                <Text style={styles.btnText}> Start Task </Text>
                                            </View>
                                        </TouchableOpacity>)}

                                        {item.status === 2 && (<TouchableOpacity onPress={()=> this.onTapCompleteTask(item)}>
                                            <View style={styles.actionBtnOutline}>
                                                <Text styles={styles.btnTextOutline}> Finish Task </Text>
                                            </View>
                                        </TouchableOpacity>)}

                                        {item.status === 3 && (
                                        <TouchableOpacity onPress={()=> this.onTapItem(item)}>
                                            <View style={styles.actionBtnEmpty}>
                                                <Image source={ViewIcon} style={styles.viewIcon} />
                                            </View>
                                        </TouchableOpacity>)}

                                    </ListItem>
                                </List>
                        );
                    } 
                }
                keyExtractor={(item, index) => index.toString()}
                />
               
        );

    }

}


const styles = StyleSheet.create({
    content: {
        backgroundColor: '#C8C8C8'
    },
    viewIcon:{
        width: 30,
        height: 30,
        marginRight: Platform.OS === 'ios' ? 0 : 10
    },
    pendingIcon:{
        width: 30,
        height: 30
    },
    dateText:{
        color: '#5C5C5D',
        fontSize: 14,
        marginTop: 10,
    },

    clientText: {
        display: 'flex',
        flexDirection: 'column',
       
    },
    
    addressText: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
       
        fontSize: 13,
        color: '#929292',
    },
    actionBtnOutline: {
        display: 'flex',
        width: Platform.OS === 'ios' ? 100 : 90,
        height: 42,
        borderWidth: 1,
        borderColor: '#566492',
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        color: '#fff',
        marginRight: 10,        
    },
    actionBtn: {
        display: 'flex',
        width: 100,
        height: 42,
        backgroundColor: '#566492',
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        color: '#fff',
        marginRight: 10
        
    },
    actionBtnEmpty: {
        display: 'flex',
        width: 100,
        height: 42,
        borderRadius: 5,
        alignItems: 'flex-end',
        alignContent: 'center',
        justifyContent: 'flex-end',
        
    },
    btnText: {
        fontSize: 13,
        color: '#FFF'
    },
    btnTextOutline: {
        fontSize: Platform.OS === 'ios' ? 14 : 12,
        color: '#474A48'
    },

    listCard:{
        backgroundColor: '#F3F3F3',
        height: 110,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',

    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    centerContent: {
        display: 'flex',
        flex:1 ,
        textAlign : 'left'
    },
});


export default GroupTaskList;
