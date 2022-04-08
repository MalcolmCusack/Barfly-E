import React from "react";
import { View,  ScrollView } from "react-native";
import { Button, TextInput, Headline, Chip } from "react-native-paper";
import { API, graphqlOperation } from "aws-amplify";
import { createEmployee, deleteEmployee } from "../../graphql/mutations";
import { listEmployees } from "../../graphql/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create emplyoees based on bar id
function CreateEmployees(props: any) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [employees, setEmployees] = React.useState([]);

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
  

  async function addEmployee() {

    const bar = await getBar()
    try {
      const payload = {
        name: name,
        email: email,
        barID: bar.id,
        admin: false,
      };

      const res = API.graphql(
        graphqlOperation(createEmployee, {
          input: payload,
        })
      );

      const employeePromise: any = await res;

      if (employeePromise.data) {
        setEmployees([...employees, employeePromise.data.createEmployee]);
        setName("");
        setEmail("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function DeleteEmployee(employee: any) {
    const payload = {
      id: employee.id,
      _version: employee._version,
    };
    const res = API.graphql({
      query: deleteEmployee,
      variables: { input: payload },
    });
    const deletePromise: any = await res;

    setEmployees(employees.filter((item) => item.id !== employee.id));
    return deletePromise;
  }

  async function getEmployees() {
    const bar = await getBar()
    try {
      const ordersPromise = API.graphql(
        graphqlOperation(listEmployees, {
          filter: { barID: { eq: bar.id }},
        })
      );
      const response = await ordersPromise;
      setEmployees(response.data.listEmployees.items.filter((item:any) => item._deleted === null))
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    getEmployees()
  }, [])


  return (
    <ScrollView>
    <View style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "20%",
          }}
        >
          {employees.map((employee) => {
            return (
              <Chip
                style={{ margin: 10, height:40 }}
                icon="delete"
                key={Math.random() + ""}
                onPress={() => DeleteEmployee(employee)}
              >
                {employee.name}
              </Chip>
            );
          })}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Headline style={{ margin: 10 }}>Add Employees</Headline>

          <TextInput
            autoComplete={null}
            label="Name"
            value={name}
            placeholder="Name"
            onChangeText={(text) => setName(text)}
            style={{ width: "50%", margin: 10 }}
          />
          <TextInput
            autoComplete={null}
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{ width: "50%", margin: 10 }}
          />

          <Button
            style={{ width: "50%", margin: 10 }}
            mode="contained"
            onPress={addEmployee}
            disabled={email === "" || name === ""}
          >
            Add
          </Button>
          <Button
        style={{ width: "50%", margin: 10 }}
        mode="contained"
        onPress={props.nextStep}
      >
        Finish
      </Button>
      <Button
        style={{ width: "50%", margin: 10 }}
        mode="contained"
        onPress={props.prevStep}
      >
        Back
      </Button>
        </View>
      </View>
      
    </View>
    </ScrollView>
  );
}

export default CreateEmployees;
