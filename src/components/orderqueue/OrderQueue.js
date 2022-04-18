import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateOrder } from "../../graphql/subscriptions";
import { listOrders } from "../../graphql/queries";
import { Text, View } from "../../../components/Themed";
import Order from "./Order";
import { ScrollView, StyleSheet } from "react-native";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "100%",
    height: "auto",
  },
  Innercontainer: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  orderQueueContainer: {
    flex: 1,
    alignItems: "center",
   // alignContent:"center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: 'column',
    flexWrap: "wrap",
    width: "30%",
   // maxHeight:600
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
  subtitle: {
 //   alignItems: 'center',
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
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [employee, setEmployee] = useState();
  

  const getEmployee = async () => {
    const authEmployee = await Auth.currentUserInfo()
      .then((auth) => setEmployee(auth))
      .catch((err) => console.log(err));
  };

  const getBar = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("bar");
  
      if (jsonValue !== null) {
          return JSON.parse(jsonValue)
      } else {
          console.log("bar not found")
          return null
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getBar()
  }, [])

  useEffect(() => {
    let isMounted = true;
    getEmployee();
    

    const subscribe = async () => {
      const barr = await getBar()

      try {
        const ordersPromise = API.graphql(
          graphqlOperation(listOrders, {
            filter: { barID: { eq: barr.id } },
          })
        );

        const response = await ordersPromise;
        console.log(barr.id)
        setOrders(response.data.listOrders.items.filter((item) => item._deleted === null))
      } catch (err) {
        console.log(err);
      }

      try {
        const orderResponse = API.graphql(
          graphqlOperation(onCreateOrder)
        ).subscribe({
          next: (orderData) => {
            const item = orderData.value.data.onCreateOrder
            if(item.barID === barr.id){
              setOrders((orders) => [
                ...orders,
                item,
              ]);
            }

          },
        });
      } catch (err) {
        console.log(err);
      }
    };

    setIsLoading(false);
    subscribe();
    return () => {
      isMounted = false;
    };
  }, [isLoading, pressed]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      <Text style={styles.title}>Order Queue</Text>
      <View style={styles.Innercontainer}>
        <View style={styles.orderQueueContainer}>
          <Text style={styles.subtitle}>Received</Text>
          {!isLoading
            ? orders.map((order, index) => {
                if (order.orderStatus === "received") {
                  return (
                    <Order
                      key={order.id + Math.random()}
                      index={index}
                      order={order}
                      employee={employee}
                      setPressed={setPressed}
                      pressed={pressed}
                      setOrders={setOrders}
                      orders={orders}
                    />
                  );
                }
              })
            : null}
        </View>
        <View style={styles.orderQueueContainer}>
          <Text style={styles.subtitle}>In-Progress</Text>
          {!isLoading
            ? orders.map((order, index) => {
                if (order.orderStatus === "in-progress") {
                  return (
                    <Order
                      key={order.id + Math.random()}
                      order={order}
                      index={index}
                      employee={employee}
                      setPressed={setPressed}
                      pressed={pressed}
                      setOrders={setOrders}
                      orders={orders}
                    />
                  );
                }
              })
            : null}
        </View>
        <View style={styles.orderQueueContainer}>
          <Text style={styles.subtitle}>Completed</Text>
          {!isLoading
            ? orders.map((order, index) => {
                if (order.orderStatus === "complete")
                  return (
                    <Order
                      key={order.id + Math.random()}
                      order={order}
                      index={index}
                      employee={employee}
                      setPressed={setPressed}
                      pressed={pressed}
                      setOrders={setOrders}
                      orders={orders}
                    />
                  );
              })
            : null}
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

export default OrderQueue;
