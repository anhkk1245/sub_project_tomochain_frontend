import React, { useEffect, useState } from "react";
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
  const [userBalance, setBalance] = useState(0);

  useEffect(() => {
    AuthService.getBalance(user.message.address).then(data => {
      console.log(data.data)
      setBalance(data.data);
    })
  })

  const initialState = {
    address: "",
    password: "",
    amount: "",
  };

  const [{ address, password, amount }, setAmount] = useState(initialState);

  const handelOnChange = (e) => {
    const { id, value } = e.target;
    setAmount((prevState) => ({ ...prevState, [id]: value }));
  };

  //handle transfer money
  const handelSubmit = (e) => {
    e.preventDefault();
    const userData = {
      address: address,
      password: password,
      amount: amount,
    };
    console.log(userData);
    AuthService.transferMoney(address, password, amount, user.message.address).then(data => {
      const { status } = data

      if (status) {
        AuthService.getBalance(user.message.address).then(data => setBalance(data.data))
      }
    });
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
                <Form.Label>Address</Form.Label>
                <InputGroup>

                  <Form.Control
                    id="address" onChange={handelOnChange} value={address}
                    autoFocus
                    required

                    placeholder=""
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <InputGroup>

                  <Form.Control
                    id="password" onChange={handelOnChange} value={password}
                    autoFocus
                    required
                    type="password"
                    placeholder=""
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
