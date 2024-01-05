import { useState } from "react";
import { Topbar } from "./../../../components/topbar/Topbar";
import { paths } from "../../../services/utils/paths";

import LogoButton from "./../../../components/logoButton/LogoButton";

import { loadWorker } from "./../../../services/workers/createWorker";
import PrimeWorker from "./workers/primeWorker";

export default function NotFound(props) {
  const [value, setValue] = useState(0);
  const iterations = 200;
  const multiplier = 1000000000;

  const primeWorker = loadWorker(PrimeWorker);

  primeWorker.onmessage = function (message) {
    console.log("Message received from worker");
    setValue(message.data.primes[message.data.primes.length - 1]);
  };

  function doPointlessComputationsInWorker() {
    primeWorker.postMessage({
      multiplier: multiplier,
      iterations: iterations,
    });
  }

  // if (!window.Worker) {
  //   console.log("Worker not supported in your browser");
  // } else {

  //   // document.querySelector("button").onclick = doPointlessComputationsInWorker;
  // }

  return (
    <div>
      <Topbar
        nonAuth
        topbarButtonText="Fazer login"
        toPath={paths.login}
        IconElement={
          <LogoButton />
          // <IconButton
          //   color="inherit"
          //   aria-label="app-logo"
          //   onClick={handleOnClickLogo}
          //   edge="start"
          // >
          //   <AppLogo src={logo} alt="logo" />
          // </IconButton>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Página não encontrada</h1>
        <div>
          <button onClick={doPointlessComputationsInWorker}>
            Computar números primos
          </button>
        </div>
        <span className="result">Resultado: {value}</span>
        <h1>404</h1>
      </div>
    </div>
  );
}
