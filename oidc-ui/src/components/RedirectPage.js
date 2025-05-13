import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeVerify from "./CodeVerify";
import localStorageService from "../services/local-storageService";
import LoadingIndicator from "../common/LoadingIndicator";

const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  
  // Memoize URL parameters parsing
  const { stateParam, codeParam } = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    return {
      stateParam: urlParams.get("state"),
      codeParam: urlParams.get("code")
    };
  }, [location.search]);

  // Memoize auth data retrieval
  const parsedAuthData = useMemo(() => 
    localStorageService.getParam(stateParam),
    [stateParam]
  );

  useEffect(() => {
    if (!stateParam || !parsedAuthData) {
      setIsReady(true);
      return;
    }

    if (!location.hash) {
      navigate(
        `${location.pathname}${location.search}#${parsedAuthData}`,
        { replace: true }
      );
    }
    setIsReady(true);
  }, [stateParam, parsedAuthData, location, navigate]);

  return (
    <div className="redirect-container">
      <div className="redirect-content">
        {!isReady ? (
          <div className="loading-indicator">
              <LoadingIndicator
              size="medium"
            message="redirecting_msg" />
          </div>
        ) : (
          <CodeVerify state={stateParam} code={codeParam} />
        )}
      </div>
    </div>
  );
};

export default RedirectPage;