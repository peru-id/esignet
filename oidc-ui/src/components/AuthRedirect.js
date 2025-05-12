import React, { useEffect, useState } from "react";

function AuthRedirect({ oidcService }) {
  
    useEffect(() => {
      const oAuthDetailResponse = oidcService.getOAuthDetails().configs;
      const oidcParams = oAuthDetailResponse?.["openid-relying-party-url"];
      
      const acrValues = oidcParams.acr_values.join(' ');
      
      const authUrl = new URL(oidcParams.url);
      const params = new URLSearchParams({
        client_id: oidcParams.client_id,
        redirect_uri: oidcParams.redirect_uri,
        response_type: 'code',
        scope: oidcParams.scope,
        nonce: oidcParams.nonce,
        state: oidcService.state,
        acr_values: acrValues,
        claims_locales: oidcParams.claims_locales,
        display: oidcParams.display,
        ui_locales: oidcParams.ui_locales
      });
      
      authUrl.search = params.toString();
      console.log("authUrl",authUrl);
      
      window.location.href = authUrl.href;
    }, [oidcService]);
  
    return <div>Redirecting to authentication provider...</div>;
  }

  export default AuthRedirect