import { useEffect, useState } from "react";
import API from "../api/api";

function TestAPI() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    API.get("/health")
      .then((res) => {
        setMessage(res.data.message);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Backend Connection Failed");
      });
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "120px",
        fontSize: "30px",
      }}
    >
      <h1>🚀 NEXORA AI OS</h1>

      <h2>{message}</h2>
    </div>
  );
}

export default TestAPI;