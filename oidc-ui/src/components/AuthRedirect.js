import React, { useEffect, useState } from "react";

function AuthRedirect({ oidcService ,state}) {
  
    useEffect(() => {
      const oAuthDetails = oidcService.getOAuthDetails().configs;
      const authUrl = new URL(oAuthDetails.authorization_params);
      
      const params = new URLSearchParams({
        client_id: oAuthDetails.client_id,
        redirect_uri: oAuthDetails.redirect_uri,
        response_type: 'code',
        scope: oAuthDetails.scope,
        state: state,
        acr_values: oAuthDetails.acr_values?.join(' ') || '',
        claims_locales: oAuthDetails?.claims_locales,
        display: oAuthDetails.display,
        ui_locales: oAuthDetails?.ui_locales
      });
      
      authUrl.search = params.toString();
      console.log("authUrl",authUrl);
      
      window.location.href = authUrl.href;
    }, [oidcService]);
  
    return <>
      
    </>
  }

  export default AuthRedirect