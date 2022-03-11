import React from "react";
import { View } from "react-native";
import { Button, TextInput, Headline, Chip } from "react-native-paper";
import { API, graphqlOperation } from "aws-amplify";
import { createEmployee, deleteEmployee } from "../../graphql/mutations";
import { useStateValue } from "../../state/StateProvider";
import Navigation from "../../../navigation";

// Create emplyoees based on bar id
function CreateEmployees(props: any) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [employees, setEmployees] = React.useState([]);
  const [{ bar }, dispatch] = useStateValue();

  async function addEmployee() {
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
      console.log(employeePromise);

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

  function finish() {
  }

  return (
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
                style={{ margin: 10 }}
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
          >
            Add
          </Button>
        </View>
      </View>
      <Button
        style={{ width: "50%", margin: 10 }}
        mode="contained"
        onPress={finish}
      >
        Next
      </Button>
      <Button
        style={{ width: "50%", margin: 10 }}
        mode="contained"
        onPress={props.prevStep}
      >
        Back
      </Button>
    </View>
  );
}

export default CreateEmployees;
