import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { listOrders } from '../../graphql/queries';
import { Text, View } from '../../../components/Themed';
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      width: '100%',
    },
    summaryContainer: {
    flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '70%',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      margin: 20,  
    },
    summary: {
      marginVertical: 30,
      height: 50,
      width: '100%',
      borderColor: '#fcba03',
      borderBottomWidth: 1,
    },
    content: {
      fontWeight: 'bold',
      fontSize: 15,
      padding: 10,
    },
    special: {
      fontStyle: 'italic',
      fontWeight: 'bold',
      color:'white'
    }
  });

const getFilterTime = (filter) => {
  
  var today = new Date()
  var fullday= 84600000 // number of milliseconds
  if(filter=="yearly"){
    today = new Date(today - (365*fullday))
  }
  else if(filter=="monthly"){
    today = new Date(today - (31*fullday))
  }
  else if(filter=="weekly"){
    today = new Date(today - (7*fullday))
  }
  else if(filter=="daily"){
    today = new Date(today - (fullday))
  }
  
  var month=(today.getMonth()+1) + ''
  if(month.length<2){
    month='0'+ month
  }

  var date=today.getDate() + ''
  if(date.length<2){
    date='0'+ date
  }

  var hours=today.getHours() + ''
  if(hours.length<2){
    hours='0'+ hours
  }
  
  const time = today.getFullYear() + '-' + month + '-' + date + 'T' + hours
  return time
}

const getOrderTotal = (orders) => {
  var amount = 0
  orders.forEach(order =>{
    var list=JSON.parse(order.items)
    list.forEach(item =>{
      amount += item.price
    })
  })
  return amount.toFixed(2)
}


const IncomeSummary = () => {

    const [orderItems, setOrderItems] = useState([])
    const [daily, setDaily] = useState([])
    const [dailyNum, setDailyNum] = useState([])
    const [weekly, setWeekly] = useState([])
    const [weeklyNum, setWeeklyNum] = useState([])
    const [monthly, setMonthly] = useState([])
    const [monthlyNum, setMonthlyNum] = useState([])
    const [yearly, setYearly] = useState([])
    const [yearlyNum, setYearlyNum] = useState([])
    const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const listSummaries = async () => {
        try {
            var response_promise = API.graphql(graphqlOperation(listOrders, {filter: {createdAt: {ge: getFilterTime("daily")}}}))
            var response = await response_promise
            setDaily(getOrderTotal(response.data.listOrders.items))
            setDailyNum(response.data.listOrders.items.length)

            response_promise = API.graphql(graphqlOperation(listOrders, {filter: {createdAt: {ge: getFilterTime("weekly")}}}))
            response = await response_promise
            setWeekly(getOrderTotal(response.data.listOrders.items))
            setWeeklyNum(response.data.listOrders.items.length)

            response_promise = API.graphql(graphqlOperation(listOrders, {filter: {createdAt: {ge: getFilterTime("monthly")}}}))
            response = await response_promise
            setMonthly(getOrderTotal(response.data.listOrders.items))
            setMonthlyNum(response.data.listOrders.items.length)

            response_promise = API.graphql(graphqlOperation(listOrders, {filter: {createdAt: {ge: getFilterTime("yearly")}}}))
            response = await response_promise
            setYearly(getOrderTotal(response.data.listOrders.items))
            setYearlyNum(response.data.listOrders.items.length)

            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }
    
    listSummaries()
    
    },[])
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Income Summary</Text>
            {!isLoading ?
               <View style={styles.summaryContainer}>
                  <View style={styles.summary}>
                    <Text style={styles.content}>Past 24 Hours: <Text style={styles.special}>${daily}</Text> on {dailyNum} orders.{'\n'}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.content}>Past Week: <Text style={styles.special}>${weekly}</Text> on {weeklyNum} orders. {'\n'}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.content}>Past Month: <Text style={styles.special}>${monthly}</Text> on {monthlyNum} orders. {'\n'}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.content}>Past Year: <Text style={styles.special}>${yearly}</Text> on {yearlyNum} orders. {'\n'}</Text>
                  </View>
                  
              </View>
            : null}
        </View>
    )
}

export default IncomeSummary