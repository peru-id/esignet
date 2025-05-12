import React, { useEffect, useState } from "react";
import { LoadingStates as states } from "../constants/states";
import authService from "../services/authService";
import localStorageService from "../services/local-storageService";
import openIDConnectService from "../services/openIDConnectService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Buffer } from "buffer";
import {
  buttonTypes,
  challengeFormats,
  challengeTypes,
  configurationKeys,
} from "../constants/clientConstants";
import redirectOnError from "../helpers/redirectOnError";

const CodeVerify = ({ state, code }) => {
  const location = useLocation();
  const [status, setStatus] = useState({ state: states.LOADING, msg: "" });
  const [errorBanner, setErrorBanner] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { t: t2 } = useTranslation("errors");
  const urlValues = location;

  //  const base64ValueAuth =localStorageService.getParam(state);;
  const base64ValueAuth = window.location.hash.split("#")[1];
  const decodedbase64ValueAuth = Buffer.from(
    base64ValueAuth,
    "base64"
  ).toString("utf-8");
  const parsedAuthData = JSON.parse(decodedbase64ValueAuth);

  // Service initialization
  const nonce = "ere973eieljznge2311";

  // Initialize services properly
  const oidcService = new openIDConnectService(parsedAuthData, nonce, state);
  const authServiceInstance = new authService(oidcService);

  const post_AuthenticateUser = authServiceInstance.post_AuthenticateUser;
  const buildRedirectParams = authServiceInstance.buildRedirectParams;

  const authenticateUser = async () => {
    try {
      setStatus({ state: states.LOADING, msg: "" });
      const transactionId = oidcService.getTransactionId();

      if (!transactionId) {
        return;
      }

      const challengeList = [
        {
          authFactorType: challengeTypes.code,
          challenge: code,
          format: challengeFormats.code,
        },
      ];

      // In real code, idvid should come from user input or auth context
      const idvid = "439674501730"; // Consider making this dynamic

      const authenticateResponse = await post_AuthenticateUser(
        transactionId,
        transactionId,
        challengeList
      );
      const { response, errors } = authenticateResponse;

      if (errors?.length > 0) {
        const firstError = errors[0];
        if (firstError.errorCode === "invalid_transaction") {
          redirectOnError(firstError.errorCode, t2(firstError.errorCode));
        } else {
          setErrorBanner({
            errorCode: firstError.errorCode,
            show: true,
          });
          setStatus({ state: states.ERROR, msg: t2(firstError.errorCode) });
        }
        return;
      } else {
        setErrorBanner(null);
        console.log("hello");

        let params = buildRedirectParams(
          nonce,
          state,
          oidcService.getOAuthDetails(),
          response.consentAction
        );

        navigate(process.env.PUBLIC_URL + "/consent" + params, {
          replace: true,
        });
      }
      // Handle successful authentication
      setErrorBanner(null);
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrorBanner({
        errorCode: "authentication_failed_msg",
        show: true,
      });
      setStatus({ state: states.ERROR, msg: t2("authentication_failed_msg") });
    }
  };

  // Trigger authentication on component mount
  useEffect(() => {
    authenticateUser();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="code-verify-container">
      {status.state === states.LOADING &&  <p>{code.authenticating_msg}</p>}

      {errorBanner?.show && (
        <div className="error-message">{t2(errorBanner.errorCode)}</div>
      )}
    </div>
  );
};

export default CodeVerify;
