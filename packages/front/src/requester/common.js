import { Alert } from "react";

// const server = () => {
//   if (process.env.LOCAL === 'local') {
//     return 'https://localhost:8080/api/v1';
//   }
//   return 'https://www.routely-api.com/api/v1';
// };

function showError(err) {
    Alert.alert("Opps! I found an error.", `Message: ${err}`);
}

const server = "https://www.routely-api.com/api/v1";

export { server, showError };
