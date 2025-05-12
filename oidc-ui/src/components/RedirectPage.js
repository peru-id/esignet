import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeVerify from "./CodeVerify";
import localStorageService from "../services/local-storageService";

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
            <div className="spinner"></div>
            <h2>Redirecting...</h2>
            <p>Please wait while we take you to your destination</p>
          </div>
        ) : (
          <CodeVerify state={stateParam} code={codeParam} />
        )}
      </div>
    </div>
  );
};

export default RedirectPage;