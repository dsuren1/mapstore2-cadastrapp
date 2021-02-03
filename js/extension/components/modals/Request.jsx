import React, { useState, useEffect } from 'react';
import Modal from '@mapstore/components/misc/Modal';
import Message from '@mapstore/components/I18N/Message';
import Select from 'react-select';
import Spinner from "react-spinkit";
import { isEmpty, includes, get } from 'lodash';
import { Button, ControlLabel, FormControl, Radio, FormGroup } from "react-bootstrap";
import { checkRequestLimitation } from "../../api";
import RequestObject from '../request/RequestObject';
import {
    DEFAULT_REQUEST_OBJ,
    USER_TYPE_OPTIONS,
    formulatePrintParams,
    DEFAULT_MAX_REQUEST
} from "@js/extension/utils/requestForm";

export default function RequestFormModal({
    onClose = () => {},
    isShown = false,
    authLevel = {},
    maxRequest = DEFAULT_MAX_REQUEST,
    ...props
}) {
    const [showReqByFields, setShowReqByFields] = useState(false);
    const [showRequestObj, setShowRequestObj] = useState(false);
    const [requestFormData, setRequestFormData] = useState(DEFAULT_REQUEST_OBJ);
    const [printDisabled, setPrintDisabled] = useState(true);
    const [availableRequest, setAvailableRequest] = useState(+maxRequest);
    const [checkingLimit, setCheckingLimit] = useState(false);

    useEffect(()=>{
        const {type, lastname, cni} = requestFormData;
        const isNotNormalUser = !isEmpty(type) && type !== "P3";  // P3 is normal user
        const isValidNormalUser = !isEmpty(cni) && type === "P3";

        setShowReqByFields(isNotNormalUser || isValidNormalUser); // Show/hide request by fields
        setShowRequestObj((isNotNormalUser && lastname.length > 2) || isValidNormalUser); // Show/hide request object fields
    }, [requestFormData.cni, requestFormData.type, requestFormData.lastname]);

    // Check request limit based cni and type
    const checkRequestLimit = ({cni, type}) => {
        setCheckingLimit(true);
        // Check request limitation
        checkRequestLimitation({cni, type}).then((data)=> {
            if (data.user) {
                // User the fetched user data to populate the request form field
                setRequestFormData({
                    ...requestFormData, ...data.user,
                    firstname: data.user?.firstName || '',
                    lastname: data.user?.lastName || '',
                    codepostal: data.user?.codePostal || ''
                });
            }
            // Set available requests from the response, else set max request from configuration
            data.requestAvailable ? setAvailableRequest(+data.requestAvailable) : setAvailableRequest(+maxRequest);
            setCheckingLimit(false);
        }).catch(()=>{
            setCheckingLimit(false);
            props.onError({
                title: "Error",
                message: "cadastrapp.requestForm.availableReqError"
            });
        });
    };

    const [printRequest, setPrintRequest] = useState({});

    useEffect(() => {
        // Generate print params from form data
        setPrintRequest(formulatePrintParams(requestFormData));
    }, [requestFormData]);

    const onChange = (item) => {
        let formObj;
        if (item.value) {
            formObj = {...DEFAULT_REQUEST_OBJ, type: item.value};
        } else {
            const {name = '', value = ''} = item?.target || {};
            formObj = {...requestFormData, [name]: includes(['askby', 'responseby'], name) ? +value : value};
            name === "cni" && setCheckingLimit(true); // Set flag when checking for request limit
        }
        setRequestFormData(formObj);
    };

    const onBlur = ({target}) => {
        const {name = '', value = ''} = target || {};
        const trimmedValue = value.trim();
        setRequestFormData({...requestFormData, [name]: trimmedValue});

        // Check request Limit
        if (name === "cni" && !isEmpty(requestFormData.type) && !isEmpty(trimmedValue) && trimmedValue.length > 2) {
            checkRequestLimit(requestFormData); // Request for allowed requests
        }
    };

    const onCloseForm = () => { onClose(); setRequestFormData(DEFAULT_REQUEST_OBJ); setAvailableRequest(DEFAULT_MAX_REQUEST);};

    const formFields = [
        {
            value: requestFormData.cni,
            name: 'cni',
            label: <Message msgId={"cadastrapp.requestForm.cni"}/>,
            validation: requestFormData.type === 'P3' && isEmpty(requestFormData.cni) && "error"
        },
        {
            value: requestFormData.lastname,
            name: 'lastname',
            label: <Message msgId={"cadastrapp.requestForm.lastName"}/>
        },
        {
            value: requestFormData.firstname,
            name: 'firstname',
            label: <Message msgId={"cadastrapp.requestForm.firstName"}/>
        },
        {
            value: requestFormData.adress,
            name: 'adress',
            label: <Message msgId={"cadastrapp.requestForm.roadNumber"}/>
        },
        {
            value: requestFormData.codepostal,
            name: 'codepostal',
            label: <Message msgId={"cadastrapp.requestForm.zipCode"}/>
        },
        {
            value: requestFormData.commune,
            name: 'commune',
            label: <Message msgId={"cadastrapp.requestForm.town"}/>
        },
        {
            value: requestFormData.mail,
            name: 'mail',
            type: 'email',
            label: <Message msgId={"cadastrapp.requestForm.mail"}/>
        }
    ];

    const radioButtonGroup = {
        groupLabel: [
            {label: <Message msgId={"cadastrapp.requestForm.askBy"}/>, name: 'askby' },
            {label: <Message msgId={"cadastrapp.requestForm.responseBy"}/>, name: 'responseby'}
        ],
        groupField: [
            <Message msgId={"cadastrapp.requestForm.counter"}/>,
            <Message msgId={"cadastrapp.requestForm.mail"}/>,
            <Message msgId={"cadastrapp.requestForm.email"}/>
        ]
    };

    return (
        <Modal
            dialogClassName="cadastrapp-modal"
            show={isShown} onHide={onCloseForm}>
            <Modal.Header closeButton>
                <Modal.Title><Message msgId={'cadastrapp.requestForm.title'}/></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight: 500, overflowY: "auto"}}>
                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel><Message msgId={'cadastrapp.requestForm.requestType'}/></ControlLabel>
                    </div>
                    <div className="form-col">
                        <Select name="type" value={requestFormData.type} onChange={onChange} options={USER_TYPE_OPTIONS}/>
                    </div>
                </div>
                {
                    formFields.map(({label, name, value, type = "text", validation = null})=> (
                        <div className="item-row">
                            <FormGroup validationState={validation}>
                                <div className="label-col">
                                    <ControlLabel>{label}</ControlLabel>
                                </div>
                                <div className="form-col">
                                    <FormControl
                                        disabled={isEmpty(requestFormData.type) || (name !== "cni" && requestFormData.type === 'P3' && isEmpty(requestFormData.cni))}
                                        value={value} name={name} onBlur={onBlur} onChange={onChange} type={type}
                                        bsSize="sm"
                                    />
                                </div>
                            </FormGroup>
                        </div>
                    ))
                }
                {
                    showReqByFields && radioButtonGroup.groupLabel.map(({label, name})=> (
                        <div className={"item-row"}>
                            <div className="label-col">
                                <ControlLabel>{label}</ControlLabel>
                            </div>
                            <div className="form-col">
                                <FormGroup>
                                    {radioButtonGroup.groupField.map((fieldLabel, index)=>
                                        <Radio onChange={onChange} checked={requestFormData[name] === index + 1} value={index + 1}  name={name} inline>
                                            {fieldLabel}
                                        </Radio>)}
                                </FormGroup>
                            </div>
                        </div>
                    ))
                }
                <hr/>
                {showRequestObj && !checkingLimit && <div className={"item-row"}>
                    <div style={{width: '100%', "float": "left"}}>
                        <ControlLabel><Message msgId={"cadastrapp.requestForm.requestObj"}/></ControlLabel>
                    </div>
                    <RequestObject
                        allow={(authLevel.isCNIL2 || authLevel.isCNIL1)}
                        requestFormData={requestFormData}
                        setPrintDisabled={setPrintDisabled}
                        setRequestFormData={setRequestFormData}
                        setAvailableRequest={setAvailableRequest}
                        availableRequest={availableRequest}
                    />
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseForm}><Message msgId={'cadastrapp.requestForm.cancel'}/></Button>
                <Button
                    disabled={printDisabled}
                    onClick={()=>props.onPrintPDF(printRequest)}
                    className="print"
                >
                    {props.loading ? (
                        <Spinner
                            spinnerName="circle"
                            noFadeIn
                            overrideSpinnerClassName="spinner"
                        />
                    ) : null}
                    <Message msgId={'cadastrapp.requestForm.print'}/>
                </Button>
                <Button
                    disabled={get(props, 'allowDocument', true)}
                    onClick={()=>props.onPrintPDF(null, 'Document')}
                    className="print"
                >
                    <Message msgId={'cadastrapp.requestForm.genDocuments'}/>
                </Button>
            </Modal.Footer>
        </Modal>);
}

