import  React, { Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import ReportIcon from '../../images/report_details_icon.png'
import ExpensesIcon from '../../images/expenses_icon_details.png';
import moment from 'moment';

import ViewIcon from '../../images/next_arrow.png';
 
class ReportList extends Component{

    constructor(props){
        super(props); 
    }

    onTapItem = (item) => {
        this.props.onViewReportDetails(item);
    }

    
    onDisplayIcon = (status) => {
            return <Thumbnail square source={ReportIcon} style={styles.pendingIcon} />;
    }

    onDisplayPriority = (value) => {

        if(value > 1){
            return (<View style={[styles.priorityView, { backgroundColor: '#FE0B0B', width: 220}]}>
                <Text style={styles.priorityText}>Priority: Urgent</Text>
            </View>)
        }else if(value > 0){
            return (<View style={[styles.priorityView, {  backgroundColor: '#ECCA1F', width: 160}]}>
                <Text style={styles.priorityText}>Priority: High</Text>
            </View>)
        }else{
            return (<View style={[styles.priorityView, { backgroundColor: '#6DA807' }]}>
                <Text style={styles.priorityText}>Priority: Medium</Text>
            </View>)
        }

    }

    onDisplayStatus = (value) => {

        switch(value){
			case 0: // waiting for Accept
				return (
                    <View style={[styles.statusView, { backgroundColor: '#FF1831' } ]}>
                        <Text style={styles.priorityText}>Status: Waiting to Accept</Text>
                    </View>
				);
			case 1: // accepted
				return (
                    <View style={[styles.statusView, { backgroundColor: '#FF1831' } ]}>
                        <Text style={styles.priorityText}>Status: Waiting to Start</Text>
                    </View>
				);
			case 2: // started
				return (
                    <View style={[styles.statusView, { backgroundColor: '#F09564' } ]}>
                        <Text style={styles.priorityText}>Status: on Progress</Text>
                    </View>
				);
			case 3: // completed
				return (
                    <View style={[styles.statusView, { backgroundColor: '#1DAF1B' } ]}>
                        <Text style={styles.priorityText}>Status: Completed</Text>
                    </View>
				);
			case 4: // ignored / Aborted
				return (
                    <View style={[styles.statusView, { backgroundColor: '#A90505' } ]}>
                        <Text style={styles.priorityText}>Status: Ignored</Text>
                    </View>
				);
        
        }
    }

    onDisplayExpenses = (currency, value, payment_status) => {
        
        if(value > 0){
            return(
                <View style={styles.expensesView}>
                    <Image source={ExpensesIcon} style={styles.expensesIcon} />
                    <Text style={styles.expensesText}>{currency+''+value} {payment_status > 0 ? <Text style={styles.expensesPendingText}>Paid </Text> : <Text style={styles.expensesPendingText}>Pending </Text>} </Text>
                </View>
            );
        }
        
    }
 
    render(){

        const { reports } = this.props;

        return (
        <FlatList
        data={reports}
        renderItem={
            ({item}) =>{
                return (
                    <List key={item.id} style={{backgroundColor: '#f9f9f9'}}>
                        <ListItem thumbnail>
                        
                        <Body>
                            <TouchableOpacity onPress={()=> this.onTapItem(item)}>
                            <View>
                                <View style={styles.dateView}>
                                    <Text note numberOfLines={1} style={styles.dateText}>{moment(item.date).format('Do MMM YYYY')}</Text>
                                </View>
                                <Text numberOfLines={2} style={styles.titleText}>{item.title}</Text>
                                {this.onDisplayStatus(item.status)}
                                {this.onDisplayPriority(item.priority)}
                                <Text note numberOfLines={2} style={styles.txtClientName}>Client Name: {item.client_name}</Text>
                                <Text note numberOfLines={1} style={styles.txtRegionName}>Region: {item.region}</Text>
                                {this.onDisplayExpenses(item.currency, item.expenses, item.payment_status)}
                            </View>
                            </TouchableOpacity>

                        </Body>
                        <Right>
                            <TouchableOpacity onPress={()=> this.onTapItem(item)}>
                                <Image source={ViewIcon} style={styles.viewIcon} />
                            </TouchableOpacity>
                        </Right>
                        </ListItem>
                </List>
                );
            } 
        }
        keyExtractor={(item, index) => index.toString()}
        />);

 

    }

}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF'
    },
    viewIcon:{
        width: 30,
        height: 30
    },
    pendingIcon:{
        width: 60,
        height: 60
    },
    expensesIcon:{
        width: 50,
        height: 50,
        marginRight: 10,
    },
    priorityView:{
        backgroundColor: '#FE0B0B',
        width: 120,
        height: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 10,
        marginBottom: 10,
    },

    statusView: {
        backgroundColor: '#17E101',
        width: 120,
        height: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 10,
        marginBottom: 10,
    },  

    priorityText: {
        fontSize: 13,
        fontWeight: '200',
        color: '#FFF',
    },
    titleText: {
        fontSize: 18,
        color: '#504E46',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#504E46',

    },
    dateView: {
        backgroundColor:'#F2F1F0',
        padding: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        marginBottom: 10,
    },txtClientName: {
        fontSize: 16,
        color: '#504E46',
        marginBottom: 10,
    }, txtRegionName: {
        fontSize: 16,
        color: '#504E46',
        marginBottom: 10,
    },
    expensesView: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 80,
        marginBottom: 10,
    },  
    expensesText:{
        fontSize: 30,
        color: '#504E46',
    },
    expensesPendingText:{
        fontSize: 20,
        color: '#504E46',
    }


});


export default ReportList;
