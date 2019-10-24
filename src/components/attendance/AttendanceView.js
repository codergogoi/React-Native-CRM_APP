import React, {Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native'; 
import { View, Container } from 'native-base';
import { connect } from 'react-redux';


class AttendencaeView extends Component {

    constructor(props){
        super();

    }

    render(){

        return (
            <SafeAreaView style={styles.container}>
                    <Container>
                        <Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
                                <Left>
                                    <TouchableOpacity onPress={this.onTapMenuButton}>
                                        <Image source={MenuIcon} style={styles.menuIcon} />
                                    </TouchableOpacity>
                                </Left>
                                <Body style={styles.taskHeader}>
                                    <Title style={styles.title}>Edit Profile</Title>
                                </Body>
						    <Right />
					    </Header>
                        <View>
                            <Text>
                                Attendance View
                            </Text>
                        </View>
                </Container>
            </SafeAreaView>            
        );

    }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AttendencaeView)


const styles = StyleSheet.create({

    container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#fcfcfc'
	},
	header:{
		backgroundColor: '#212654',
		flex: 1,
		flexDirection: 'row',
	},
	userIcon:{
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 1,
		borderColor: '#FFFF'
	},
	welcomeTitle:{
		fontSize: 16,
		marginTop: 20,
		color: '#838281'
	},
	menuIcon: {
		width: 40,
		height: 40
	},
	title: {
		fontSize: 16,
		color: '#000',
		alignItems: 'center',
	},
	taskPlaceHolder:{
		width: '98%',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft:15,
		fontSize: 16,
		color: '#BEBFC3',
		backgroundColor: '#f9f9f9',

	},
	taskText:{
		fontSize: 18,
		color: '#242427',
		borderColor: '#e0e1e2',
		borderBottomWidth: 1,
		width: '90%',
		marginLeft: 15,
		marginRight: 15,
	},
	commentText:{
		fontSize: 18,
		color: '#242427',
		marginBottom: 5,
		paddingLeft: 20,
		width: '100%'
	},
	itemStyle:{
		minHeight: 50,
		flexDirection:'column',
		alignItems: 'flex-start',
		margin: 5,
		marginBottom: 10,
		justifyContent: 'space-around',

	},
	taskHeader: {
		fontSize: 16,
		color: '#BEBFC3',
		alignItems: 'center'
	}, butonIcon:{
		width: 50,
		height: 50,
	},
	butonView: {
		width: 250,
		height: 42,
		backgroundColor: '#EEEEEE',
		borderRadius: 20,
		borderColor: '#D7D6D8',
		borderWidth: 1,
		margin: 10,
		flexDirection: 'row',
	}
	, buttonText: {
		color: 'black',
		alignContent: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		marginLeft: 5,
		marginTop: 8,

	},
	uploadProgress: {
		justifyContent: 'center',   
		alignItems: 'center',

	},
});