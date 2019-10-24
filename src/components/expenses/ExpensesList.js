import  React, { Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import PendingIcon from '../../images/pending_icon.png'
import ProgressIcon from '../../images/progress_icon.png'
import CompletedIcon from '../../images/completed_icon.png'
import DenyIcon from '../../images/deny.png'
import moment from 'moment';
 
class ExpensesList extends Component{

    constructor(props){
        super(props); 
    }
 
    onDisplayIcon = (status) => {

        if(status === 3){
            return <Thumbnail square source={CompletedIcon} style={styles.pendingIcon} />;
        }else if(status === 2){
            return <Thumbnail square source={DenyIcon} style={styles.pendingIcon} />;
        }else if(status === 1){
            return <Thumbnail square source={ProgressIcon} style={styles.pendingIcon} />;
        }else{
            return <Thumbnail square source={PendingIcon} style={styles.pendingIcon} />;
        }
        
    }

    currencySymbol = (currency) => {

        if(currency === "INR"){
            return "₹";
        }else if(currency === "AED") {
            return "AED";
        }else if(currency === "KWD"){
            return "KWD";
        }else if(currency === "SAR"){
            return "SAR"
        }else{
            return "₹";
        }

    }

    /* <Text note numberOfLines={1} style={styles.dateText}>{moment(expense.date).format('Do MMM YYYY')}</Text>
    <Text numberOfLines={1} style={styles.titleText}>{expense.title}</Text>
    <Text note numberOfLines={2} style={styles.descriptions}>{expense.description}</Text>
    */


    render(){

        const { expenses } = this.props;

        return (
            <View style={styles.content}>
                <Content>
                    { 
                        expenses.map((expense) => {
                            return (
                                <List key={expense.id}>
                                    <View style={styles.card}>
                                        <View style={styles.headlineView}>
                                            <View style={styles.dateView}>
                                                <Text style={styles.txtdate}>{moment(expense.date).format('MMM Do')}</Text>
                                            </View>
                                            <View style={styles.descriptionView}>
                                                <Text numberOfLines={1} style={styles.titleText}>{expense.title}</Text>
                                                <View style={styles.descriptions}>
                                                     <Text>{expense.description}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.statusView}>
                                            <Text> {expense.status > 0 ? <Text style={[styles.expensesPendingText, {color: '#17E101'}]}>Paid </Text> : <Text style={[styles.expensesPendingText, {color: '#D90F0F'}]}>Pending </Text>} </Text>
                                            <Text note numberOfLines={1} style={styles.expensesText}>{this.currencySymbol(expense.currency)+''+expense.cost}</Text>
                                        </View>
                                    </View>
                            </List>
                            );
                        })
                    }
                </Content>
               
            </View>
        );

    }

}


const styles = StyleSheet.create({
    content: {
        backgroundColor: '#C8C8C8',
    },
    card: {
        backgroundColor: '#FFFF',
        height: 150,
        padding: 5,
        marginTop: 10,
    },
    headlineView:{
        height: 110,
        flexDirection: 'row',
        alignContent: 'flex-start'
        
    },
    dateView:{
        backgroundColor: '#FF5733',
        padding: 2,
        width: 60,
        height: 60,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtdate:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center'
    },
    viewIcon:{
        width: 30,
        height: 30
    },
    descriptionView:{
        width: '80%',
        padding: 10,
    },
    pendingIcon:{
        width: 30,
        height: 30
    },
     

    statusView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
         
    },  

    descriptions: {
        width: 110,
        fontSize: 16,
        color: '#FFF',
        padding: 5,
        backgroundColor: '#EEEFEF',
        borderRadius: 10,
    },
    titleText: {
        fontSize: 18,
        color: '#504E46',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#504E46',

    },
     
    expensesView: {
        flexDirection: 'column',
        alignContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },  
    expensesText:{
        fontSize: 17,
        color: '#504E46',
        textAlign: 'right'
    },
    expensesPendingText:{
        fontSize: 20,
        color: '#504E46',
        textAlign: 'left',
    }

});


export default ExpensesList;
