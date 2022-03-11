import React from 'react';
import SignIn from '../../../components/auth/SignIn';
import CreateCommon from './CreateCommon';
import CreateEmployees from './CreateEmployees';
import CreateMenu from './CreateMenu';


function MultiStepForm({navigation}) {
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
        case 4:
            return <SignIn />
        default:
            return <></>
    }

}

export default MultiStepForm;
