import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateOrder } from "../../graphql/subscriptions";
import { listOrders } from "../../graphql/queries";
import { Text, View } from "../../../components/Themed";
import Order from "./Order";
import { StyleSheet } from "react-native";
import { Auth } from "aws-amplify";
import { useStateValue } from "../../state/StateProvider"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width:"100%"
  },
  Innercontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width:"100%"
  },
  orderQueueContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    
    flexWrap: "wrap",
    width : "30%"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const OrderQueue = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [received, setReceived] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [employee, setEmployee] = useState();
  const [{ bar }] = useStateValue();

  const getEmployee = async () => {
      console.log(bar)
      const authEmployee = await Auth.currentUserInfo()
      .then((auth) => setEmployee(auth))
      .catch(err => console.log(err));

  }
  

  useEffect(() => {
    let isMounted = true
    getEmployee();
    
    const subscribe = async () => {
      setReceived([])
      setInprogress([])
   //   setOrders([])
      try {
        const ordersPromise = API.graphql(graphqlOperation(listOrders, {filter: {barID: {eq: "a0381d31-0b50-494c-9a9d-7b2115679893"}}}))// bar.id}}}))
        const response = await ordersPromise;
        //setOrders(response.data.listOrders.items);
      } catch (err) {
        console.log(err);
      }

      try {
        const orderResponse = API.graphql(
          graphqlOperation(onCreateOrder)
        ).subscribe({
          next: (orderData) => {
            const items = JSON.parse(orderData.value.data.onCreateOrder.items);
            setOrderItems((orderItems) => [...orderItems, items]);
            setOrders((orders) => [
              ...orders,
              orderData.value.data.onCreateOrder,
            ]);
          },
        });
          
        
      } catch (err) {
        console.log(err);
      }
    }
  
    setIsLoading(false);
    subscribe();
    return () => { isMounted = false };
  }, [isLoading, pressed ]);

  useEffect(() => {
    console.log(orders)
    orders.map((order) => {
      console.log(order)
      if(order.orderStatus === "received"){
        setReceived((received) => [...received, order]);
      }
      else if(order.orderStatus === "in-progress"){
        setInprogress((inprogress) => [...inprogress, order]);
      }
      else if(order.orderStatus === "completed"){
        setCompleted((completed) => [...completed, order]);
      }
    })

  }, [orders])

  console.log(orders);

  const updateFieldChanged = index => e => {
    console.log('index: ' + index);
    console.log('property name: '+ e.target.name);
    let newArr = [...data]; // copying the old datas array
    newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
  
    setData(newArr);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Queue</Text>
      <View style={styles.Innercontainer}>
      <View style={styles.orderQueueContainer}>
       <Text style={styles.subtitle}>Received</Text>
        {!isLoading
          ? orders.map((order, index) => {
              if (order.orderStatus === "received") {
                return <Order key={order.id + Math.random()} index={index} order={order} employee={employee} setPressed={setPressed} pressed={pressed} setOrders={setOrders} orders={orders} setInprogress={setInprogress} setCompleted={setCompleted} setReceived={setReceived} />;
              }
            })
          : null}
      </View>
      <View style={styles.orderQueueContainer}>
      <Text style={styles.subtitle}>In-Progress</Text>
        {!isLoading
          ? orders.map((order, index) => {
              if (order.orderStatus === "in-progress") {
                return <Order key={order.id + Math.random()} order={order} index={index} employee={employee} setPressed={setPressed} pressed={pressed} setOrders={setOrders} orders={orders} setInprogress={setInprogress} setCompleted={setCompleted} setReceived={setReceived}/>;
              }
            })
          : null}
      </View>
      <View style={styles.orderQueueContainer}>
      <Text style={styles.subtitle}>Completed</Text>
        {!isLoading
          ? orders.map((order, index) => {
            if (order.orderStatus === "complete")
              return <Order key={order.id + Math.random()} order={order} index={index} employee={employee} setPressed={setPressed} pressed={pressed} setOrders={setOrders} orders={orders} setInprogress={setInprogress} setCompleted={setCompleted} setReceived={setReceived}/>;
            })
          : null}
      </View>
      </View>
      </View>
  );
};

export default OrderQueue;
