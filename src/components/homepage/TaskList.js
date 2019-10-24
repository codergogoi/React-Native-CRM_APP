import  React, { Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import moment from 'moment';

import TaskPending from '../../images/task_pending.png'
import TaskWorkInProgress from '../../images/task_on_progress.png'
import TaskWaiting from '../../images/task_waiting.png'
import TaskIgnored from '../../images/task_ignored.png'
import TaskCompleted from '../../images/task_completed.png';
import GroupTaskIcon from '../../images/group_icon.png';

import ViewIcon from '../../images/next_arrow.png';
import { Platform } from '@unimodules/core';
 
class TaskList extends Component{

    constructor(props){
        super(props); 
    }

    onTapItem = (item) => {
        this.props.onViewTaskDetails(item);
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


    render(){

        const { tasks } = this.props;

        if(tasks.length > 0){
            return (
                <FlatList
                data={tasks}
                renderItem={
                    ({item}) =>{

                        return (
                                <List key={item.id} style={styles.listCard}> 
                                    <ListItem noBorder style={styles.listItem}>

                                        {this.onDisplayIcon(item.status)}
                                         <TouchableOpacity onPress={()=> this.onTapItem(item)} style={styles.centerContent}>
                                            <View style={styles.titleView}>
                                                <Text style={styles.clientText} numberOfLines={2}>{item.title}</Text>
                                                <Text>{item.client_name}</Text>
                                            </View>
                                            <View style={styles.createdView}>
                                                <View style={{display: 'flex', flexDirection: 'row', paddingLeft: 10}}>
                                                    <Text style={styles.dateText}>{moment(item.end_date).format('Do MMM YYYY')}</Text>
                                                    {item.grouped &&  
                                                        <View style={styles.dateView}>
                                                            <Text style={styles.stickerText}>Group Task</Text>
                                                        </View>  
                                                    }
                                                </View>
                                            </View>
                                            
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity onPress={()=> this.onTapItem(item)} style={styles.actionContent}>
                                            <View style={styles.actionBtnEmpty}>
                                                <Image source={ViewIcon} style={styles.viewIcon} />
                                            </View>
                                        </TouchableOpacity>

                                    </ListItem>
                                </List>
                        );
 
                    } 
                }
                keyExtractor={(item, index) => index.toString()}
                />
               
        );

        }else{

            return(<View style={styles.nodata}><Text> No Task available! </Text></View>);
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
    pendingIcon:{
        width: 30,
        height: 30
    },
    dateText:{
        color: '#919191',
        fontSize: 16,
        marginTop: 5,
    },

    stickerText:{
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold'
    },

    clientText: {
        fontSize: 16,
        fontWeight: 'bold',
      
    },
    
    addressText: {
        fontSize: 13,
        color: '#929292',
    },
    actionBtnOutline: {
        display: 'flex',
        width: 100,
        height: 42,
        borderWidth: 1,
        borderColor: '#566492',
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        color: '#fff',
        marginRight: 10
        
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
        marginRight: 10
        
    },
    btnText: {
        fontSize: 13,
        color: '#FFF'
    },
    btnTextOutline: {
        fontSize: 14,
        color: '#474A48'
    },

    listCard:{
        backgroundColor: '#F3F3F3',
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
     }
    
});


export default TaskList;
