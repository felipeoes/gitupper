export function loadWorker(worker, props) {
  const code = worker.toString();
  const propsString = JSON.stringify(props);

  const blob = new Blob([`(${code})(${propsString})`], {
    type: "application/javascript",
  });

  // webpack worker loader
  // return new Worker(new URL(`./${worker.name}.worker.js`, import.meta.url));

  // return new Worker(URL.createObjectURL(blob), import.meta.url);

  return new Worker(URL.createObjectURL(blob));
}
