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

  const orderTest = [
    {
      id: "c3d52efa-84b1-44c3-8bf6-813fcc19f84d",
      timestamp: null,
      items: [
        '[{"price":16,"name":"Bison Burger","id":"05c28679-14c8-4a06-9261-c739f4f4f262"},{"price":69.69,"name":"Can of whoop ass","id":"ca27fa30-54ac-4d0e-92a8-f5d216360289"},{"price":23.5203409626507,"name":"minim ex adipisici","id":"5dde62ff-f2df-45fe-ae3c-0d3ff1d99bc1"}]',
      ],
      completed: false,
      userID: "7b91aced-aa0f-44f8-b436-9dbe35862c8e",
      barID: null,
      employeeID: null,
      _version: 1,
      _deleted: null,
      _lastChangedAt: 1638242406472,
      createdAt: "2021-11-30T03:20:06.447Z",
      updatedAt: "2021-11-30T03:20:06.447Z",
      User: null,
    },
  ];

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
        setOrders(response.data.listOrders.items);
      } catch (err) {
        console.log(err);
      }

      try {
        const orderResponse = API.graphql(
          graphqlOperation(onCreateOrder)
        ).subscribe({
          next: (orderData) => {
            // console.log('full order data: ', orderData.value.data.onCreateOrder)
            const items = JSON.parse(orderData.value.data.onCreateOrder.items);
            setOrderItems((orderItems) => [...orderItems, items]);
            setOrders((orders) => [
              ...orders,
              orderData.value.data.onCreateOrder,
            ]);
          },
        });
        console.log("out")
        if(isMounted){
          console.log("in")
          orders.map((order) => {
            console.log(order)
            if(order.orderStatus === "received"){
              setReceived((received) => [...received, order]);
            }
            else if(order.orderStatus === "in-progress"){
              setInprogress((inprogress) => [...inprogress, order]);
            }
            else if(order.orderStatus === "completed"){
              setInprogress((completed) => [...completed, order]);
            }
          })
          }
        
      } catch (err) {
        console.log(err);
      }
    };
  
    setIsLoading(false);
    subscribe();
    return () => { isMounted = false };
  }, [isLoading, pressed]);

  console.log(orders);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Queue</Text>
      <View style={styles.Innercontainer}>
      <View style={styles.orderQueueContainer}>
       <Text style={styles.subtitle}>Recieved</Text>
        {!isLoading
          ? received.map((order) => {
              return <Order key={order.id + Math.random()} order={order} employee={employee} setPressed={setPressed} pressed={pressed}/>;
            })
          : null}
      </View>
      <View style={styles.orderQueueContainer}>
      <Text style={styles.subtitle}>In-Progress</Text>
        {!isLoading
          ? inprogress.map((order) => {
              return <Order key={order.id + Math.random()} order={order} employee={employee} setPressed={setPressed} pressed={pressed}/>;
            })
          : null}
      </View>
      <View style={styles.orderQueueContainer}>
      <Text style={styles.subtitle}>Completed</Text>
        {!isLoading
          ? completed.map((order) => {
              return <Order key={order.id + Math.random()} order={order} employee={employee} setPressed={setPressed} pressed={pressed}/>;
            })
          : null}
      </View>
      </View>
      </View>
  );
};

export default OrderQueue;
