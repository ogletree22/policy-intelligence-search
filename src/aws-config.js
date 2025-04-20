const awsConfig = {
    Auth: {
        Cognito: {
            // REQUIRED - Amazon Cognito Region
            region: 'us-east-1',
            
            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: 'us-east-1_PNIRzFCHi',
            
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolClientId: '27hr4ocssi4adsr98ms5938sdn',
            
            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: true,
            
            // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
            // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
            signUpVerificationMethod: 'code',
            
            // OPTIONAL - Configuration for cookie storage
            storage: {
                // REQUIRED - Cookie domain
                domain: window.location.hostname,
                // OPTIONAL - Cookie path
                path: '/',
                // OPTIONAL - Cookie expiration in days
                expires: 365,
                // OPTIONAL - Cookie secure flag
                secure: window.location.protocol === 'https:'
            }
        }
    }
};

export default awsConfig; 