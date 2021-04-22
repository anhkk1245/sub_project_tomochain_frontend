import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  faAngleLeft,
  faEnvelope,
  faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { CounterWidget } from "../../components/Widgets";
import AuthService from "../../services/auth.service"

export default () => {
  let user = AuthService.getCurrentUser();

  //save user balance
  const [userBalance, setBalance] = useState(1000);

  const initialState = {
    receiverEmail: "",
    amount: "",
  };

  const [{ receiverEmail, amount }, setAmount] = useState(initialState);

  const handelOnChange = (e) => {
    const { id, value } = e.target;
    setAmount((prevState) => ({ ...prevState, [id]: value }));
  };

  //handle transfer money
  const handelSubmit = (e) => {
    e.preventDefault();
    const userData = {
      receiverEmail: receiverEmail,
      amount: amount,
    };
    console.log(userData);
  };

  let [showTransactionInput, setState] = useState(true);

  const handleOnClick = () => {
    setState(!showTransactionInput);
  };


  return (
    <>
      <div className="justify-content-between align-items-center py-4">
        <Row>
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Your Balance"
              title={userBalance}
              icon={faCashRegister}
              iconColor="shape-tertiary"
            />
          </Col>
        </Row>

        <Button
          variant="primary"
          onClick={handleOnClick}
          size="sm"
          className="me-2"
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          New Transaction
        </Button>
        {showTransactionInput && (
          <div className="col-5">
            <Form className="mt-4" onSubmit={handelSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Sender Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </InputGroup.Text>
                  <Form.Control
                    id="receiverEmail" onChange={handelOnChange} value={receiverEmail}
                    autoFocus
                    required
                    type="email"
                    placeholder="example@company.com"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Enter your amount</Form.Label>
                  <InputGroup>
                    <Form.Control id="amount" onChange={handelOnChange} value={amount} required placeholder="$" />
                  </InputGroup>
                </Form.Group>
              </Form.Group>
              <Button
                className="col-2"
                variant="primary"
                type="submit"
                className="w-100"
              >
                Send
              </Button>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};
