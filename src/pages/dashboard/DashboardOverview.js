import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Form,
  Button,
  InputGroup,
  Toast,
} from "@themesberg/react-bootstrap";
import { CounterWidget } from "../../components/Widgets";
import AuthService from "../../services/auth.service";
import { Hint } from "react-autocomplete-hint";
import axios from 'axios';

export default () => {
  const [hintData, setHintData] = useState([])
  let user = AuthService.getCurrentUser();
  const getData = async () => {
    const res = await axios.get('http://localhost:8000/api/getUser')
      var hintArray = []
       res.data.map(a => hintArray.push(a.email))
        setHintData(hintArray)
  }

  useEffect(()=> {
    getData()
  })

  //save user balance
  const [userBalance, setBalance] = useState(0);
  const toggleShowToast = () => setShowToast(!showToast);

  // use toast for notification
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    AuthService.getBalance(user.message.address).then((data) => {
      console.log(data.data);
      setBalance(data.data);
    });
  });

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

    AuthService.transferMoney(
      address,
      password,
      amount,
      user.message.address
    ).then((data) => {
      const { status } = data;

      if (status) {
        AuthService.getBalance(user.message.address).then((data) =>
          setBalance(data.data)
        );
      }
    });
    console.log(hintData)
    toggleShowToast();
  };

  let [showTransactionInput, setState] = useState(true);

  const handleOnClick = () => {
    setState(!showTransactionInput);
  };

  return (
    <>
      <div
        style={{ position: "relative" }}
        className="justify-content-between align-items-center py-4"
      >
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
          <Form className="mt-4 row" onSubmit={handelSubmit}>
            <Row>
              <Col>
                <div className="form-group">
                  <label className="mb-2">Address</label>
                  <Hint options={hintData} allowTabFill>
                    <input
                      className="form-control"
                      id="address"
                      onChange={handelOnChange}
                      value={address}
                      type="email"
                      autoFocus
                      required
                      placeholder="user@gmail.com"
                    ></input>
                  </Hint>
                </div>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id="password"
                      onChange={handelOnChange}
                      value={password}
                      autoFocus
                      required
                      type="password"
                      placeholder=""
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Enter your amount</Form.Label>
                    <InputGroup>
                      <Form.Control
                        id="amount"
                        onChange={handelOnChange}
                        value={amount}
                        required
                        placeholder="$"
                      />
                    </InputGroup>
                  </Form.Group>
                </Form.Group>
              </Col>
            </Row>
            <Col sm={2}>
              <Button
                className="col-1"
                variant="primary"
                type="submit"
                className="w-100 col"
              >
                Send
              </Button>
            </Col>
          </Form>
        )}

        <Toast
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
          show={showToast}
          onClose={toggleShowToast}
          className="bg-success text-white my-3"
        >
          <Toast.Header className="text-primary" closeButton={false}>
            <strong className="me-auto ms-2">Congratulation</strong>
            <Button variant="close" size="xs" onClick={toggleShowToast} />
          </Toast.Header>
          <Toast.Body>Transfer money success !!</Toast.Body>
        </Toast>
      </div>
    </>
  );
};
