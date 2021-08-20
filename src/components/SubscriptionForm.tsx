import React from "react";
import styled from  "styled-components";
import colors from "../styles/colors";
import axios from "axios";

const Form = styled.form`
    margin: 0 auto;
    max-width: 305px;
    box-shadow: 0px 2px 5px 0px rgba(10, 6, 20, 0.24);
    &:focus {
        outline: none;
    }
    .form-control {
        border: none;
        &:focus {
            box-shadow: none;
        }
    }
    .input-group {
        height: 45px;
    }
    input {
        height: 100%;
        max-width: 150px;
        padding: 0 0 0 15px;
    }
    .btn {
        border: none;
        height: 100%;
        background-color: ${colors.bluePrimary};
        color: ${colors.lightBlue};
        margin: -1px;
        text-transform: uppercase;
        position: relative;
        &:hover, &:focus, &:active, &:visited {
            background-color: ${colors.blueSecondary};
            outline: none;
            cursor: pointer;
        }
    }
    .input-group-btn:last-child > .btn, .input-group-btn:last-child > .btn-group {
        padding: 10px;
        margin-left: 1px;
    }
`

const SubscriptionForm = (props) => {
    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <h2
                className="header"
                style={{
                    color: colors.lightBlue,
                    textAlign: "center",
                    fontSize: "0.8rem",
                    letterSpacing: "3px",
                    fontWeight: 500,
                    wordSpacing: "4px",
                    textTransform: "uppercase",
                    width: "90%",
                }}
            >
            Inscreva-se para receber novidades
            </h2>
            <Form name="mp-form" id="mp-form"
                  action="https://mateusbatistasantos.mediapost.com.br/ptit/ptit_processa.php"
                  method="post"
                  onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.target);

                      axios.request({
                          method: "POST",
                          url: "https://mateusbatistasantos.mediapost.com.br/ptit/ptit_processa.php",
                          data,
                      }).then((res) => {
                          console.log(res);
                      })
                  }}
            >
                <div className="input-group">
                    <input
                        type="hidden"
                        id="hash"
                        name="hash"
                        value="364DR07417"
                    />
                    <input
                        type="hidden"
                        id="htm_response"
                        name="htm_response"
                        value="1"
                    />
                    <input
                        type="hidden"
                        id="cod_lista"
                        name="cod_lista"
                        value="4"
                    />
                    <input
                        type="text"
                        id="mp-email"
                        name="mp-email"
                        className="form-control"
                        defaultValue=""
                        placeholder="E-mail"
                    />

                    <span className="input-group-btn">
                        <input
                            className="btn btn-default"
                            type="submit"
                            name="submit"
                            value="Inscrever-se"
                        />
                    </span>
                </div>
            </Form>
        </div>
    );
}

export default SubscriptionForm;
