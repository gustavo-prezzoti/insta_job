# Instagram OAuth Authentication Flow

This document outlines the Instagram OAuth authentication flow implemented in the VIRALYX.AI application.

## Overview

The authentication flow follows these steps:

1. User clicks "Connect with Instagram" in the InstagramLoginModal
2. Frontend calls backend API to get an OAuth authorization URL
3. A popup window opens with the Instagram/Facebook authorization page
4. User authorizes the application on Instagram
5. Instagram redirects to our callback URL with a temporary code
6. Our callback page (`/instagram/oauth/callback`) captures this code
7. The code is sent to our backend API to complete the flow
8. Backend exchanges the code for access tokens and verifies the connection
9. User is redirected back to the search page and can now post to Instagram

## Components Involved

- `InstagramLoginModal.tsx` - Initiates the OAuth flow
- `instagramService.ts` - Contains `loginWithInstagramOAuth()` function to handle popup and tracking
- `InstagramOAuthCallback.tsx` - Handles the redirect from Instagram and completes the authentication
- `Instagram/index.ts` (API) - Contains API calls to interact with the backend

## Authentication Endpoint

The callback endpoint in our backend:

```
POST /instagram/oauth/complete
Headers:
  - Content-Type: application/json
  - jwt_token: USER_JWT_TOKEN
Body:
  {
    "temp_code": "TEMPORARY_CODE_FROM_INSTAGRAM"
  }
```

### Success Response

```json
{
  "status": "success",
  "message": "Instagram connected successfully",
  "accounts": [
    {
      "id": 123,
      "username": "nome_do_usuario_instagram"
    }
  ]
}
```

### Error Response

```json
{
  "detail": "Erro ao conectar Instagram: Mensagem de erro específica"
}
```

## Implementation Notes

- The application uses a separate callback page rather than modifying the existing page to handle the OAuth redirect
- We detect when the popup window is redirected to our callback URL and then close it
- We wait for the backend processing to complete and then verify that the credentials were stored correctly
- This implementation follows OAuth2 best practices and security guidelines

## Troubleshooting

1. If popup fails to open, check if popup blockers are enabled
2. If authentication fails with Error 101, check that the app is correctly configured in the Facebook Developer Console
3. If the callback doesn't complete, verify that the redirect URL is correctly registered in Facebook App settings 