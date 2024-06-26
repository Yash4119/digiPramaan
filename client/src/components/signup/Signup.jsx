import axios from 'axios';
import IsIndividualToggle from '../isIndividualToggle/IsIndividualToggle';
import ProgressBar from '../progressBar/ProgressBar';
import './signup.scss';
import { useEffect, useState } from 'react';


const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];


export default function Signup({ isOnSignup, setIsOnSignup }) {
    const [step, setStep] = useState(1);
    const [isIndividual, setIsIndividual] = useState(true);
    const [orgLogo, setorgLogo] = useState(null);
    const [orgSignature, setOrgSignature] = useState(null);
    const [isError, setIsError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isIndividual: ''
    });
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            isIndividual
        }))
    }, [isIndividual]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleChangeConfirm = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if(value !== formData.password){
            setIsError(true);
        } else {
            setIsError(false);
        }
    };
    const handleNext = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep + 1);
        }
    };
    const handleBack = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep - 1);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        isIndividual ?
            registerIndividual() : registerOrganization();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const registerIndividual = async () => {
        try {
            const response = await axios.post('http://localhost:8080/register', formData);
            console.log(response);
            setIsOnSignup(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const registerOrganization = async () => {
        try {
            const response = await axios.post('http://localhost:8080/orgRegistration', formData);
            console.log(response);
            setIsOnSignup(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setorgLogo(reader.result);
            const { name, value } = e.target;
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
            handleUpload(file).then(url => {
                setFormData(prev => ({
                    ...prev,
                    orgLogo: url
                }))
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSignChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setOrgSignature(reader.result);
            const { name, value } = e.target;
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
            handleUpload(file).then(url => {
                setFormData(prev => ({
                    ...prev,
                    orgSignature: url
                }))
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (file) => {

        if (!validFileTypes.find(type => type === file.type)) {
            //   setError('File must be in JPG/PNG format');
            return;
        }

        const form = new FormData();
        form.append('image', file);

        try {
            const response = await axios.post('http://localhost:8080/uploadImage', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.url instanceof Promise) {
                const url = await response.data.url;
                console.log("lmaoooooo");
                console.log('Image uploaded:', url); // This should log the final URL
                return url;
            } else {
                console.log('Image uploaded:', response.data.url); // This should log the final URL
                return response.data.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle errors
        }        
        
    };

    const stepsIndividual = [
        'Get Started',
        'Personal Information',
        'Account Information',
        'Confirmation'
    ]

    const stepsOrganization = [
        'Get Started',
        'Organization Information',
        'Issuer Information',
        'Confirmation'
    ]

    const renderStepIndividual = () => {
        switch (step) {
            case 1:
                return (
                    <div className='step-1'>
                        {/* <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required /> */}
                        <IsIndividualToggle first={'Individual'} second={'Organization'} setIsIndividual={setIsIndividual} isIndividual={isIndividual} />
                        <button className='cta' onClick={handleNext}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                            {/* <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext} disabled={!formData.name || !formData.email}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChangeConfirm} placeholder="Confirm Password" required />
                            {
                                isError &&
                                <span className='error-text'>Passwords don't match!</span>
                            }
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext} disabled={!formData.email || !formData.password || !formData.confirmPassword}>Next</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className='last-step'>
                        <p>Please review your information before submitting:</p>
                        <p>Name : {formData.name}</p>
                        <p>Email : {formData.email}</p>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderStepOrganization = () => {
        switch (step) {
            case 1:
                return (
                    <div className='step-1'>
                        {/* <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required /> */}
                        <IsIndividualToggle first={'Individual'} second={'Organization'} setIsIndividual={setIsIndividual} isIndividual={isIndividual} />
                        <button className='cta' onClick={handleNext}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} placeholder="Organization Name" required />
                            {/* <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                        </div>
                        <div className="input-wrapper">
                            <h4>Upload Organization Logo</h4>
                            {/* <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                            <div className="image-input">
                                <input
                                    type="file"
                                    name="orgLogo"
                                    id="orgLogo"
                                    accept="image/"
                                    onChange={handleImageChange}
                                />
                                {orgLogo && (
                                    <div>
                                        <img
                                            src={orgLogo}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext} disabled={!formData.orgName || !formData.orgLogo}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            {/* <div className="input-wrapper">
                                <h4>Upload issuer Signature</h4>
                                <div className="image-input">
                                    <input
                                        type="file"
                                        name="orgSignature"
                                        id="orgSignature"
                                        accept="image/"
                                        onChange={handleSignChange}
                                    />
                                    {orgLogo && (
                                        <div>
                                            <img
                                                src={orgSignature}
                                                alt="Uploaded"
                                                style={{ maxWidth: "100px" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div> */}
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChangeConfirm} placeholder="Confirm Password" required />
                            {
                                isError &&
                                <span className='error-text'>Passwords don't match!</span>
                            }
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext} disabled={!formData.email || !formData.password || !formData.confirmPassword}>Next</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className='last-step'>
                        <p>Please review your information before submitting:</p>
                        <p>Organization Name : {formData.orgName}</p>
                        <p>Email : {formData.email}</p>
                        <div className="image-wrapper">
                            <div className="image-input">
                                {orgLogo && (
                                    <div>
                                        <p>
                                            Organization Logo :
                                        </p>
                                        <img
                                            src={orgLogo}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="image-input">
                                {orgSignature && (
                                    <div>
                                        <p>
                                            Organization Signature :
                                        </p>
                                        <img
                                            src={orgSignature}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    function togglePopUpBox() {
        setIsOnSignup((prev) => !prev);
    }

    return (
        <div className="signup" onClick={togglePopUpBox}>
            <div className="glassbox" onClick={(e) => e.stopPropagation()}>
                <div className="cross" onClick={togglePopUpBox}>+</div>
                <ProgressBar lineWidth={'160px'} stepWidth={'140px'} className="progress-bar" steps={isIndividual ? stepsIndividual : stepsOrganization} currentStep={step} />
                {
                    isIndividual ?
                        renderStepIndividual()
                        :
                        renderStepOrganization()
                }
            </div>
        </div>
    )
}