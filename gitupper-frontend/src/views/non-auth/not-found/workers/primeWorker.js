export default function PrimeWorker() {
  function calculatePrimes(iterations, multiplier) {
    var primes = [];
    for (var i = 0; i < iterations; i++) {
      var candidate = i * (multiplier * Math.random());
      var isPrime = true;
      for (var c = 2; c <= Math.sqrt(candidate); ++c) {
        if (candidate % c === 0) {
          // not prime
          isPrime = false;
          break;
        }
      }
      // if (isPrime) {
      //   primes.push(candidate);
      //   // primes.push(somaum1);
      // }
      primes.push(iterations);
    }
    return primes;
  }

  onmessage = function (e) {
    console.log("Worker: Message received from main script");
    var iterations = e.data.iterations;
    var multiplier = e.data.multiplier;
    var primes = calculatePrimes(1, multiplier);

    postMessage({
      command: "done",
      primes: primes,
    });
  };
}
