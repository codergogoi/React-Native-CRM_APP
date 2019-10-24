import React, { Component } from 'react';
import {  StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'




const taskSummary = (props) => (
        <View style={styles.container}>
            <View style={styles.progressBlock}>
                <TouchableOpacity onPress={props.onTapCompletedTask}>
                    <ProgressCircle
                            percent={props.pendingTask}
                            radius={52}
                            borderWidth={8}
                            color="#ff6d6d"
                            shadowColor="#f1efef"
                            bgColor="#fff"
                        >
                            <Text style={styles.percentText}>{props.completedTask+'%'}</Text>
                        </ProgressCircle>
                    <Text style={styles.commentText}>Total Task</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.progressBlock}>
                <TouchableOpacity onPress={props.onTapAchievedTask}>
                    <ProgressCircle
                            percent={props.completedTask}
                            radius={52}
                            borderWidth={8}
                            color="#0A9F05"
                            shadowColor="#f1efef"
                            bgColor="#fff"
                        >
                            <Text style={styles.percentText}>{props.achieved+'%'}</Text>
                        </ProgressCircle>
                    <Text style={styles.commentText}>Completed Task</Text>
                </TouchableOpacity>
            </View>

        </View>
);

/*

                */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 160,
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    progressBlock: {
        width: '48%',
        padding: 10
    },
    commentText:{
        marginTop: 10,
        fontSize: 12,
        color: '#4F4E4E'
    },
    percentText:{
        fontSize:25,
        color:'#331949'
    }

});



export default taskSummary;