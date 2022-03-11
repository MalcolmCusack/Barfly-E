import React from 'react';
import CreateCommon from './CreateCommon';
import CreateEmployees from './CreateEmployees';
import CreateMenu from './CreateMenu';
import { Button, Headline, TextInput } from "react-native-paper";
import { Text, View } from '../../../components/Themed';


function MultiStepForm() {
    const [step, setStep] = React.useState(3);
    const [payload, setPayload] = React.useState({
        name: '',
        email: '',  // awsEmail
        phone: '',  // awsPhone 
        payment: {
            routingNum: '',
            accountNum: ''
        },    // json
        address: {
            address: ''
        }, //json
        bio: ''
    });

    React.useEffect(() => {
    
        console.log(payload)
    }, [payload]);
    

    const nextStep = () => {
        setStep(step + 1);
    }

    const prevStep = () => {
        setStep(step - 1);
    }

    const handleInputData = (value, key) => {

        setPayload(prevState => ({
            ...prevState,
            [key]: value
        }));
    }

    switch (step) {
        case 1:
            return (
                <CreateCommon nextStep={nextStep} handleInputData={handleInputData} payload={payload} />
            );
        case 2:
            return (
                <CreateMenu nextStep={nextStep} prevStep={prevStep} setPayload={setPayload}  />
            );
        case 3: 
            return (
                <CreateEmployees nextStep={nextStep} prevStep={prevStep} setPayload={setPayload} />
            );
        default:
            return <></>
    }

}

export default MultiStepForm;
