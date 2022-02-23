import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Accordion,
  ListGroup,
  Form,
  Badge,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { DoctorGetPatient, DoctorUpdatePatient } from "../actions/doctorActions";
import { getUserDailyReports, getUserDetails } from "../actions/userActions";
import { useParams } from "react-router-dom";
import { BaseUrl } from "../utils/utils";
import axios from "axios";

function DoctorPatientDetailScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { user_info } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error, reports } = userDetails;

  const [updating, setUpdating] = useState(false);
  const [sucessReportRequest, setSucessReportRequest] = useState(false);
  const [message, setMessage] = useState("");

  let { pid } = useParams();
  useEffect(() => {
    if (!user_info || user_info.roles !== "ROLE_DOCTOR") {
      navigate("/login");
    }
    dispatch(getUserDetails(pid));
    dispatch(getUserDailyReports(pid));
  }, [dispatch, user_info, pid]);

  const requestDailtReportHandler = async () => {
    setUpdating(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "x-access-token": `${user_info.accessToken}`,
        },
      };

      const { data } = await axios.put(
        BaseUrl + `/api/view/requestReport`,
        { userId: pid, date: new Date() },
        config
      );
      setMessage(data.message);
      setUpdating(false);
      setSucessReportRequest(true);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
      setUpdating(false);
      setSucessReportRequest(false);
    }
  };
  const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
  return (
    <div>
      <Link to="/doctor/dashboard" className="btn btn-light my-2 ms-3">
        Go Back
      </Link>
      <Container>
        <h3 className="my-3 text-center">Patient Name</h3>

        <div>
          <Row className="justify-content-center">
            <Col md={10}>
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : (
                <div>
                  <h2 className="ms-3">Patient Details</h2>
                  <div className="mb-3">
                    <div className="card mb-4">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 fw-bold">Full Name</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {user ? user.name : "John"}{" "}
                              {user ? user.lname : "Doe"}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 fw-bold">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {user ? user.email : "johndoe@error.com"}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 fw-bold">Role</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0 text-uppercase">
                              {user ? user.role : "Patient"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Row className="mb-3">
                <Col md={10}>
                  <h2 className="ms-3">Request daily symptome report</h2>
                </Col>
                <Col>
                  <Button onClick={() => requestDailtReportHandler()}>
                    Send request
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={10}>
                  <h4 className="ms-3">
                    Report requested for: &nbsp; &nbsp;
                    <div className="text-center badge bg-warning text-wrap fw-bold text-white ">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </h4>
                </Col>
                <Col>
                  <div className="text-center badge bg-success text-wrap fw-bold text-white fs-5">
                    True
                  </div>
                </Col>
              </Row>
              {updating ? (
                <Loader />
              ) : message ? (
                <Message variant={sucessReportRequest ? "success" : "danger"}>
                  {message}
                </Message>
              ) : (
                ""
              )}

              <h2 className="ms-3">Daily reports </h2>

              <Accordion flush>
                {reports && reports.length > 0 ? (
                  reports.map(
                    (report, index) =>
                      report.questions && (
                        <Accordion.Item key={index} eventKey={index}>
                          <Accordion.Header>
                            Patient Update &nbsp;
                            <div className="fw-bold text-end">
                              {new Date(report.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                Have tested positif for covid19 ? :{" "}
                                {report.questions.hasCovid ? (
                                  <Badge bg="success">True</Badge>
                                ) : (
                                  <Badge bg="danger">False</Badge>
                                )}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Have travelled recently ? :{" "}
                                {report.questions.hasTravelled ? (
                                  <Badge bg="success">True</Badge>
                                ) : (
                                  <Badge bg="danger">False</Badge>
                                )}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Has auto immune disease? :{" "}
                                {report.questions.hasAutoImmuneDisease ? (
                                  <Badge bg="success">True</Badge>
                                ) : (
                                  <Badge bg="danger">False</Badge>
                                )}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Is pregnant? :{" "}
                                {report.questions.isPregnant ? (
                                  <Badge bg="success">True</Badge>
                                ) : (
                                  <Badge bg="danger">False</Badge>
                                )}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Has allergic reaction? :
                                {report.questions.hadAllergicReaction ? (
                                  <Badge bg="success">True</Badge>
                                ) : (
                                  <Badge bg="danger">False</Badge>
                                )}
                              </ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                      )
                  )
                ) : (
                  <Message variant={"warning"}>
                    {"No reports have been submitted recently"}
                  </Message>
                )}
              </Accordion>

              <h2 className="ms-3 mt-5 text-danger">Update Patient Details</h2>

              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Status</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup className="ms-4 w-75" variant="flush">
                      <ListGroup.Item>
                        <Form.Check
                          type="switch"
                          id="covid-conf-switch"
                          label="Covid Confirmed"
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Check
                          type="switch"
                          id="quarntine-switch"
                          label="In Quarantine"
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Check
                          type="switch"
                          id="urgent-switch"
                          label="Urgent"
                        />
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Requirements</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        Requirement1Name : patientInfo
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Requirement2Name : patientInfo
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Requirement3Name : patientInfo
                      </ListGroup.Item>
                      <ListGroup.Item>...</ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button className="ms-3 w-50">UPDATE PATIENT</Button>
              </div>
            </Col>
          </Row>
        </div>
        {/* )} */}
      </Container>
    </div>
  );
}

export default DoctorPatientDetailScreen;