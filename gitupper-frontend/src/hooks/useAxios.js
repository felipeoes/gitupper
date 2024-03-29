// import { useState, useEffect, useMemo, useRef, useContext } from "react";
// import axios from "axios";
// import { AxiosContext } from "../contexts/axios.jsx";

// const useAxios = (url, method, payload) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");
//   const [loaded, setLoaded] = useState(false);
//   const contextInstance = useContext(AxiosContext);
//   const instance = useMemo(() => {
//     return contextInstance || axios;
//   }, [contextInstance]);
//   const controllerRef = useRef(new AbortController());
//   const cancel = () => {
//     controllerRef.current.abort();
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await instance.request({
//           signal: controllerRef.current.signal,
//           data: payload,
//           method,
//           url,
//         });

//         setData(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoaded(true);
//       }
//     })();
//   }, []);

//   return { cancel, data, error, loaded };
// };

// export default useAxios;
